import { Router } from 'express'
import { validatorMiddleware } from '../../middlewares'
import { controllerWrapper } from '../../utils'
import { loginController, loginSchema, LoginType } from './controllers'
import { logoutController } from './controllers/logout.controller'

export const authRouter = Router()

authRouter.post(
  '/login',
  validatorMiddleware(loginSchema),
  controllerWrapper<LoginType>(loginController)
)

authRouter.delete('/logout', controllerWrapper(logoutController))
