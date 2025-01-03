import { IRouter } from '../../utils'
import { ICreateUser } from './interfaces'
import { userCreate, userGetList } from './services'

export const userCreateController = async ({ body }: IRouter<ICreateUser>) => {
  const result = await userCreate(body)
  return { id: result._id }
}

export const userGetListController = async () => {
  const result = await userGetList()
  return { payload: result }
}
