import { IRouter } from '../../../utils/common/controller-wrapper'
import { operationFindByUserId } from '../services'

export const operationFindMyController = async ({ user }: IRouter) => {
  const payload = await operationFindByUserId(user._id)

  return { payload }
}
