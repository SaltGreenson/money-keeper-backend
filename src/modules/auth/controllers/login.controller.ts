import { Response } from 'express'
import { z } from 'zod'
import { envVariable, ForbiddenException } from '../../../utils'
import { login } from '../services/auth.service'
import { IRouter } from './../../../utils/common/controller-wrapper'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20)
})

export type LoginType = z.infer<typeof loginSchema>

export const loginController = async (
  { body, config: { headers } }: IRouter<LoginType>,
  res: Response
) => {
  const userAgent = headers['user-agent']

  if (!userAgent) {
    throw new ForbiddenException()
  }

  const { token } = await login(userAgent, body)

  const cookieName = envVariable('COOKIE_NAME', { isRequired: true })

  res.cookie(cookieName, token)

  return { statusCode: 200, token }
}
