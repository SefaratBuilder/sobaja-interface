import ToastMessage from 'components/ToastMessage'
import React, { useState } from 'react'
import ConfirmTransactionModal from './ConfirmTransaction'
import WaitingTransactionModal from './WaitingTransaction'
import ResultTransactionModal from './ResultTransaction'

export interface CompTransaction {
    payload: any
    setPayload: React.Dispatch<React.SetStateAction<any>>

    isOpenConfirmModal: boolean
    setIsOpenConfirmModal: React.Dispatch<React.SetStateAction<boolean>>

    // onConfirm: Promise<void>

    isOpenWaitingModal: boolean
    setIsOpenWaitingModal: React.Dispatch<React.SetStateAction<boolean>>

    isOpenResultModal: boolean
    setIsOpenResultModal: React.Dispatch<React.SetStateAction<boolean>>

    isOpenToastMessageModal: boolean
    setIsOpenToastMessageModal: React.Dispatch<React.SetStateAction<boolean>>

    TransactionHash: string
    setTransactionHash: React.Dispatch<React.SetStateAction<string>>

    isTransactionSuccess: boolean
    setIsTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>
    error: any
    setError: React.Dispatch<React.SetStateAction<string>>
}

interface Data {
    data: CompTransaction
    onConfirm: any
}

export const InitCompTransaction = (): CompTransaction => {
    const [payload, setPayload] = useState<any>(undefined)
    const [TransactionHash, setTransactionHash] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [isTransactionSuccess, setIsTransactionSuccess] =
        useState<boolean>(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
    const [isOpenWaitingModal, setIsOpenWaitingModal] = useState<boolean>(false)
    const [isOpenResultModal, setIsOpenResultModal] = useState<boolean>(false)
    const [isOpenToastMessageModal, setIsOpenToastMessageModal] =
        useState<boolean>(false)

    return {
        payload,
        setPayload,
        setError,
        setIsTransactionSuccess,
        isOpenConfirmModal,
        setIsOpenConfirmModal,
        isOpenWaitingModal,
        setIsOpenWaitingModal,
        isOpenResultModal,
        setIsOpenResultModal,
        isOpenToastMessageModal,
        setIsOpenToastMessageModal,
        TransactionHash,
        setTransactionHash,
        isTransactionSuccess,
        error,
    }
}

const ComponentsTransaction = ({ data, onConfirm }: Data) => {
    return (
        <>
            {data.isOpenConfirmModal && (
                <ConfirmTransactionModal
                    setConfirmTransaction={data.setIsOpenConfirmModal}
                    payload={data.payload}
                    onConfirm={onConfirm}
                />
            )}
            {data.isOpenWaitingModal && (
                <WaitingTransactionModal
                    setModalRemove={data.setIsOpenWaitingModal}
                    payloadTxn={data.payload}
                />
            )}
            {data.isOpenResultModal && (
                <ResultTransactionModal
                    isSuccess={data.error ? false : true}
                    setOpenModal={data.setIsOpenResultModal}
                    error={data.error}
                    txnHash={data.TransactionHash}
                />
            )}
            {data.isOpenToastMessageModal && (
                <ToastMessage
                    payload={data.payload}
                    setToastMessageModal={data.setIsOpenToastMessageModal}
                    isSuccess={data.isTransactionSuccess}
                    txnHash={data.TransactionHash}
                />
            )}
        </>
    )
}

export default ComponentsTransaction
