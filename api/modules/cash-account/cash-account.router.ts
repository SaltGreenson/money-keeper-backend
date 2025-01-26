import { Router } from 'express'
import { validatorMiddleware } from '../../middlewares'
import { controllerWrapper } from '../../utils'
import {
  cashAccountCreateController,
  cashAccountCreateSchema,
  cashAccountFindMyController
} from './controllers'

export const cashAccountRouter = Router()

cashAccountRouter.post(
  '/',
  validatorMiddleware(cashAccountCreateSchema),
  controllerWrapper(cashAccountCreateController)
)

cashAccountRouter.get('/my', controllerWrapper(cashAccountFindMyController))
