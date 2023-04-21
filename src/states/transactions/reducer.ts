import { createReducer } from '@reduxjs/toolkit'
import { addTxn, removeTxn } from './actions'

export interface Txn {
    hash: string
    msg: string
    status: boolean
}

export interface TxnState {
    txnList: Txn[]
}

const initialState: TxnState = {
    txnList: [],
}

export default createReducer(initialState, (builder) => {
    builder
        .addCase(addTxn, (state, action) => {
            const txnList = [...state.txnList, action.payload]
            return {
                txnList,
            }
        })
        .addCase(removeTxn, (state, action) => {
            const txn = action.payload
            const txnList = state.txnList.filter((t) => t.hash !== txn.hash)
            return {
                txnList,
            }
        })
})
