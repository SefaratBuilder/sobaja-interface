import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'
import Setting from 'components/HeaderLiquidity'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Field, Token } from 'interfaces'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import LabelButton from 'components/Buttons/LabelButton'
import PlusIcon from 'assets/icons/plus.svg'
import { ROUTERS } from 'constants/addresses'
import { useTokenApproval } from 'hooks/useToken'
import {
    ALL_SUPPORTED_CHAIN_IDS,
    URLSCAN_BY_CHAINID,
    WRAPPED_NATIVE_COIN,
    ZERO_ADDRESS,
} from 'constants/index'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import {
    useFactoryContract,
    useRouterContract,
    useTokenContract,
    useRouterSmartAccountContract,
} from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { divNumberWithDecimal, mulNumberWithDecimal } from 'utils/math'
import { usePair } from 'hooks/useAllPairs'
import { calcSlippageAmount, isNativeCoin, shortenAddress } from 'utils'
import WalletModal from 'components/WalletModal'
import { InitCompTransaction } from 'components/TransactionModal'
import ComponentsTransaction from 'components/TransactionModal'
import { useTransactionHandler } from 'states/transactions/hooks'
import PoolPriceBar from './PoolPriceBar'
import BackArrow from 'assets/icons/arrow-left.svg'
import {
    useAppState,
    useSlippageTolerance,
    useUpdateRefAddress,
} from 'states/application/hooks'
import imgCopy from 'assets/icons/copy.svg'
import imgCheckMark from 'assets/icons/check-mark.svg'
import { sendEvent } from 'utils/analytics'
import { useMintActionHandlers, useMintState } from 'states/mint/hooks'
import Blur from 'components/Blur'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { OpacityModal } from 'components/Web3Status'
import { useEstimateGas } from 'hooks/useEstimateGas'
import { useSmartAccountContext } from 'contexts/SmartAccountContext'
import { useSmartAccount } from 'hooks/useSmartAccount'

