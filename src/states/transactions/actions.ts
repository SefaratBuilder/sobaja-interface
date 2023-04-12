import { createAction } from '@reduxjs/toolkit'
import { Txn } from './reducer'

export const addTxn = createAction<Txn>('transactions/addTxn')

export const removeTxn = createAction<Txn>('transactions/removeTxn')

