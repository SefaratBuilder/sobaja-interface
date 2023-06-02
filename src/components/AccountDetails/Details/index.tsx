import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import ETH from 'assets/token-logos/eth.svg'
import PlusIcon from 'assets/icons/plus.svg'
import Arrow from 'assets/icons/arrow-link.svg'
import { useAddUser, useUsersState } from 'states/users/hooks'
import { useActiveWeb3React } from 'hooks'
import {
    User,
    UserActivity,
    UserBalance,
    UsersDetails,
    initBalanceToken,
} from 'states/users/reducer'
import { Field, Token } from 'interfaces'
import { NATIVE_COIN, URLSCAN_BY_CHAINID } from 'constants/index'

import TokenListModal from 'components/TokenListModal'
import { useAllTokenBalances } from 'hooks/useCurrencyBalance'
import SendModal from '../SendModal'

const WrapDetailsAccount = ({ balance }: { balance?: string }) => {
    const [currentTab, setCurrentTab] = useState<'Balances' | 'Activity'>(
        'Balances',
    )
    const { chainId } = useActiveWeb3React()
    const allBalances = useAllTokenBalances()

    // const [token, setToken] = useState<Token>(NATIVE_COIN[chainId || 5])
    // const tokenStruct = useToken(token.address)
    // const balanceToken = useCurrencyBalance(account, tokenStruct)
    // const updateBalance = useUpdateBalanceTokens()
    const addUser = useAddUser()
    const userData = useUsersState()

    /**
     * @add handle add token to list UsersState
     */
    const handleOnAdd = useCallback(
        (
            token: Token,
            balance: string,
            allTokenBalances: {
                [tokenAddress: string]: string | undefined
            },
        ) => {
            const updateBalance = userData.balances.map((i) => {
                return {
                    ...i,
                    balance: allTokenBalances?.[i.address] || i.balance,
                }
            })

            const newUser = {
                balances: [
                    ...updateBalance,
                    {
                        ...token,
                        balance: allTokenBalances?.[token.address] || balance,
                    },
                ],
                activity: [...userData.activity],
            }

            !userData.balances.map((i) => i.address).includes(token.address) &&
                addUser(newUser)
        },
        [userData],
    )

    /**
     * @update update balances when open
     */
    useEffect(() => {
        if (userData) {
            const updateBalance = userData.balances.map((i) => {
                return {
                    ...i,
                    balance: allBalances?.[i.address] || i.balance,
                }
            })

            const newUser = {
                balances: [...updateBalance],
                activity: [...userData.activity],
            }
            addUser(newUser)
            console.log('update balances')
        }
    }, [])

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

            {currentTab === 'Balances' && (
                <WrapTokens>
                    {userData &&
                        userData?.balances?.map(
                            (i: UserBalance, index: number) => {
                                return (
                                    <span key={index}>
                                        <CustomSendModal>
                                            <SendModal propsToken={i} />
                                        </CustomSendModal>

                                        <LabelToken key={index}>
                                            <div>
                                                <img
                                                    src={i.logoURI || ETH}
                                                    alt="logo-token"
                                                />
                                                <span>{i.symbol}</span>
                                            </div>
                                            <div>
                                                ≈${Number(i.balance).toFixed(6)}
                                            </div>
                                        </LabelToken>
                                        {<Line />}
                                    </span>
                                )
                            },
                        )}
                </WrapTokens>
            )}
            {currentTab === 'Activity' && (
                <WrapTokens isReverse={true}>
                    {userData &&
                        userData?.activity?.map(
                            (i: UserActivity, index: number) => {
                                return (
                                    <span key={index}>
                                        <LabelToken
                                            key={index}
                                            onClick={() =>
                                                chainId &&
                                                window.open(
                                                    `${URLSCAN_BY_CHAINID[chainId].url}tx/${i.hash}`,
                                                )
                                            }
                                        >
                                            <div>
                                                {/* <img src={ETH} alt="" /> */}
                                                <span>{i.method}</span>
                                            </div>
                                            <div>{i.timestamp}</div>
                                        </LabelToken>
                                        {<Line />}
                                    </span>
                                )
                            },
                        )}

                    {/* <Line isNotLast={true} /> */}
                </WrapTokens>
            )}
            <WrapAddToken>
                <div>Don't see your token?</div>
                <div>
                    <Icon>
                        <img src={PlusIcon} alt="plus" />
                    </Icon>
                    Add Token
                    {chainId && (
                        <CustomTokenListModal>
                            <TokenListModal
                                token={NATIVE_COIN[chainId]}
                                field={Field.INPUT}
                                onUserSelect={() => {}}
                                onSelectToken={handleOnAdd}
                            />
                        </CustomTokenListModal>
                    )}
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

    @media screen and (max-width: 391px) {
        padding: 0.5rem 0;
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
    @media screen and (max-width: 391px) {
        padding: 0.5rem 1.5rem;
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

const WrapTokens = styled.div<{ isReverse?: boolean }>`
    position: relative;
    display: flex;
    flex-direction: ${({ isReverse }) =>
        isReverse ? 'column-reverse' : 'column'};
    max-height: 210px;
    /* height: 100%; */
    overflow-y: scroll;

    span {
        :hover {
            background: #b5baba7a;
        }
    }

    ::-webkit-scrollbar {
        display: none;
        /* width: 8px;
        background-color: #f5f5f5; */
    }
`

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
    @media screen and (max-width: 391px) {
        padding: 0.2rem 1rem;
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

const CustomTokenListModal = styled.div`
    position: absolute;
    opacity: 0;
`

const CustomSendModal = styled.div`
    position: absolute;
    width: 100%;
    opacity: 0;
`
