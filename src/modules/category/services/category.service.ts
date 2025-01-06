import { isConflictMongoException } from '../../../helpers'
import { ConflictException, InternalServerError } from '../../../utils'
import { IUser, UserRole } from '../../user/core'
import { CategoryCreateType } from '../controllers/category-create.controller'
import { Category, CategoryType } from '../core'

export const categoryCreate = async (data: CategoryCreateType, user: IUser) => {
  try {
    const isModerator = user.roles.includes(UserRole.ADMIN) || user.roles.includes(UserRole.MANAGER)

    data.type = isModerator ? data.type : CategoryType.PRIVATE

    return (await Category.create({ ...data, userId: user._id })).save()
  } catch (err) {
    if (isConflictMongoException(err)) {
      throw new ConflictException('Category already exists')
    }

    console.error(err)
    throw new InternalServerError()
  }
}
