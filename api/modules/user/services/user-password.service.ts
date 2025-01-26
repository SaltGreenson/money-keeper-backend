import bcrypt from 'bcrypt'
import { BadRequestException } from '../../../utils'
import { User } from '../core'

export const userSavePassword = async (id: string, password: string) => {
  const salt = await bcrypt.genSalt(10)

  const hashedPassword = await bcrypt.hash(password, salt)

  const updated = await User.updateOne({ _id: id }, { password: hashedPassword })

  if (!updated.modifiedCount) {
    throw new BadRequestException('User not found')
  }

  return { id }
}

export const userComparePassword = async (id: string, password: string) => {
  const candidate = await User.findById(id)

  if (!candidate) {
    throw new BadRequestException('User not found')
  }

  const isEqual = await bcrypt.compare(password, candidate.password)

  return { isEqual }
}
