import { isConflictMongoException } from '../../../helpers'
import { BadRequestException, ConflictException, InternalServerError } from '../../../utils'
import { UserCreateType } from '../controllers'
import { User, UserStatus } from '../core'
import { userSavePassword } from './user-password.service'

export const userCreate = async ({ password, ...data }: UserCreateType) => {
  try {
    const status = password ? UserStatus.ACTIVE : UserStatus.DRAFT
    data.name = data.name ? data.name : data.email.split('@')[0]

    const created = await new User({ ...data, status }).save()

    if (password) {
      await userSavePassword(String(created._id), password)
    }

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
