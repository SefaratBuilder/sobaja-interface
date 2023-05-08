import { Columns } from 'components/Layouts'
import React from 'react'
import styled from 'styled-components'

const CurrentStake = () => {
    const data = [
        {
            amount: '100',
            package: '30 days',
            endDate: '30-05-2023',
        },
        {
            amount: '100',
            package: '60 days',
            endDate: '30-09-2023',
        },
        {
            amount: '123',
            package: '365 days',
            endDate: '05-07-2023',
        },
        {
            amount: '200',
            package: '90 days',
            endDate: '14-05-2023',
        },
        {
            amount: '200',
            package: '90 days',
            endDate: '14-05-2023',
        },
        {
            amount: '200',
            package: '90 days',
            endDate: '14-05-2023',
        },
        {
            amount: '200',
            package: '90 days',
            endDate: '14-05-2023',
        },
        {
            amount: '200',
            package: '90 days',
            endDate: '14-05-2023',
        },
        {
            amount: '200',
            package: '90 days',
            endDate: '14-05-2023',
        },
    ]

    return (
        <SwapContainer>
            <Title>Your current stake:</Title>
            <WrapDetails className="header-details">
                <Details isTitle={true}>Amount</Details>
                <Details isTitle={true}>Package</Details>
                <Details isTitle={true}>End date</Details>
                <Details isTitle={true}>Action</Details>
            </WrapDetails>
            {data.map((d) => {
                return (
                    <WrapDetails>
                        <Details>{d.amount}</Details>
                        <Details>{d.package}</Details>
                        <Details>{d.endDate}</Details>
                        <Details>
                            <div>Withdraw</div>
                            <span></span>
                            <div>Harvest</div>
                        </Details>
                    </WrapDetails>
                )
            })}
        </SwapContainer>
    )
}

const SwapContainer = styled(Columns)`
    /* margin: 0 auto 40px; */
    height: fit-content;
    max-height: 442px;
    width: 100%;

    max-width: 450px;
    border: 2px solid #003b5c;
    border-radius: 16px 16px 0 0;
    position: sticky;
    z-index: 0;
    overflow: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
    .title {
        color: rgba(136, 136, 136, 1);
    }

    .header-details {
        padding-top: 40px;
    }
    @media (max-width: 500px) {
        width: 90%;
    }
`
const Details = styled.div<{ isTitle?: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* text-align: center; */
    padding: 5px 0;
    background: ${({ isTitle }) =>
        isTitle ? 'rgba(0,38,59,0.6)' : 'rgba(255,255,255,0.1)'};

    div {
        cursor: pointer;
    }
    span {
        border: 0.5px solid #fff;
        width: 50%;
    }
`
const WrapDetails = styled.div`
    display: grid;
    grid-template-columns: 0.2fr 0.2fr 0.25fr 0.35fr;
    border: 2px solid black;
`
const Title = styled.div`
    width: 446px;
    position: fixed;
    padding: 10px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: calc(10px);
    border-radius: 16px 16px 0 0;
`

export default CurrentStake
