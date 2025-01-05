import { Response } from 'express'
import { envVariable, ForbiddenException } from '../../../utils'
import { IRouter } from '../../../utils/common/controller-wrapper'
import { removeToken } from '../services/token.service'

export const logoutController = async ({ config: { cookies } }: IRouter<never>, res: Response) => {
  const cookieName = envVariable('COOKIE_NAME', { isRequired: true })

  const token = ((cookies ?? {}) as Record<string, string>)[cookieName]

  if (!token) {
    throw new ForbiddenException()
  }

  await removeToken(token)

  res.clearCookie(cookieName)

  return { statusCode: 200 }
}
