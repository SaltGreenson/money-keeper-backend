import { Double } from 'mongodb'
import { model, Schema } from 'mongoose'
import { OperationType } from '../../../operation'
import { dateResetDay, dateResetMonth, dateResetYear } from '../helpers'

export enum DashboardType {
  OPERATION = 'OPERATION',
  CASH_ACCOUNT = 'CASH_ACCOUNT'
}

export interface IDashboard {
  operationType: OperationType
  type: DashboardType
  day?: Date
  userId: Schema.Types.ObjectId
  categoryId: Schema.Types.ObjectId
  cashAccountId: Schema.Types.ObjectId
  amount: Schema.Types.Double
  year?: Date
  month?: Date
}

const dashboardSchema = new Schema<IDashboard>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    cashAccountId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    operationType: { type: String, enum: OperationType, default: OperationType.EXPENSES },
    type: { type: String, enum: DashboardType, default: DashboardType.OPERATION },
    day: { type: Date, default: null },
    month: { type: Date, default: null },
    year: { type: Date, default: null },
    amount: { type: Schema.Types.Double, required: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

dashboardSchema.pre('save', function (next) {
  if (this.year) {
    this.year = dateResetYear(this.year)
  }

  if (this.month) {
    this.month = dateResetMonth(this.month)
  }

  if (this.day) {
    this.day = dateResetDay(this.day)
  }

  this.amount = new Double(Number(this.amount)) as unknown as Schema.Types.Double

  next()
})

dashboardSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
})

dashboardSchema.virtual('cashAccount', {
  ref: 'CashAccount',
  localField: 'cashAccountId',
  foreignField: '_id',
  justOne: true
})

export const Dashoboard = model<IDashboard>('Dashoboard', dashboardSchema)
