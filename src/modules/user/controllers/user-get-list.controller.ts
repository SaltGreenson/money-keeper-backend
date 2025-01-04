import { userGetList } from '../services'

export const userGetListController = async () => {
  const result = await userGetList()
  return { payload: result }
}
