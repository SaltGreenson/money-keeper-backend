import { ConflictException } from '../../../utils'
import { User } from '../core'
import { ICreateUser } from '../interfaces'

export const userCreate = async (data: ICreateUser) => {
  try {
    return await new User(data).save()
  } catch (err) {
    console.log(err)
    throw new ConflictException('User already exists')
  }
}
