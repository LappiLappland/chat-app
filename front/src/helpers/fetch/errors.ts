
export class NetworkError extends Error {
  
  responseObject: unknown;

  constructor(responseObject?: unknown) {
    super();
    this.responseObject = responseObject;
  }
}

export class UnauthorizedError extends NetworkError {

}

export class ForbiddenError extends NetworkError {

}