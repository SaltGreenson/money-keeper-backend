import { MongoAPIError } from 'mongodb'
import mongoose from 'mongoose'
import { envVariable, InternalServerError } from '../common'

export const connectDatabase = async () => {
  mongoose.set('strict', true)
  const url = envVariable('MONGO_DB_URL', { isRequired: true })
  return mongoose.connect(url).catch((error: MongoAPIError) => {
    throw new InternalServerError(error.message)
  })
}
