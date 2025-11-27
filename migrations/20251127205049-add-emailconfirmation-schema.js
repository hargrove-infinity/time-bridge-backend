module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async up(db) {
    const users = await db.collection("users").find({}).toArray();

    if (users.length) {
      for (const user of users) {
        await db.collection("emailconfirmations").insertOne({
          user: user._id,
          isEmailSent: true,
          isEmailConfirmed: true,
          code: "123456",
          expireCodeTime: new Date(Date.now() + 30 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  },

  /**
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async down(db) {
    const collections = await db
      .listCollections({ name: "emailconfirmations" })
      .toArray();

    if (collections.length) {
      await db.dropCollection("emailconfirmations");
    }
  },
};
