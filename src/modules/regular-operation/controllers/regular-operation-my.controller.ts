import { IRouter } from '../../../utils/common/controller-wrapper'
import { regularOperationFindByUserId } from '../services'

export const regularOperationFindMyController = async ({ user }: IRouter) => {
  const payload = await regularOperationFindByUserId(user._id)

  return { payload }
}
