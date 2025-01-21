import { z } from 'zod'
import { IRouter } from '../../../utils/common/controller-wrapper'
import { OperationType } from '../../operation'
import { CategoryType } from '../core'
import { categoryCreate } from '../services'

export const categoryCreateSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.enum([...Object.values(CategoryType)] as [string, ...string[]]).optional(),
  operationType: z.enum([...Object.values(OperationType)] as [string, ...string[]]),
  depth: z.number().optional(),
  parentId: z.string().optional(),
  hasChild: z.boolean().optional()
})

export type CategoryCreateType = z.infer<typeof categoryCreateSchema>

export const categoryCreateController = async ({ body, user }: IRouter<CategoryCreateType>) => {
  const result = await categoryCreate(body, user)

  return { id: result._id }
}
