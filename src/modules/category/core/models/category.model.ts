import { model, Schema } from 'mongoose'
import { OperationType } from '../../../operation'

export enum CategoryType {
  GENERAL = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface ICategory {
  name: string
  icon?: string
  depth: number
  width: number
  hasChild: boolean
  type: CategoryType
  operationType: OperationType
  parentId: Schema.Types.ObjectId | null
  userId: Schema.Types.ObjectId
  userId_name: string
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    icon: { type: String, default: null },
    type: { type: String, enum: CategoryType, default: CategoryType.PRIVATE },
    operationType: { type: String, enum: OperationType, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    userId_name: { type: String, uniq: true },
    depth: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    hasChild: { type: Boolean, default: false }
  },
  { timestamps: true }
)

categorySchema.pre('save', function (next) {
  this.userId_name = `${this.userId.toString()}_${this.name}`
  next()
})

export const Category = model<ICategory>('Category', categorySchema)
