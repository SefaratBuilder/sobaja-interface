import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import Success from 'assets/icons/success.svg'
import { Row } from 'components/Layouts'
import { handleTime } from 'utils/convertTime'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { ILaunchpadDetails } from '..'

interface IDetails {
    details: ILaunchpadDetails | undefined
    setCurrentPage: React.Dispatch<
        React.SetStateAction<'Admin' | 'Create' | 'Details' | 'Infomation'>
    >
}

const LaunchpadDetails = ({ details, setCurrentPage }: IDetails) => {
    const currencies = details?.currencies
    const [currencySelected, setCurrencySelected] = useState('ETH')
    const timeLine = [
        {
            time: '1683700636',
            title: 'Soba Holding Calculation Period',
        },
        {
            time: '1683700896',
            title: 'Subscription Period',
        },
        {
            time: '1685501136',
            title: 'Calculation Period',
        },
        {
            time: '1685511136',
            title: 'Final Token Distribution',
        },
    ]
    const currentTimeline = useMemo(() => {
        const currentTs = new Date().getTime() / 1000
        let i = 0
        let result = timeLine[0]
        timeLine.map((tl, index) => {
            if (Number(tl.time) < currentTs) {
                console.log({ index })
                i = index
                result = tl
            }
        })
        return { ...result, index: i }
    }, timeLine)

    return (
        <Container>
            <div
                className="btn-back"
                onClick={() => setCurrentPage('Infomation')}
            >
                {' '}
                {'<'} Launchpad
            </div>
            <WrapTitle>
                <LeftSide>
                    <Thumbnail>
                        <img src={details?.img} alt="" />
                    </Thumbnail>
                    <DetailsHeader>
                        <div>
                            <div className="title">
                                <div>{details?.token.symbol}</div>
                                <Badge>On sale</Badge>
                            </div>
                            <div className="details">{details?.details}</div>
                        </div>
                        <div className="social-contact">
                            <div>Website</div>
                            <div>Twitter</div>
                        </div>
                    </DetailsHeader>
                </LeftSide>
                <RightSide>
                    End date: {handleTime(timeLine[timeLine.length - 1].time)}
                </RightSide>
            </WrapTitle>
            <Line></Line>
            <WrapBody>
                <WrapBodyHead>
                    <div>
                        <div className="title">Type:</div>
                        <div className="details">Subscription</div>
                    </div>
                    <div>
                        <div>Token Sale Price:</div>
                        <div className="details">1 Soba = 100 USD</div>
                    </div>
                    <div>
                        <div>Tokens Offered:</div>
                        <div className="details">50,000,000 Soba</div>
                    </div>
                    <div>
                        <div>Single Initial Investment:</div>
                        <div className="details">10 Soba</div>
                    </div>
                    <div>
                        <div>Hard cap per user:</div>
                        <div className="details">30,000 Soba</div>
                    </div>
                </WrapBodyHead>

                <WrapTimeLine>
                    <div>
                        <div className="title-body">Subscription Timeline</div>
                        {timeLine.map((tl, i) => {
                            return (
                                <TimeLine>
                                    <div className="left-side">
                                        <div className={`logo number-timeline`}>
                                            {i < currentTimeline.index + 1 ? (
                                                <img src={Success} alt="" />
                                            ) : (
                                                i + 1
                                            )}
                                        </div>
                                        {i !== timeLine.length - 1 && (
                                            <div>
                                                <div className="line-direction"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="right-side">
                                        <div>{tl.title}</div>
                                        <span>{handleTime(tl.time, true)}</span>
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
                                {/* <div>Total commitment</div> */}
                                <div>Total token sale</div>
                                <div>Payment</div>
                                <div>Finalized</div>
                            </div>
                            <div className="economics right">
                                <div>{details?.hardCap || '30,000'}</div>
                                <div>{details?.softCap || '1,000'}</div>
                                <div>{details?.individualCap || '1,000'}</div>
                                <div>{details?.totalToken || '1,000'}</div>
                                <div>
                                    {details?.paymentCurrency?.reduce(
                                        (a, b) => a + ' | ' + b,
                                    ) || 'ETH'}
                                </div>
                                <div>{'????'}</div>
                            </div>
                        </LabelEconomics>
                    </div>
                </WrapTimeLine>
                <WrapCommit>
                    <div className="general-sale">
                        <div className="title-commit">General sale</div>
                        <LabelCommit className="label-commit">
                            <WrapInput>
                                <div>Commit amount: </div>
                                <Input />
                            </WrapInput>
                            <div className="label-currency">
                                <div>Payment currency: </div>
                                {currencies &&
                                    currencies.map((crc) => {
                                        return (
                                            <div
                                                className={`currency ${
                                                    crc === currencySelected
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    setCurrencySelected(crc)
                                                }
                                            >
                                                {crc}
                                            </div>
                                        )
                                    })}
                            </div>
                            <div className="label-recap">
                                <div>Recap: </div>
                                <div>5 ETH - 30 Soba</div>
                            </div>
                            <PrimaryButton
                                name="Confirm"
                                onClick={() => {}}
                                type="launch-pad"
                            />
                        </LabelCommit>
                    </div>
                    <div className="requirement">
                        <div className="title-commit">Entry requirements</div>
                        <span>
                            <div>ID verification ≥ Level 2</div>
                            <div>Project allowlist verification</div>
                        </span>
                    </div>
                </WrapCommit>
            </WrapBody>
        </Container>
    )
}

const Container = styled.div`
    padding: 30px 8rem;
    .btn-back {
        cursor: pointer;
        padding: 0 0 1rem;
    }
`
const WrapCommit = styled.div`
    display: flex;
    justify-content: space-between;
    color: #111;
    .title-commit {
        font-size: 24px;
        font-weight: bolder;
    }

    .general-sale {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #fff;
        padding: 20px 20px 30px;
        gap: 10px;
        border-radius: 15px;
        /* padding: 10px 0 15px; */
    }

    .requirement {
        color: #fff;

        padding: 20px 0;
        min-width: 600px;
        span {
            color: #a2a0a0;
            div:nth-child(1) {
                padding-top: 10px;
            }
        }
        /* padding: 40px 0; */
    }
`
const LabelCommit = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 10px;

    width: 400px;
    height: fit-content;
    border: 1px solid #111;
    border-radius: 10px;

    box-shadow: 2.5px 2.5px #111;
    .label-currency {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

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
        gap: 10px;
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
`
const LeftSide = styled.div`
    display: flex;
    gap: 20px;
`
const RightSide = styled.div`
    display: flex;
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
        max-width: 600px;
    }

    .social-contact {
        display: flex;
        gap: 10px;
        div {
            cursor: pointer;
        }
    }
`

const Badge = styled.div<{ type?: string }>`
    border: 1px solid #111;
    border-radius: 4px;
    padding: 3px 5px;
    font-size: 14px;
    color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ type }) => (type ? 'red' : 'aquamarine')};
`
const WrapBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4.5rem;
`

const WrapBodyHead = styled.div`
    display: flex;
    /* justify-content: space-between; */
    gap: 10rem;
    padding: 2rem 0 0;
    div {
        .details {
            font-size: 18px;
            color: #ffffff85;
        }
    }
`

const WrapTimeLine = styled.div`
    display: flex;
    justify-content: space-between;

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
        min-width: 300px;
        /* :nth-child(2 ), */
        div {
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
