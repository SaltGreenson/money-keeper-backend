import { z } from 'zod'
import { IRouter } from '../../../utils/common/controller-wrapper'
import { OperationType } from '../../operation'
import { categoryFindMany } from '../services'

export const categoryFindManyShema = z.object({
  name: z.string().max(100).optional(),
  operationType: z.enum([...Object.values(OperationType)] as [string, ...string[]]).optional(),
  parentId: z.string().optional()
})

export type CategoryFindManyType = z.infer<typeof categoryFindManyShema>

export const categoryFindManyController = async ({
  query,
  user
}: IRouter<never, never, CategoryFindManyType>) => {
  const result = await categoryFindMany(query, user)

  return { payload: result }
}
