import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Success from 'assets/icons/success.svg'
import { Row } from 'components/Layouts'
import { handleTime } from 'utils/convertTime'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { ILaunchpadDetails } from '..'
import { add, divNumberWithDecimal, mulNumberWithDecimal } from 'utils/math'
import ETH from 'assets/token-logos/matic.svg'
import { useFairLaunchContract } from 'hooks/useContract'
import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import Blur from 'components/Blur'
import { useTransactionHandler } from 'states/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { URLSCAN_BY_CHAINID } from 'constants/index'
import { useQueryCommitUser, useQueryLaunchpad } from 'hooks/useQueryLaunchpad'
import { badgeColors, getCurrentTimeLine } from 'utils/launchpad'

const UnknowThumbnail =
    // 'https://thelagostoday.com/wp-content/uploads/2021/07/bit-bitcoin.jpg'
    'https://p2pb2b.com/static/img/launchpad/banner.png'

interface IDetails {
    details: ILaunchpadDetails | undefined
    setCurrentPage: React.Dispatch<
        React.SetStateAction<'Admin' | 'Create' | 'Details' | 'Infomation'>
    >
}

const LaunchpadDetails = ({ details, setCurrentPage }: IDetails) => {
    const { refetch } = useQueryLaunchpad()
    const [commitValue, setCommitValue] = useState('0')
    const fairlaunchContract = useFairLaunchContract(details?.id)
    const initDataTransaction = InitCompTransaction()
    const { addTxn } = useTransactionHandler()
    const { chainId, account } = useActiveWeb3React()
    const delayDuration = 15000
    const { totalCommitment } = useQueryCommitUser(details?.id, account)

    /**
     * @totalOffered : total commitment of user / this launchpad
     */
    const totalOffered = useMemo(() => {
        if (!details?.totalCommitment || !details.price) return 0
        return Number(details.totalCommitment) / Number(details.price)
    }, [details])

    const isAdmin = useMemo(() => {
        if (!account || !details?.launchpadOwner) return false
        return (
            account?.toLocaleLowerCase() ===
            details?.launchpadOwner?.toLocaleLowerCase()
        )
    }, [account, details])

    const isAtLimit = useMemo(() => {
        if (
            totalCommitment &&
            details?.individualCap &&
            details.paymentToken?.decimals
        ) {
            return (
                Number(
                    mulNumberWithDecimal(
                        commitValue,
                        details.paymentToken?.decimals,
                    ),
                ) >
                    Number(details?.individualCap) - Number(totalCommitment) ||
                Number(details?.individualCap) === Number(totalCommitment)
            )
        }
        return false
    }, [totalCommitment, details, commitValue])

    const isAvailableConfirm = useMemo(() => {
        if (details?.startTime && details?.endTime) {
            const current = new Date().getTime() / 1000
            return (
                current > Number(details.startTime) &&
                current < Number(details.endTime)
            )
        }
        return false
    }, [details])

    const currentTimeline = getCurrentTimeLine(
        details?.startTime,
        details?.endTime,
        details?.finalized,
    )

    const isAvailableClaim = useMemo(() => {
        if (details?.claims && details?.claims?.length > 0 && account) {
            let dClaimed = details?.claims?.find(
                (d) =>
                    d.address.toLocaleLowerCase() ===
                    account.toLocaleLowerCase(),
            )
            return dClaimed ? false : true
        }
        return true
    }, [details, account])

    const onCommit = async () => {
        console.log('onCommit...')
        try {
            if (!commitValue) return
            initDataTransaction.setError('')
            initDataTransaction.setPayload({
                method: 'commit',
                input: commitValue,
                tokenIn: details?.paymentToken,
            })
            initDataTransaction.setIsOpenConfirmModal(true)
        } catch (err) {
            console.log('failed to commit', err)
        }
    }

    const onConfirmCommit = useCallback(async () => {
        try {
            initDataTransaction.setIsOpenConfirmModal(false)
            initDataTransaction.setIsOpenWaitingModal(true)

            const amount = mulNumberWithDecimal(commitValue, 18)
            const callResult = await fairlaunchContract?.commit(amount, {
                value: amount,
            })

            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)

            const txn = await callResult.wait()
            initDataTransaction.setIsOpenResultModal(false)

            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                    callResult.hash || ''
                }`,
                msg: `Commit`,
                status: txn.status === 1 ? true : false,
            })

            setTimeout(() => {
                console.log('refetch data')
                refetch()
            }, delayDuration)
        } catch (error) {
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }, [initDataTransaction])

    const handleOnClaim = async () => {
        try {
            initDataTransaction.setError('')
            if (details?.finalized) {
                console.log('on claim....')
                initDataTransaction.setIsOpenWaitingModal(true)

                const callResult = await fairlaunchContract?.claim()

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                        callResult.hash || ''
                    }`,
                    msg: 'Claim',
                    status: txn.status === 1 ? true : false,
                })

                setTimeout(() => {
                    console.log('refetch data')
                    refetch()
                }, delayDuration)
            }
        } catch (err) {
            console.log('Failed to approve token: ', err)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
        }
    }

    const handleOnFinalize = async () => {
        try {
            initDataTransaction.setError('')
            if (
                currentTimeline.badge === 'On Progess' &&
                !details?.finalized &&
                details?.launchpadOwner
            ) {
                console.log('on claim....')
                initDataTransaction.setIsOpenWaitingModal(true)

                const callResult = await fairlaunchContract?.finalize()

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                        callResult.hash || ''
                    }`,
                    msg: 'Finalize launchpad',
                    status: txn.status === 1 ? true : false,
                })

                setTimeout(() => {
                    console.log('refetch data')
                    refetch()
                }, delayDuration)
            }
        } catch (err) {
            console.log('Failed to approve token: ', err)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
        }
    }

    return (
        <>
            <>
                <ComponentsTransaction
                    data={initDataTransaction}
                    onConfirm={() => onConfirmCommit()}
                />
            </>
            <Container>
                <div
                    className="btn-back"
                    onClick={() => setCurrentPage('Infomation')}
                >
                    {' '}
                    {'<'} Launchpad
                </div>
                {/* <button onClick={() => refetch()}>Refect</button> */}
                <WrapTitle>
                    <LeftSide>
                        <Thumbnail>
                            <img src={details?.img || UnknowThumbnail} alt="" />
                        </Thumbnail>
                        <DetailsHeader>
                            <div>
                                <div className="title">
                                    <div>{details?.lPadToken?.symbol}</div>
                                    <Badge
                                        bgColor={
                                            badgeColors?.[
                                                currentTimeline?.badge
                                                    ?.split(' ')
                                                    ?.join('')
                                            ]
                                        }
                                    >
                                        {currentTimeline?.badge}
                                    </Badge>
                                </div>
                                <div className="details">
                                    {details?.lPadToken?.name}
                                </div>
                            </div>
                            <div className="social-contact">
                                <div>Website</div>
                                <div>Twitter</div>
                            </div>
                        </DetailsHeader>
                    </LeftSide>
                    <RightSide>
                        <span>End date:</span>
                        <span>
                            {' '}
                            {handleTime(
                                currentTimeline.timeLine[
                                    currentTimeline.timeLine.length - 1
                                ].time,
                            )}
                        </span>
                    </RightSide>
                </WrapTitle>
                <Line></Line>
                <WrapBody>
                    <WrapBodyHead>
                        <span>
                            <div className="title">Type:</div>
                            <div className="details">Subscription</div>
                        </span>
                        <span>
                            <div>Token Sale Price:</div>
                            <div className="details">
                                {`1 ${
                                    details?.lPadToken &&
                                    details?.lPadToken?.symbol
                                }`}{' '}
                                ={' '}
                                {details?.price
                                    ? divNumberWithDecimal(details?.price, 18)
                                    : '0'}{' '}
                                {details?.paymentToken?.symbol}
                            </div>
                        </span>
                        <span>
                            <div>Tokens Offered:</div>
                            <div className="details">
                                {totalOffered} {details?.lPadToken?.symbol}
                            </div>
                        </span>
                        <span>
                            <div>Hard cap per user:</div>
                            <div className="details">
                                {details?.hardcap
                                    ? divNumberWithDecimal(details?.hardcap, 18)
                                    : '0'}{' '}
                                {details?.paymentToken?.symbol}
                            </div>
                        </span>
                        <span>
                            <div>Single Initial Investment:</div>
                            <div className="details">
                                {details?.individualCap
                                    ? divNumberWithDecimal(
                                          details?.individualCap,
                                          18,
                                      )
                                    : '0'}{' '}
                                {details?.paymentToken?.symbol}
                            </div>
                        </span>
                        <span>
                            <div>Your Investment:</div>
                            <div className="details">
                                {totalCommitment
                                    ? divNumberWithDecimal(totalCommitment, 18)
                                    : '0'}{' '}
                                {details?.paymentToken?.symbol}
                            </div>
                        </span>
                    </WrapBodyHead>

                    <WrapTimeLine>
                        <div className="requirement">
                            <div className="title-commit">
                                Entry requirements
                            </div>
                            <span>
                                <div>ID verification ≥ Level 2</div>
                                <div>Project allowlist verification</div>
                            </span>
                        </div>
                        <div>
                            <div className="title-body">
                                Subscription Timeline
                            </div>
                            {currentTimeline.timeLine?.map((tl, i) => {
                                return (
                                    <TimeLine key={i}>
                                        <div className="left-side">
                                            <div
                                                className={`logo number-timeline`}
                                            >
                                                {i <
                                                currentTimeline.index + 1 ? (
                                                    <img src={Success} alt="" />
                                                ) : (
                                                    i + 1
                                                )}
                                            </div>
                                            {i !==
                                                currentTimeline.timeLine
                                                    .length -
                                                    1 && (
                                                <div>
                                                    <div className="line-direction"></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="right-side">
                                            <div>{tl.title}</div>
                                            <span>
                                                {i === 3 && !details?.finalized
                                                    ? 'Not resolved yet'
                                                    : handleTime(tl.time, true)}
                                            </span>
                                        </div>
                                    </TimeLine>
                                )
                            })}
                        </div>

                        <div>
                            <div className="title-body">
                                Token Sale and Economics
                            </div>
                            <LabelEconomics jus="space-between">
                                <div className="economics left">
                                    <div>Hard cap</div>
                                    <div>Soft cap</div>
                                    <div>Individual cap</div>
                                    <div>Total token sale</div>
                                    <div>Payment</div>
                                    <div>Finalized</div>
                                </div>
                                <div className="economics right">
                                    <div>
                                        {details?.hardcap
                                            ? divNumberWithDecimal(
                                                  details?.hardcap,
                                                  18,
                                              )
                                            : '30,000'}
                                    </div>
                                    <div>
                                        {details?.softcap
                                            ? divNumberWithDecimal(
                                                  details?.softcap,
                                                  18,
                                              )
                                            : '1,000'}
                                    </div>
                                    <div>
                                        {details?.individualCap
                                            ? divNumberWithDecimal(
                                                  details?.individualCap,
                                                  18,
                                              )
                                            : '1,000'}
                                    </div>
                                    <div>
                                        {details?.totalTokenSale
                                            ? divNumberWithDecimal(
                                                  details?.totalTokenSale,
                                                  18,
                                              )
                                            : '1,000'}
                                    </div>
                                    <div>
                                        {/* {details?.paymentCurrency?.reduce(
                                        (a, b) => a + ' | ' + b,
                                    ) || 'ETH'} */}
                                        {details?.paymentToken?.symbol}
                                    </div>
                                    <div>{'????'}</div>
                                </div>
                            </LabelEconomics>
                        </div>
                    </WrapTimeLine>
                    <WrapCommit>
                        {/**
                         * @dev On progess: launchpad is over and owner is not resolved yet
                         */}
                        {currentTimeline.badge === 'On Progess' ? (
                            isAdmin ? (
                                <Commit>
                                    <div className="title-commit">Finalize</div>
                                    <LabelCommit className="claim">
                                        <div className="label-currency">
                                            <div>
                                                Launchpad is over, please
                                                resolve it!
                                            </div>
                                        </div>

                                        <PrimaryButton
                                            name={'Resolve'}
                                            onClick={() => handleOnFinalize()}
                                            type="launch-pad"
                                            disabled={!isAdmin}
                                        />
                                    </LabelCommit>
                                </Commit>
                            ) : (
                                <Commit>
                                    <div className="title-commit">
                                        On Progess
                                    </div>
                                    <LabelCommit className="claim">
                                        <div className="label-currency">
                                            <div>
                                                Launchpad is over, please wait
                                                for owner resolve!
                                            </div>
                                        </div>
                                    </LabelCommit>
                                </Commit>
                            )
                        ) : (
                            <></>
                        )}

                        {/**
                         * @dev Closed: launchpad is over and owner resolved
                         */}
                        {currentTimeline.badge === 'Closed' ? (
                            isAvailableClaim ? (
                                <Commit>
                                    <div className="title-commit">
                                        General claim
                                    </div>
                                    <LabelCommit className="claim">
                                        <div className="label-currency">
                                            <div>Your investment: </div>
                                            <div>
                                                {divNumberWithDecimal(
                                                    totalCommitment || 0,
                                                    details?.paymentToken
                                                        ?.decimals || 18,
                                                )}{' '}
                                                {details?.paymentToken?.symbol}
                                            </div>
                                        </div>
                                        <div className="label-currency">
                                            <div>Receive: </div>
                                            <div>
                                                {details?.price
                                                    ? Number(totalCommitment) /
                                                      Number(details?.price)
                                                    : 0}{' '}
                                                {details?.lPadToken?.symbol}
                                            </div>
                                        </div>
                                        <PrimaryButton
                                            name={
                                                !details?.finalized
                                                    ? 'Launchpad is not finalized'
                                                    : 'Claim'
                                            }
                                            onClick={() => handleOnClaim()}
                                            type="launch-pad"
                                            disabled={!details?.finalized}
                                        />
                                    </LabelCommit>
                                </Commit>
                            ) : (
                                <Commit>
                                    <div className="title-commit">
                                        General claim
                                    </div>
                                    <LabelCommit className="claim">
                                        <div className="label-currency">
                                            <div>You already claimed</div>
                                        </div>
                                    </LabelCommit>
                                </Commit>
                            )
                        ) : (
                            <></>
                        )}

                        {/**
                         * @dev On Sale: launchpad is start and available for commit
                         */}
                        {currentTimeline.badge === 'On Sale' && (
                            <Commit>
                                <div className="title-commit">General sale</div>
                                <LabelCommit>
                                    <WrapInput>
                                        <div>Commit amount: </div>
                                        <Input
                                            onChange={(e) =>
                                                setCommitValue(e?.target?.value)
                                            }
                                        />
                                    </WrapInput>
                                    <div className="label-currency">
                                        <div>Payment currency: </div>
                                        {details?.paymentToken?.symbol}
                                    </div>
                                    {isAtLimit && (
                                        <div className="label-recap">
                                            <div>Warning: </div>
                                            <div>
                                                Your investment is at limit
                                            </div>
                                        </div>
                                    )}
                                    <PrimaryButton
                                        name="Confirm"
                                        onClick={() => onCommit()}
                                        type="launch-pad"
                                        disabled={
                                            isAtLimit || !isAvailableConfirm
                                        }
                                    />
                                </LabelCommit>
                            </Commit>
                        )}
                    </WrapCommit>
                </WrapBody>
            </Container>
        </>
    )
}

const Container = styled.div`
    max-width: 1240px;
    margin: auto;

    padding: 30px 4rem;

    @media screen and (max-width: 1240px) {
        padding: 30px 4rem;
    }
    @media screen and (max-width: 890px) {
        padding: 30px 1.5rem;
        font-size: 14px;
    }

    .btn-back {
        cursor: pointer;
        padding: 5px 8px;
        /* padding: 0 0 3.5rem; */
        margin-bottom: 3.5rem;
        font-size: 20px;
        border: 2px solid white;
        border-radius: 12px;
        /* width: 22%; */
        max-width: 150px;
    }
`
const WrapCommit = styled.div`
    display: flex;
    justify-content: space-evenly;
    color: #111;
    flex-wrap: wrap;
    gap: 1rem;
`

const Commit = styled.div`
    .title-commit {
        font-size: 24px;
        font-weight: bolder;
    }
    .claim {
        padding: 20px 50px;
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    padding: 20px 20px 30px;
    gap: 10px;
    border-radius: 12px;

    /* @media screen and (max-width: 576px) {
        zoom: 0.8;
    } */
`

const LabelCommit = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 10px;

    /* width: 400px; */
    height: fit-content;
    border: 1px solid #111;
    border-radius: 10px;

    box-shadow: 2.5px 2.5px #111;
    .label-currency {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;

        .currency {
            padding: 2px 5px;
            border: 1px solid #111;
            border-radius: 4px;
            cursor: pointer;
        }

        .active {
            background: #a57e4a8f;
            scale: 1.1;
        }
    }
    .label-recap {
        display: flex;
        gap: 5px;
        color: red;
    }
`
const WrapInput = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    div {
        min-width: 140px;
    }
`

const TimeLine = styled.div`
    display: flex;
    gap: 10px;

    .left-side {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .logo {
            width: 36px;
            height: 36px;

            img {
                width: 100%;
            }
        }

        .number-timeline {
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        /* 
        .active {
            background: #2db02d;
        } */
    }

    .right-side {
        span {
            font-size: 14px;
            color: #989898;
        }
    }

    .line-direction {
        width: 1px;
        height: 50px;
        border: 1px solid white;
    }
`
const Line = styled.div`
    padding: 0.4rem 0;
    border-bottom: 0.1rem solid white;
`
const WrapTitle = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    @media screen and (max-width: 402px) {
        flex-wrap: wrap;
    }
`
const Thumbnail = styled.div`
    width: 300px;
    height: 180px;
    img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media screen and (max-width: 920px) {
        width: 150px;
        height: 90px;
    }
    /* @media screen and (max-width: 576px) {
        width: 120px;
        height: 90px;
    } */
`
const LeftSide = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`
const RightSide = styled.div`
    display: flex;
    gap: 10px;
    span {
        /* flex-direction: column; */
    }

    @media screen and (max-width: 768px) {
        flex-direction: column;
        gap: 0;
        min-width: 89px;
    }
`

const DetailsHeader = styled.div`
    display: flex;
    padding: 0.2rem 0;
    flex-direction: column;
    justify-content: space-between;

    .title {
        display: flex;
        gap: 10px;
        font-size: 32px;
        font-weight: 800;
        align-items: center;
    }

    .details {
        color: #9c9999;
        font-size: 16px;
        /* max-width: 600px; */
    }

    .social-contact {
        display: flex;
        gap: 10px;
        div {
            cursor: pointer;
        }
    }
`

const Badge = styled.div<{ bgColor?: string }>`
    border: 1px solid #111;
    border-radius: 4px;
    padding: 3px 5px;
    font-size: 14px;
    color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ bgColor }) => (bgColor ? bgColor : '')};
`
const WrapBody = styled.div`
    display: flex;
    flex-direction: column;

    gap: 4.5rem;
`

const WrapBodyHead = styled.div`
    /* display: flex;
    justify-content: space-between;
    flex-wrap: wrap; */
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem 0 0;
    /* span {
        width: 180px;
    } */

    .details {
        /* font-size: 18px; */
        color: #ffffff85;
    }

    @media screen and (max-width: 962px) {
        /* padding: 30px 1.5rem; */
        justify-content: start;
    }
`

const WrapTimeLine = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    .requirement {
        color: #fff;

        padding: 20px 0;
        /* min-width: 600px; */
        span {
            color: #a2a0a0;
            div:nth-child(1) {
                padding-top: 10px;
            }
        }
        /* padding: 40px 0; */
    }

    /* padding-top: 2rem; */

    .title-body {
        padding-bottom: 2rem;
        font-size: 24px;
        font-weight: 800;
    }
    /* display: flex; */
    /* flex-direction: column; */
    /* gap: 20px; */
`
const LabelEconomics = styled(Row)`
    /* border: 1px solid white; */
    div {
        /* :nth-child(2 ), */
        div {
            min-width: 150px;
            padding: 10px 0;

            border: 1px solid white;
            :nth-child(2),
            :nth-child(4),
            :nth-child(6),
            :nth-child(8) {
                background: #a57e4a8f;
            }
        }
    }
    .economics {
        display: flex;
        flex-direction: column;
        /* gap: 10px; */
    }

    .left {
        text-align: right;
        div {
            padding-right: 10px;
        }
    }

    .right {
        text-align: left;
        div {
            padding-left: 10px;
        }
    }
`

const Input = styled.input`
    width: 100%;
    padding: 5px 10px;
    border: 1px solid #000000;
    height: 30px;
    border-radius: 6px;
    background: none;
    text-align: end;
    :focus {
        outline: none;
    }
    ::placeholder {
        color: #7b7777;
    }
    font-size: 14px;
    color: #111;
    @media screen and (max-width: 576px) {
        input {
            padding: 2px 5px;
        }
    }
    &#file-upload {
        display: none;
    }
`

export default LaunchpadDetails
