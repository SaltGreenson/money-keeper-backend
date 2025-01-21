import { Double } from 'mongodb'
import { model, Schema } from 'mongoose'

export interface ICashAccount {
  name: string
  userId: Schema.Types.ObjectId
  amount: Schema.Types.Double
  userId_name: string
}

const cashAccountSchema = new Schema<ICashAccount>(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Schema.Types.Double, default: new Double(0) },
    userId_name: { type: String, unique: true }
  },
  { timestamps: true }
)

cashAccountSchema.pre('save', function (next) {
  this.userId_name = `${this.userId.toString()}_${this.name}`
  next()
})

export const CashAccount = model<ICashAccount>('CashAccount', cashAccountSchema)
