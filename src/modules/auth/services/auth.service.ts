import { ForbiddenException } from '../../../utils'
import { userComparePassword, userCreate, userFindByEmail } from '../../user'
import { UserStatus } from '../../user/core'
import { LoginType } from './../controllers/login.controller'
import { saveToken } from './token.service'

export const login = async (userAgent: string, { email, password }: LoginType) => {
  let candidate = await userFindByEmail(email)

  if (!candidate) {
    candidate = await userCreate({ email, password })

    return saveToken(candidate._id.toString(), userAgent)
  }

  if (candidate.status !== UserStatus.ACTIVE) {
    throw new ForbiddenException('Invalid email or password')
  }

  const { isEqual } = await userComparePassword(candidate._id.toString(), password)

  if (!isEqual) {
    throw new ForbiddenException('Invalid email or password')
  }

  return saveToken(candidate._id.toString(), userAgent)
}
