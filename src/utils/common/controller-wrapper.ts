import { NextFunction, Request, Response } from 'express'
import { IRequest } from '../../interfaces'
import { IUser } from '../../modules/user/core'

type BasicType = object | undefined

export interface IRouter<B = BasicType, P = BasicType, Q = BasicType> {
  body: B
  params: P
  query: Q
  user: IUser
  config: Pick<Request, 'headers' | 'cookies'>
}

export function controllerWrapper<B = BasicType, P = BasicType, Q = BasicType, S = unknown>(
  method: (a: IRouter<B, P, Q>, res: Response) => Promise<S>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await method(
        {
          body: req.body,
          params: req.params,
          query: req.query,
          user: (req as IRequest).user,
          config: { headers: req.headers, cookies: req.cookies }
        } as IRouter<B, P, Q>,
        res
      )
      res.json(result ?? { statusCode: 200 })
    } catch (err) {
      next(err)
    }
  }
}
