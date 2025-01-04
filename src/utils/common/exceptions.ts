const messageBuilder = (message: string, statusCode: number, additionalData: object = {}) => {
  return JSON.stringify({ message, statusCode, ...additionalData })
}

export class InternalServerError extends Error {
  constructor(message: string, additionalData?: object) {
    super(messageBuilder(message, 500, additionalData))
    this.name = InternalServerError.name
  }
}

export class ForbiddenException extends Error {
  constructor(message: string, additionalData?: object) {
    super(messageBuilder(message, 403, additionalData))
    this.name = ForbiddenException.name
  }
}

export class ConflictException extends Error {
  constructor(message: string, additionalData?: object) {
    super(messageBuilder(message, 409, additionalData))
    this.name = ConflictException.name
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string, additionalData?: object) {
    super(messageBuilder(message, 401, additionalData))
    this.name = UnauthorizedException.name
  }
}

export class BadRequestException extends Error {
  constructor(message: string, additionalData?: object) {
    super(messageBuilder(message, 404, additionalData))
    this.name = BadRequestException.name
  }
}
