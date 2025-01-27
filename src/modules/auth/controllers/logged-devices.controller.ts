import { IRouter } from '../../../utils/common/controller-wrapper'
import { getCurrentlyLogged } from '../services'

export const loggedDevicesController = async ({ user }: IRouter) => {
  const payload = await getCurrentlyLogged(user._id)

  return { payload }
}
