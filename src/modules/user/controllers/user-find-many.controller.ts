import { userFindMany } from '../services'

export const userFindManyController = async () => {
  const result = await userFindMany()
  return { payload: result }
}
