import { isConflictMongoException } from '../../../helpers'
import { BadRequestException, ConflictException, InternalServerError } from '../../../utils'
import { cashAccountCreate } from '../../cash-account'
import { categoryCreate } from '../../category'
import { OperationType } from '../../operation'
import { UserCreateType } from '../controllers/user-create.controller'
import { IUser, User, UserStatus } from '../core'
import { userSavePassword } from './user-password.service'

const getUserName = ({ email, name }: Pick<UserCreateType, 'name' | 'email'>) => {
  return name ? name : email.split('@')[0]
}

const userPostcreate = async (user: IUser, password?: string) => {
  const promises: Promise<unknown>[] = [
    cashAccountCreate({ name: 'Основной' }, user),
    categoryCreate({ name: 'Прочее', operationType: OperationType.EXPENSES }, user)
  ]

  if (password) {
    promises.push(userSavePassword(String(user._id), password))
  }

  await Promise.all(promises)
}

export const userCreate = async ({ password, ...data }: UserCreateType) => {
  try {
    const status = password ? UserStatus.ACTIVE : UserStatus.DRAFT

    const created = await new User({ ...data, name: getUserName(data), status }).save()

    await userPostcreate(created, password)

    return created.toJSON()
  } catch (err) {
    if (isConflictMongoException(err)) {
      throw new ConflictException('User already exists')
    }

    if (err instanceof BadRequestException) {
      throw err
    }

    console.error(err)

    throw new InternalServerError()
  }
}
