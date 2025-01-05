import jwt from 'jsonwebtoken'
import { isConflictException } from '../../../helpers'
import {
  BadRequestException,
  envVariable,
  ForbiddenException,
  InternalServerError,
  UnauthorizedException
} from '../../../utils'
import { IUser, UserStatus } from '../../user/core'
import { deviceFromUserAgent, Token } from '../core'

const generateToken = (userId: string) => {
  const jwtSecrent = envVariable('JWT_SECRET', { isRequired: true })
  return jwt.sign(userId, jwtSecrent)
}

export const saveToken = async (userId: string, userAgent: string) => {
  const device = deviceFromUserAgent(userAgent)
  const token = generateToken(userId)

  try {
    return (await Token.create({ device, userId, token })).toJSON()
  } catch (err) {
    if (isConflictException(err)) {
      const tokenData = (await Token.findOne({ device, userId }))?.toJSON()

      if (tokenData) {
        return tokenData
      }
    }

    console.error(err)
    throw new InternalServerError()
  }
}

export const removeToken = async (token: string) => {
  return Token.deleteOne({ token })
}

export const verifyToken = async (
  tokenToValidate: string,
  userAgent: string
): Promise<{ user: IUser }> => {
  try {
    const userId = jwt.decode(tokenToValidate, envVariable('JWT_SECRET', { isRequired: true }))

    if (!userId) {
      throw new UnauthorizedException()
    }

    const device = deviceFromUserAgent(userAgent)

    const token = await Token.findOne({ userId, device }).populate(
      'userId',
      'status roles name email'
    )

    if (!token) {
      throw new UnauthorizedException()
    }

    if ((token.userId as IUser).status !== UserStatus.ACTIVE) {
      throw new ForbiddenException()
    }

    return { user: token.userId as IUser }
  } catch {
    throw new UnauthorizedException()
  }
}

export const getToken = async (userId: string, userAgent: string) => {
  const device = deviceFromUserAgent(userAgent)

  const candidate = await Token.findOne({ device, userId })

  if (!candidate) {
    throw new BadRequestException('Token is missing')
  }

  return candidate.toJSON()
}

export const getCurrentlyLogged = async (userId: string) => {
  const payload = await Token.find({ userId })

  return { payload }
}
