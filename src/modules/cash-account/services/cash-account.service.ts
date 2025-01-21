import { isConflictMongoException } from '../../../helpers'
import { ConflictException, InternalServerError } from '../../../utils'
import { IUser } from '../../user/core'
import { CashAccountCreateType } from '../controllers'
import { CashAccount } from '../core'

export const cashAccountCreate = async (data: CashAccountCreateType, user: IUser) => {
  try {
    const result = await CashAccount.create({ ...data, userId: user._id })

    return result.toJSON()
  } catch (err) {
    if (isConflictMongoException(err)) {
      throw new ConflictException('Cash account already exists')
    }

    console.error(err)

    throw new InternalServerError()
  }
}
