import { NextFunction, Request, Response } from 'express'

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  console.error(err)

  try {
    const error = JSON.parse(err.message) as { message: string; statusCode: number }

    res.status(error.statusCode ?? 500).json(error)
  } catch {
    res.status(500).send({ message: 'Internal Server Error', statusCode: 500 })
  }
}
