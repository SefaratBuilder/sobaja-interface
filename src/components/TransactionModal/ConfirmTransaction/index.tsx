import Blur from 'components/Blur'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import React, { Fragment, useRef } from 'react'
import { useAppState } from 'states/application/hooks'
import styled from 'styled-components'
import imgClose from 'assets/icons/x.svg'

interface ConfirmTransactionModalProps {
    setConfirmTransaction: React.Dispatch<React.SetStateAction<boolean>>

    payload?: any
    onConfirm?: any
}

const ConfirmTransactionModal = ({
    setConfirmTransaction,
    payload,
    onConfirm,
}: ConfirmTransactionModalProps) => {
    const ref = useRef<any>()
    const { slippage } = useAppState()

    useOnClickOutside(ref, () => {
        setConfirmTransaction(false)
    })

    const Swap = () => {
        const detail = payload?.method === 'swap' ? 'for' : 'x'
        return (
            <ContainerItem>
                <Header>
                    <div className={'title'}>Confirm {payload?.method}</div>
                    <div>
                        <ImgClose
                            onClick={() => setConfirmTransaction(false)}
                            src={imgClose}
                            alt="X"
                        />
                    </div>
                </Header>
                <EstimatedNotice>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <h2>{payload?.input || 999}</h2>
                        <h2>{payload?.tokenIn?.symbol || 'X'}</h2>
                    </TitleEstimate>
                    <h3>{detail}</h3>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <h2>{payload?.output || 9999}</h2>
                        <h2>{payload?.tokenOut?.symbol || 'Y'}</h2>
                    </TitleEstimate>
                    {/* <h2>{payload.tokenIn + "/" + payload.tokenOut} Pool Tokens</h2> */}
                    <span>
                        Output is estimated. If the price changes by more than{' '}
                        {slippage || 0}% your transaction will revert.
                    </span>
                </EstimatedNotice>
                <ContentBottom>
                    <WrapButton>
                        <PrimaryButton
                            onClick={() => {
                                onConfirm()
                                // setConfirmTransaction(false)
                            }}
                            type="light-blue"
                            name="Confirm Supply"
                        />
                    </WrapButton>
                </ContentBottom>
            </ContainerItem>
        )
    }
    return (
        <>
            <Container ref={ref}>
                {<Swap />}
                {/* <h1>Hello</h1> */}
                {/* {payload && payload?.method === 'Add' && <AddLiquidity />}
                {payload?.method === 'Remove' && <Remove />}
                {payload?.method === 'Faucet' && <Faucet />} */}
            </Container>
            <Blur />
        </>
    )
}

export default ConfirmTransactionModal

const Container = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    background: var(--bg5) !important;
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 20px 25px;
    background-color: #00000073;
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    max-width: 500px;
    width: 100%;
    padding: 20px 30px;
    backdrop-filter: blur(40px);
    z-index: 999;
    @media screen and (max-width: 576px) {
        max-width: 400px;
        width: 90%;
        padding: 20px 20px;
    }
    @media screen and (max-width: 390px) {
        max-width: 370px;
        padding: 20px 15px;
    }
`

const ContainerItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    .title {
        font-size: 30px;
        font-weight: bold;
    }
`
const WrapImg = styled.div`
    position: relative;
    margin-top: 15px;
    display: flex;

    img {
        height: 25px;
        width: 25px;
        border-radius: 50%;
    }
    img:first-child {
        z-index: 1;
    }
    img:nth-child(2) {
        position: absolute;
        left: -10px;
    }
`
const EstimatedNotice = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    h2 {
        font-weight: 400;
    }
    span {
        font-size: 12px;
        font-style: italic;
    }
    .details {
        font-size: 16px;
        font-style: italic;
        padding-bottom: 5px;
    }
`

const ImgClose = styled.img`
    width: 16px;
    /* height: 20px; */
    cursor: pointer;
`
const ContentBottom = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;

    img {
        height: 20px;
        width: 20px;
        border-radius: 50%;
    }
    div {
        display: flex;
        justify-content: space-between;
    }
`
const WrapButton = styled.div`
    /* margin-top: 1rem; */
`
const TitleEstimate = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    h1 {
        font-size: 48px;
        margin-right: 10px;
    }
`
