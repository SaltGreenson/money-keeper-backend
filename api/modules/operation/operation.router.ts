import { Router } from 'express'
import { validatorMiddleware } from '../../middlewares'
import { controllerWrapper } from '../../utils'
import {
  operationCreateController,
  operationCreateSchema,
  operationCreateTransform,
  operationFindMyController
} from './controllers'

export const operationRouter = Router()

operationRouter.post(
  '/',
  validatorMiddleware(operationCreateSchema, 'body', operationCreateTransform),
  controllerWrapper(operationCreateController)
)

operationRouter.get('/my', controllerWrapper(operationFindMyController))
