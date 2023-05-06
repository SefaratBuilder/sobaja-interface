import { createAction } from '@reduxjs/toolkit'
import { HistoryTrans, Txn } from './reducer'

export const addTxn = createAction<Txn>('transactions/addTxn')
export const addHistoryTxn = createAction<HistoryTrans>('transactions/addHistoryTxn')
export const removeTxn = createAction<Txn>('transactions/removeTxn')
