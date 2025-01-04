import jwt from 'jsonwebtoken'
import { isConflictException } from '../../../helpers'
import { BadRequestException, envVariable, InternalServerError } from '../../../utils'
import { deviceFromUserAgent, Token } from '../core'

const generateToken = (userId: string) => {
  const jwtSecrent = envVariable('JWT_SECRET', { isRequired: true })

  return jwt.sign(userId, jwtSecrent, { expiresIn: new Date(9999, 11).getTime() })
}

export const saveToken = async (userId: string, userAgent: string) => {
  const device = deviceFromUserAgent(userAgent)
  const token = generateToken(userId)

  try {
    return (await Token.create({ device, userId, token })).toJSON()
  } catch (err) {
    if (isConflictException(err)) {
      return (await Token.findOne({ device, userId }))?.toJSON()
    }

    console.error(err)
    throw new InternalServerError()
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
