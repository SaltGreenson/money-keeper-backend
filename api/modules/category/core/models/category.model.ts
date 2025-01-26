import { model, Schema } from 'mongoose'
import { OperationType } from '../../../operation'

export interface ICategory {
  _id: string
  name: string
  icon?: string
  depth: number
  width: number
  hasChild: boolean
  operationType: OperationType
  parentId: Schema.Types.ObjectId | null
  generalCategoryId: Schema.Types.ObjectId | null
  userId: Schema.Types.ObjectId
  userId_name: string
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    icon: { type: String, default: null },
    operationType: { type: String, enum: OperationType, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    generalCategoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    userId_name: { type: String, uniq: true },
    depth: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    hasChild: { type: Boolean, default: false }
  },
  { timestamps: true }
)

categorySchema.pre('save', function (next) {
  this.userId_name = `${this.userId.toString()}_${this.name}_${this.depth}_${this.parentId}`
  next()
})

export const Category = model<ICategory>('Category', categorySchema)
