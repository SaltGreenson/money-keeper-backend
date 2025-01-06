import { MongoServerError } from 'mongodb'

export const isConflictMongoException = (error: unknown) =>
  error instanceof MongoServerError && error.code === 11000
