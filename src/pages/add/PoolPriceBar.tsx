import { Field } from 'interfaces'
import React from 'react'
import styled from 'styled-components'
import imgDownArrowDark from 'assets/icons/chevron-grey.svg'
import { useSwapState } from 'states/swap/hooks'
import { Row } from 'components/Layouts'
import { div } from 'utils/math'
import NotiIcon from 'assets/icons/notification.svg'

const PoolPriceBar = ({
    dropDown,
    setDropDown,
}: {
    dropDown: boolean
    setDropDown: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { inputAmount, outputAmount, tokenIn, tokenOut, swapType } =
        useSwapState()
    const slippage = 0
    const maximumSent =
        Number(inputAmount) && slippage
            ? Number(inputAmount) * (1 + Number(slippage) / 100)
            : 0
    const minimumReceived = outputAmount
        ? Number(outputAmount) * (1 - Number(slippage) / 100)
        : 0
    const rate =
        Number(inputAmount) && Number(outputAmount)
            ? Number(div(inputAmount, outputAmount)).toFixed(8)
            : 0
    const priceImpact =
        Number(inputAmount) && Number(outputAmount)
            ? Number(div(inputAmount, outputAmount)).toFixed(8)
            : 0

    return (
        <>
            <PoolPriceWrapper>
                <WrapFee
                    dropDown={dropDown}
                    onClick={() => setDropDown(!dropDown)}
                >
                    <Row al="center" gap="2px">
                        <img src={NotiIcon} alt="notification icon" />
                        <span>
                            1 {tokenOut?.symbol} = {rate} {tokenIn?.symbol}{' '}
                            (including fee)
                        </span>
                    </Row>
                    <img
                        className={dropDown ? 'active' : ''}
                        src={imgDownArrowDark}
                        alt="chevron down"
                    />
                </WrapFee>
                <WrapExpectedOutput
                    className={dropDown ? 'active' : 'chevron down'}
                    dropDown={dropDown}
                >
                    <ContentOutput>
                        <ItemOutput>
                            <div>
                                <div>Expected output</div>
                            </div>
                            <div>
                                <div>
                                    {outputAmount
                                        ? Number(outputAmount).toFixed(8)
                                        : 0}{' '}
                                    {tokenOut?.symbol}
                                </div>
                            </div>
                        </ItemOutput>
                        <ItemOutput>
                            <div>
                                <div>Price impact</div>
                            </div>
                            <div>
                                <div>
                                    {priceImpact
                                        ? Number(priceImpact).toFixed(2)
                                        : 0}{' '}
                                    %
                                </div>
                            </div>
                        </ItemOutput>
                        <Hr />
                        <ItemOutput>
                            <div>
                                {swapType === Field.INPUT ? (
                                    <div>Minimum received</div>
                                ) : (
                                    <div>Maximum sent</div>
                                )}
                            </div>
                            <div>
                                {swapType === Field.INPUT ? (
                                    <Row>
                                        <span>
                                            {minimumReceived.toFixed(8)}
                                        </span>
                                        <span>{tokenOut?.symbol}</span>
                                    </Row>
                                ) : (
                                    <Row>
                                        <span>{maximumSent.toFixed(8)}</span>
                                        <span>{tokenIn?.symbol}</span>
                                    </Row>
                                )}
                            </div>
                        </ItemOutput>
                        <ItemOutput>
                            <div>
                                <span>Fee</span>
                            </div>
                            <div>
                                <span>0.25%</span>
                            </div>
                        </ItemOutput>
                    </ContentOutput>
                </WrapExpectedOutput>
            </PoolPriceWrapper>
        </>
    )
}

const PoolPriceWrapper = styled.div``

const WrapFee = styled.div<{ dropDown: boolean }>`
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    align-items: center;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    @media screen and (max-width: 390px) {
        padding: 5px;
    }
    img {
        height: 15px;
        width: 15px;
        transition: all 0.3s ease-in-out;
        transform: rotate(0deg);
        &.active {
            transform: rotateX(180deg);
        }
    }
`

const WrapExpectedOutput = styled.div<{ dropDown: boolean }>`
    transition: all 0.1s ease-in-out;
    overflow: hidden;
    height: 0;
    margin: 10px 0;

    &.active {
        height: 116px;
        @media (max-width: 576px) {
            height: 130px;
        }
    }
`

const ContentOutput = styled.div`
    padding: 15px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: 1px solid var(--border2);

    img {
        height: 20px;
    }
    @media screen and (max-width: 390px) {
        padding: 7px;
    }
`

const ItemOutput = styled.div`
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text2);
    div {
        display: flex;
        align-items: center;
    }
    div:first-child {
        gap: 5px;
    }
`

const Hr = styled.div`
    border-top: 1px solid var(--border2);
    width: 100%;
`

export default PoolPriceBar
