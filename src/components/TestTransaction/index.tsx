import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import ConfirmTransactionModal from 'components/TransactionModal/ConfirmTransaction'
import React, { useCallback, useEffect, useState } from 'react'
import { useTransactionHandler } from 'states/transactions/hooks'
import styled from 'styled-components'

const TestTransaction = () => {
    const initDataTransaction = InitCompTransaction()
    const [isConfirm, setIsConfirm] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const { addTxn, removeTxn } = useTransactionHandler()

    useEffect(() => {
        if (isConfirm) {
            let timeX = setTimeout(() => {
                initDataTransaction.setTransactionHash('0x112312312312')
                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)
                setIsConfirm(false)
            })

            return () => {
                clearTimeout(timeX)
            }
        }
    }, [isConfirm])

    useEffect(() => {
        if (isDone) {
            let timeX = setTimeout(() => {
                addTxn({
                    hash: '1289731289738912',
                    msg: '324789237fh2iufh',
                    status: true,
                })

                initDataTransaction.setIsOpenResultModal(false)
                initDataTransaction.setIsTransactionSuccess(true)
                initDataTransaction.setIsOpenToastMessageModal(true)
                setIsDone(false)
            })
            return () => {
                clearTimeout(timeX)
                initDataTransaction.setIsOpenToastMessageModal(false)
            }
        }
    }, [isDone])

    const onConfirm = useCallback(async () => {
        try {
            initDataTransaction.setError('')
            initDataTransaction.setIsOpenWaitingModal(true)
            initDataTransaction.setIsOpenConfirmModal(false)

            setTimeout(() => {
                setIsConfirm(true)
            }, 2000)

            setTimeout(() => {
                initDataTransaction.setPayload({
                    ...initDataTransaction.payload,
                    msg: new Date().getTime(),
                })
                // addTxn({
                //     hash: Math.random().toString(),
                //     msg: Math.random().toString(),
                //     status: true,
                // })

                setIsDone(true)
            }, 4000)

            // const transactionHash: any = await signAndSubmitTransaction(initDataTransaction?.payload?.payload)
            // const transactionHash: any = '0x-0k3'
            // initDataTransaction.setTransactionHash(transactionHash)

            // initDataTransaction.setIsOpenWaitingModal(false)
            // initDataTransaction.setIsOpenResultModal(true)

            // if (!transactionHash || transactionHash?.error) {
            //     initDataTransaction.setError('Failed')
            //     return
            // }

            // const result: any = await sdk.client.waitForTransactionWithResult(transactionHash?.hash)
            // const result: any = { success: true }
            // if (result?.success) {
            //     initDataTransaction.setIsOpenToastMessageModal(true)
            //     initDataTransaction.setIsTransactionSuccess(result?.success)
            //     // updateApplication()
            //     // await handleRefAddress(address, refAddress, 'stake')
            // }
            // if (result?.error) {
            //     initDataTransaction.setError(
            //         'Failed to stake. Please try again!',
            //     )
            //     initDataTransaction.setIsTransactionSuccess(false)
            //     return
            // }
        } catch (error) {
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
            initDataTransaction.setError('Failed')
        }
    }, [initDataTransaction])

    return (
        <Container>
            <div>
                <button
                    onClick={
                        () => initDataTransaction.setIsOpenConfirmModal(true)
                        // initDataTransaction.setIsOpenWaitingModal(true)
                    }
                >
                    Dens ot kcilc
                </button>
            </div>
            <ComponentsTransaction
                data={initDataTransaction}
                onConfirm={onConfirm}
            />

            {/* {p && <ConfirmTransactionModal setConfirmTransaction={setP} />} */}
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
`

export default TestTransaction
