import { userFindMany } from '../services'

export const userGetListController = async () => {
  const result = await userFindMany()
  return { payload: result }
}
