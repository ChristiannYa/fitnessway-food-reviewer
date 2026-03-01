export class RequestBaseError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RequestBaseError";
    this.status = status;
  }
}