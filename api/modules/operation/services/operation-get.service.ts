import { Operation } from '../core'

export const operationFindByUserId = async (userId: string) => {
  return Operation.find({ userId }).sort({ date: 1, name: 1 })
}
