import { Double } from 'mongodb'
import { model, Schema } from 'mongoose'
import { BadRequestException } from '../../../../utils'
import { OperationType } from '../../../operation'

export interface IRegularOperation {
  name: string
  day: number
  startDate: Date
  type: OperationType
  endDate?: Date
  userId: Schema.Types.ObjectId
  categoryId: Schema.Types.ObjectId
  cashAccountId: Schema.Types.ObjectId
  amount: Schema.Types.Double
  userId_cashAccountId_name_day: string
}

const regularOperationSchema = new Schema<IRegularOperation>(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    cashAccountId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    type: { type: String, enum: OperationType, default: OperationType.INCOME },
    day: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    amount: { type: Schema.Types.Double, required: true },
    userId_cashAccountId_name_day: { type: String, unique: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

regularOperationSchema.pre('save', function (next) {
  this.day = new Date(this.startDate).getDate()

  if (this.day > 28) {
    throw new BadRequestException('Start Date can not be after 28th day of month')
  }

  this.userId_cashAccountId_name_day = `${this.userId}_${this.cashAccountId}_${this.name}_${this.day}`
  this.amount = new Double(Number(this.amount)) as unknown as Schema.Types.Double

  next()
})

regularOperationSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
})

regularOperationSchema.virtual('cashAccount', {
  ref: 'CashAccount',
  localField: 'cashAccountId',
  foreignField: '_id',
  justOne: true
})

export const RegularOperation = model<IRegularOperation>('RegularOperation', regularOperationSchema)
