/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'
import { BadRequestException, InternalServerError } from '../utils'

const buildError = (error: ZodError) => {
  return error.errors.reduce((acc: Record<string, string[]>, issue) => {
    const field = issue.path.join('.')

    if (acc[field]) {
      acc[field].push(issue.message)
    } else {
      acc[field] = [issue.message]
    }

    return acc
  }, {})
}

export function validatorMiddleware(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (!(error instanceof ZodError)) {
        throw new InternalServerError((error as { message: string }).message)
      }

      const errors = buildError(error)

      throw new BadRequestException('Invalid data', { details: errors })
    }
  }
}
