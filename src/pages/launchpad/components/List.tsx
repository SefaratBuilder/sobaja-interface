import { Row } from 'components/Layouts'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Soba from 'assets/token-logos/sbj.svg'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { handleTime } from 'utils/convertTime'
import { ILaunchpadDetails, adminAddress } from '..'
import { useQueryLaunchpad } from 'hooks/useQueryLaunchpad'
import { useToken, useTokens } from 'hooks/useToken'
import { divNumberWithDecimal } from 'utils/math'
import { ChainId, Token } from 'interfaces'
import { badgeColors, getCurrentTimeLines } from 'utils/launchpad'
import UnknowToken from 'assets/token-logos/dai.svg'
import {
    CompTransaction,
    InitCompTransaction,
} from 'components/TransactionModal'
import { useTransactionHandler } from 'states/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { URLSCAN_BY_CHAINID } from 'constants/index'
import { useFairLaunchContract } from 'hooks/useContract'
import { getContract } from 'utils'
import { FAIRLAUNCH_ABI } from 'constants/jsons/fairlaunch'
import BgSoba from 'assets/icons/soba2.svg'

const UnknowThumbnail =
    // 'https://thelagostoday.com/wp-content/uploads/2021/07/bit-bitcoin.jpg'
    'https://p2pb2b.com/static/img/launchpad/banner.png'
interface IListLaunchpad {
    setCurrentPage: React.Dispatch<
        React.SetStateAction<'Admin' | 'Create' | 'Details' | 'Infomation'>
    >
    setLpDetails: React.Dispatch<
        React.SetStateAction<ILaunchpadDetails | undefined>
    >
    setIsOpenAdmin: React.Dispatch<React.SetStateAction<boolean>>
    initDataTransaction: CompTransaction
}

