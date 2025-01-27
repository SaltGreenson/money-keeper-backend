import { NextFunction, Request, Response } from 'express'
import { IRequest } from '../interfaces'
import { verifyToken } from '../modules/auth'
import { envVariable, ForbiddenException, UnauthorizedException } from '../utils'

const getToken = (req: Request) => {
  const cookieName = envVariable('COOKIE_NAME')

  const token = ((req.cookies ?? {}) as Record<string, string>)[cookieName]

  if (token) {
    return token
  }

  const authorization = req.headers.authorization

  if (!authorization) {
    return null
  }

  const [bearer, headerToken] = String(authorization).split(' ')

  if (bearer !== 'Bearer') {
    return null
  }

  if (!headerToken) {
    return null
  }

  return headerToken
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getToken(req)

    if (!token) {
      return next(new UnauthorizedException())
    }

    const userAgent = req.headers['user-agent']

    if (!userAgent) {
      return next(new ForbiddenException())
    }

    const { user } = await verifyToken(token, userAgent)

    ;(req as IRequest).user = user

    next()
  } catch (err) {
    next(err)
  }
}
