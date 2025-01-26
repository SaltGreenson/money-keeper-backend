import { DashboardType, IDashboard } from '../../core'
import { dashboardCreateHelper } from './basic.service'

const getFilter = (data: Omit<IDashboard, 'type'>, key: 'day' | 'month' | 'year') => {
  return {
    type: DashboardType.OPERATION,
    [key]: data.day,
    cashAccountId: data.cashAccountId,
    categoryId: data.categoryId
  }
}

export const dashboardOperationCreate = async ({
  day,
  ...data
}: Omit<IDashboard, 'month' | 'year' | 'type'>) => {
  return Promise.all([
    dashboardCreateHelper({
      data: { ...data, type: DashboardType.OPERATION, day },
      filter: getFilter({ ...data, day }, 'day')
    }),
    dashboardCreateHelper({
      data: { ...data, type: DashboardType.OPERATION, month: day },
      filter: getFilter({ ...data, day }, 'month')
    }),
    dashboardCreateHelper({
      data: { ...data, type: DashboardType.OPERATION, year: day },
      filter: getFilter({ ...data, day }, 'year')
    })
  ])
}
