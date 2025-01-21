import { z } from 'zod'
import { IRouter } from '../../../utils/common/controller-wrapper'
import { OperationType } from '../../operation'
import { regularOperationCreate } from '../services'

export const regularOperationCreateSchema = z.object({
  name: z.string().min(3).max(100),
  startDate: z.date().min(new Date()),
  type: z.enum([...Object.values(OperationType)] as [string, ...string[]]).optional(),
  endDate: z.date().min(new Date()).optional(),
  categoryId: z.string(),
  cashAccountId: z.string(),
  amount: z.number().min(1)
})

export type RegularOperationCreateType = z.infer<typeof regularOperationCreateSchema>

export const regularOperationCreateTransform = (
  data: RegularOperationCreateType
): RegularOperationCreateType => {
  return {
    ...data,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : undefined
  }
}

export const regularOperationCreateController = async ({
  body,
  user
}: IRouter<RegularOperationCreateType>) => {
  const result = await regularOperationCreate(body, user)

  return { id: result._id }
}
