import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ETH from 'assets/token-logos/eth.svg'
import PlusIcon from 'assets/icons/plus.svg'
import Arrow from 'assets/icons/arrow-link.svg'
import { useUpdateBalanceTokens, useUsersState } from 'states/users/hooks'
import { useActiveWeb3React } from 'hooks'
import { UserActivity, UserBalance } from 'states/users/reducer'

const WrapDetailsAccount = (balance?: string) => {
    const [currentTab, setCurrentTab] = useState<'Balances' | 'Activity'>(
        'Balances',
    )
    const { chainId } = useActiveWeb3React()
    const { users } = useUsersState()

    return (
        <Container>
            <WrapDetail>
                <div
                    className={`${currentTab === 'Balances' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('Balances')}
                >
                    Balances
                </div>
                <div
                    className={`${currentTab === 'Activity' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('Activity')}
                >
                    Activity
                </div>
            </WrapDetail>
            <WrapTokens>
                {currentTab === 'Balances' &&
                    chainId &&
                    users?.[chainId?.toString()]?.balances.map(
                        (i: UserBalance) => {
                            return (
                                <>
                                    <LabelToken>
                                        <div>
                                            <img src={ETH} alt="" />
                                            <span>{i.symbol}</span>
                                        </div>
                                        <div>${i.balance}</div>
                                    </LabelToken>
                                    <Line />
                                </>
                            )
                        },
                    )}
                {currentTab === 'Activity' &&
                    chainId &&
                    users?.[chainId?.toString()]?.activity?.map(
                        (i: UserActivity) => {
                            return (
                                <>
                                    <LabelToken>
                                        <div>
                                            <img src={ETH} alt="" />
                                            <span>{i.method}</span>
                                        </div>
                                        <div>${i.timestamp}</div>
                                    </LabelToken>
                                    <Line />
                                </>
                            )
                        },
                    )}

                <Line isNotLast={true} />
            </WrapTokens>

            <WrapAddToken>
                <div>Don't see your token?</div>
                <div>
                    <Icon>
                        <img src={PlusIcon} alt="plus" />
                    </Icon>
                    Add Token
                </div>
            </WrapAddToken>
            <Line isNotLast={true} />
            <WrapLink>
                <div>Learn Smart Account</div>
                <img src={Arrow} alt="" />
            </WrapLink>
            <Line isNotLast={true} />
        </Container>
    )
}

export default WrapDetailsAccount

const Container = styled.div`
    width: 100%;
`

const WrapAddToken = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    padding: 1rem 0;

    div {
        display: flex;
        gap: 5px;
        align-items: center;
    }

    div:nth-child(2) {
        cursor: pointer;
    }
`

const Icon = styled.div`
    border: 1px solid white;
    border-radius: 50%;
    width: 16px;
    height: 16px;

    img {
        width: 100%;
        padding: 3px;
        /* height: 12px; */
    }
`

const WrapLink = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;

    padding: 1rem 1.5rem;
    color: #00f3ff;
    cursor: pointer;
    img {
        width: 12px;
        height: 12px;
    }
`

const WrapDetail = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* padding: 1rem 0; */
    text-align: center;
    div {
        border-bottom: 0.8px solid white;
        padding: 0.6rem 0;
        cursor: pointer;
    }

    .active {
        color: #0089ff;
        border-bottom: 1px solid #0089ff;
    }
`

const WrapTokens = styled.div``
const LabelToken = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 0.5rem 1rem;
    cursor: pointer;

    div {
        min-height: 30px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    img {
        width: 18px;
        height: 18px;
        border-radius: 50%;
    }
`

const Line = styled.div<{ isNotLast?: boolean }>`
    height: ${({ isNotLast }) => (isNotLast ? '2px' : '0.5px')};
    width: 100%;
    background: ${({ isNotLast }) =>
        isNotLast
            ? 'linear-gradient(90deg, rgba(0, 59, 92, 0.140625) 0%, #004B76 51.56%, rgba(0, 59, 92, 0) 100%)'
            : 'linear-gradient(270deg,rgba(255, 255, 255, 0) 0%,#ffffff 50.52%,rgba(255, 255, 255, 0) 100%)'};
`
