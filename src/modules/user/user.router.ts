import { Router } from 'express'
import { controllerWrapper } from '../../utils'
import { ICreateUser } from './interfaces'
import { userCreateController, userGetListController } from './user.controller'

export const userRouter = Router()

userRouter.post('/', controllerWrapper<ICreateUser>(userCreateController))

userRouter.get('/list', controllerWrapper(userGetListController))
