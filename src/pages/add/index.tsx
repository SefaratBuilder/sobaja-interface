import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'
import Setting from 'components/Setting'
import Bridge from 'components/Bridge'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Field, Token } from 'interfaces'
import { useSwapActionHandlers, useSwapState } from 'states/swap/hooks'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import LabelButton from 'components/Buttons/LabelButton'
import PlusIcon from 'assets/icons/plus.svg'
import { useRouterContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import {ROUTERS} from 'constants/addresses'
import { useTokenApproval } from 'hooks/useToken'
import { mulNumberWithDecimal } from 'utils/math'
import { usePair } from 'hooks/useAllPairs'
import { ALL_SUPPORTED_CHAIN_IDS } from 'constants/index'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'

const Swap = () => {
    const swapState = useSwapState()
    const [poolPriceBarOpen, setPoolPriceBarOpen] = useState(true)
    const { inputAmount, outputAmount, tokenIn, tokenOut } = swapState
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

    const router = useRouterContract();
    const { account, chainId } = useActiveWeb3React();
    const pair = usePair(chainId, tokenIn, tokenOut)
    const routerAddress = chainId ? ROUTERS[chainId] : undefined
    const tokenApproval = useTokenApproval(account, routerAddress, tokenIn)




    const handleOnApprove = async () =>{
        try {
            if (tokenIn && inputAmount && routerAddress) {
                await tokenApproval.approve(
                    routerAddress,
                    mulNumberWithDecimal(inputAmount, tokenIn.decimals),
                )
                console.log('Approve successfully...')
            }
        } catch (err) {
            console.log('Failed to approve token: ', err)
        }
    }

    const handleOnAddLiquidity = () => {
        router?.addLiquidity(
            tokenIn?.address,
            tokenOut?.address,
            inputAmount,
            outputAmount,
            0,
            0,
            account,
            (new Date()).getTime()
        )
    }

    const AddButton = () => {
        // const balanceIn = 0
        // const balanceOut = 0
        // const isNotConnected = true
        // const isUndefinedAmount = true
        // const isInsufficientBalance = true
        // const isUndefinedCoin = true
        // const isInffuficientLiquidity = !pair
        const balanceIn = useCurrencyBalance(account, tokenIn)
        const isNotConnected = !account
        const unSupportedNetwork =
            chainId && !ALL_SUPPORTED_CHAIN_IDS.includes(chainId)
        const isUndefinedAmount = inputAmount && outputAmount
        const isInffuficientLiquidity = !pair
        const isUndefinedCurrencies = !tokenIn || !tokenOut
        const isInsufficientBalance =
            inputAmount && balanceIn && Number(balanceIn) < Number(inputAmount)
        const isInsufficientAllowance =
            Number(tokenApproval?.allowance) < Number(inputAmount)


        return (
            <Row>
                {isNotConnected ? (
                    <PrimaryButton
                        // onClick={() => setIsConnected(!isConnected)}
                        name="Connect Wallet"
                    />
                ) : unSupportedNetwork ? (
                    <LabelButton name="Unsupported network"/>
                ) :
                    isUndefinedCurrencies ? (
                    <LabelButton name="Select a coin" />
                ) : isUndefinedAmount ? (
                    <LabelButton name="Enter an amount" />
                ) : isInsufficientBalance ? (
                    <LabelButton name="Insufficient Balance" />
                ) : isInsufficientAllowance ? (
                    <PrimaryButton 
                        name={`Approve ${tokenIn?.symbol}`}
                        onClick={handleOnApprove}
                    />
                ) : isInffuficientLiquidity ? (
                    <LabelButton name="Insufficient Liquidity" />
                ) : (
                    <PrimaryButton
                        onClick={() => handleOnAddLiquidity()}
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
                    <Link to="/swap">Swap</Link>
                    <Link to="/add">Add</Link>
                    <Link to="/pools">Pool</Link>
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
                <Icon>
                    <img src={PlusIcon} alt="icon" />
                </Icon>
                <CurrencyInputPanel
                    token={tokenOut}
                    value={outputAmount}
                    onUserInput={handleOnUserInput}
                    onUserSelect={handleOnTokenSelection}
                    field={Field.OUTPUT}
                />
            </Columns>
            <AddButton />
        </SwapContainer>
    )
}

const SwapContainer = styled(Columns)`
    position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
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

const Icon = styled.div`
    width: 35px;
    height: 35px;
    margin: -10px auto;
    cursor: pointer;
    border-radius: 50%;
    transition: all ease-in-out 0.3s;
    background: var(--bg4);
    border: 2px solid var(--border3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    img {
        width: 20px;
    }
`

export default Swap
