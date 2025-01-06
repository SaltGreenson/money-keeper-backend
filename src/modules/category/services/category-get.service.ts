import { IUser } from '../../user/core'
import { CategoryFindManyType } from '../controllers'
import { Category, CategoryType } from '../core'

export const categoryFindMany = async (data: CategoryFindManyType, user: IUser) => {
  const filter: Record<string, unknown> = {
    $or: [{ type: CategoryType.GENERAL }, { userId: user._id }],
    parentId: null
  }

  if (data.parentId) {
    filter.parentId = data.parentId
  }

  if (data.operationType) {
    filter.operationType = data.operationType
  }

  if (data.name) {
    filter.name = { $regex: new RegExp(data.name, 'i') }
  }

  return Category.find(filter).select('-icon -userId_name -updatedAt').sort({ name: 1 })
}