const Add = () => {
    const mintState = useMintState()
    const [poolPriceBarOpen, setPoolPriceBarOpen] = useState(true)
    const [isOpenWalletModal, setIsOpenWalletModal] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const { inputAmount, outputAmount, tokenIn, tokenOut, swapType } = mintState
    const { onUserInput, onTokenSelection, onChangeMintState } =
        useMintActionHandlers()
    const { account, chainId } = useActiveWeb3React()
    const { wallet } = useSmartAccountContext()
    const routerContract = useRouterContract()
    const routerAddress = chainId ? ROUTERS[chainId] : undefined
    const contractApproveTokenIn = useTokenContract(tokenIn?.address)
    const contractApproveTokenOut = useTokenContract(tokenOut?.address)

    const tokenInApproval = useTokenApproval(
        wallet?.address || account,
        routerAddress,
        tokenIn,
    )
    const tokenOutApproval = useTokenApproval(
        wallet?.address || account,
        routerAddress,
        tokenOut,
    )
    const { slippage } = useSlippageTolerance()
    const { refAddress } = useAppState()
    const initDataTransaction = InitCompTransaction()
    const { addTxn } = useTransactionHandler()
    const loca = useLocation()
    const pair = usePair(chainId, tokenIn, tokenOut)
    const ref = useRef<any>()
    const { sendUserPaidTransaction } = useSmartAccount(wallet?.address)

    useOnClickOutside(ref, () => {
        setIsOpenWalletModal(false)
    })

    const isInsufficientAllowanceTokenIn =
        Number(tokenInApproval?.allowance) < Number(inputAmount) &&
        tokenIn?.address !== ZERO_ADDRESS
    const isInsufficientAllowanceTokenOut =
        Number(tokenOutApproval?.allowance) < Number(outputAmount) &&
        tokenOut?.address !== ZERO_ADDRESS
    const isInsufficientAllowance =
        isInsufficientAllowanceTokenIn || isInsufficientAllowanceTokenOut

    const updateRef = useUpdateRefAddress()

    useEffect(() => {
        if (loca.search && loca.search.includes('?')) {
            updateRef(loca.search.slice(1))
        }
    }, [loca])

    const handleOnUserInput = useCallback(
        (field: Field, value: string) => {
            onUserInput(field, value)
        },
        [onUserInput, mintState],
    )

    const handleOnTokenSelection = useCallback(
        (field: Field, token: Token) => {
            onTokenSelection(field, token)
        },
        [onTokenSelection, mintState],
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

    const handleOnAdd = async () => {
        try {
            if (inputAmount && outputAmount && tokenIn && tokenOut) {
                initDataTransaction.setError('')
                initDataTransaction.setPayload({
                    method: 'add liquidity',
                    input: inputAmount,
                    output: outputAmount,
                    tokenIn,
                    tokenOut,
                })
                initDataTransaction.setIsOpenConfirmModal(true)
            }
        } catch (error) {
            console.log('failed to add', error)
        }
    }

    const getAddMethod = useCallback(() => {
        const isEthTxn = isNativeCoin(tokenIn) || isNativeCoin(tokenOut)

        const method = isEthTxn ? 'addLiquidityETH' : 'addLiquidity'
        return method
    }, [tokenIn, tokenOut])

    const getAddArguments = useCallback(() => {
        if (!inputAmount || !outputAmount || !tokenIn || !tokenOut) return

        const isEthTxn = isNativeCoin(tokenIn) || isNativeCoin(tokenOut)
        const token = isNativeCoin(tokenIn) ? tokenOut : tokenIn
        const amountToken = isNativeCoin(tokenOut) ? inputAmount : outputAmount
        const amountTokenMin = isNativeCoin(tokenIn)
            ? mulNumberWithDecimal(
                  calcSlippageAmount(outputAmount, slippage)[0],
                  tokenOut.decimals,
              )
            : mulNumberWithDecimal(
                  calcSlippageAmount(inputAmount, slippage)[0],
                  tokenIn.decimals,
              )

        let value = isNativeCoin(tokenIn)
            ? mulNumberWithDecimal(inputAmount, tokenIn.decimals)
            : mulNumberWithDecimal(outputAmount, tokenOut.decimals)
        value = isEthTxn ? value : '0'
        let valueMin = isNativeCoin(tokenIn)
            ? mulNumberWithDecimal(
                  calcSlippageAmount(inputAmount, slippage)[0],
                  tokenIn.decimals,
              )
            : mulNumberWithDecimal(
                  calcSlippageAmount(outputAmount, slippage)[0],
                  tokenOut.decimals,
              )

        if (isEthTxn) {
            return {
                args: [
                    token.address,
                    mulNumberWithDecimal(amountToken, token.decimals),
                    amountTokenMin,
                    valueMin,
                    account,
                    (new Date().getTime() / 1000 + 1000).toFixed(0),
                    refAddress || ZERO_ADDRESS,
                ],
                value,
            }
        } else {
            return {
                args: [
                    tokenIn.address,
                    tokenOut.address,
                    mulNumberWithDecimal(inputAmount, tokenIn.decimals),
                    mulNumberWithDecimal(outputAmount, tokenOut.decimals),
                    mulNumberWithDecimal(
                        calcSlippageAmount(inputAmount, slippage)[0],
                        tokenIn.decimals,
                    ),
                    mulNumberWithDecimal(
                        calcSlippageAmount(outputAmount, slippage)[0],
                        tokenOut.decimals,
                    ),
                    account,
                    (new Date().getTime() / 1000 + 1000).toFixed(0),
                    refAddress || ZERO_ADDRESS,
                ],
                value,
            }
        }
    }, [inputAmount, outputAmount, tokenIn, tokenOut])

    const onConfirms = useCallback(async () => {
        try {
            if (inputAmount && outputAmount && tokenIn && tokenOut) {
                const method = getAddMethod()
                const argument = getAddArguments()

                if (!argument) {
                    initDataTransaction.setError('Failed')
                    return initDataTransaction.setIsOpenResultModal(true)
                }
                initDataTransaction.setIsOpenConfirmModal(false)
                initDataTransaction.setIsOpenWaitingModal(true)

                const isEthTxn = isNativeCoin(tokenIn) || isNativeCoin(tokenOut)
                // const method = isEthTxn ? 'addLiquidityETH' : 'addLiquidity'
                const token = isNativeCoin(tokenIn) ? tokenOut : tokenIn
                const amountToken = isNativeCoin(tokenOut)
                    ? inputAmount
                    : outputAmount
                const amountTokenMin = isNativeCoin(tokenIn)
                    ? mulNumberWithDecimal(
                          calcSlippageAmount(outputAmount, slippage)[0],
                          tokenOut.decimals,
                      )
                    : mulNumberWithDecimal(
                          calcSlippageAmount(inputAmount, slippage)[0],
                          tokenIn.decimals,
                      )
                let value = isNativeCoin(tokenIn)
                    ? mulNumberWithDecimal(inputAmount, tokenIn.decimals)
                    : mulNumberWithDecimal(outputAmount, tokenOut.decimals)
                value = isEthTxn ? value : '0'

                let valueMin = isNativeCoin(tokenIn)
                    ? mulNumberWithDecimal(
                          calcSlippageAmount(inputAmount, slippage)[0],
                          tokenIn.decimals,
                      )
                    : mulNumberWithDecimal(
                          calcSlippageAmount(outputAmount, slippage)[0],
                          tokenOut.decimals,
                      )

                const args = isEthTxn
                    ? [
                          token.address,
                          mulNumberWithDecimal(amountToken, token.decimals),
                          amountTokenMin, //
                          valueMin,
                          account,
                          (new Date().getTime() / 1000 + 1000).toFixed(0),
                          refAddress || ZERO_ADDRESS,
                      ]
                    : [
                          tokenIn.address,
                          tokenOut.address,
                          mulNumberWithDecimal(inputAmount, tokenIn.decimals),
                          mulNumberWithDecimal(outputAmount, tokenOut.decimals),
                          mulNumberWithDecimal(
                              calcSlippageAmount(inputAmount, slippage)[0],
                              tokenIn.decimals,
                          ), //
                          mulNumberWithDecimal(
                              calcSlippageAmount(outputAmount, slippage)[0],
                              tokenOut.decimals,
                          ), //
                          account,
                          (new Date().getTime() / 1000 + 1000).toFixed(0),
                          refAddress || ZERO_ADDRESS,
                      ]
                let callResult: any
                if (!wallet) {
                    const gasLimit = await routerContract?.estimateGas?.[
                        method
                    ]?.(...args, { value })
                    callResult = await routerContract?.[method]?.(...args, {
                        value,
                        gasLimit: gasLimit && gasLimit.add(1000),
                    })
                } else {
                    // addliquidity using account abstraction
                    if (!routerContract || !routerAddress) return
                    const addData =
                        await routerContract.interface.encodeFunctionData(
                            method,
                            [...args],
                        )
                    if (!addData) return

                    const txApproveIn = {
                        to: tokenIn.address,
                        data: tokenInApproval.approveEncodeData(
                            routerAddress,
                            mulNumberWithDecimal(inputAmount, tokenIn.decimals),
                        ),
                    }
                    const txApproveOut = {
                        to: tokenOut.address,
                        data: tokenOutApproval.approveEncodeData(
                            routerAddress,
                            mulNumberWithDecimal(
                                outputAmount,
                                tokenOut.decimals,
                            ),
                        ),
                    }
                    const txAddliqudity = {
                        to: routerAddress,
                        data: addData,
                        value,
                    }
                    const txns =
                        isInsufficientAllowanceTokenIn &&
                        isInsufficientAllowanceTokenOut
                            ? [txApproveIn, txApproveOut, txAddliqudity]
                            : isInsufficientAllowanceTokenIn
                            ? [txApproveIn, txAddliqudity]
                            : isInsufficientAllowanceTokenOut
                            ? [txApproveOut, txAddliqudity]
                            : [txAddliqudity]
                    callResult = await sendUserPaidTransaction(txns)
                }
                const txn = await callResult?.wait?.()
                initDataTransaction.setIsOpenResultModal(false)

                if (txn) {
                    addTxn({
                        hash: txn?.transactionHash || callResult.hash,
                        msg: `Add liquidity ${tokenIn?.symbol} and ${tokenOut?.symbol}`,
                        status: txn?.status === 1 ? true : false,
                    })
                }
                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)
                sendEvent({
                    category: 'Defi',
                    action: 'Add liquidity',
                    label: [
                        tokenIn?.symbol,
                        tokenIn?.address,
                        tokenOut?.symbol,
                        tokenOut?.address,
                    ].join('/'),
                })

                /**
                 * @dev reset input && output state when transaction success
                 */
                onUserInput(Field.INPUT, '')
                onUserInput(Field.OUTPUT, '')
            }
        } catch (error) {
            console.log('error', error)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }, [
        initDataTransaction,
        isInsufficientAllowance,
        isInsufficientAllowanceTokenIn,
        isInsufficientAllowanceTokenOut,
    ])

    const handleOnApprove = async (
        approve: (to: string, amount: string) => void,
        amount: string | undefined,
        decimals: number | undefined,
    ) => {
        try {
            initDataTransaction.setError('')
            if (amount && decimals && routerAddress) {
                initDataTransaction.setIsOpenWaitingModal(true)
                const callResult: any = await approve(
                    routerAddress,
                    mulNumberWithDecimal(amount, decimals), //amount * 10 ** decimals
                )
                console.log('🤦‍♂️ ⟹ Add ⟹ callResult:', callResult)

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                console.log('🤦‍♂️ ⟹ Add ⟹ txn:', { txn })
                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                        callResult.hash || ''
                    }`,
                    msg: 'Approve',
                    status: txn.status === 1 ? true : false,
                })
                console.log('add suceessss =>')
            }
        } catch (err) {
            console.log('Failed to approve token: ', err)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
        }
    }

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

            const addRate = pair.calcAddRate(
                amountInWithDel,
                tI,
                tO,
                Field.INPUT,
            )
            onChangeMintState({
                ...mintState,
                outputAmount: addRate,
            })
        }
    }, [
        inputAmount,
        chainId,
        pair?.reserve0,
        pair?.reserve1,
        pair?.reserveLp,
        pair?.tokenLp.address,
    ])

    useEffect(() => {
        // when output amount change
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

            const addRate = pair?.calcAddRate(
                amountOutWithDel,
                tI,
                tO,
                Field.OUTPUT,
            )

            onChangeMintState({
                ...mintState,
                inputAmount: addRate,
            })
        }
    }, [
        outputAmount,
        chainId,
        pair?.reserve0,
        pair?.reserve1,
        pair?.reserveLp,
        pair?.tokenLp.address,
    ])

    const argsEstimate = useMemo(() => {
        if (isInsufficientAllowance) {
            return {
                contract: isInsufficientAllowanceTokenIn
                    ? contractApproveTokenIn
                    : contractApproveTokenOut,
                method: () => {
                    return 'approve'
                },
                args: () => {
                    return {
                        args: [
                            routerAddress,
                            mulNumberWithDecimal(
                                inputAmount || '0',
                                tokenIn?.decimals || 18,
                            ),
                        ],
                        value: '0x',
                    }
                },
            }
        }

        return {
            contract: routerContract,
            method: getAddMethod,
            args: getAddArguments,
        }
    }, [
        isInsufficientAllowance,
        swapType,
        inputAmount,
        outputAmount,
        tokenIn,
        tokenOut,
        chainId,
        contractApproveTokenIn,
        contractApproveTokenOut,
    ])
    // contract - method - argument
    const gasEstimate = useEstimateGas(
        argsEstimate.contract,
        argsEstimate.method,
        argsEstimate.args,
    )

    const AddButton = () => {
        const balanceIn = useCurrencyBalance(
            wallet?.address || account,
            tokenIn,
        )
        const balanceOut = useCurrencyBalance(
            wallet?.address || account,
            tokenOut,
        )
        const isNotConnected = !wallet?.address && !account
        const unSupportedNetwork =
            chainId && !ALL_SUPPORTED_CHAIN_IDS.includes(chainId)
        const isUndefinedAmount = !inputAmount || !outputAmount
        const isInffuficientLiquidity = false
        const isUndefinedCurrencies = !tokenIn || !tokenOut
        const isInsufficientBalance =
            inputAmount &&
            balanceIn &&
            (Number(balanceIn) < Number(inputAmount) ||
                Number(balanceOut) < Number(outputAmount))

        return (
            <Row>
                {isNotConnected ? (
                    <PrimaryButton
                        onClick={() => {
                            openWalletModal()
                        }}
                        name="Connect Wallet"
                    />
                ) : unSupportedNetwork ? (
                    <LabelButton name="Unsupported network" />
                ) : isUndefinedCurrencies ? (
                    <LabelButton name="Select a coin" />
                ) : isUndefinedAmount ? (
                    <LabelButton name="Enter an amount" />
                ) : isInsufficientBalance ? (
                    <LabelButton name="Insufficient Balance" />
                ) : isInsufficientAllowance && !wallet ? (
                    <ButtonGroup>
                        {isInsufficientAllowanceTokenIn && (
                            <PrimaryButton
                                name={`Approve ${tokenIn?.symbol}`}
                                onClick={() =>
                                    handleOnApprove(
                                        tokenInApproval.approve,
                                        inputAmount,
                                        tokenIn?.decimals,
                                    )
                                }
                            />
                        )}
                        {isInsufficientAllowanceTokenOut && (
                            <PrimaryButton
                                name={`Approve ${tokenOut?.symbol}`}
                                onClick={() =>
                                    handleOnApprove(
                                        tokenOutApproval.approve,
                                        outputAmount,
                                        tokenOut?.decimals,
                                    )
                                }
                            />
                        )}
                    </ButtonGroup>
                ) : isInffuficientLiquidity ? (
                    <LabelButton name="Insufficient Liquidity" />
                ) : (
                    <PrimaryButton
                        onClick={() => handleOnAdd()}
                        name={'Add liquidity'}
                    />
                )}
                {/* Gas Estimate:{' '}
                {gasEstimate
                    ? divNumberWithDecimal(gasEstimate.toString(), 18)
                    : 'Calculating...'} */}
            </Row>
        )
    }

    return (
        <>
            <ComponentsTransaction
                data={initDataTransaction}
                onConfirm={onConfirms}
            />
            {(initDataTransaction.isOpenConfirmModal ||
                initDataTransaction.isOpenResultModal ||
                initDataTransaction.isOpenWaitingModal) && <Blur />}
            <SwapContainer ref={ref}>
                {!account && isOpenWalletModal && (
                    <>
                        <WalletModal
                            setToggleWalletModal={setIsOpenWalletModal}
                        />
                        <OpacityModal
                            onClick={() => setIsOpenWalletModal(false)}
                        />
                    </>
                )}
                <Row jus="space-between">
                    <BackLink to="/pools">
                        <img src={BackArrow} alt="back arrow" />
                    </BackLink>
                    <Title>Add Liquidity</Title>
                    <Setting />
                </Row>
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
                {pair && (
                    <PoolPriceBar
                        dropDown={poolPriceBarOpen}
                        setDropDown={setPoolPriceBarOpen}
                        pair={pair}
                        gasFee={
                            gasEstimate
                                ? Number(gasEstimate)?.toFixed(5)
                                : gasEstimate
                        }
                    />
                )}
                <AddButton />
                {account ? (
                    <Referral>
                        <span>Referral:</span>
                        <p>
                            https://app.sobajaswap.com/#/add?
                            {account && shortenAddress(account, 5)}
                        </p>
                        {/* <span>
                        <img src={imgCopy} alt="" />
                    </span> */}
                        <span>
                            {isCopied ? (
                                <CopyBtn>
                                    <CopyAccountAddress src={imgCheckMark} />
                                    <Tooltip className="tooltip">
                                        Copied
                                    </Tooltip>
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
                ) : (
                    <LabelMsg>Login to get your referral link</LabelMsg>
                )}
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
    background: linear-gradient(
        to top right,
        rgba(0, 28, 44, 0.3),
        rgba(0, 28, 44, 0.3)
    );
    gap: 15px;
    position: relative;
    z-index: 0;

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

const Referral = styled.div`
    display: grid;
    grid-template-columns: 55px 1fr 12px;
    font-size: 14px;
    span {
        color: rgba(0, 255, 163, 1);
    }
    p {
        opacity: 0.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 4px;
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
const CopyAccountAddress = styled.img`
    height: 12px;
    cursor: pointer;
`

const Title = styled.div`
    font-size: 24px;
    width: 100%;
    text-align: center;
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

const ButtonGroup = styled(Row)`
    width: 100%;
    gap: 5px;
`

const BackLink = styled(Link)`
    img {
        width: 30px;
    }
`
const LabelMsg = styled.div`
    margin: auto;
    opacity: 0.5;
`

export default Add
