import { BadRequestException } from '../../../utils'
import { IUser } from '../../user/core'
import { CategoryFindManyType } from '../controllers'
import { Category } from '../core'

export const categoryFindMany = async (data: CategoryFindManyType, user: IUser) => {
  const filter: Record<string, unknown> = {
    userId: user._id,
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

  return Category.find(filter).select('name operationType parentId hasChild').sort({ name: 1 })
}

export const categoryFindById = async (id: string) => {
  const candidate = await Category.findById(id)

  if (!candidate) {
    throw new BadRequestException('Category not found')
  }

  return candidate
}
