import { DashboardType, IDashboard } from '../../core'
import { dashboardCreateHelper } from './basic.service'

const getFilter = (data: Omit<IDashboard, 'type'>, key: 'day' | 'month' | 'year') => {
  return {
    type: DashboardType.CASH_ACCOUNT,
    [key]: data.day,
    cashAccountId: data.cashAccountId,
    categoryId: data.categoryId
  }
}

export const dashboardCashAccountCreate = async ({
  day,
  ...data
}: Omit<IDashboard, 'month' | 'year' | 'type'>) => {
  return Promise.all([
    dashboardCreateHelper({
      data: { ...data, type: DashboardType.CASH_ACCOUNT, day },
      filter: getFilter({ ...data, day }, 'day')
    }),
    dashboardCreateHelper({
      data: { ...data, type: DashboardType.CASH_ACCOUNT, month: day },
      filter: getFilter({ ...data, day }, 'month')
    }),
    dashboardCreateHelper({
      data: { ...data, type: DashboardType.CASH_ACCOUNT, year: day },
      filter: getFilter({ ...data, day }, 'year')
    })
  ])
}
