import { Router } from 'express'
import { validatorMiddleware } from '../../middlewares'
import { controllerWrapper } from '../../utils'
import {
  regularOperationCreateController,
  regularOperationCreateSchema,
  regularOperationCreateTransform,
  regularOperationFindMyController
} from './controllers'

export const regularOperationRouter = Router()

regularOperationRouter.post(
  '/',
  validatorMiddleware(regularOperationCreateSchema, 'body', regularOperationCreateTransform),
  controllerWrapper(regularOperationCreateController)
)

regularOperationRouter.get('/my', controllerWrapper(regularOperationFindMyController))
