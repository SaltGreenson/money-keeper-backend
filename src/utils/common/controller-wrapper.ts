import { NextFunction, Request, Response } from 'express'

type BasicType = object | undefined

export interface IRouter<B = BasicType, P = BasicType, Q = BasicType> {
  body: B
  params: P
  query: Q
  headers: Pick<Request, 'headers'>
}

export function controllerWrapper<B = BasicType, P = BasicType, Q = BasicType, S = unknown>(
  method: (a: IRouter<B, P, Q>) => Promise<S>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await method({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers
      } as unknown as IRouter<B, P, Q>)

      res.json(result ?? { statusCode: 200 })
    } catch (err) {
      next(err)
    }
  }
}
