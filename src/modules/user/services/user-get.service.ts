import { BadRequestException } from '../../../utils'
import { User } from '../core'

export const userFindById = async (id: string) => {
  return User.findById(id)
}

export const userFindByIdWithThrow = async (id: string) => {
  const candidate = await userFindById(id)

  if (!candidate) {
    throw new BadRequestException('User not found')
  }

  return candidate
}

export const userFindByEmail = async (email: string) => {
  return User.findOne({ email })
}

export const userFindMany = async () => {
  return User.find()
}
