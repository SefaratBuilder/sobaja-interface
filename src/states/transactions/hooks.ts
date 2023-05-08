import { HistoryTrans, Txn, TxnState } from './reducer'
import { AppState } from './../index'
import { useDispatch, useSelector } from 'react-redux'
import { removeTxn, addTxn, addHistoryTxn } from './actions'

export function useTransactionsState(): TxnState {
    return useSelector((state: AppState) => state.transactions)
}

export function useTransactionHandler() {
    const dispatch = useDispatch()

    return {
        removeTxn: (txn: Txn) => dispatch(removeTxn(txn)),
        addTxn: (txn: Txn) => dispatch(addTxn(txn)),
        addHistoryTxn: (txn: HistoryTrans) => dispatch(addHistoryTxn(txn)),
    }
}
