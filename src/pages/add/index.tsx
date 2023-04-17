import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'
import Setting from 'components/HeaderLiquidity'
import Bridge from 'components/Bridge'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Field, Token } from 'interfaces'
import { useSwapActionHandlers, useSwapState } from 'states/swap/hooks'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import LabelButton from 'components/Buttons/LabelButton'
import PlusIcon from 'assets/icons/plus.svg'
import { ROUTERS } from 'constants/addresses'
import { useTokenApproval } from 'hooks/useToken'
import {
    ALL_SUPPORTED_CHAIN_IDS,
    URLSCAN_BY_CHAINID,
    WRAPPED_NATIVE_COIN,
    ZERO_ADDESS,
} from 'constants/index'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import { ethers } from 'ethers'
import { useFactoryContract, useRouterContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { mulNumberWithDecimal } from 'utils/math'
import { usePair } from 'hooks/useAllPairs'
import { FixedNumber } from '@ethersproject/bignumber'
import { isNativeCoin } from 'utils'
import WalletModal from 'components/WalletModal'
import { InitCompTransaction } from 'components/TransactionModal'
import ComponentsTransaction from 'components/TransactionModal'
import ToastMessage from 'components/ToastMessage'
import { useTransactionHandler } from 'states/transactions/hooks'

const Swap = () => {
    const swapState = useSwapState()
    const router = useRouterContract()
    const [poolPriceBarOpen, setPoolPriceBarOpen] = useState(true)
    const [isOpenWalletModal, setIsOpenWalletModal] = useState(false)

    const { inputAmount, outputAmount, tokenIn, tokenOut, swapType } = swapState
    const { onUserInput, onSwitchTokens, onTokenSelection, onChangeSwapState } =
        useSwapActionHandlers()
    const { account, chainId } = useActiveWeb3React()
    const routerContract = useRouterContract()
    const routerAddress = chainId ? ROUTERS[chainId] : undefined
    const tokenInApproval = useTokenApproval(account, routerAddress, tokenIn)
    const tokenOutApproval = useTokenApproval(account, routerAddress, tokenOut)

    const factoryContract = useFactoryContract()
    const initDataTransaction = InitCompTransaction()
    const { addTxn } = useTransactionHandler()

    const pair = usePair(chainId, tokenIn, tokenOut)
    console.log({ pair })

    const isInsufficientAllowanceTokenIn =
        Number(tokenInApproval?.allowance) < Number(inputAmount) &&
        tokenIn?.address !== ZERO_ADDESS
    const isInsufficientAllowanceTokenOut =
        Number(tokenOutApproval?.allowance) < Number(outputAmount) &&
        tokenOut?.address !== ZERO_ADDESS
    const isInsufficientAllowance =
        isInsufficientAllowanceTokenIn || isInsufficientAllowanceTokenOut

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

    const handleOnAdd = async () => {
        try {
            if (inputAmount && outputAmount && tokenIn && tokenOut) {
                console.log('adding...')
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

    // const handleOnAddLiquidity = async () => {
    //     try {
    //         if (inputAmount && outputAmount && tokenIn && tokenOut) {
    //             const isEthTxn = isNativeCoin(tokenIn) || isNativeCoin(tokenOut)
    //             const method = isEthTxn ? 'addLiquidityETH' : 'addLiquidity'
    //             const token = isNativeCoin(tokenIn) ? tokenOut : tokenIn
    //             const amountToken = isNativeCoin(tokenOut)
    //                 ? inputAmount
    //                 : outputAmount

    //             let value = isNativeCoin(tokenIn)
    //                 ? mulNumberWithDecimal(inputAmount, tokenIn.decimals)
    //                 : mulNumberWithDecimal(outputAmount, tokenOut.decimals)
    //             value = isEthTxn ? value : '0x00'
    //             const args = isEthTxn
    //                 ? [
    //                       token.address,
    //                       mulNumberWithDecimal(amountToken, token.decimals),
    //                       mulNumberWithDecimal(amountToken, token.decimals), //
    //                       value,
    //                       account,
    //                       (new Date().getTime() / 1000 + 1000).toFixed(0),
    //                   ]
    //                 : [
    //                       tokenIn.address,
    //                       tokenOut.address,
    //                       mulNumberWithDecimal(inputAmount, tokenIn.decimals),
    //                       mulNumberWithDecimal(outputAmount, tokenOut.decimals),
    //                       mulNumberWithDecimal(inputAmount, tokenIn.decimals), //
    //                       mulNumberWithDecimal(outputAmount, tokenOut.decimals), //
    //                       account,
    //                       (new Date().getTime() / 1000 + 1000).toFixed(0),
    //                   ]
    //             console.log({ ...args, value })
    //             const gasLimit = await routerContract?.estimateGas?.[method]?.(
    //                 ...args,
    //                 { value },
    //             )
    //             const callResult = await routerContract?.[method]?.(...args, {
    //                 value,
    //                 gasLimit: gasLimit && gasLimit.add(1000),
    //             })
    //             const txn = await callResult.wait()

    //             if (txn.status === 1) {
    //                 console.log('Successfull...', txn)
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    const onConfirm = useCallback(async () => {
        try {
            if (inputAmount && outputAmount && tokenIn && tokenOut) {
                initDataTransaction.setIsOpenConfirmModal(false)
                initDataTransaction.setIsOpenWaitingModal(true)

                const isEthTxn = isNativeCoin(tokenIn) || isNativeCoin(tokenOut)
                const method = isEthTxn ? 'addLiquidityETH' : 'addLiquidity'
                const token = isNativeCoin(tokenIn) ? tokenOut : tokenIn
                const amountToken = isNativeCoin(tokenOut)
                    ? inputAmount
                    : outputAmount

                let value = isNativeCoin(tokenIn)
                    ? mulNumberWithDecimal(inputAmount, tokenIn.decimals)
                    : mulNumberWithDecimal(outputAmount, tokenOut.decimals)
                value = isEthTxn ? value : '0x00'
                const args = isEthTxn
                    ? [
                          token.address,
                          mulNumberWithDecimal(amountToken, token.decimals),
                          mulNumberWithDecimal(amountToken, token.decimals), //
                          value,
                          account,
                          (new Date().getTime() / 1000 + 1000).toFixed(0),
                      ]
                    : [
                          tokenIn.address,
                          tokenOut.address,
                          mulNumberWithDecimal(inputAmount, tokenIn.decimals),
                          mulNumberWithDecimal(outputAmount, tokenOut.decimals),
                          mulNumberWithDecimal(inputAmount, tokenIn.decimals), //
                          mulNumberWithDecimal(outputAmount, tokenOut.decimals), //
                          account,
                          (new Date().getTime() / 1000 + 1000).toFixed(0),
                      ]
                console.log({ ...args, value })
                const gasLimit = await routerContract?.estimateGas?.[method]?.(
                    ...args,
                    { value },
                )
                const callResult = await routerContract?.[method]?.(...args, {
                    value,
                    gasLimit: gasLimit && gasLimit.add(1000),
                })

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                        callResult.hash || ''
                    }`,
                    // hash: tx?.hash || '',
                    msg: 'Add liquidity',
                    status: txn.status === 1 ? true : false,
                })
            }
        } catch (error) {
            // initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }, [initDataTransaction])

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
                    mulNumberWithDecimal(amount, decimals),
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

            const addRate = pair?.calcAddRate(
                amountInWithDel,
                tI,
                tO,
                Field.INPUT,
            )
            console.log('Amount out', addRate)
            handleOnUserInput(Field.OUTPUT, addRate)
            // onUserInput(Field.OUTPUT, addRate)
        }
        // if(!pair) {
        //     onChangeSwapState({
        //         ...swapState,
        //         outputAmount: ''
        //     })
        // }
    }, [inputAmount, tokenIn, tokenOut])

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

            console.log('🤦‍♂️ ⟹ useEffect ⟹ amountOutWithDel:', amountOutWithDel)

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
            console.log('Amount In', addRate)
            handleOnUserInput(Field.INPUT, addRate)
        }
        // if(!pair) {
        //     onChangeSwapState({
        //         ...swapState,
        //         inputAmount: ''
        //     })
        // }
    }, [outputAmount, tokenIn, tokenOut])

    const AddButton = () => {
        const balanceIn = useCurrencyBalance(account, tokenIn)
        const balanceOut = useCurrencyBalance(account, tokenOut)
        const isNotConnected = !account
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

        console.log({
            allowIn: tokenInApproval?.allowance,
            allowOut: tokenOutApproval?.allowance,
        })
        return (
            <Row>
                {isNotConnected ? (
                    <PrimaryButton
                        // onClick={() => setIsConnected(!isConnected)}
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
                ) : isInsufficientAllowance ? (
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
                        name={'Add liquidty'}
                    />
                )}
            </Row>
        )
    }

    return (
        <>
            <ComponentsTransaction
                data={initDataTransaction}
                onConfirm={onConfirm}
                // onConfirm={approveToken}
                //     // isInsufficientAllowance &&
                //     // !isNativeCoin(tokenIn)
                //     //     ? handleOnApprove
                //     //     : onConfirm
                //     // () => handleOnApprove()
            />
            <ToastMessage />
            <SwapContainer>
                {!account && isOpenWalletModal && (
                    <WalletModal setToggleWalletModal={openWalletModal} />
                )}
                <Row jus="space-between">
                    <Nav gap="20px">
                        <Link to="/swap">Swap</Link>
                        {/* <Link to="/add" className="active-link">Add</Link> */}
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

    img {
        width: 20px;
    }
`

const ButtonGroup = styled(Row)`
    width: 100%;
    gap: 5px;
`

export default Swap
