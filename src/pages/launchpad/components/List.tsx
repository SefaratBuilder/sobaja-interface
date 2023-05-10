import { Row } from 'components/Layouts'
import React from 'react'
import styled from 'styled-components'
import Soba from 'assets/token-logos/sbj.svg'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { handleTime } from 'utils/convertTime'
import { ILaunchpadDetails } from '..'
interface IListLaunchpad {
    setCurrentPage: React.Dispatch<
        React.SetStateAction<'Admin' | 'Create' | 'Details' | 'Infomation'>
    >
    setLpDetails: React.Dispatch<
        React.SetStateAction<ILaunchpadDetails | undefined>
    >
}

const ListLaunchpad = ({ setCurrentPage, setLpDetails }: IListLaunchpad) => {
    const data = [
        {
            url: 'https://static.okx.com/cdn/grow/jumpstart/projects/20230413/1681376287536.png?x-oss-process=image/format,webp',
            token: {
                symbol: 'SUI ',
                name: 'SUI Token',
                url: 'https://static.okx.com/cdn/oksupport/asset/currency/icon/sui20230414104031.png?x-oss-process=image/format,webp',
            },
            totalReward: '999999999',
            rateToUSD: '99',
            payment: ['ETH', 'USDC'],
            startDate: '1683085885',
            endDate: '1683363368',
            softCap: '1',
            hardCap: '100',
            price: '0.1',
            individualCap: '5',
            overflow: '10',
            totalToken: '40',
            details: 'Sui is a high throughput, low latency Layer 1 blockchain',
        },
        {
            url: 'https://static.okx.com/cdn/oksupport/active/ieo/20220422/1650607744430.png?x-oss-process=image/format,webp',
            token: {
                symbol: 'TAKI',
                name: 'Taki',
                url: 'https://static.okx.com/cdn/oksupport/asset/currency/icon/taki.png?x-oss-process=image/format,webp',
            },
            totalReward: '999999999',
            rateToUSD: '100',
            payment: ['ETH', 'USDT'],
            startDate: '1683085885',
            endDate: '1683363368',
            softCap: '1',
            hardCap: '200',
            price: '0.1',
            individualCap: '1',
            overflow: '10',
            totalToken: '40',
            details:
                'Taki is a global social network where anyone can earn social crypto tokens simply by participating within the community',
        },
        {
            url: 'https://static.okx.com/cdn/oksupport/active/ieo/20220414/1649904954608.png?x-oss-process=image/format,webp',
            token: {
                symbol: 'ELT',
                name: 'Element Black',
                url: 'https://static.okx.com/cdn/oksupport/asset/currency/icon/elt.png?x-oss-process=image/format,webp',
            },
            totalReward: '999999999',
            rateToUSD: '100',
            payment: ['ETH'],
            startDate: '1683085885',
            endDate: '1683363368',
            softCap: '1',
            hardCap: '300',
            price: '0.1',
            individualCap: '1',
            overflow: '10',
            totalToken: '40',
            details:
                'Element Black (ELT) is a Social-Fi NFT Game development company dedicated to building an NFT 2.0/Create-To-Earn ecosystem',
        },
    ]
    const handleOnClick = (launchpad: (typeof data)[0]) => {
        setCurrentPage('Details')
        setLpDetails({
            img: launchpad.url,
            currencies: launchpad.payment,
            timeline: [''],

            token: {
                address: launchpad.token.name,
                symbol: launchpad.token.symbol,
                // name: launchpad.token.name,
            },
            details: launchpad.details,
            paymentCurrency: ['ETH', 'USDC'],
            softCap: launchpad.softCap,
            hardCap: launchpad.hardCap,
            price: launchpad.price,
            individualCap: launchpad.individualCap,
            overflow: launchpad.overflow,
            totalToken: launchpad.totalToken,
        })
    }
    return (
        <Container>
            <Title>
                <p>Launchpad</p>
            </Title>
            <WrapLaunchpad>
                {data.map((launchpad, index) => {
                    return (
                        <CardDetails>
                            <div className="thumbnail">
                                <img src={launchpad.url} alt="launchpad" />
                            </div>
                            <Details>
                                <div className="label">
                                    <WrapHeader>
                                        <LogoToken>
                                            <img
                                                src={launchpad.token.url}
                                                alt=""
                                            />
                                        </LogoToken>
                                        <div>
                                            <span>
                                                {launchpad.token.symbol}
                                            </span>
                                            <Badge
                                                type={
                                                    index !== 2
                                                        ? undefined
                                                        : 'closed'
                                                }
                                            >
                                                {index !== 2
                                                    ? 'On Sale'
                                                    : 'Closed'}
                                            </Badge>
                                        </div>
                                        <div className="name-token">
                                            {launchpad.token.name}
                                        </div>
                                    </WrapHeader>
                                    <WrapDetails>
                                        <div>
                                            Total Reward:{' '}
                                            {launchpad.totalReward}
                                        </div>
                                        <div>
                                            Sale Price: 1 Test -{' '}
                                            {launchpad.rateToUSD} USDC
                                        </div>
                                        <div>
                                            Start Time:{' '}
                                            {handleTime(launchpad.startDate)}
                                        </div>
                                        <div>
                                            End Time:{' '}
                                            {handleTime(launchpad.endDate)}
                                        </div>
                                        <div>
                                            Payment Crypto:{' '}
                                            {launchpad.payment.reduce(
                                                (a, b) => a + ' | ' + b,
                                            )}
                                        </div>

                                        <div className="btn-view">
                                            <PrimaryButton
                                                name="View more"
                                                onClick={() =>
                                                    handleOnClick(launchpad)
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
    padding: 30px 0.5rem;
`
const Title = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 4.5rem;
    p {
        font-weight: 800;
        font-size: 34px;
    }
`
const WrapLaunchpad = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    color: #111;
    gap: 25px;
`
const CardDetails = styled(Row)`
    border: 1px solid black;
    border-radius: 10px;
    background: #fff;
    display: flex;
    gap: 5.5rem;
    max-width: 1200px;

    .thumbnail {
        min-width: 750px;
        max-height: 300px;
        display: flex;
        align-items: center;
        border: 3px solid #fff;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const Details = styled.div`
    width: 100%;
    max-width: 500px;

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
    padding: 1rem 0;
    gap: 8px;
    .btn-view {
        width: 50%;
    }
`

export default ListLaunchpad
