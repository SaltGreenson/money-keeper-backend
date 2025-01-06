import { Router } from 'express'
import { validatorMiddleware } from '../../middlewares'
import { controllerWrapper } from '../../utils'
import {
  categoryCreateController,
  categoryCreateSchema,
  CategoryCreateType,
  categoryFindManyController,
  categoryFindManyShema,
  CategoryFindManyType
} from './controllers'

export const categoryRouter = Router()

categoryRouter.post(
  '/',
  validatorMiddleware(categoryCreateSchema),
  controllerWrapper<CategoryCreateType>(categoryCreateController)
)

categoryRouter.get(
  '/list',
  validatorMiddleware(categoryFindManyShema, 'query'),
  controllerWrapper<never, never, CategoryFindManyType>(categoryFindManyController)
)
