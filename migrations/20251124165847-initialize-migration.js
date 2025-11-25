module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async up(db) {
    const collections = await db.listCollections({ name: "users" }).toArray();

    if (collections.length === 0) {
      await db.createCollection("users");
    }
  },

  /**
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async down(db) {
    const collections = await db.listCollections({ name: "users" }).toArray();

    if (collections.length) {
      await db.dropCollection("users");
    }
  },
};
