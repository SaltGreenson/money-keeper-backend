import { isConflictMongoException } from '../../../helpers'
import { ConflictException, InternalServerError } from '../../../utils'
import { IUser } from '../../user/core'
import { RegularOperationCreateType } from '../controllers'
import { RegularOperation } from '../core'

export const regularOperationCreate = async (data: RegularOperationCreateType, user: IUser) => {
  try {
    const result = await RegularOperation.create({ ...data, userId: user._id })

    return result.toJSON()
  } catch (err) {
    if (isConflictMongoException(err)) {
      throw new ConflictException('Regular operation already exists')
    }

    console.error(err)

    throw new InternalServerError()
  }
}

// TODO: add cron
