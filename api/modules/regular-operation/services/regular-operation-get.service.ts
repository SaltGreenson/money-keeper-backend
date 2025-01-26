import { RegularOperation } from '../core'

export const regularOperationFindByUserId = async (userId: string) => {
  return RegularOperation.find({ userId })
    .select('_id name amount startDate type endDate categoryId cashAccountId cashAccount category')
    .populate('category', '_id name')
    .populate('cashAccount', '_id name')
    .sort({ type: 1, name: 1 })
}
