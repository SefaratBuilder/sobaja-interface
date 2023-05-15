import { Row } from 'components/Layouts'
import React from 'react'
import styled from 'styled-components'
import Soba from 'assets/token-logos/sbj.svg'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { handleTime } from 'utils/convertTime'
import { ILaunchpadDetails } from '..'
import { useQueryLaunchpad } from 'hooks/useQueryLaunchpad'
import { useToken, useTokens } from 'hooks/useToken'
import UnknowToken from 'assets/token-logos/dai.svg'
import { divNumberWithDecimal } from 'utils/math'
import { Token } from 'interfaces'
interface IListLaunchpad {
    setCurrentPage: React.Dispatch<
        React.SetStateAction<'Admin' | 'Create' | 'Details' | 'Infomation'>
    >
    setLpDetails: React.Dispatch<
        React.SetStateAction<ILaunchpadDetails | undefined>
    >
}

const ListLaunchpad = ({ setCurrentPage, setLpDetails }: IListLaunchpad) => {
    const { data } = useQueryLaunchpad()
    console.log('🤦‍♂️ ⟹ ListLaunchpad ⟹ data:', data)
    const { launchpads } = data
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

    console.log('🤦‍♂️ ⟹ ListLaunchpad ⟹ paymentCurrencies:', paymentCurrencies)

    const handleOnClick = (
        launchpad: (typeof launchpads)[0],
        lPadToken: Token | undefined,
        pmCur: Token | undefined,
    ) => {
        setCurrentPage('Details')

        setLpDetails({
            ...launchpad,
            img: '',
            lPadToken: lPadToken,
            paymentToken: pmCur,
        })
    }

    const isClosed = (time: string) => {
        return Number(time) <= new Date().getTime() / 1000
    }
    return (
        <Container>
            <Title>
                <p>Launchpad</p>
                <div
                    className="btn-create"
                    onClick={() => setCurrentPage('Create')}
                >
                    + Create market
                </div>
            </Title>
            <WrapLaunchpad>
                {launchpads &&
                    launchpads?.map((launchpad, index) => {
                        return (
                            <CardDetails>
                                <div className="thumbnail">
                                    <img src={UnknowToken} alt="launchpad" />
                                </div>
                                <Details>
                                    <div className="label">
                                        <WrapHeader>
                                            <LogoToken>
                                                <img src={UnknowToken} alt="" />
                                            </LogoToken>
                                            <div>
                                                <span>
                                                    {
                                                        launchpadTokens?.[index]
                                                            ?.symbol
                                                    }
                                                </span>
                                                <Badge
                                                    type={
                                                        isClosed(
                                                            launchpad.endTime,
                                                        )
                                                            ? 'closed'
                                                            : undefined
                                                    }
                                                >
                                                    {isClosed(launchpad.endTime)
                                                        ? 'Closed'
                                                        : 'On Sale'}
                                                </Badge>
                                            </div>
                                            <div className="name-token">
                                                {/* {"launchpad.token.name"} */}
                                                {launchpadTokens?.[index]?.name}
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
                                                    launchpadTokens?.[index]
                                                        ?.symbol
                                                }{' '}
                                                -{' '}
                                                {divNumberWithDecimal(
                                                    launchpad.price,
                                                    18,
                                                )}{' '}
                                                USDC
                                            </div>
                                            <div>
                                                Start Time:{' '}
                                                {handleTime(
                                                    launchpad.startTime,
                                                )}
                                            </div>
                                            <div>
                                                End Time:{' '}
                                                {handleTime(launchpad.endTime)}
                                            </div>
                                            <div>
                                                Payment Crypto:{' '}
                                                {
                                                    launchpadTokens?.[index]
                                                        ?.symbol
                                                }
                                            </div>

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
                                                    type="launch-pad"
                                                />
                                            </div>
                                        </WrapDetails>
                                    </div>
                                </Details>
                            </CardDetails>
                        )
                    })}
            </WrapLaunchpad>
        </Container>
    )
}

const Container = styled.div`
    margin: 0 auto 40px;
    max-width: 1440px;

    padding: 30px 0.5rem;
`
const Title = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 4.5rem;

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
    justify-content: space-evenly;
    flex-wrap: wrap;
    color: #111;
    gap: 25px;
    flex-direction: row-reverse;
`
const CardDetails = styled(Row)`
    border: 1px solid black;
    border-radius: 10px;
    background: #fff;
    /* gap: 5.5rem; */
    display: block;
    max-width: 350px;

    .thumbnail {
        /* min-width: 550px; */
        /* max-height: 300px; */
        /* display: flex; */
        /* align-items: center; */
        border-bottom: 1px solid #111;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const Details = styled.div`
    /* width: 400px; */
    /* min-width: 400px; */
    padding: 0 1.5rem;
    max-width: 320px;

    .label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* min-height: 300px; */
        span {
            font-size: 22px;
        }
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

const Badge = styled.div<{ type?: string }>`
    border: 1px solid #111;
    border-radius: 4px;
    padding: 3px 5px;
    font-size: 12px;
    color: #111;
    display: flex;
    justify-content: center;
    background: ${({ type }) => (type ? 'red' : 'aquamarine')};
`

const WrapDetails = styled.div`
    /* padding-top: 1rem; */
    display: flex;
    flex-direction: column;
    gap: 8px;
    /* padding: 1rem 0.5rem; */
    padding: 0 1rem;
    font-size: 14px;

    .btn-view {
        /* width: 50%; */
        padding: 0 0 1rem;
    }
`

export default ListLaunchpad
