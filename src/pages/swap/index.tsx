import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'
import Bridge from 'components/Bridge'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Field, Token } from 'interfaces'
import { useSwapActionHandlers, useSwapState } from 'states/swap/hooks'
import PoolPriceBar from './PoolPriceBar'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import LabelButton from 'components/Buttons/LabelButton'
import SwapIcon from 'assets/icons/swap-icon.svg'
import { useActiveWeb3React } from 'hooks'
import { usePair, usePairAddressesByIds } from 'hooks/useAllPairs'
import Setting from 'components/HeaderLiquidity'
import { useToken, useTokenApproval } from 'hooks/useToken'
import { useCurrencyBalance, useTokenBalance } from 'hooks/useCurrencyBalance'
import WalletModal from 'components/WalletModal'
import { ALL_SUPPORTED_CHAIN_IDS, WRAPPED_NATIVE_COIN } from 'constants/index'
import { ROUTERS, WRAPPED_NATIVE_ADDRESSES } from 'constants/addresses'
import { FixedNumber } from 'ethers'
import { mulNumberWithDecimal } from 'utils/math'
import { MaxUint256 } from 'ethers'
import { useRouterContract } from 'hooks/useContract'
import { calcTransactionDeadline, computeGasLimit, isNativeCoin } from 'utils'
import { useTransactionDeadline } from 'states/application/hooks'
import { useSlippageTolerance } from '../../states/application/hooks'
import {calcSlippageAmount} from '../../utils/index'

