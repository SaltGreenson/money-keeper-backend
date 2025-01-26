import { Double } from 'mongodb'
import { model, Schema } from 'mongoose'
import { dateResetDay } from '../../../dashboard/core/helpers'

export enum OperationType {
  INCOME = 'INCOME',
  EXPENSES = 'EXPENSES'
}

export enum OperationStatus {
  CURRENT = 'CURRENT',
  PLANNING = 'PLANNING'
}

export interface IOperation {
  name: string
  description?: string
  status: OperationStatus
  type: OperationType
  categoryId: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  cashAccountId: Schema.Types.ObjectId
  amount: Schema.Types.Double
  date: Date
  name_date_amount_cashAccountId: string
}

const operationSchema = new Schema<IOperation>(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    type: { type: String, enum: OperationType, default: OperationType.EXPENSES },
    status: { type: String, enum: OperationStatus, default: OperationStatus.CURRENT },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cashAccountId: { type: Schema.Types.ObjectId, ref: 'CashAccount', required: true },
    amount: { type: Schema.Types.Double, required: true },
    name_date_amount_cashAccountId: { type: String, unique: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
)

operationSchema.pre('save', function (next) {
  if (dateResetDay(this.date) > new Date()) {
    this.status = OperationStatus.PLANNING
  }

  this.amount = new Double(Number(this.amount)) as unknown as Schema.Types.Double
  this.name_date_amount_cashAccountId = `${this.name}_${new Date(this.date).getTime()}_${this.amount}_${this.cashAccountId}`
  next()
})

export const Operation = model<IOperation>('Operation', operationSchema)
