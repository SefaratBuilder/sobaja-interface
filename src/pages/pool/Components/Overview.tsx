import { Columns, Row } from 'components/Layouts'
import { Data, IMint, ISwap } from 'hooks/useQueryPool'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import imgCopy from 'assets/icons/copy.svg'
import UNKNOWN from 'assets/icons/question-mark-button-dark.svg'
import tokenList from 'constants/jsons/tokenList.json'
import { shortenAddress } from 'utils'
import imgCheckMark from 'assets/icons/check-mark.svg'
import ETH from 'assets/token-logos/eth.svg'
import { uniqByKeepFirst } from 'utils/handleArray'

const Overview = ({
    pool,
    transaction,
    width,
}: {
    pool?: Data
    transaction?: (ISwap | IMint)[]
    width?: number
}) => {
    const dTransactions = useMemo(() => {
        if (transaction?.[0]) {
            return uniqByKeepFirst(
                transaction.filter(
                    (tx) =>
                        tx.pair.token0.id === pool?.addresses?.[1] &&
                        tx.pair.token1.id === pool?.addresses?.[2],
                ),
                (t: ISwap | IMint) => t.pair.id,
            )
        }
        return []
    }, [transaction])
    console.log('🤦‍♂️ ⟹ transactions ⟹ transactions:', dTransactions)

    const [isCopied, setIsCopied] = useState(false)
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

    const dataShow = useMemo(() => {
        if (width && width > 576) {
            return {
                title: ['Token Amount', 'Token Amount', 'Sender', 'Time'],
            }
        }

        return {
            title: ['Sender', 'Time'],
        }
    }, [width])

    return (
        <Container>
            <WrapData gap="20px">
                <LabelContract>
                    <Row gap="20px">
                        <p>Contract</p>
                        <Row gap="5px">
                            <p>
                                {pool?.addresses?.[0] &&
                                    shortenAddress(pool?.addresses?.[0], 6)}
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
                                            onClick={() => handleCopyAddress()}
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
                </LabelContract>
                <LabelAssets gap="25px">
                    <p>Assets in pool</p>
                    <Row gap="10px">
                        <p className="badge">50%</p>
                        <Row gap="5px">
                            <img
                                src={
                                    pool?.symbols?.[1] === 'WETH'
                                        ? ETH
                                        : tokenList.find(
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
                                        : tokenList.find(
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
                    <Transactions isMobile={width ? width <= 576 : false}>
                        <Row gap="10px">
                            <p>All</p>
                            <p>Swap</p>
                            <p>Add</p>
                        </Row>
                        {dataShow?.title?.map((t, index) => {
                            return <span key={index}>{t}</span>
                        })}
                    </Transactions>
                    {dTransactions &&
                        dTransactions?.map((tx: any) => {
                            return (
                                <Transactions
                                    isMobile={width ? width <= 576 : false}
                                >
                                    <Row gap="10px">
                                        <span>{tx.type}</span>
                                    </Row>
                                    {width && width > 576 ? (
                                        <>
                                            <span>
                                                {tx?.amount0
                                                    ? tx?.amount0
                                                    : tx?.amount0In === '0'
                                                    ? tx?.amount0Out
                                                    : tx?.amount0In}
                                            </span>
                                            <span>
                                                {tx?.amount1
                                                    ? tx?.amount1
                                                    : tx?.amount1In === '0'
                                                    ? tx?.amount1Out
                                                    : tx?.amount1In}
                                            </span>
                                            <span>0x</span>
                                            <span>{tx.date}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>0x</span>
                                            <span>{tx.date}</span>
                                        </>
                                    )}
                                </Transactions>
                            )
                        })}
                </LabelTransactions>
            </WrapData>
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
    width: 256px;
    padding: 10px 10px;
    border-radius: 6px;
    background: #48494c52;
    img {
        width: 16px;
        height: 16px;
        cursor: pointer;
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
    span {
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