const Swap = () => {

    const swapState = useSwapState()
    const [poolPriceBarOpen, setPoolPriceBarOpen] = useState(false)
    const { inputAmount, outputAmount, swapType, tokenIn, tokenOut } = swapState
    const { onUserInput, onSwitchTokens, onTokenSelection, onChangeSwapState } =
        useSwapActionHandlers()
    const { chainId, library, account } = useActiveWeb3React()
    const [isOpenWalletModal, setIsOpenWalletModal] = useState(false)
    const pair = usePair(chainId, tokenIn, tokenOut)
    const routerAddress = chainId ? ROUTERS[chainId] : undefined
    const tokenApproval = useTokenApproval(account, routerAddress, tokenIn)
    const balanceIn = useCurrencyBalance(account, tokenIn)
    const routerContract = useRouterContract()
    const { deadline } = useTransactionDeadline()
    
    const { slippage, setSlippage } = useSlippageTolerance()

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

    const getSwapMethod = () => {
        if(swapType === Field.INPUT) {
            if(isNativeCoin(tokenIn))
                return 'swapExactETHForTokens'
            else if(isNativeCoin(tokenOut))
                return 'swapExactTokensForETH'
            else 
                return 'swapExactTokensForTokens'
        } else {
            if(isNativeCoin(tokenOut))
                return 'swapTokensForExactETH'
            else if(isNativeCoin(tokenIn))
                return 'swapETHForExactTokens'
            else    
                return 'swapTokensForExactTokens'
        }
    }

    const getSwapArguments = () => {
        if(!inputAmount || !outputAmount || !tokenIn || !tokenOut || !chainId) return 
        if(swapType === Field.INPUT) {
            console.log({amountOutmin: mulNumberWithDecimal(outputAmount, tokenOut.decimals)})
            if(isNativeCoin(tokenIn))
                return {
                    args: [
                        mulNumberWithDecimal(calcSlippageAmount(outputAmount,slippage)[0], tokenOut.decimals), // amountOutMin
                        [WRAPPED_NATIVE_ADDRESSES[chainId], tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline)
                    ],
                    value: mulNumberWithDecimal(inputAmount, tokenIn.decimals) //amountIn
                }
            else if(isNativeCoin(tokenOut))
                return {
                    args: [
                        mulNumberWithDecimal(inputAmount, tokenIn.decimals), //amountIn
                        mulNumberWithDecimal(calcSlippageAmount(outputAmount,slippage)[0], tokenOut.decimals), //amountOutMin
                        [tokenIn.address, WRAPPED_NATIVE_ADDRESSES[chainId]],
                        account,
                        calcTransactionDeadline(deadline)
                    ],
                    value: '0x00'
                }
            else
                return {
                    args: [
                        mulNumberWithDecimal(inputAmount, tokenIn.decimals), //amountIn
                        mulNumberWithDecimal(calcSlippageAmount(outputAmount,slippage)[0], tokenOut.decimals), //amountOutMin
                        [tokenIn.address, tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline)
                    ],
                    value: '0x00'
                }
        } else {
            if(isNativeCoin(tokenOut))
                return {
                    args: [
                        mulNumberWithDecimal(outputAmount, tokenOut.decimals), //amountOut
                        mulNumberWithDecimal(calcSlippageAmount(inputAmount,slippage)[1], tokenIn.decimals), //amountInMax
                        [tokenIn.address, WRAPPED_NATIVE_ADDRESSES[chainId]],
                        account,
                        calcTransactionDeadline(deadline)
                    ],
                    value: '0x00'
                }
            else if(isNativeCoin(tokenIn))
                return {
                    args: [
                        mulNumberWithDecimal(outputAmount, tokenOut.decimals), //amountOut
                        [WRAPPED_NATIVE_ADDRESSES[chainId], tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline)
                    ],
                    value: mulNumberWithDecimal(calcSlippageAmount(inputAmount,slippage)[1], tokenIn.decimals) //amountInMax
                }
            else
                return {
                    args: [
                        mulNumberWithDecimal(outputAmount, tokenOut.decimals), //amountOut
                        mulNumberWithDecimal(calcSlippageAmount(inputAmount,slippage)[1], tokenIn.decimals), //amountInMax
                        [tokenIn.address, tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline)
                    ],
                    value: '0x00'
                }
        }
    }

    const handleOnSwap = async () => {
        try {
            if(inputAmount && outputAmount && tokenIn && tokenOut) {
                const method = getSwapMethod()
                const swapArguments = getSwapArguments()
                if(!swapArguments) return
                const { args, value } = swapArguments
                const gasLimit = await routerContract?.estimateGas[method](...args, { value })
                const callResult = await routerContract?.[method](...args, { value, gasLimit: computeGasLimit(gasLimit)})
                const txn = await callResult.wait()
                if(txn.status === 1) {
                    console.log('Swap successfully...')
                }
            }
        } catch(error) {
            console.log('failed to swap', error)
        }
    }

    const handleOnApprove = async () => {
        try {
            if (tokenIn && inputAmount && routerAddress) {
                await tokenApproval?.approve(
                    routerAddress,
                    mulNumberWithDecimal(inputAmount, tokenIn.decimals)
                )                
            }
        } catch (err) {
            console.log('Failed to approve token: ', err)
        }
    }

    const openWalletModal = () => {
        setIsOpenWalletModal(!isOpenWalletModal)
    }

    useEffect(()=>{
        if(inputAmount && pair && tokenIn && tokenOut && swapType === Field.INPUT && chainId){
            const amountInWithDel = mulNumberWithDecimal(inputAmount, tokenIn.decimals)
            const tI = isNativeCoin(tokenIn) ? WRAPPED_NATIVE_COIN[chainId] : tokenIn
            const tO = isNativeCoin(tokenOut) ? WRAPPED_NATIVE_COIN[chainId] : tokenOut
            const swapRate = pair?.calcSwapRate((amountInWithDel), tI, tO, Field.INPUT)
            onChangeSwapState({
                ...swapState,
                outputAmount: swapRate
            })
            return
        } 
        return () => {
            // onChangeSwapState({
            //     ...swapState,
            //     outputAmount: '',
            //     inputAmount: ''
            // })
        }
    },[inputAmount, chainId])

    useEffect(()=>{
        if(outputAmount && pair && tokenIn && tokenOut && swapType === Field.OUTPUT && chainId){
            const amountOutWithDel = mulNumberWithDecimal(outputAmount, tokenOut.decimals)
            const tI = isNativeCoin(tokenIn) ? WRAPPED_NATIVE_COIN[chainId] : tokenIn
            const tO = isNativeCoin(tokenOut) ? WRAPPED_NATIVE_COIN[chainId] : tokenOut
            const swapRate = pair?.calcSwapRate((amountOutWithDel), tI, tO, Field.OUTPUT)
            onChangeSwapState({
                ...swapState,
                inputAmount: swapRate
            }) 
        }
        return () => {
            // onChangeSwapState({
            //     ...swapState,
            //     outputAmount: '',
            //     inputAmount: ''
            // })
        }
    },[outputAmount, chainId])

    const SwapButton = () => {
        const isNotConnected = !account
        const unSupportedNetwork =
            chainId && !ALL_SUPPORTED_CHAIN_IDS.includes(chainId)
        const isUndefinedAmount = !inputAmount && !outputAmount
        const isInffuficientLiquidity = !pair || Number(inputAmount) < 0
        const isUndefinedCurrencies = !tokenIn || !tokenOut
        const isInsufficientBalance =
            inputAmount && balanceIn && Number(balanceIn) < Number(inputAmount)
        const isInsufficientAllowance =
            Number(tokenApproval?.allowance) < Number(inputAmount) && !isNativeCoin(tokenIn)

        return (
            <Row>
                {isNotConnected ? (
                    <PrimaryButton
                        name="Connect Wallet"
                        onClick={openWalletModal}
                    />
                ) : unSupportedNetwork ? (
                    <LabelButton name="Unsupported network" />
                ) : isUndefinedCurrencies ? (
                    <LabelButton name="Select a coin" />
                ) : isUndefinedAmount ? (
                    <LabelButton name="Enter an amount" />
                ) : isInsufficientBalance ? (
                    <LabelButton name="Insufficient Balance" />
                ) : isInffuficientLiquidity ? (
                    <LabelButton name="Insufficient Liquidity" />
                ) : isInsufficientAllowance ? (
                    <PrimaryButton
                        name={`Approve ${tokenIn?.symbol}`}
                        onClick={handleOnApprove}
                    />
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
            {!account && isOpenWalletModal && (
                <WalletModal setToggleWalletModal={openWalletModal} />
            )}
            <Row jus="space-between">
                <Nav gap="20px">
                    <Link to="/swap" className='active-link'>Swap</Link>
                    {/* <Link to="/add">Add</Link> */}
                    {/* <Link to="/pools">Pool</Link> */}
                    <Link to="/limit">Limit</Link>
                </Nav>
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
                    <img src={SwapIcon} alt="icon" onClick={onSwitchTokens} />
                </Icon>
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
    margin: 40px auto;
    height: fit-content;
    max-width: 480px;
    background: var(--bg5)!important;
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 20px 25px;
    background: linear-gradient(
        to top right,
        rgba(0, 28, 44, 0.3),
        rgba(0, 28, 44, 0.3)
    );
    gap: 15px;
    @media(max-width: 500px) {
        width: 90%;
    }
`

const Nav = styled(Row)`
    a {
        padding: 5px 8px;
        border-radius: 4px;
        text-decoration: none!important;
        :hover {
            text-decoration: none!important;
        }
    }

    .active-link {
        background: var(--bg6);
    }
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

    :hover {
        transform: rotate(180deg);
    }
    img {
        width: 20px;
    }
`

export default Swap
