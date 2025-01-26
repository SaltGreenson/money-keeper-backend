import { Router } from 'express'
import { validatorMiddleware } from '../../middlewares'
import { controllerWrapper } from '../../utils'
import {
  dashboardFindMyController,
  dashboardFindMySchema,
  dashboardFindMyTransform
} from './controllers'

export const dashboardRouter = Router()

dashboardRouter.get(
  '/my',
  validatorMiddleware(dashboardFindMySchema, 'query', dashboardFindMyTransform),
  controllerWrapper(dashboardFindMyController)
)
