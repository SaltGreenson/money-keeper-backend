import { ConflictException } from '../../../utils'
import { CreateUserType } from '../controllers'
import { User } from '../core'

export const userCreate = async (data: CreateUserType) => {
  try {
    return await new User(data).save()
  } catch (err) {
    console.log(err)
    throw new ConflictException('User already exists')
  }
}
