import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
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
import { usePair } from 'hooks/useAllPairs'
import Setting from 'components/HeaderLiquidity'
import { useTokenApproval } from 'hooks/useToken'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import WalletModal from 'components/WalletModal'
import { shortenAddress } from 'utils'

import {
    ALL_SUPPORTED_CHAIN_IDS,
    URLSCAN_BY_CHAINID,
    WRAPPED_NATIVE_COIN,
} from 'constants/index'
import { ROUTERS, WRAPPED_NATIVE_ADDRESSES } from 'constants/addresses'
import { ZeroAddress } from 'ethers'
import { mulNumberWithDecimal } from 'utils/math'
import { useRouterContract } from 'hooks/useContract'
import {
    calcSlippageAmount,
    calcTransactionDeadline,
    computeGasLimit,
    isNativeCoin,
} from 'utils'
import {
    useAppState,
    useSlippageTolerance,
    useTransactionDeadline,
    useUpdateRefAddress,
} from 'states/application/hooks'
import { useTransactionHandler } from 'states/transactions/hooks'
import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import ToastMessage from 'components/ToastMessage'
import imgCopy from 'assets/icons/copy.svg'
import imgCheckMark from 'assets/icons/check-mark.svg'
import { sendEvent } from 'utils/analytics'
import Blur from 'components/Blur'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { OpacityModal } from 'components/Web3Status'

