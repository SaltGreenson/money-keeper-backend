import { Double } from 'mongodb'
import { model, Schema } from 'mongoose'

export enum OperationType {
  INCOME = 'INCOME',
  EXPENSES = 'EXPENSES'
}

export interface IOperation {
  name: string
  type: OperationType
  categoryId: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  cashAccountId: Schema.Types.ObjectId
  amount: Schema.Types.Double
  date: Date
  name_date_amount: string
}

const operationSchema = new Schema<IOperation>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: OperationType, default: OperationType.EXPENSES },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cashAccountId: { type: Schema.Types.ObjectId, ref: 'CashAccount', required: true },
    amount: { type: Schema.Types.Double, required: true },
    name_date_amount: { type: String, unique: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
)

operationSchema.pre('save', function (next) {
  this.amount = new Double(Number(this.amount)) as unknown as Schema.Types.Double
  this.name_date_amount = `${this.name}_${new Date(this.date).getTime()}_${this.amount}`
  next()
})

export const Operation = model<IOperation>('Operation', operationSchema)
