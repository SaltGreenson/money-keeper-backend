import { Double } from 'mongodb'
import { Schema } from 'mongoose'
import { InternalServerError } from '../../../../utils'
import { Dashoboard, IDashboard } from '../../core'
import { dateResetDay, dateResetMonth, dateResetYear } from '../../core/helpers'
import { dashboardCashAccountCreate } from './dashboard-cash-account.service'
import { dashboardOperationCreate } from './dashboard-operation.service'

type DashboardCreateType = {
  filter: Record<string, unknown>
  data: IDashboard
}

const transformData = (data: IDashboard) => {
  if (data.day) {
    return { ...data, day: data.day, year: undefined, month: undefined }
  }

  if (data.month) {
    return { ...data, month: data.month, year: undefined, day: undefined }
  }

  if (data.year) {
    return { ...data, year: data.year, month: undefined, day: undefined }
  }

  throw new InternalServerError('Date is missing for dashboard')
}

const getFilter = (data: IDashboard, basicFilter: Record<string, unknown>) => {
  if (basicFilter.year) {
    basicFilter.year = dateResetYear(basicFilter.year as Date)
  }

  if (basicFilter.month) {
    basicFilter.month = dateResetMonth(basicFilter.month as Date)
  }

  if (basicFilter.day) {
    basicFilter.day = dateResetDay(basicFilter.day as Date)
  }

  return {
    ...basicFilter,
    operationType: data.operationType,
    userId: data.userId
  }
}

export const dashboardCreateHelper = async ({ data, filter }: DashboardCreateType) => {
  const updated = await Dashoboard.updateOne(getFilter(data, filter), {
    $inc: { amount: new Double(Number(data.amount)) }
  })

  if (!updated.matchedCount) {
    return Dashoboard.create(transformData(data))
  }

  return updated
}

export const dashboardCreate = async ({
  generalCategoryId,
  ...data
}: Omit<IDashboard, 'type' | 'month' | 'year'> & { generalCategoryId: Schema.Types.ObjectId }) => {
  return Promise.all([
    dashboardCashAccountCreate({ ...data, categoryId: generalCategoryId }),
    dashboardOperationCreate(data)
  ])
}
