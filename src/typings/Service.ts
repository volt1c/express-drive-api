export class ServiceError extends Error {
  public status

  constructor(msg: string, status: number) {
    super(msg)
    this.status = status
  }
}
