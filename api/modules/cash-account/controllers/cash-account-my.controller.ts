import { IRouter } from '../../../utils/common/controller-wrapper'
import { cashAccountFindByUserId } from '../services'

export const cashAccountFindMyController = async ({ user }: IRouter) => {
  const payload = await cashAccountFindByUserId(user._id)

  return { payload }
}
