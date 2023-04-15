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
import {
    ALL_SUPPORTED_CHAIN_IDS,
    URLSCAN_BY_CHAINID,
    WRAPPED_NATIVE_COIN,
} from 'constants/index'
import { ROUTERS, WRAPPED_NATIVE_ADDRESSES } from 'constants/addresses'
import { FixedNumber } from 'ethers'
import { mulNumberWithDecimal } from 'utils/math'
import { MaxUint256 } from 'ethers'
import { useFactoryContract, usePairContract, useRouterContract } from 'hooks/useContract'
import { calcTransactionDeadline, computeGasLimit, isNativeCoin } from 'utils'
import { useAppState, useTransactionDeadline } from 'states/application/hooks'
import { useTransactionHandler } from 'states/transactions/hooks'
import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import ToastMessage from 'components/ToastMessage'

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
    const { addTxn } = useTransactionHandler()
    const initDataTransaction = InitCompTransaction()
    const pairContract = usePairContract('0x1990D029794ffC74fC20908740A22de982152945')
    const factoryContract = useFactoryContract()
    console.log({pair, tokenIn, tokenOut})
    const mintLp = async () => {
        try {
            if(account) {
                console.log('111', pairContract)
                // const token0 = await pairContract?.token0()
                // const token1 = await pairContract?.token1()
                // console.log('>>>>>>>>>>>>>>>', token0, token1)
                const gasLimit = await pairContract?.estimateGas.mint(account)
                const callResult = await pairContract?.mint(account, { gasLimit })

                await callResult.wait()
                if(callResult?.status === 1) console.log('mint okkkkk', callResult)
            }
        } catch(err) {
            console.log('failed mint' ,err)
        }
    }

    const create = async () => {
        try {
            if(account) {
                console.log('111', factoryContract)
                console.log('addressssss', tokenIn?.address, tokenOut?.address)
                const gasLimit = await factoryContract?.estimateGas.createPair(tokenIn?.address, tokenOut?.address)
                const callResult = await factoryContract?.createPair(tokenIn?.address, tokenOut?.address, { gasLimit: computeGasLimit(gasLimit) })
                await callResult.wait()
                if(callResult?.status === 1) console.log('create okkkkk', callResult)
            }
        } catch(err) {
            console.log('failed mint' ,err)
        }
    }

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
        if (swapType === Field.INPUT) {
            if (isNativeCoin(tokenIn)) return 'swapExactETHForTokens'
            else if (isNativeCoin(tokenOut)) return 'swapExactTokensForETH'
            else return 'swapExactTokensForTokens'
        } else {
            if (isNativeCoin(tokenOut)) return 'swapTokensForExactETH'
            else if (isNativeCoin(tokenIn)) return 'swapETHForExactTokens'
            else return 'swapTokensForExactTokens'
        }
    }

    const getSwapArguments = () => {
        if (!inputAmount || !outputAmount || !tokenIn || !tokenOut || !chainId)
            return
        if (swapType === Field.INPUT) {
            console.log({
                amountOutmin: mulNumberWithDecimal(
                    outputAmount,
                    tokenOut.decimals,
                ),
            })
            if (isNativeCoin(tokenIn))
                return {
                    args: [
                        '0', //amountOutMin
                        [WRAPPED_NATIVE_ADDRESSES[chainId], tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: mulNumberWithDecimal(inputAmount, tokenIn.decimals), //amountIn
                }
            else if (isNativeCoin(tokenOut))
                return {
                    args: [
                        mulNumberWithDecimal(inputAmount, tokenIn.decimals), //amountIn
                        '0x00',
                        [tokenIn.address, WRAPPED_NATIVE_ADDRESSES[chainId]],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: '0x00',
                }
            else
                return {
                    args: [
                        mulNumberWithDecimal(inputAmount, tokenIn.decimals), //amountIn
                        mulNumberWithDecimal(outputAmount, tokenOut.decimals), //amountOutMin
                        [tokenIn.address, tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: '0x00',
                }
        } else {
            if (isNativeCoin(tokenOut))
                return {
                    args: [
                        mulNumberWithDecimal(outputAmount, tokenOut.decimals), //amountOut
                        mulNumberWithDecimal(inputAmount, tokenIn.decimals), //amountInMax
                        [tokenIn.address, WRAPPED_NATIVE_ADDRESSES[chainId]],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: '0x00',
                }
            else if (isNativeCoin(tokenIn))
                return {
                    args: [
                        mulNumberWithDecimal(outputAmount, tokenOut.decimals), //amountOut
                        [WRAPPED_NATIVE_ADDRESSES[chainId], tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: mulNumberWithDecimal(inputAmount, tokenIn.decimals), //amountInMax
                }
            else
                return {
                    args: [
                        mulNumberWithDecimal(outputAmount, tokenOut.decimals), //amountOut
                        mulNumberWithDecimal(inputAmount, tokenIn.decimals), //amountInMax
                        [tokenIn.address, tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: '0x00',
                }
        }
    }

    const handleOnSwap = async () => {
        try {
            if (inputAmount && outputAmount && tokenIn && tokenOut) {
                console.log('swaping...')
                initDataTransaction.setError('')
                initDataTransaction.setPayload({
                    method: 'swap',
                    input: inputAmount,
                    output: outputAmount,
                    tokenIn,
                    tokenOut,
                })
                initDataTransaction.setIsOpenConfirmModal(true)
            }
        } catch (error) {
            console.log('failed to swap', error)
        }
    }

    const handleOnApprove = async () => {
        try {
            initDataTransaction.setError('')

            if (tokenIn && inputAmount && routerAddress) {
                console.log('approving....')
                initDataTransaction.setIsOpenWaitingModal(true)
                const callResult: any = await tokenApproval?.approve(
                    routerAddress,
                    mulNumberWithDecimal(inputAmount, tokenIn.decimals),
                )

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                        callResult.hash || ''
                    }`,
                    // hash: tx?.hash || '',
                    msg: 'Approve',
                    status: txn.status === 1 ? true : false,
                })
            }
        } catch (err) {
            console.log('Failed to approve token: ', err)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
        }
    }

    const onConfirm = useCallback(async () => {
        try {
            initDataTransaction.setIsOpenConfirmModal(false)
            initDataTransaction.setIsOpenWaitingModal(true)

            const method = getSwapMethod()
            const swapArguments = getSwapArguments()
            if (!swapArguments) {
                initDataTransaction.setError('Failed')
                initDataTransaction.setIsOpenWaitingModal(false)
                return initDataTransaction.setIsOpenResultModal(true)
            }

            const { args, value } = swapArguments
            const gasLimit = await routerContract?.estimateGas[method](
                ...args,
                { value },
            )
            const callResult = await routerContract?.[method](...args, {
                value,
                gasLimit: computeGasLimit(gasLimit),
            })

            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)

            console.log('🤦‍♂️ ⟹ handleOnSwap ⟹ callResult:', { callResult })
            const txn = await callResult.wait()
            initDataTransaction.setIsOpenResultModal(false)

            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                    callResult.hash || ''
                }`,
                // hash: tx?.hash || '',
                msg: 'Swap',
                status: txn.status === 1 ? true : false,
            })
        } catch (error) {
            // initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }, [initDataTransaction])

    const openWalletModal = () => {
        setIsOpenWalletModal(!isOpenWalletModal)
    }

    useEffect(() => {
        if (
            inputAmount &&
            pair &&
            tokenIn &&
            tokenOut &&
            swapType === Field.INPUT &&
            chainId
        ) {
            const amountInWithDel = mulNumberWithDecimal(
                inputAmount,
                tokenIn.decimals,
            )
            const tI = isNativeCoin(tokenIn)
                ? WRAPPED_NATIVE_COIN[chainId]
                : tokenIn
            const tO = isNativeCoin(tokenOut)
                ? WRAPPED_NATIVE_COIN[chainId]
                : tokenOut
            const swapRate = pair?.calcSwapRate(
                amountInWithDel,
                tI,
                tO,
                Field.INPUT,
            )
            onChangeSwapState({
                ...swapState,
                outputAmount: swapRate,
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
    }, [inputAmount, chainId])

    useEffect(() => {
        if (
            outputAmount &&
            pair &&
            tokenIn &&
            tokenOut &&
            swapType === Field.OUTPUT &&
            chainId
        ) {
            const amountOutWithDel = mulNumberWithDecimal(
                outputAmount,
                tokenOut.decimals,
            )
            const tI = isNativeCoin(tokenIn)
                ? WRAPPED_NATIVE_COIN[chainId]
                : tokenIn
            const tO = isNativeCoin(tokenOut)
                ? WRAPPED_NATIVE_COIN[chainId]
                : tokenOut
            const swapRate = pair?.calcSwapRate(
                amountOutWithDel,
                tI,
                tO,
                Field.OUTPUT,
            )
            onChangeSwapState({
                ...swapState,
                inputAmount: swapRate,
            })
        }
        return () => {
            // onChangeSwapState({
            //     ...swapState,
            //     outputAmount: '',
            //     inputAmount: ''
            // })
        }
    }, [outputAmount, chainId])

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
            Number(tokenApproval?.allowance) < Number(inputAmount) &&
            !isNativeCoin(tokenIn)

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
                <PrimaryButton
                        onClick={() => mintLp()}
                        name={'Mint lp'}
                />
                <PrimaryButton
                        onClick={() => create()}
                        name={'Create pair'}
                />
            </Row>
        )
    }

    return (
        <>
            <ComponentsTransaction
                data={initDataTransaction}
                onConfirm={
                    Number(tokenApproval?.allowance) < Number(inputAmount) &&
                    !isNativeCoin(tokenIn)
                        ? handleOnApprove
                        : onConfirm
                }
            />
            <ToastMessage />
            <SwapContainer>
                {!account && isOpenWalletModal && (
                    <WalletModal setToggleWalletModal={openWalletModal} />
                )}
                <Row jus="space-between">
                    <Nav gap="20px">
                        <Link to="/swap" className="active-link">
                            Swap
                        </Link>
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
                        <img
                            src={SwapIcon}
                            alt="icon"
                            onClick={onSwitchTokens}
                        />
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
        </>
    )
}

const SwapContainer = styled(Columns)`
    margin: 0 auto 40px;
    height: fit-content;
    max-width: 480px;
    background: var(--bg5) !important;
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 20px 25px;
    background: linear-gradient(
        to top right,
        rgba(0, 28, 44, 0.3),
        rgba(0, 28, 44, 0.3)
    );
    gap: 15px;
    @media (max-width: 500px) {
        width: 90%;
    }
`

const Nav = styled(Row)`
    a {
        padding: 5px 8px;
        border-radius: 4px;
        text-decoration: none !important;
        :hover {
            text-decoration: none !important;
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
