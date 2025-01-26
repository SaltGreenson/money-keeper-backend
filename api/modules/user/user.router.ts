import { Router } from 'express'
import { validatorMiddleware } from '../../middlewares'
import { controllerWrapper } from '../../utils'
import {
  userCreateController,
  userCreateSchema,
  UserCreateType,
  userFindManyController,
  userMeController
} from './controllers'

export const userRouter = Router()

userRouter.post(
  '/',
  validatorMiddleware(userCreateSchema),
  controllerWrapper<UserCreateType>(userCreateController)
)

userRouter.get('/list', controllerWrapper(userFindManyController))
userRouter.get('/me', controllerWrapper(userMeController))
