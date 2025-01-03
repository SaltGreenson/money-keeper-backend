const messageBuilder = (message: string, statusCode: number) => {
  return JSON.stringify({ message, statusCode })
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(messageBuilder(message, 500))
    this.name = InternalServerError.name
  }
}

export class ForbiddenException extends Error {
  constructor(message: string) {
    super(messageBuilder(message, 403))
    this.name = ForbiddenException.name
  }
}

export class ConflictException extends Error {
  constructor(message: string) {
    super(messageBuilder(message, 409))
    this.name = ConflictException.name
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string) {
    super(messageBuilder(message, 401))
    this.name = UnauthorizedException.name
  }
}

export class BadRequestException extends Error {
  constructor(message: string) {
    super(messageBuilder(message, 404))
    this.name = BadRequestException.name
  }
}
