import { BadRequestException } from '../../../utils'
import { CashAccount } from '../core'

export const cashAccountFindByUserId = async (userId: string) => {
  return CashAccount.find({ userId }).select('_id name amount').sort({ name: 1 })
}

export const cashAccountFindOneByUserId = async (userId: string) => {
  const candidate = await CashAccount.findOne({ userId }).sort({ name: 1 })

  if (!candidate) {
    throw new BadRequestException('Cash account is missing')
  }

  return candidate
}
