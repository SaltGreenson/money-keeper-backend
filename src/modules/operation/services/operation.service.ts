import { Schema } from 'mongoose'
import { isConflictMongoException } from '../../../helpers'
import { BadRequestException, ConflictException, InternalServerError } from '../../../utils'
import { cashAccountUpdateBalance } from '../../cash-account'
import { categoryFindById } from '../../category'
import { ICategory } from '../../category/core'
import { dashboardCreate } from '../../dashboard'
import { regularOperationCreate } from '../../regular-operation'
import { IUser } from '../../user/core'
import { OperationCreateType } from '../controllers'
import { IOperation, Operation, OperationStatus, OperationType } from '../core'

type PostcreateType = {
  data: IOperation
  user: IUser
  category: ICategory
  isRegular?: boolean
}

const operationPostcreate = async ({ category, data, user, isRegular }: PostcreateType) => {
  const promises: Promise<unknown>[] = []

  if (data.status === OperationStatus.CURRENT) {
    promises.push(
      dashboardCreate({
        amount: data.amount,
        cashAccountId: data.cashAccountId,
        categoryId: data.categoryId,
        operationType: data.type,
        day: data.date,
        userId: user._id as unknown as Schema.Types.ObjectId,
        generalCategoryId: (category.generalCategoryId ??
          category._id) as unknown as Schema.Types.ObjectId
      })
    )

    promises.push(
      cashAccountUpdateBalance(
        String(data.cashAccountId),
        Number(data.amount),
        data.type ?? OperationType.EXPENSES
      )
    )
  }

  if (isRegular) {
    promises.push(
      regularOperationCreate(
        {
          amount: Number(data.amount),
          cashAccountId: String(data.cashAccountId),
          categoryId: String(data.categoryId),
          name: data.name,
          startDate: data.date,
          type: data.type
        },
        user
      )
    )
  }

  return Promise.all(promises)
}

export const operationCreate = async (data: OperationCreateType, user: IUser) => {
  const category = await categoryFindById(data.categoryId)

  try {
    const result = await Operation.create({ ...data, userId: user._id })

    await operationPostcreate({ data: result, category, user, isRegular: data.isRegular })

    return result.toJSON()
  } catch (err) {
    if (isConflictMongoException(err)) {
      throw new ConflictException('Operation already added')
    }

    if (err instanceof BadRequestException) {
      throw err
    }

    console.error(err)

    throw new InternalServerError()
  }
}
