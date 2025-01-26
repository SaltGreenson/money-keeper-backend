import { z } from 'zod'
import { IRouter } from '../../../utils/common/controller-wrapper'
import { OperationType } from '../core'
import { operationCreate } from '../services'

export const operationCreateSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(300).optional(),
  type: z.enum([...Object.values(OperationType)] as [string, ...string[]]).optional(),
  date: z.date(),
  categoryId: z.string(),
  cashAccountId: z.string(),
  amount: z.number().min(0.01),
  isRegular: z.boolean().optional()
})

export type OperationCreateType = z.infer<typeof operationCreateSchema>

export const operationCreateTransform = (data: OperationCreateType): OperationCreateType => {
  return {
    ...data,
    date: new Date(data.date)
  }
}

export const operationCreateController = async ({ body, user }: IRouter<OperationCreateType>) => {
  const result = await operationCreate(body, user)

  return { id: result._id }
}
