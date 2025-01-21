import { isConflictMongoException } from '../../../helpers'
import { ConflictException, ForbiddenException, InternalServerError } from '../../../utils'
import { IUser, UserRole } from '../../user/core'
import { CategoryCreateType } from '../controllers/category-create.controller'
import { Category, CategoryType, ICategory } from '../core'
import { categoryFindById } from './category-get.service'

export const categoryUpdate = async (id: string, data: Partial<Omit<ICategory, 'id'>>) => {
  return Category.updateOne({ _id: id }, data)
}

const preCreate = async (data: CategoryCreateType, user: IUser) => {
  if (data.parentId) {
    const parent = await categoryFindById(data.parentId)

    if (parent.depth >= 3) {
      throw new ForbiddenException('Can not create category. Max 3 categories in depth')
    }

    if (parent.width >= 10) {
      throw new ForbiddenException('Can not create category. Max 10 categories in width')
    }

    data.depth = parent.depth + 1
    await categoryUpdate(data.parentId, { hasChild: true, width: parent.width + 1 })
  }

  const isModerator = user.roles.includes(UserRole.ADMIN) || user.roles.includes(UserRole.MANAGER)

  if (!isModerator && data.type !== CategoryType.GENERAL) {
    throw new ForbiddenException()
  }

  return data
}

export const categoryCreate = async (data: CategoryCreateType, user: IUser) => {
  const criteria = await preCreate(data, user)

  try {
    return (await Category.create({ ...criteria, userId: user._id })).save()
  } catch (err) {
    if (isConflictMongoException(err)) {
      throw new ConflictException('Category already exists')
    }

    console.error(err)

    throw new InternalServerError()
  }
}
