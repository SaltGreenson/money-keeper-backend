import { IRouter } from '../../../utils'
import { userFindByIdWithThrow } from '../services'

export const userMeController = async ({ user }: IRouter<never>) => {
  const result = await userFindByIdWithThrow(user._id)
  return { payload: result }
}
