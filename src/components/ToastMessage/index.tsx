import React, { useEffect, useState } from 'react'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { Columns, Row } from 'components/Layouts'
import {
    useTransactionHandler,
    useTransactionsState,
} from 'states/transactions/hooks'
import { Txn } from 'states/transactions/reducer'
import styled from 'styled-components'
import SuccessIcon from 'assets/icons/success.svg'
import ErrorIcon from 'assets/icons/close.png'
import { InitCompTransaction } from 'components/TransactionModal'
import { useUpdateApplicationState } from 'states/application/hooks'
import { getEtherscanLink } from 'utils'
import { useActiveWeb3React } from 'hooks'

const Toast = ({ txn }: { txn: Txn }) => {
    const { removeTxn } = useTransactionHandler()
    const { chainId } = useActiveWeb3React()

    useEffect(() => {
        let timeX = setTimeout(() => {
            removeTxn(txn)
        }, 5000)

        return () => {
            clearTimeout(timeX)
        }
    }, [txn])

    console.log(getEtherscanLink(chainId || 80001, txn.hash, 'transaction'))
    return (
        <ToastWrapper className="toast" href="#">
            <Row al={'center'} jus={'space-between'} gap={'10px'}>
                <div>{txn.msg}</div>
                <span className="icon">
                    <img
                        src={txn.status ? SuccessIcon : ErrorIcon}
                        alt="toast message icon"
                    />
                </span>
            </Row>
            <span
                className="view-link"
                onClick={() =>
                    txn.hash &&
                    window.open(
                        getEtherscanLink(
                            chainId || 80001,
                            txn.hash,
                            'transaction',
                        ),
                    )
                }
            >
                View on explorer
            </span>
        </ToastWrapper>
    )
}

interface ToastMsg {
    payload?: any
    setToastMessageModal?: React.Dispatch<React.SetStateAction<boolean>>
    // isSuccess: boolean
    // txnHash?: string | undefined
}

const ToastMessage = ({ payload, setToastMessageModal }: ToastMsg) => {
    const { txnList } = useTransactionsState()

    return (
        <ToastMessageWrapper>
            <>
                {txnList.map((txn, index: any) => {
                    return (
                        <Toast
                            txn={{
                                hash: txn.hash,
                                msg: txn.msg,
                                status: txn.status,
                            }}
                            key={index + 1}
                        />
                    )
                })}
            </>
        </ToastMessageWrapper>
    )
}

const ToastMessageWrapper = styled(Columns)`
    position: absolute;
    right: 0;
    top: 0;
    max-width: 300px;
    width: 100%;
    z-index: 999;
    gap: 20px;
    /* padding: 20px; */
    margin-right: 20px;
    overflow: hidden;
`

const ToastWrapper = styled.a`
    background: var(--bg5);
    border-radius: 8px;
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word;
    min-height: 50px;
    border: 2px solid var(--border2);
    padding: 10px;
    cursor: pointer;

    animation: move cubic-bezier(0.1, 0.4, 0.7, 1) 1 0.5s;
    @keyframes move {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }

    :hover {
        text-decoration: none;
    }

    .view-link {
        font-weight: 600;
        text-decoration: underline;
        color: #00a3ff;
    }

    .icon {
        display: block;
        width: 24px;

        img {
            width: 100%;
        }
    }
`

const ToastLoader = styled.div`
    z-index: 1;
    animation: bounceInRight 0.2s linear;
    ::after {
        content: '';
        /* display: block;   */
        transition: all 2s ease;
        position: absolute;
        z-index: 3;
        height: 3px;
        left: 2px;
        bottom: 0;
        background: linear-gradient(to right, rgba(157, 195, 230, 1), #d5dbf0);
        /* box-shadow: 0 0 20px 0 rgb(0 64 120); */
        border-radius: 0px 0px 5px 5px;
        animation: setWidth 5s linear;
    }
    @keyframes setWidth {
        0% {
            width: 100%;
        }
        99% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            width: 0%;
        }
    }
    @keyframes bounceInRight {
        0% {
            opacity: 0;
            transform: translateX(120%);
        }
        60% {
            opacity: 1;
            transform: translateX(-10%);
        }
        80% {
            transform: translateX(10%);
        }
        100% {
            transform: translateX(0);
        }
    }
`

export default ToastMessage
