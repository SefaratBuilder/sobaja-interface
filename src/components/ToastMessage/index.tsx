import React, { useState } from 'react'
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { Columns, Row } from 'components/Layouts';
import { useTransactionHandler, useTransactionsState } from 'states/transactions/hooks';
import { Txn } from 'states/transactions/reducer'
import styled from 'styled-components'
import SuccessIcon from 'assets/icons/success.svg'

const Toast = ({ txn } : { txn: Txn }) => {
    return (
      <ToastWrapper className="toast" href="#">
            <Row al={'center'} gap={'10px'}>
                {txn.msg} 
                <span className="icon">
                    <img src={SuccessIcon} alt="toast message icon" />
                </span>
            </Row>
            <span className="view-link">View on explorer</span>
      </ToastWrapper>
    );
};

const ToastMessage = () => {
    const { txnList } = useTransactionsState()
    const [hash, setHash] = useState(0)
    const { addTxn, removeTxn } = useTransactionHandler()

    return(
        <ToastMessageWrapper>
            <>
                <PrimaryButton name="Add" onClick={() => {
                    setHash(hash => hash + 1)
                    addTxn({ hash: 'asdasdsa', msg: 'asd kad asod asd asd asd as dqwiopejwq as da dasd asd asd a', status: true})
                }} />
                <PrimaryButton name="Remove" onClick={() => {
                    removeTxn({ hash: 'asdasdsa', msg: 'asd kad asod asd asd asd as dqwiopejwq as da dasd asd asd a', status: true})
                }} />
                {txnList.map((txn, index) => {
                    return <Toast txn={txn} key={index + 1} />
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
    padding: 20px;
    overflow: hidden;
`

const ToastWrapper = styled.a`
    background: var(--bg5);
    border-radius: 8px;
    white-space: pre-wrap;       /* css-3 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word; 
    min-height: 50px;
    border: 2px solid var(--border2);
    padding: 10px;
    cursor: pointer;

    animation: move cubic-bezier(0.1, 0.4, 0.7, 1) 1 .5s;

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
        width: 60px;

        img { 
            width: 100%;
        }
    }
`

export default ToastMessage