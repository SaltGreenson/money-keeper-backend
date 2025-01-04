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

const sliceObject = (body: Record<string, unknown>, schema: z.ZodObject<any, any>) => {
  const keys = schema._getCached().keys

  return keys.reduce((acc: Record<string, unknown>, curr) => {
    acc[curr] = body[curr]

    return acc
  }, {})
}

export function validatorMiddleware(
  schema: z.ZodObject<any, any>,
  validate: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[validate])

      req[validate] = sliceObject(req[validate], schema)

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
