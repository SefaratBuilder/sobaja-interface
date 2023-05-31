import { Columns, Row } from 'components/Layouts'
import { Data, IMint, ISwap } from 'hooks/useQueryPool'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import imgCopy from 'assets/icons/copy.svg'
import UNKNOWN from 'assets/icons/question-mark-button-dark.svg'
import ListTokens from 'constants/jsons/tokenList.json'
import { isAddress, shortenAddress } from 'utils'
import imgCheckMark from 'assets/icons/check-mark.svg'
import ETH from 'assets/token-logos/eth.svg'
import { uniqByKeepFirst } from 'utils/handleArray'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { useNavigate } from 'react-router-dom'
import { useMintActionHandlers } from 'states/mint/hooks'
import { Field } from 'interfaces'
import { useTokens } from 'hooks/useToken'
import { useToken } from 'hooks/useToken'
import { compare } from 'utils/compare'
import { WRAPPED_NATIVE_ADDRESSES } from 'constants/addresses'
import { useActiveWeb3React } from 'hooks'
import { ZERO_ADDRESS } from 'constants/index'
import { NATIVE_COIN } from 'constants/index'
import Pagination from 'components/Pagination'
import { useSwapActionHandlers } from 'states/swap/hooks'

const Overview = ({
    pool,
    transaction,
    width,
    tokenList,
    setCurrentPage,
}: {
    pool?: Data
    transaction?: (ISwap | IMint)[]
    width?: number
    tokenList?: string[]
    setCurrentPage: React.Dispatch<
        React.SetStateAction<'Pools' | 'Details' | 'Position'>
    >
}) => {
    const [isCopied, setIsCopied] = useState(false)
    const [indexFieldActive, setIndexFieldActive] = useState(0)
    const [page, setPage] = useState<number>(1)
    const [transactions, setTransactions] = useState<(ISwap | IMint)[]>()

    const [modalRemovePool, setModalRemovePool] = useState<boolean>(false)
    const navigate = useNavigate()
    const { onTokenSelection } = useMintActionHandlers()
    const { onTokenSelection: SelectionTokenSwap } = useSwapActionHandlers()
    const { chainId } = useActiveWeb3React()
    const poolRemoveTokens = useTokens(
        pool?.addresses ? pool?.addresses?.map((p) => p) : [],
    )

    /**
     * @dev dataShow: titles in transactions
     */
    const dataShow = useMemo(() => {
        if (width && width > 692) {
            return {
                title: ['Token Amount', 'Token Amount', 'Sender', 'Time'],
                fields: ['All', 'Swap', 'Add'],
            }
        }

        return {
            title: ['Sender', 'Time'],
            fields: ['All', 'Swap', 'Add'],
        }
    }, [width])

    /**
     * @dev dTransactions: handle transactions
     */
    const dTransactions = useMemo(() => {
        if (transaction?.[0]) {
            return indexFieldActive === 0
                ? transaction.filter(
                      (tx) =>
                          tx.pair.token0.id === pool?.addresses?.[1] &&
                          tx.pair.token1.id === pool?.addresses?.[2],
                  )
                : transaction
                      .filter(
                          (tx) =>
                              tx.pair.token0.id === pool?.addresses?.[1] &&
                              tx.pair.token1.id === pool?.addresses?.[2],
                      )
                      .filter(
                          (t: any) =>
                              t?.type === dataShow.fields?.[indexFieldActive],
                      )
        }
        return []
    }, [transaction, indexFieldActive, pool])

    const totalPage =
        dTransactions && dTransactions?.length > 0
            ? Math.ceil(dTransactions?.length / 10)
            : 1

    useEffect(() => {
        const filterData = dTransactions.filter(
            (d, index) => index >= (page - 1) * 10 && index < page * 10,
        )
        setTransactions(filterData)
    }, [page, dTransactions])

    useEffect(() => {
        page > totalPage && setPage(1)
    }, [indexFieldActive, totalPage, page])

    const handleCopyAddress = () => {
        if (pool?.addresses?.[0]) {
            navigator.clipboard.writeText(pool?.addresses?.[0]).then(() => {
                setIsCopied(true)
                setTimeout(() => {
                    setIsCopied(false)
                }, 1000)
            })
        }
    }

    /**
     *@handleOnAdd wrong data subgraph so navigate page add first, not set tokens
     */
    const handleOnAdd = () => {
        if (
            chainId &&
            poolRemoveTokens &&
            poolRemoveTokens?.length > 0 &&
            poolRemoveTokens?.[1] &&
            poolRemoveTokens?.[2]
        ) {
            onTokenSelection(
                Field.INPUT,
                compare(
                    poolRemoveTokens[1].address,
                    WRAPPED_NATIVE_ADDRESSES?.[chainId],
                )
                    ? NATIVE_COIN?.[chainId]
                    : poolRemoveTokens[1],
            )
            onTokenSelection(
                Field.OUTPUT,
                compare(
                    poolRemoveTokens[2].address,
                    WRAPPED_NATIVE_ADDRESSES?.[chainId],
                )
                    ? NATIVE_COIN?.[chainId]
                    : poolRemoveTokens[2],
            )
        }

        navigate('/add')
    }

    const handleOnSwap = () => {
        if (
            chainId &&
            poolRemoveTokens &&
            poolRemoveTokens?.length > 0 &&
            poolRemoveTokens?.[1] &&
            poolRemoveTokens?.[2]
        ) {
            SelectionTokenSwap(
                Field.INPUT,
                compare(
                    poolRemoveTokens[1].address,
                    WRAPPED_NATIVE_ADDRESSES?.[chainId],
                )
                    ? NATIVE_COIN?.[chainId]
                    : poolRemoveTokens[1],
            )
            SelectionTokenSwap(
                Field.OUTPUT,
                compare(
                    poolRemoveTokens[2].address,
                    WRAPPED_NATIVE_ADDRESSES?.[chainId],
                )
                    ? NATIVE_COIN?.[chainId]
                    : poolRemoveTokens[2],
            )
        }
        navigate('/swap')
    }

    return (
        <Container>
            <WrapData gap="20px">
                <LabelX>
                    <LabelContract>
                        <Row gap="10px" al="center">
                            <div
                                className="back"
                                onClick={() => setCurrentPage('Pools')}
                            >
                                {width && width > 370 ? '< Back' : '<'}
                            </div>
                            <Row gap="20px" className="address">
                                <p>Contract</p>
                                <Row gap="5px">
                                    <p>
                                        {pool?.addresses?.[0] &&
                                            shortenAddress(
                                                pool?.addresses?.[0],
                                                6,
                                            )}
                                    </p>
                                    <>
                                        {isCopied ? (
                                            <CopyBtn>
                                                <CopyAccountAddress
                                                    src={imgCheckMark}
                                                />
                                                <Tooltip className="tooltip">
                                                    Copied
                                                </Tooltip>
                                            </CopyBtn>
                                        ) : (
                                            <CopyBtn>
                                                <CopyAccountAddress
                                                    onClick={() =>
                                                        handleCopyAddress()
                                                    }
                                                    src={imgCopy}
                                                />
                                                <Tooltip className="tooltip">
                                                    Click to copy address
                                                </Tooltip>
                                            </CopyBtn>
                                        )}
                                    </>
                                </Row>
                            </Row>
                        </Row>
                    </LabelContract>
                    <Row gap="10px">
                        <PrimaryButton
                            name="Swap"
                            onClick={() => handleOnSwap()}
                        />
                        <PrimaryButton
                            name="Add"
                            onClick={() => handleOnAdd()}
                        />
                        {/* <PrimaryButton
                            name="Remove"
                            onClick={() => setModalRemovePool(true)}
                        /> */}
                    </Row>
                </LabelX>

                <LabelAssets gap="25px">
                    <p>Assets in pool</p>
                    <Row gap="10px">
                        <p className="badge">50%</p>
                        <Row gap="5px">
                            <img
                                src={
                                    pool?.symbols?.[1] === 'WETH'
                                        ? ETH
                                        : ListTokens.find(
                                              (t) =>
                                                  t.address ==
                                                      pool?.addresses?.[1] ||
                                                  t.symbol ==
                                                      pool?.symbols?.[1],
                                          )?.logoURI || UNKNOWN
                                }
                                alt="logo-token"
                            />
                            <div>{Number(pool?.reserve0)?.toFixed(8)}</div>
                            <div>{pool?.symbols?.[1]}</div>
                        </Row>
                    </Row>
                    <Row gap="10px">
                        <p className="badge">50%</p>
                        <Row gap="5px">
                            <img
                                src={
                                    pool?.symbols?.[2] === 'WETH'
                                        ? ETH
                                        : ListTokens.find(
                                              (t) =>
                                                  t.address ==
                                                      pool?.addresses?.[2] ||
                                                  t.symbol ==
                                                      pool?.symbols?.[2],
                                          )?.logoURI || UNKNOWN
                                }
                                alt="logo-token"
                            />
                            <div>{Number(pool?.reserve1)?.toFixed(8)}</div>
                            <div>{pool?.symbols?.[2]}</div>
                        </Row>
                    </Row>
                </LabelAssets>
                <LabelDetails gap="10px" jus="space-around">
                    <div>
                        <p className="title">TVL</p>
                        <p>${pool?.tvlValue?.toFixed(8)}</p>
                    </div>
                    <div>
                        <p className="title">Volume (24h)</p>
                        <p>
                            $
                            {pool?.volumeValue && !isNaN(pool?.volumeValue)
                                ? pool?.volumeValue?.toFixed(2)
                                : 0}
                        </p>
                    </div>
                    <div>
                        <p className="title">APR (24h)</p>
                        <p>{pool?.aprValue?.toFixed(2)}%</p>
                    </div>
                </LabelDetails>
                <h2>Transactions</h2>
                <LabelTransactions gap="20px">
                    <Transactions isMobile={width ? width <= 692 : false}>
                        <Row gap="10px">
                            {dataShow?.fields?.map((field, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`field ${
                                            index === indexFieldActive &&
                                            'active'
                                        }`}
                                        onClick={() =>
                                            setIndexFieldActive(index)
                                        }
                                    >
                                        {field}
                                    </div>
                                )
                            })}
                        </Row>
                        {dataShow?.title?.map((t, index) => {
                            return <span key={index}>{t}</span>
                        })}
                    </Transactions>
                    {transactions &&
                        transactions?.map((tx: any, index: number) => {
                            return (
                                <Transactions
                                    className="trans"
                                    isMobile={width ? width <= 692 : false}
                                    key={index}
                                >
                                    <Row gap="10px">
                                        <span>{tx.type}</span>
                                    </Row>
                                    {width && width > 692 ? (
                                        <>
                                            <LabelAmount>
                                                <div className="to">
                                                    {tx?.amount0
                                                        ? Number(
                                                              tx?.amount0,
                                                          )?.toFixed(6)
                                                        : tx?.amount0In === '0'
                                                        ? Number(
                                                              tx?.amount0Out,
                                                          )?.toFixed(6)
                                                        : Number(
                                                              tx?.amount0In,
                                                          )?.toFixed(6)}
                                                </div>
                                                <div>
                                                    {tx?.pair?.token0?.symbol}
                                                </div>
                                            </LabelAmount>
                                            <LabelAmount>
                                                <div className="to">
                                                    {tx?.amount1
                                                        ? Number(
                                                              tx?.amount1,
                                                          )?.toFixed(6)
                                                        : tx?.amount1In === '0'
                                                        ? Number(
                                                              tx?.amount1Out,
                                                          )?.toFixed(6)
                                                        : Number(
                                                              tx?.amount1In,
                                                          )?.toFixed(6)}
                                                </div>
                                                <div>
                                                    {tx?.pair?.token1?.symbol}
                                                </div>
                                            </LabelAmount>

                                            <span>
                                                {shortenAddress(
                                                    tx.from || tx.sender,
                                                    4,
                                                )}
                                            </span>
                                            <span>{tx.date}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>
                                                {shortenAddress(
                                                    tx.from || tx.sender,
                                                    4,
                                                )}
                                            </span>
                                            <span>{tx.date}</span>
                                        </>
                                    )}
                                </Transactions>
                            )
                        })}
                </LabelTransactions>
            </WrapData>
            <Pagination
                page={page}
                setPage={setPage}
                setLoadingChangePage={undefined}
                totalPage={totalPage}
            />
        </Container>
    )
}

