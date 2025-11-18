export class ApplicationError extends Error {
  public statusCode: number;
  public errorCode: string;
  public errorDescription: string;
  public data: string[] = [];

  constructor(options: {
    statusCode: number;
    errorCode: string;
    errorDescription: string;
    data?: string[];
  }) {
    super();
    this.statusCode = options.statusCode;
    this.errorCode = options.errorCode;
    this.errorDescription = options.errorDescription;
    this.data = options.data || [];
  }

  buildErrorPayload() {
    return [
      {
        code: this.errorCode,
        description: this.errorDescription,
        data: this.data,
      },
    ];
  }
}
