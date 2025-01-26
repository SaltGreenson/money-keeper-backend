import { model, Schema } from 'mongoose'
import { IUser } from '../../../user/core'

export interface IToken {
  token: string
  userId: Schema.Types.ObjectId | IUser
  device: string
  userId_device: string
}

const tokenSchema = new Schema<IToken>(
  {
    token: { type: String, unique: true, required: true },
    device: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userId_device: { type: String, unique: true }
  },
  { timestamps: true }
)

tokenSchema.pre('save', function (next) {
  this.userId_device = `${this.userId.toString()}_${this.device}`
  next()
})

export const Token = model<IToken>('Token', tokenSchema)