export default Overview

const Container = styled.div`
    padding: 20px 0;
    color: #fff;

    overflow: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
`

const WrapData = styled(Columns)``

const LabelTransactions = styled(Columns)`
    padding: 20px 10px;
    overflow: scroll;
    ::-webkit-scrollbar {
        display: none;
    }

    background: #48494c52;
    border-radius: 6px;

    .trans {
        :hover {
            background: #716c6c8e;
        }
        cursor: pointer;
    }
`

const LabelAssets = styled(Columns)`
    padding: 20px 10px;

    overflow: scroll;
    ::-webkit-scrollbar {
        display: none;
    }

    div {
        margin: auto 0;
    }
    background: #48494c52;
    border-radius: 6px;

    img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }

    .badge {
        padding: 5px;
        background: #111;
        border-radius: 6px;
        /* border: 1px solid white; */
    }
`

const LabelContract = styled.div`
    /* width: 256px; */
    display: flex;
    gap: 5px;
    /* padding: 10px 10px; */
    align-items: center;
    img {
        width: 16px;
        height: 16px;
        cursor: pointer;
    }

    .address {
        background: #48494c52;
        padding: 10px 10px;
        border-radius: 6px;
    }

    .back {
        cursor: pointer;
        /* background: #48494c52; */
        padding: 10px;
        background: white;
        color: black;
        border-radius: 6px;
    }
`

const LabelDetails = styled(Row)`
    padding: 20px 0;
    background: #48494c52;
    border-radius: 6px;

    div {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .title {
        color: #a2f2eb;
    }

    @media screen and (max-width: 456px) {
        display: flex;
        flex-direction: column;
        gap: 20px;
        div {
            display: block;
            padding: 0 20px;
        }
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
const Transactions = styled.div<{ isMobile?: boolean }>`
    display: grid;
    text-align: end;
    grid-template-columns: ${({ isMobile }) =>
        isMobile ? '110px 1fr 1fr' : '1fr 1fr 1fr 1fr 1fr'};
    grid-gap: 14px;
    padding: 10px 4px;

    span {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .field {
        cursor: pointer;
        color: #7d7979;
    }
    .active {
        color: #fff;
        /* padding: 5px; */
    }
`

const LabelAmount = styled.div`
    display: flex;
    gap: 5px;
    justify-content: flex-end;
    div {
        max-width: 100px;
        @media screen and (max-width: 990px) {
            max-width: 70px;
        }
        @media screen and (max-width: 800px) {
            max-width: 60px;
        }
    }
`

const LabelX = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    button {
        width: 120px;
    }
`
