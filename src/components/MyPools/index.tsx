import React, {
    useState,
    Fragment,
    useMemo,
    useCallback,
    useRef,
    useEffect,
} from 'react'
import styled from 'styled-components'
import { useMyPosition, useTokensUrl } from 'hooks/useAllPairs'
import UnknowToken from 'assets/icons/question-mark-button-dark.svg'
import {
    calcSlippageAmount,
    calcTransactionDeadline,
    isNativeCoin,
} from 'utils'
import { div, mul, mulNumberWithDecimal } from 'utils/math'
import {
    useAppState,
    useUpdateApplicationState,
} from 'states/application/hooks'
import { useActiveWeb3React } from 'hooks'
import { useRouterContract } from 'hooks/useContract'
import { useNavigate } from 'react-router-dom'
import { useSwapActionHandlers } from 'states/swap/hooks'
import { Field } from 'interfaces'
import imgClose from 'assets/icons/icon-close.svg'
import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import { useTokenApproval } from 'hooks/useToken'
import { ROUTERS } from 'constants/addresses'
import { useTransactionHandler } from 'states/transactions/hooks'
import { Row } from 'components/Layouts'
import { sendEvent } from 'utils/analytics'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import Pagination from 'components/Pagination'
import { useMintActionHandlers } from 'states/mint/hooks'
import { ZERO_ADDRESS } from 'constants/index'

interface Positions {
    position: (
        | {
              value: string
              valueWithDec: string
              tokenLp: any
              token0: any
              token1: any
              percent: number
              totalLp: any
              totalReserve0: any
              totalReserve1: any
          }
        | undefined
    )[]
    tokenList: string[]
}

