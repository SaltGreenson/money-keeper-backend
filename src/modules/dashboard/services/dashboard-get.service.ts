import { DashboardFindMyType } from '../controllers'
import { DashboardType, Dashoboard } from '../core'
import { dateResetDay, dateResetMonth, dateResetYear } from '../core/helpers'

export const dashboardFindByUserId = async (data: DashboardFindMyType, userId: string) => {
  const filter: Record<string, unknown> = {
    userId,
    type: DashboardType.CASH_ACCOUNT
  }

  if (data.day) {
    filter.day = dateResetDay(data.day)
  } else if (data.month) {
    filter.month = dateResetMonth(data.month)
  } else if (data.year) {
    filter.year = dateResetYear(data.year)
  } else {
    filter.day = dateResetDay()
  }

  if (data.cashAccountId) {
    filter.cashAccountId = data.cashAccountId
  }

  if (data.categoryId) {
    filter.categoryId = data.categoryId
  }

  if (data.operationType) {
    filter.operationType = data.operationType
  }
  console.log(filter)
  return Dashoboard.find(filter)
    .select(
      '_id amount day month year operationType type categoryId cashAccountId cashAccount category'
    )
    .populate('category', '_id name')
    .populate('cashAccount', '_id name')
}