const Swap = () => {
    const swapState = useSwapState()
    const [poolPriceBarOpen, setPoolPriceBarOpen] = useState(true)
    const [isCopied, setIsCopied] = useState(false)
    const { inputAmount, outputAmount, swapType, tokenIn, tokenOut } = swapState
    const { onUserInput, onSwitchTokens, onTokenSelection, onChangeSwapState } =
        useSwapActionHandlers()
    const { chainId, library, account } = useActiveWeb3React()
    const { refAddress } = useAppState()
    const [isOpenWalletModal, setIsOpenWalletModal] = useState(false)
    const pair = usePair(chainId, tokenIn, tokenOut)
    const routerAddress = chainId ? ROUTERS[chainId] : undefined
    const tokenApproval = useTokenApproval(account, routerAddress, tokenIn)
    const balanceIn = useCurrencyBalance(account, tokenIn)
    const routerContract = useRouterContract()
    const { deadline } = useTransactionDeadline()
    const { addTxn } = useTransactionHandler()
    const initDataTransaction = InitCompTransaction()
    const loca = useLocation()
    const { slippage } = useSlippageTolerance()
    const updateRef = useUpdateRefAddress()
    const ref = useRef<any>()

    useOnClickOutside(ref, () => {
        setIsOpenWalletModal(false)
    })

    useEffect(() => {
        if (loca.search && loca.search.includes('?')) {
            updateRef(loca.search.slice(1))
        }
    }, [loca])

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

    const handleCopyAddress = () => {
        console.log({ href: window.location.href })
        console.log({ hostname: window.location.hostname })

        if (account) {
            navigator.clipboard
                .writeText(
                    // window.location.href
                    `https://app.sobajaswap.com/#/swap?
                        ${account}`,
                )
                .then(() => {
                    setIsCopied(true)
                    setTimeout(() => {
                        setIsCopied(false)
                    }, 1000)
                })
        }
    }

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
        const amountIn = mulNumberWithDecimal(inputAmount, tokenIn.decimals)
        const amountOut = mulNumberWithDecimal(outputAmount, tokenOut.decimals)
        const amountOutMin = mulNumberWithDecimal(
            calcSlippageAmount(outputAmount, slippage)[0],
            tokenOut.decimals,
        )
        const amountInMax = mulNumberWithDecimal(
            calcSlippageAmount(inputAmount, slippage)[1],
            tokenIn.decimals,
        )
        if (swapType === Field.INPUT) {
            if (isNativeCoin(tokenIn))
                return {
                    args: [
                        amountOutMin, //amountOutMin
                        [WRAPPED_NATIVE_ADDRESSES[chainId], tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: amountIn, //amountIn
                }
            else if (isNativeCoin(tokenOut))
                return {
                    args: [
                        amountIn, //amountIn
                        amountOutMin, //amountOutMin
                        [tokenIn.address, WRAPPED_NATIVE_ADDRESSES[chainId]],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: '0x00',
                }
            else
                return {
                    args: [
                        amountIn, //amountIn
                        amountOutMin, //amountOutMin
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
                        amountOut, //amountOut
                        amountInMax, //amountInMax
                        [tokenIn.address, WRAPPED_NATIVE_ADDRESSES[chainId]],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: '0x00',
                }
            else if (isNativeCoin(tokenIn))
                return {
                    args: [
                        amountOut, //amountOut
                        [WRAPPED_NATIVE_ADDRESSES[chainId], tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                    ],
                    value: amountInMax, //amountInMax
                }
            else
                return {
                    args: [
                        amountOut, //amountOut
                        amountInMax, //amountInMax
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

            const referralAddress = refAddress || ZeroAddress
            const newArgs = [...args, referralAddress]
            console.log('🤦‍♂️ ⟹ args:', newArgs)

            const gasLimit = await routerContract?.estimateGas[method](
                ...newArgs,
                {
                    value,
                },
            )
            console.log('🤦‍♂️ ⟹ onConfirm ⟹ gasLimit:', gasLimit)
            const callResult = await routerContract?.[method](...newArgs, {
                value,
                gasLimit: computeGasLimit(gasLimit),
            })

            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)

            console.log('🤦‍♂️ ⟹ handleOnSwap ⟹ callResult:', { callResult })
            sendEvent({
                category: 'Defi',
                action: 'Swap',
                label: [
                    tokenIn?.symbol,
                    tokenIn?.address,
                    tokenOut?.symbol,
                    tokenOut?.address,
                ].join('/'),
            })

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
            if (isNaN(Number(swapRate))) {
                onChangeSwapState({
                    ...swapState,
                    outputAmount: '',
                })
            } else {
                onChangeSwapState({
                    ...swapState,
                    outputAmount: swapRate,
                })
            }
            return
        }
        return () => {}
    }, [
        inputAmount,
        chainId,
        pair?.reserve0,
        pair?.reserve1,
        pair?.reserveLp,
        pair?.tokenLp.address,
    ])

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

            if (isNaN(Number(swapRate))) {
                onChangeSwapState({
                    ...swapState,
                    inputAmount: '',
                })
            } else {
                onChangeSwapState({
                    ...swapState,
                    inputAmount: swapRate,
                })
            }
        }
        return () => {}
    }, [
        outputAmount,
        chainId,
        pair?.reserve0,
        pair?.reserve1,
        pair?.reserveLp,
        pair?.tokenLp.address,
    ])

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
            </Row>
        )
    }

    return (
        <>
            <>
                <ComponentsTransaction
                    data={initDataTransaction}
                    onConfirm={
                        Number(tokenApproval?.allowance) <
                            Number(inputAmount) && !isNativeCoin(tokenIn)
                            ? handleOnApprove
                            : onConfirm
                    }
                />
                {(initDataTransaction.isOpenConfirmModal ||
                    initDataTransaction.isOpenResultModal ||
                    initDataTransaction.isOpenWaitingModal) && <Blur />}
            </>
            <ToastMessage />
            <SwapContainer ref={ref}>
                {!account && isOpenWalletModal && (
                    <>
                        <WalletModal
                            setToggleWalletModal={setIsOpenWalletModal}
                        />
                        <OpacityModal
                            onClick={() => setIsOpenWalletModal(false)}
                        />
                        {/* <Blur /> */}
                    </>
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
                        hideMaxButton={true}
                    />
                </Columns>
                {pair && (
                    <PoolPriceBar
                        pair={pair}
                        dropDown={poolPriceBarOpen}
                        setDropDown={setPoolPriceBarOpen}
                    />
                )}
                <SwapButton />

                {/* Test */}
                {/* <div>
                    <PrimaryButton
                        name="TEST"
                        onClick={() =>
                            initDataTransaction.setIsOpenWaitingModal(true)
                        }
                    />
                </div> */}
                <Referral>
                    <span>Referral:</span>
                    <p>
                        https://app.sobajaswap.com/#/swap?
                        {account && shortenAddress(account, 6)}
                    </p>
                    <span>
                        {isCopied ? (
                            <CopyBtn>
                                <CopyAccountAddress src={imgCheckMark} />
                                <Tooltip className="tooltip">Copied</Tooltip>
                            </CopyBtn>
                        ) : (
                            <CopyBtn>
                                <CopyAccountAddress
                                    onClick={() => handleCopyAddress()}
                                    src={imgCopy}
                                />
                                <Tooltip className="tooltip">
                                    Click to copy address
                                </Tooltip>
                            </CopyBtn>
                        )}
                    </span>
                </Referral>
            </SwapContainer>
        </>
    )
}

const SwapContainer = styled(Columns)`
    margin: 0 auto 40px;
    height: fit-content;
    max-width: 520px;
    background: var(--bg5) !important;
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 20px 25px;
    background-color: #00000073;
    gap: 15px;
    position: relative;
    z-index: 0;

    @media (max-width: 500px) {
        width: 90%;
    }
`

const Referral = styled.div`
    display: grid;
    grid-template-columns: 54px 1fr 12px;
    font-size: 14px;
    span {
        color: rgba(0, 255, 163, 1);
    }
    p {
        opacity: 0.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
    img {
        cursor: pointer;
    }
`

const CopyBtn = styled.div`
    position: relative;
    :hover .tooltip {
        transition: all 0.1s ease-in-out;
        opacity: 1;
        visibility: visible;
    }
`
const Tooltip = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    width: 100px;
    height: 30px;
    font-size: 12px;
    right: -45px;
    text-align: center;
    border: 1px solid;
    border-radius: 6px;
    background: rgba(157, 195, 230, 0.1);
    backdrop-filter: blur(3px);
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

const CopyAccountAddress = styled.img`
    height: 12px;
    cursor: pointer;
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