const MyPools = ({ position, tokenList }: Positions) => {
    const [modalRemovePool, setModalRemovePool] = useState<boolean>(false)
    const [percentValue, setPercentValue] = useState(0)
    // const { position, tokenList } = useMyPosition()
    const totalPage = position?.length > 0 ? Math.ceil(position?.length / 6) : 1
    const [page, setPage] = useState(1)

    const [positionInCurrentPage, setPositionInCurrentPage] = useState<
        typeof position
    >(position?.slice(0, 6))

    const [poolRemove, setPoolRemove] = useState<(typeof position)[0]>()
    const navigate = useNavigate()
    const urlTokens = useTokensUrl(tokenList)
    const { onTokenSelection } = useMintActionHandlers()
    const updateAppication = useUpdateApplicationState()
    const { slippage } = useAppState()
    const { account, chainId } = useActiveWeb3React()
    const routerContract = useRouterContract()
    const initDataTransaction = InitCompTransaction()
    const { addTxn } = useTransactionHandler()
    const { deadline } = useAppState()
    const routerAddress = chainId ? ROUTERS[chainId] : undefined
    const tokenApproval = useTokenApproval(
        account,
        routerAddress,
        poolRemove?.tokenLp,
    )

    useEffect(() => {
        setPositionInCurrentPage(position?.slice(0, 6) || [])
    }, [position])

    const isInsufficientAllowance = useMemo(
        () =>
            Number(tokenApproval?.allowance) <
            (Number(poolRemove?.value) * Number(percentValue)) / 100,
        [percentValue, tokenApproval, poolRemove],
    )

    const arrPrecent = [0, 25, 50, 75, 100]

    const handleChangeInput = (value: any) => {
        setPercentValue(value)
    }

    const handleOnApprove = async () => {
        try {
            initDataTransaction.setError('')
            const inputAmount =
                Number(poolRemove?.valueWithDec) * Number(percentValue)
            if (routerAddress && inputAmount && chainId) {
                console.log('approving....')
                initDataTransaction.setIsOpenWaitingModal(true)
                const callResult: any = await tokenApproval?.approve(
                    routerAddress,
                    mulNumberWithDecimal(
                        inputAmount,
                        poolRemove?.tokenLp.decimals,
                    ),
                )

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)
                addTxn({
                    hash:callResult.hash,
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

    const handleOnAdd = (item: (typeof position)[0]) => {
        console.log({ item })

        onTokenSelection(Field.INPUT, item?.token0)
        onTokenSelection(Field.OUTPUT, item?.token1)

        navigate('/add')
    }

    const handleRemove = () => {
        try {
            if (!isInsufficientAllowance && poolRemove) {
                setModalRemovePool(false)
                console.log('removing...')
                initDataTransaction.setError('')
                initDataTransaction.setPayload({
                    method: 'remove',
                    tokenIn: poolRemove?.token0,
                    tokenOut: poolRemove?.token1,
                    input: (
                        (poolRemove?.token0?.value * percentValue) /
                        100
                    ).toFixed(4),
                    output: (
                        (poolRemove?.token1?.value * percentValue) /
                        100
                    ).toFixed(4),
                })

                initDataTransaction.setIsOpenConfirmModal(true)
            }
        } catch (error) {
            console.log('failed to swap', error)
        }
    }

    const onConfirm = useCallback(async () => {
        try {
            if (poolRemove && chainId) {
                initDataTransaction.setError('')
                initDataTransaction.setIsOpenConfirmModal(false)
                initDataTransaction.setIsOpenWaitingModal(true)

                const isEthTxn =
                    isNativeCoin(poolRemove.token0) ||
                    isNativeCoin(poolRemove.token1) // is Pool contain native coin ?

                const method = isEthTxn
                    ? 'removeLiquidityETH'
                    : 'removeLiquidity'
                // const token = isNativeCoin(tokenIn)? tokenOut : tokenIn

                const balanceToRemove = div(
                    mul(poolRemove.value, percentValue),
                    100,
                )

                const args = isEthTxn
                    ? [
                          poolRemove.tokenLp.address,
                          mulNumberWithDecimal(
                              poolRemove.value,
                              poolRemove.tokenLp.decimals,
                          ), // amount of L token to remove
                          // mulNumberWithDecimal(amountToken,token.decimals), // minimum amount of token must received
                          mulNumberWithDecimal(
                              calcSlippageAmount(
                                  mul(
                                      div(balanceToRemove, poolRemove.totalLp),
                                      poolRemove.totalReserve0,
                                  ),
                                  slippage,
                              )[0],
                              poolRemove.token0?.decimals,
                          ),
                          mulNumberWithDecimal(
                              calcSlippageAmount(
                                  mul(
                                      div(balanceToRemove, poolRemove.totalLp),
                                      poolRemove.totalReserve1,
                                  ),
                                  slippage,
                              )[0],
                              poolRemove.token1?.decimals,
                          ),
                          account,
                          calcTransactionDeadline(deadline),
                          ZERO_ADDRESS,
                      ]
                    : [
                          poolRemove.token0.address,
                          poolRemove.token1.address,
                          mulNumberWithDecimal(
                              balanceToRemove,
                              poolRemove.tokenLp.decimals,
                          ), // liquidity amount
                          mulNumberWithDecimal(
                              calcSlippageAmount(
                                  mul(
                                      div(balanceToRemove, poolRemove.totalLp),
                                      poolRemove.totalReserve0,
                                  ),
                                  slippage,
                              )[0],
                              poolRemove.token0?.decimals,
                          ),
                          mulNumberWithDecimal(
                              calcSlippageAmount(
                                  mul(
                                      div(balanceToRemove, poolRemove.totalLp),
                                      poolRemove.totalReserve1,
                                  ),
                                  slippage,
                              )[0],
                              poolRemove.token1?.decimals,
                          ),
                          account,
                          calcTransactionDeadline(deadline),
                          ZERO_ADDRESS,
                      ]
                console.log(...args)
                const gasLimit = await routerContract?.estimateGas?.[method]?.(
                    ...args,
                )
                const callResult = await routerContract?.[method]?.(...args, {
                    gasLimit: gasLimit && gasLimit.add(1000),
                })

                sendEvent({
                    category: 'Defi',
                    action: 'Remove liquidity',
                    label: [
                        poolRemove.token0?.symbol,
                        poolRemove.token0?.address,
                        poolRemove.token1?.symbol,
                        poolRemove.token1?.address,
                    ].join('/'),
                })

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()

                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: callResult.hash,
                    msg: `Remove ${poolRemove.token0?.symbol} and ${poolRemove.token1?.symbol}`,
                    status: txn.status === 1 ? true : false,
                })

                updateAppication()
                // navigate('/pools')
            }
        } catch (error) {
            console.log(error)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }, [initDataTransaction])

    useEffect(() => {
        const filterData = position.filter(
            (d, index) => index >= (page - 1) * 6 && index < page * 6,
        )
        setPositionInCurrentPage(filterData)
    }, [page])

    /*
     * Update position when account change
     */
    useEffect(() => {
        setPositionInCurrentPage(position?.slice(0, 6))
    }, [account])

    return (
        <>
            <ComponentsTransaction
                data={initDataTransaction}
                onConfirm={onConfirm}
            />
            <WrapMyPools>
                <RowMyPools>
                    {positionInCurrentPage &&
                        positionInCurrentPage?.length > 0 &&
                        positionInCurrentPage.map((item, index) => {
                            return (
                                <ColMyPools key={index}>
                                    <WrapContent>
                                        <WrapText>
                                            <WrapLogo>
                                                <Logo
                                                    src={
                                                        urlTokens?.[
                                                            item?.token0
                                                                ?.address
                                                        ] || UnknowToken
                                                    }
                                                ></Logo>
                                                <LogoTwo
                                                    src={
                                                        urlTokens?.[
                                                            item?.token1
                                                                ?.address
                                                        ] || UnknowToken
                                                    }
                                                ></LogoTwo>
                                            </WrapLogo>
                                            <div>
                                                {' '}
                                                {item?.token0?.symbol}/
                                                {item?.token1?.symbol}
                                            </div>
                                        </WrapText>
                                        <Value>
                                            {Number(item?.value).toFixed(4)}
                                        </Value>
                                    </WrapContent>

                                    <WrapContent>
                                        <WrapText>Your pool share:</WrapText>
                                        <Value>
                                            {Number(item?.percent).toFixed(4)} %
                                        </Value>
                                    </WrapContent>
                                    <HrTag></HrTag>
                                    <WrapContent>
                                        <WrapText>
                                            <Logo
                                                src={
                                                    urlTokens?.[
                                                        item?.token0?.address
                                                    ] || UnknowToken
                                                }
                                            ></Logo>
                                            <div>{item?.token0?.symbol}</div>
                                        </WrapText>
                                        <Value>
                                            {Number(
                                                item?.token0?.value,
                                            ).toFixed(4)}
                                        </Value>
                                    </WrapContent>
                                    <WrapContent>
                                        <WrapText>
                                            <Logo
                                                src={
                                                    urlTokens?.[
                                                        item?.token1?.address
                                                    ] || UnknowToken
                                                }
                                            ></Logo>
                                            <div>{item?.token1?.symbol}</div>
                                        </WrapText>
                                        <Value>
                                            {Number(
                                                item?.token1?.value,
                                            ).toFixed(4)}
                                        </Value>
                                    </WrapContent>
                                    <WrapAddAndRemove>
                                        <BtnAdd
                                            onClick={() => {
                                                handleOnAdd(item)
                                            }}
                                        >
                                            Add
                                        </BtnAdd>
                                        <BtnRemove
                                            onClick={() => {
                                                setPoolRemove(item)
                                                setModalRemovePool(
                                                    !modalRemovePool,
                                                )
                                            }}
                                        >
                                            Remove
                                        </BtnRemove>
                                    </WrapAddAndRemove>
                                </ColMyPools>
                            )
                        })}
                </RowMyPools>
                {positionInCurrentPage.length <= 0 ? (
                    <Row jus="center">
                        You don't have a liquidity position yet. Try to add new
                        position.
                    </Row>
                ) : (
                    <Pagination
                        page={page}
                        setPage={setPage}
                        isSorted={false}
                        totalPage={totalPage}
                    />
                )}
                {modalRemovePool && (
                    <ModalRemovePool>
                        <WrapRemovePool>
                            <WrapTitle>
                                <Title>Remove</Title>
                                <BtnClose
                                    src={imgClose}
                                    onClick={() => setModalRemovePool(false)}
                                ></BtnClose>
                            </WrapTitle>
                            {/* <WrapTip>
                            <span>
                                Tip:Tip: Lorem ipsum dolor sit amet,
                                consectetuer adipiscing elit, sed diam nonummy
                                nibh euismod tincidunt ut laoreet dolore magna
                                aliquam erat volutpat. Ut wisi enim ad minim
                                veniam.
                            </span>
                        </WrapTip> */}
                            <WrapRemoveAmount>
                                <WrapAmount>
                                    <TitleRemove>Percent Remove</TitleRemove>
                                    <WrapPercent>
                                        <Percent>{percentValue}%</Percent>
                                    </WrapPercent>
                                </WrapAmount>
                                <WrapInputRange>
                                    <Input
                                        onChange={(e) =>
                                            handleChangeInput(e.target.value)
                                        }
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={percentValue}
                                        disabled={false}
                                    />
                                    <DotPercent>
                                        {arrPrecent.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <span>
                                                        {item == 100
                                                            ? 'Max'
                                                            : item}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </DotPercent>
                                </WrapInputRange>
                            </WrapRemoveAmount>
                            <WrapContentRemove>
                                <RowContentRemove>
                                    <WrapText>
                                        <Logo
                                            src={
                                                urlTokens?.[
                                                    poolRemove?.token0?.address
                                                ] || UnknowToken
                                            }
                                        ></Logo>
                                        <div>{poolRemove?.token0?.symbol}</div>
                                    </WrapText>
                                    <Value>
                                        {(
                                            (poolRemove?.token0?.value *
                                                percentValue) /
                                            100
                                        ).toFixed(4)}
                                    </Value>
                                </RowContentRemove>
                                <RowContentRemove>
                                    <WrapText>
                                        <Logo
                                            src={
                                                urlTokens?.[
                                                    poolRemove?.token1?.address
                                                ] || UnknowToken
                                            }
                                        ></Logo>
                                        <div>{poolRemove?.token1?.symbol}</div>
                                    </WrapText>
                                    <Value>
                                        {(
                                            (poolRemove?.token1?.value *
                                                percentValue) /
                                            100
                                        ).toFixed(4)}
                                    </Value>
                                </RowContentRemove>
                            </WrapContentRemove>
                            {/* <WrapPrice>
                            <TextPrice>Price:</TextPrice>
                            <ValuePrice>1 ETH = 1,981.58 USDC </ValuePrice>
                        </WrapPrice>
                        <WrapPrice>
                            <TextPrice></TextPrice>
                            <ValuePrice>1 USDT = 0.00050 </ValuePrice>
                        </WrapPrice> */}
                            {Number(percentValue) === 0 ? (
                                <BtnConfirm isDisabled={true}>
                                    Select your percent
                                </BtnConfirm>
                            ) : isInsufficientAllowance ? (
                                <BtnConfirm onClick={() => handleOnApprove()}>
                                    Approve
                                </BtnConfirm>
                            ) : (
                                <BtnConfirm onClick={() => handleRemove()}>
                                    Remove
                                </BtnConfirm>
                            )}
                        </WrapRemovePool>
                    </ModalRemovePool>
                )}
            </WrapMyPools>
        </>
    )
}

const BtnClose = styled.img`
    width: unset;
    height: 20px;
    cursor: pointer;
    :hover {
        background: #003b5c;
    }
`
const WrapTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const WrapPrice = styled.div`
    padding: 0px 15px;
    margin-top: 20px;
    display: flex;
`
const TextPrice = styled.div`
    width: 15%;
`
const ValuePrice = styled.div``
const WrapInputRange = styled.div`
    position: relative;
    height: 5px;
    width: 92%;
    margin: auto;
`

const DotPercent = styled.div`
    position: absolute;
    top: 0px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 3px;
    > div {
        height: 10px;
        width: 10px;
        background: #ffffff;
        border-radius: 50%;
        z-index: -1;
        > span {
            position: relative;
            left: -7px;
            top: 15px;
        }
    }
`
const WrapPercent = styled.div`
    width: 60%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    text-align: right;
    padding: 0px 10px;
`
const WrapAmount = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`

const Input = styled.input`
    position: absolute;
    /* width: 100%; */
    top: 3px;
    height: 3px;
    -webkit-appearance: none;
    background: #ffffff;
    width: 100%;
    /* z-index: -1; */
    ::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #00b2ff;
        cursor: pointer;
        z-index: 999999;
    }
`

const Percent = styled.div`
    font-size: 50px;
    font-weight: 400;
`
const TitleRemove = styled.div`
    font-weight: 500;
    font-size: 18px;
    color: #ffffff;
    width: 40%;
`
const GroupButton = styled.div`
    display: flex;
    gap: 25px;
`
const WrapRemoveAmount = styled.div`
    padding: 15px 15px;
    height: 155px;
    margin-top: 20px;
    background: rgba(0, 178, 255, 0.1);
    border-radius: 6px;
`

const RowContentRemove = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0px;
`
const WrapContentRemove = styled.div`
    margin-top: 20px;
    border-radius: 6px;
    padding: 15px;
    background: rgba(0, 178, 255, 0.1);
`

const WrapTip = styled.div`
    margin-top: 20px;
    padding: 15px;
    background: rgba(0, 178, 255, 0.1);
    border-radius: 6px;
    > span {
        font-size: 13px;
    }
`

const BtnConfirm = styled.div<{ isDisabled?: boolean }>`
    margin-top: 20px;
    background: #00b2ff;
    border-radius: 12px;
    padding: 10px;
    width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    color: #ffffff;
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
`
const Title = styled.div`
    font-weight: 700;
    font-size: 20px;
    display: flex;
    justify-content: center;
    color: #ffffff;
`

const WrapRemovePool = styled.div`
    background: rgba(0, 28, 44, 0.3);
    border: 2px solid #003b5c;
    backdrop-filter: blur(25px);
    border-radius: 12px;
    padding: 20px;
    max-width: 500px;
    height: fit-content;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;

    @media screen and (max-width: 550px) {
        min-width: 300px;
        font-size: 12px;
        scale: 0.9;
    }
`
const ModalRemovePool = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: fit-content;
    z-index: 1;
    margin: auto;
    display: flex;
    justify-content: center;
    background: #00000055;
    height: 100%;

    @media screen and (max-width: 1100px) {
        /* width: 90%; */
    }
`
const WrapLogo = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: 40px;
`
const Logo = styled.img`
    width: 25px;
    height: 25px;
    border-radius: 50%;
`
const LogoTwo = styled(Logo)`
    position: absolute;
    left: 15px;
    top: 0px;
    border-radius: 50%;
`
const HrTag = styled.div`
    height: 1px;
    background-color: #888888;
`
const BtnRemove = styled.div`
    border: 0.475851px solid #00b2ff;
    border-radius: 6px;
    text-align: center;
    padding: 5px 0px;
    cursor: pointer;
    transition: all ease-in-out 0.3s;

    &:hover {
        background: var(--bg6);
    }
`
const BtnAdd = styled(BtnRemove)``
const WrapAddAndRemove = styled.div`
    display: flex;
    gap: 20px;
    padding: 0px 15px;
    margin-bottom: 20px;
    cursor: pointer;

    > div {
        width: 50%;
    }
`
const Value = styled.div``
const WrapText = styled.div`
    gap: 5px;
    display: flex;
    align-items: center;
`
const WrapContent = styled.div`
    margin: 20px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;
`
const ColMyPools = styled.div`
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #888888;
    backdrop-filter: blur(15px);
    border-radius: 12px;
    width: 100%;
    /* flex: 48%;
    max-width: 48%; */

    @media screen and (max-width: 1440px) {
    }
    @media screen and (max-width: 1250px) {
    }
    @media screen and (max-width: 840px) {
        max-width: 100%;
        /* font-size: 12px; */
    }
    @media screen and (max-width: 390px) {
        font-size: 12px;
    }
`
const RowMyPools = styled.div`
    /* display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: space-between; */
    display: grid;
    grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr) minmax(
            300px,
            1fr
        );

    grid-gap: 10px;
    @media screen and (max-width: 1160px) {
        grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr);
    }
    @media screen and (max-width: 770px) {
        /* flex-direction: column; */
        grid-template-columns: minmax(100px, 1fr);
    }
`
const WrapMyPools = styled.div`
    margin-top: 10px;
`

export default MyPools
