export class ApplicationError extends Error {
  public statusCode: number;
  public errorDefinition: {
    code: string;
    description: string;
  };
  public data: string[] = [];

  constructor(options: {
    statusCode: number;
    errorDefinition: {
      code: string;
      description: string;
    };
    data?: string[];
  }) {
    super();
    this.statusCode = options.statusCode;
    this.errorDefinition = options.errorDefinition;
    this.data = options.data || [];
  }

  buildErrorPayload() {
    return [
      {
        code: this.errorDefinition.code,
        description: this.errorDefinition.description,
        data: this.data,
      },
    ];
  }
}
