import { BadRequestException } from '../../../utils'
import { User } from '../core'

export const userFindById = async (id: string) => {
  return (await User.findById(id))?.toJSON()
}

export const userFindByIdWithThrow = async (id: string) => {
  const candidate = await userFindById(id)

  if (!candidate) {
    throw new BadRequestException('User not found')
  }

  return candidate
}

export const userFindByEmail = async (email: string) => {
  return (await User.findOne({ email }))?.toJSON()
}

export const userFindByEmailWithThrow = async (email: string) => {
  const candidate = await userFindByEmail(email)

  if (!candidate) {
    throw new BadRequestException('Invalid email or password')
  }

  return candidate
}

export const userFindMany = async () => {
  return User.find()
}
