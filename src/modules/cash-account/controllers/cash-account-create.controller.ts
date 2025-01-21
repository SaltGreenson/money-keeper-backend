import { z } from 'zod'
import { IRouter } from '../../../utils/common/controller-wrapper'
import { cashAccountCreate } from '../services'

export const cashAccountCreateSchema = z.object({
  name: z.string().min(3).max(100)
})

export type CashAccountCreateType = z.infer<typeof cashAccountCreateSchema>

export const cashAccountCreateController = async ({
  body,
  user
}: IRouter<CashAccountCreateType>) => {
  const result = await cashAccountCreate(body, user)

  return { id: result._id }
}
