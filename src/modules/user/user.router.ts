import { Router } from 'express'
import { validatorMiddleware } from '../../middlewares'
import { controllerWrapper } from '../../utils'
import {
  CreateUserType,
  userCreateController,
  userCreateSchema,
  userGetListController,
  userMeController
} from './controllers'

export const userRouter = Router()

userRouter.post(
  '/',
  validatorMiddleware(userCreateSchema),
  controllerWrapper<CreateUserType>(userCreateController)
)

userRouter.get('/list', controllerWrapper(userGetListController))
userRouter.get('/me', controllerWrapper(userMeController))
