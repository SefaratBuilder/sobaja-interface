import Blur from 'components/Blur'
// import HiddenGlobalScroll from "components/HiddenGlobalScroll"
// import { Loader } from "components/Loader"
// import { payloadTxnModal } from "constants/index"
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import imgClose from 'assets/icons/x.svg'
import Loader from 'components/Loader'

interface WaitingTransactionModalProps {
    setModalRemove?: any
    payloadTxn?: any
}

const WaitingTransactionModal = ({
    setModalRemove,
    payloadTxn,
}: WaitingTransactionModalProps) => {
    const [message, setMessage] = useState<string>('')
    const ref = useRef()

    useEffect(() => {
        if (payloadTxn && payloadTxn?.method) {
            // const method = payloadTxn?.method
            switch (payloadTxn.method) {
                case 'Add':
                    setMessage(
                        `Supplying ${
                            payloadTxn.amountInNoDecimals +
                            ' ' +
                            payloadTxn.tokenIn
                        } and ${
                            payloadTxn.amountOutNoDecimals +
                            ' ' +
                            payloadTxn.tokenOut
                        }`,
                    )
                    break
                case 'Swap':
                    setMessage(
                        `Swap ${
                            payloadTxn?.amountIn + ' ' + payloadTxn.tokenIn
                        } for ${
                            payloadTxn?.amountOut + ' ' + payloadTxn.tokenOut
                        }`,
                    )
                    break
                case 'Remove':
                    {
                        setMessage(
                            `Remove ${
                                payloadTxn.amountIn + ' ' + payloadTxn.tokenIn
                            } for ${
                                payloadTxn.amountOut.coinX +
                                ' ' +
                                payloadTxn.tokenOut.coinX
                            } and ${
                                payloadTxn.amountOut.coinY +
                                ' ' +
                                payloadTxn.tokenOut.coinY
                            }`,
                        )
                    }
                    break
                case 'Faucet':
                    {
                        setMessage('')
                    }
                    break
                default:
                    setMessage('')
                    break
            }
        }
    }, [payloadTxn])

    useOnClickOutside(ref, () => {
        setModalRemove(false)
    })

    return (
        <>
            {/* <HiddenGlobalScroll /> */}
            <Container>
                <Header>
                    <ImgClose
                        onClick={() => setModalRemove(false)}
                        src={imgClose}
                        alt=""
                    />
                </Header>
                <WrapContent>
                    <WrapInfoLoad>
                        <div>Waiting For Confirmation</div>
                        <WrapLoader>
                            <Loader size="42px" />
                        </WrapLoader>
                        <div>{message}</div>
                        <div>Confirm this transaction in your wallet</div>
                    </WrapInfoLoad>
                </WrapContent>
            </Container>
            <Blur />
        </>
    )
}

export default WaitingTransactionModal
const Container = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 20px 25px;
    background: linear-gradient(
        to top right,
        rgba(0, 28, 44, 0.3),
        rgba(0, 28, 44, 0.3)
    );
    background-color: #00000073;

    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    max-width: 500px;
    width: 100%;
    padding: 20px 30px;
    backdrop-filter: blur(40px);
    @media screen and (max-width: 576px) {
        width: 90%;
    }
`
const Header = styled.div`
    display: flex;
    justify-content: flex-end;
`
const WrapContent = styled.div``
const WrapLoader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25px 0;
`
const WrapInfoLoad = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    div {
        text-align: center;
    }

    div:first-child {
        font-size: 24px;
    }
    div:last-child {
        color: #ffffffba;
        font-size: 14px;
    }
    @media screen and (max-width: 390px) {
        text-align: center;
    }
`
const ImgClose = styled.img`
    width: 16px;
    /* height: 20px; */
    cursor: pointer;
`
