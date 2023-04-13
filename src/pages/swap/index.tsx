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
import { ALL_SUPPORTED_CHAIN_IDS } from 'constants/index'
import { ROUTERS } from 'constants/addresses'
import { FixedNumber } from 'ethers'
import { mulNumberWithDecimal } from 'utils/math'
import { MaxUint256 } from 'ethers'
import { useRouterContract } from 'hooks/useContract'

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
    // console.log({pair})

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


    const handleOnSwapExactTokensForTokens = async () => {
        try {
            if(inputAmount && tokenIn && tokenOut && outputAmount){
                await routerContract?.swapExactTokensForTokens(
                    mulNumberWithDecimal(inputAmount,tokenIn?.decimals),
                    mulNumberWithDecimal(Number(outputAmount) * 0.999, tokenOut?.decimals),
                    [tokenIn.address,tokenOut.address],
                    account,
                    (new Date().getTime()/1000 + 1000).toFixed(0)
                )                
                console.log('Successfully swapped');
                
            }

        } catch (error) {
            console.log(error);
            
        }
    }

    const handleOnSwapTokensForExactTokens = async () =>{
        try {
            if(inputAmount && tokenIn && tokenOut && outputAmount){
                await routerContract?.swapTokensForExactTokens(
                    mulNumberWithDecimal(outputAmount,  tokenOut.decimals),
                    mulNumberWithDecimal(Number(inputAmount) * 1 / 0.999, tokenIn.decimals),
                    [tokenIn.address,tokenOut.address],
                    account,
                    (new Date().getTime()/1000 + 1000).toFixed(0)
                )         

            }
        } catch (error) {
            console.log(error);
            
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
        if(inputAmount && pair && tokenIn && tokenOut && swapType === Field.INPUT){
            const amountInWithDel = mulNumberWithDecimal(inputAmount, tokenIn.decimals)
            const swapRate = pair?.calcSwapRate((amountInWithDel),tokenIn,tokenOut, Field.INPUT)
            onChangeSwapState({
                ...swapState,
                outputAmount: swapRate
            })
        } 
        if(!pair || !inputAmount) {
            onChangeSwapState({
                ...swapState,
                outputAmount: ''
            }) 
        }
    },[inputAmount, pair])

    useEffect(()=>{
        if(outputAmount && pair && tokenIn && tokenOut && swapType === Field.OUTPUT){
            const amountOutWithDel = mulNumberWithDecimal(outputAmount, tokenOut.decimals)
            const swapRate = pair?.calcSwapRate((amountOutWithDel), tokenIn, tokenOut, Field.OUTPUT)
            onChangeSwapState({
                ...swapState,
                inputAmount: swapRate
            }) 
        }
        if(!pair || !outputAmount) {
            onChangeSwapState({
                ...swapState,
                inputAmount: ''
            }) 
        }
    },[outputAmount, pair])

    const [setting, setSetting] = useState(false)
    console.log({tokenIn, tokenOut})
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
            Number(tokenApproval?.allowance) < Number(inputAmount)

        return (
            <Row>
                <PrimaryButton
                    onClick={() => { console.log('coming soon') }}
                    name={'Coming Soon'}
                />
                {/* {isNotConnected ? (
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
                ) : !isInffuficientLiquidity ? (
                    <LabelButton name="Insufficient Liquidity" />
                ) : isInsufficientAllowance ? (
                    <PrimaryButton
                        name={`Approve ${tokenIn?.symbol}`}
                        onClick={handleOnApprove}
                    />
                ) : (
                    <PrimaryButton
                        onClick={() => swapType === Field.INPUT ? handleOnSwapExactTokensForTokens() : handleOnSwapTokensForExactTokens()}
                        name={'Swap'}
                    />
                )} */}
            </Row>
        )
    }

    return (
        <SwapContainer>
            {!account && isOpenWalletModal && (
                <WalletModal setToggleWalletModal={openWalletModal} />
            )}
            <Row jus="space-between">
                <Row gap="20px">
                    <Link to="/swap">Swap</Link>
                    <Link to="/add">Add</Link>
                    {/* <Link to="/pools">Pool</Link> */}
                    <Link to="/limit">Limit</Link>
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
    @media screen and (max-width: 767px) {
        margin: 0 20px;
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
