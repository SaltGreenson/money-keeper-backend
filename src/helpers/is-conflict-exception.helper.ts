import { MongoServerError } from 'mongodb'

export const isConflictException = (error: unknown) =>
  error instanceof MongoServerError && error.code === 11000
