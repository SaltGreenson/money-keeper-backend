import { Response } from 'express'
import { envVariable, UnauthorizedException } from '../../../utils'
import { IRouter } from '../../../utils/common/controller-wrapper'
import { removeToken } from '../services/token.service'

export const logoutController = async (
  { config: { cookies, headers } }: IRouter<never>,
  res: Response
) => {
  const cookieName = envVariable('COOKIE_NAME', { isRequired: true })

  let token = ((cookies ?? {}) as Record<string, string>)[cookieName]

  if (!token) {
    const [, headerToken] = String(headers?.authorization).split(' ')

    token = headerToken
  }

  if (!token) {
    throw new UnauthorizedException()
  }

  await removeToken(token)

  res.clearCookie(cookieName)

  return { statusCode: 200 }
}
