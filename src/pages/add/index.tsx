import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'
import Setting from 'components/Setting'
import Bridge from 'components/Bridge'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Field, Token } from 'interfaces'
import { useSwapActionHandlers, useSwapState } from 'states/swap/hooks'
import PoolPriceBar from './PoolPriceBar'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import LabelButton from 'components/Buttons/LabelButton'
import SwapIcon from 'assets/icons/swap-icon.svg'

const Swap = () => {
    const swapState = useSwapState()
    const [poolPriceBarOpen, setPoolPriceBarOpen] = useState(true)
    const { inputAmount, outputAmount, swapType, tokenIn, tokenOut } = swapState
    const { onUserInput, onSwitchTokens, onTokenSelection, onChangeSwapState } =
        useSwapActionHandlers()

    const handleOnUserInput = useCallback(
        (field: Field, value: string) => {
            onUserInput(field, value)
        },
        [onUserInput, swapState],
    )

    const handleOnTokenSelection = useCallback(
        (field: Field, token: Token) => {
            onTokenSelection(field, token)
        },
        [onTokenSelection, swapState],
    )

    const handleOnSwap = () => {}

    const SwapButton = () => {
        const balanceIn = 0
        const isNotConnected = true
        const isUndefinedAmount = true
        const isInffuficientLiquidity = true
        const isUndefinedCoin = !tokenIn || !tokenOut
        const isInsufficientBalance = Number(inputAmount) > balanceIn
        const unSupportedNetwork = true

        return (
            <Row>
                {isNotConnected ? (
                    <PrimaryButton name="Connect Wallet" />
                ) : unSupportedNetwork ? (
                    <LabelButton name="Supported for testnet or devnet now" />
                ) : isUndefinedCoin ? (
                    <LabelButton name="Select a coin" />
                ) : isUndefinedAmount ? (
                    <LabelButton name="Enter an amount" />
                ) : isInffuficientLiquidity ? (
                    <LabelButton name="Insufficient Liquidity" />
                ) : isInsufficientBalance ? (
                    <LabelButton name="Insufficient Balance" />
                ) : (
                    <PrimaryButton
                        onClick={() => handleOnSwap()}
                        name={'Swap'}
                    />
                )}
            </Row>
        )
    }

    return (
        <SwapContainer>
            <Row jus="space-between">
                <Row gap="20px">
                    <Link to="swap">Swap</Link>
                    <Link to="add">Add</Link>
                    <Link to="limit">Limit</Link>
                </Row>
                <Setting />
            </Row>
            <Bridge />
            <Columns>
                <CurrencyInputPanel
                    token={tokenIn}
                    value={inputAmount}
                    onUserInput={handleOnUserInput}
                    onUserSelect={handleOnTokenSelection}
                    field={Field.INPUT}
                />
                <Icon src={SwapIcon} alt="icon" />
                <CurrencyInputPanel
                    token={tokenOut}
                    value={outputAmount}
                    onUserInput={handleOnUserInput}
                    onUserSelect={handleOnTokenSelection}
                    field={Field.OUTPUT}
                />
            </Columns>
            <PoolPriceBar
                dropDown={poolPriceBarOpen}
                setDropDown={setPoolPriceBarOpen}
            />
            <SwapButton />
        </SwapContainer>
    )
}

const SwapContainer = styled(Columns)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: fit-content;
    max-width: 480px;
    background: #130f0f;
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 20px 25px;
    background: linear-gradient(
        to top right,
        rgba(0, 28, 44, 0.3),
        rgba(0, 28, 44, 0.3)
    );
    gap: 15px;
`

const Icon = styled.img`
    width: 30px;
    margin: 0px auto;
`

export default Swap
