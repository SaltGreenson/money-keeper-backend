import { NextFunction, Request, Response } from 'express'
import { IRequest } from '../interfaces'
import { verifyToken } from '../modules/auth'
import { envVariable, ForbiddenException, UnauthorizedException } from '../utils'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieName = envVariable('COOKIE_NAME')

    const token = ((req.cookies ?? {}) as Record<string, string>)[cookieName]

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
