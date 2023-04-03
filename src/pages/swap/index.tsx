import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'
import Setting from 'components/Setting'
import Bridge from 'components/Bridge'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Field, Token } from 'interfaces'
import { useSwapActionHandlers, useSwapState } from 'states/swap/hooks'

const Swap = () => {
    const swapState = useSwapState()
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

    return (
        <SwapContainer>
            <Row jus="space-between">
                <Row gap="20px">
                    <Link to="swap">Swap</Link>
                    <Link to="limit">Limit</Link>
                </Row>
                <Setting />
            </Row>
            <Bridge />
            <CurrencyInputPanel
                value={inputAmount}
                onUserInput={handleOnUserInput}
                onUserSelect={handleOnTokenSelection}
                field={Field.INPUT}
            />
            <CurrencyInputPanel
                value={outputAmount}
                onUserInput={handleOnUserInput}
                onUserSelect={handleOnTokenSelection}
                field={Field.OUTPUT}
            />
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
    min-height: 500px;
    max-width: 430px;
    background: #130f0f;
    border: 1px solid rgb(0, 59, 92);
    border-radius: 12px;
    padding: 20px 25px;
    background: linear-gradient(
        to top right,
        rgba(0, 28, 44, 0.3),
        rgba(0, 28, 44, 0.3)
    );
    gap: 10px;
`

export default Swap
