import { User } from '../core'

export const userGetList = async () => {
  return User.find()
}