const ListLaunchpad = ({
    setCurrentPage,
    setLpDetails,
    setIsOpenAdmin,
    initDataTransaction,
}: IListLaunchpad) => {
    const { data, refetch } = useQueryLaunchpad()
    console.log('🤦‍♂️ ⟹ data:', data)
    const { launchpads } = data
    // const initDataTransaction = InitCompTransaction()
    const { addTxn } = useTransactionHandler()
    const { account, chainId, provider } = useActiveWeb3React()
    // const [launchpadId, setLaunchpadId] = useState(undefined)

    // const fairlaunchContract = useFairLaunchContract(launchpadId)

    /**
     * @dev
     * handle timeline for launchpad
     */
    const currentTimeLines = useMemo(() => {
        if (launchpads) {
            return getCurrentTimeLines(
                launchpads?.map(({ startTime, endTime, finalized }) => {
                    return { startTime, endTime, isFinalized: finalized }
                }),
            )
        }
    }, [launchpads])

    const availableSetTimes = useMemo(() => {
        const current = new Date().getTime() / 1000

        return launchpads?.map((lp) => {
            return current < Number(lp.startTime)
        })
    }, [launchpads])

    const launchpadTokens = useTokens(
        launchpads?.map((lp) => lp.launchpadToken),
    )

    const paymentCurrencies = useTokens(
        launchpads?.map((lp) =>
            lp.paymentCurrency === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
                : lp.paymentCurrency,
        ),
    )

    const handleOnSetTime = async (id: string) => {
        try {
            initDataTransaction.setError('')
            if (launchpads && provider) {
                console.log('on claim....')
                initDataTransaction.setIsOpenWaitingModal(true)

                const startTime = new Date().getTime() / 1000 + 300 // start after 5 min
                const endTime = startTime + 86400 // end after start 1 hour

                const fairlaunchContract = getContract(
                    id,
                    FAIRLAUNCH_ABI,
                    provider,
                    account ? account : undefined,
                )

                const callResult = await fairlaunchContract?.setTimestamp(
                    startTime.toFixed(),
                    endTime.toFixed(),
                )

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                        callResult.hash || ''
                    }`,
                    msg: 'Set time',
                    status: txn.status === 1 ? true : false,
                })

                setTimeout(() => {
                    console.log('refetch data')
                    refetch()
                }, 5000)
            }
        } catch (err) {
            console.log('Failed to approve token: ', err)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
        }
    }

    const handleOnClick = (
        launchpad: (typeof launchpads)[0],
        lPadToken: Token | undefined,
        pmCur: Token | undefined,
    ) => {
        // setLaunchpadId(Number(launchpad?.id))
        setCurrentPage('Details')

        setLpDetails({
            ...launchpad,
            img: '',
            lPadToken: lPadToken,
            paymentToken: pmCur,
        })
    }

    useEffect(() => {
        refetch()
    }, [])

    return (
        <Container>
            {!account ? (
                <div className="notice">Please connect wallet</div>
            ) : chainId !== ChainId.MUMBAI ? (
                <>
                    <div className="notice">
                        Only support for Polygon Mumbai
                    </div>
                </>
            ) : (
                <>
                    <Title>
                        <p>Launchpad</p>
                        <div>
                            {adminAddress?.toLocaleLowerCase() ===
                                account?.toLocaleLowerCase() && (
                                <div
                                    className="btn-create"
                                    onClick={() => setIsOpenAdmin((i) => !i)}
                                >
                                    + Grant operator
                                </div>
                            )}
                            <div
                                className="btn-create"
                                onClick={() => setCurrentPage('Create')}
                            >
                                + Create
                            </div>
                        </div>
                    </Title>
                    <WrapLaunchpad>
                        {launchpads &&
                            launchpads?.map((launchpad, index) => {
                                return (
                                    <CardDetails key={index}>
                                        <div className="thumbnail">
                                            <img
                                                src={UnknowThumbnail}
                                                alt="launchpad"
                                            />
                                        </div>
                                        <Details>
                                            <div className="label">
                                                <WrapHeader>
                                                    <LogoToken>
                                                        <img
                                                            src={UnknowToken}
                                                            alt=""
                                                        />
                                                    </LogoToken>
                                                    <div>
                                                        <span>
                                                            {
                                                                launchpadTokens?.[
                                                                    index
                                                                ]?.symbol
                                                            }
                                                        </span>
                                                        <Badge
                                                            bgColor={
                                                                currentTimeLines &&
                                                                badgeColors?.[
                                                                    currentTimeLines?.[
                                                                        index
                                                                    ].badge
                                                                        ?.split(
                                                                            ' ',
                                                                        )
                                                                        ?.join(
                                                                            '',
                                                                        )
                                                                ]
                                                            }
                                                        >
                                                            {
                                                                currentTimeLines?.[
                                                                    index
                                                                ].badge
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <div className="name-token">
                                                        {/* {"launchpad.token.name"} */}
                                                        {
                                                            launchpadTokens?.[
                                                                index
                                                            ]?.name
                                                        }
                                                    </div>
                                                </WrapHeader>
                                                <WrapDetails>
                                                    <div>
                                                        Total Token:{' '}
                                                        {divNumberWithDecimal(
                                                            launchpad.totalTokenSale,
                                                            18,
                                                        )}
                                                    </div>
                                                    <div>
                                                        Sale Price: 1{' '}
                                                        {
                                                            launchpadTokens?.[
                                                                index
                                                            ]?.symbol
                                                        }{' '}
                                                        -{' '}
                                                        {divNumberWithDecimal(
                                                            launchpad.price,
                                                            18,
                                                        )}{' '}
                                                        {
                                                            paymentCurrencies?.[
                                                                index
                                                            ]?.symbol
                                                        }
                                                    </div>
                                                    <div className="label-time">
                                                        <div>
                                                            Start Time:{' '}
                                                            <span>
                                                                {handleTime(
                                                                    launchpad.startTime,
                                                                    true,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            End Time:{' '}
                                                            <span>
                                                                {handleTime(
                                                                    launchpad.endTime,
                                                                    true,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        Payment Crypto:{' '}
                                                        {
                                                            launchpadTokens?.[
                                                                index
                                                            ]?.symbol
                                                        }
                                                    </div>
                                                    {availableSetTimes[index] &&
                                                        account?.toLocaleLowerCase() ===
                                                            launchpad.launchpadOwner.toLocaleLowerCase() && (
                                                            <div>
                                                                <PrimaryButton
                                                                    name="Set time"
                                                                    onClick={() =>
                                                                        handleOnSetTime(
                                                                            launchpad.id,
                                                                        )
                                                                    }
                                                                    type="launch-pad"
                                                                />
                                                            </div>
                                                        )}
                                                    <div className="btn-view">
                                                        <PrimaryButton
                                                            name="View more"
                                                            onClick={() =>
                                                                handleOnClick(
                                                                    launchpad,
                                                                    launchpadTokens?.[
                                                                        index
                                                                    ],
                                                                    paymentCurrencies?.[
                                                                        index
                                                                    ],
                                                                )
                                                            }
                                                            size="12px"
                                                        />
                                                    </div>
                                                </WrapDetails>
                                            </div>
                                        </Details>
                                    </CardDetails>
                                )
                            })}
                    </WrapLaunchpad>
                </>
            )}
        </Container>
    )
}

const Container = styled.div`
    margin: 0 auto 40px;
    max-width: 1475px;

    padding: 30px 0;

    .notice {
        text-align: center;
    }

    @media screen and (max-width: 1554px) {
        max-width: 1100px;
    }

    @media screen and (max-width: 1163px) {
        max-width: 725px;
    }

    @media screen and (max-width: 788px) {
        max-width: 505px;
    }
`
const Title = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    align-items: center;
    padding-bottom: 4.5rem;

    div {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }

    .btn-create {
        padding: 5px 8px;
        border: 1px solid white;
        border-radius: 6px;
        cursor: pointer;

        :hover {
            background: #fff;
            color: #111;
        }
    }

    p {
        font-weight: 800;
        font-size: 34px;
    }
`
const WrapLaunchpad = styled.div`
    display: flex;
    flex-wrap: wrap;
    color: #111;
    gap: 25px;
    /* text-align: end; */

    @media screen and (max-width: 788px) {
        justify-content: center;
    }
    /* flex-direction: row-reverse; */
`
const CardDetails = styled(Row)`
    border: 1px solid #003b5c;
    border-radius: 10px;
    background: url(${BgSoba});
    /* gap: 5.5rem; */
    display: block;
    max-width: 350px;
    color: white;

    .thumbnail {
        /* min-width: 550px; */
        /* max-height: 300px; */
        /* display: flex; */
        /* align-items: center; */
        /* border-bottom: 1px solid #111; */
    }

    img {
        width: 100%;
        /* height: 100%; */
        /* object-fit: cover; */
        border-radius: 8px 8px 0 0;
        /* border-bottom: 1px solid; */
    }
`

const Details = styled.div`
    /* width: 400px; */
    /* min-width: 400px; */
    padding: 0 0.5rem;
    max-width: 320px;
    margin: auto;

    .label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* min-height: 300px; */
        /* span {
            font-size: 22px;
        } */
    }
`

const WrapHeader = styled.div`
    display: flex;
    /* justify-content: center; */
    gap: 10px;
    align-items: center;
    padding: 1rem 0;

    .name-token {
        font-size: 22px;
        opacity: 0.5;
    }
`

const LogoToken = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 0.3px solid #0000005e;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
    }
`

const Badge = styled.div<{ bgColor?: string }>`
    border: 1px solid #111;
    border-radius: 4px;
    padding: 3px 5px;
    font-size: 12px;
    color: #111;
    display: flex;
    justify-content: center;
    background: ${({ bgColor }) => (bgColor ? bgColor : '')};
    color: ${({ bgColor }) => (bgColor === 'red' ? 'white' : '')};
`

const WrapDetails = styled.div`
    /* padding-top: 1rem; */
    display: flex;
    flex-direction: column;
    gap: 8px;
    /* padding: 1rem 0.5rem; */
    /* padding: 0 1rem; */
    font-size: 14px;

    .label-time {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 12px;
        div:nth-child(1) {
            padding-bottom: 1rem;
        }
        div {
            display: flex;
            justify-content: space-between;
        }
    }

    .btn-view {
        /* width: 50%; */
        padding: 0 0 1rem;
    }
`

export default ListLaunchpad
