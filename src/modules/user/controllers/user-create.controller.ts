import { z } from 'zod'
import { IRouter } from '../../../utils'
import { userCreate } from '../services'

export const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(30).optional(),
  password: z.string().min(8).max(20).optional()
})

export type CreateUserType = z.infer<typeof userCreateSchema>

export const userCreateController = async ({ body }: IRouter<CreateUserType>) => {
  const result = await userCreate(body)

  return { id: result._id }
}
