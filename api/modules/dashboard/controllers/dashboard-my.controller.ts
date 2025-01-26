import { z } from 'zod'
import { dateTransform } from '../../../helpers'
import { IRouter } from '../../../utils/common/controller-wrapper'
import { OperationType } from '../../operation'
import { DashboardType } from '../core'
import { dateResetDay, dateResetMonth, dateResetYear } from '../core/helpers'
import { dashboardFindByUserId } from '../services'

export const dashboardFindMySchema = z.object({
  type: z.enum([...Object.values(DashboardType)] as [string, ...string[]]).optional(),
  operationType: z.enum([...Object.values(OperationType)] as [string, ...string[]]).optional(),
  cashAccountId: z.string().optional(),
  categoryId: z.string().optional(),
  day: z.date().optional(),
  month: z.date().optional(),
  year: z.date().optional()
})

export type DashboardFindMyType = z.infer<typeof dashboardFindMySchema>

export const dashboardFindMyTransform = (data: DashboardFindMyType): DashboardFindMyType => ({
  ...data,
  day: dateTransform(data.day, dateResetDay),
  month: dateTransform(data.month, dateResetMonth),
  year: dateTransform(data.year, dateResetYear)
})

export const dashboardFindMyController = async ({
  user,
  query
}: IRouter<never, never, DashboardFindMyType>) => {
  const payload = await dashboardFindByUserId(query, user._id)

  return { payload }
}
