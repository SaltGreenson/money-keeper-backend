import { Request } from 'express'
import { IUser } from '../modules/user/core'

export interface IRequest extends Request {
  user: IUser
}
