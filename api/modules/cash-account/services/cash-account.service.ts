import { Double } from 'mongodb'
import { isConflictMongoException } from '../../../helpers'
import { ConflictException, InternalServerError } from '../../../utils'
import { OperationType } from '../../operation'
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

export const cashAccountUpdateBalance = async (
  _id: string,
  amount: number,
  type: OperationType
) => {
  const totalAmonut = type === OperationType.INCOME ? new Double(amount) : new Double(-amount)

  return CashAccount.updateOne({ _id }, { $inc: { amount: totalAmonut } })
}
