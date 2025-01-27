import { Router } from 'express'
import { validatorMiddleware } from '../../middlewares'
import { controllerWrapper } from '../../utils'
import { loginController, loginSchema, LoginType } from './controllers'
import { loggedDevicesController } from './controllers/logged-devices.controller'
import { logoutController } from './controllers/logout.controller'

export const authRouter = Router()

authRouter.post(
  '/login',
  validatorMiddleware(loginSchema),
  controllerWrapper<LoginType>(loginController)
)

export const authAuthenticatedRouter = Router()

authAuthenticatedRouter.get('/logged-devices', controllerWrapper(loggedDevicesController))

authAuthenticatedRouter.delete('/logout', controllerWrapper(logoutController))
