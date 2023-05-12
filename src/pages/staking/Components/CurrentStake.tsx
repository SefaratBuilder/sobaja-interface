import { Columns } from 'components/Layouts'
import { useActiveWeb3React } from 'hooks'
import {
    useAllPosition,
} from 'hooks/useStakingData'
import { useHarvest, useWithDraw } from 'hooks/useStakingFunction'
import React from 'react'
import styled from 'styled-components'
import { divNumberWithDecimal} from 'utils/math'

const CurrentStake = () => {
    const { account } = useActiveWeb3React()
    const AllStakingData = useAllPosition(account)

    return (
        <>
            <SwapContainer>
                <Title>Your current stake:</Title>
                <WrapDetails className="header-details">
                    <Details isTitle={true}>Amount</Details>
                    <Details isTitle={true}>Package</Details>
                    <Details isTitle={true}>End date</Details>
                    <Details isTitle={true}>Last Time Reward</Details>
                    <Details isTitle={true}>Claimable Reward</Details>
                    <Details isTitle={true}>Action</Details>
                </WrapDetails>
                {AllStakingData.map((position: any) => {
                    const lastTimeRewardFormat = new Date(
                        position.lastTimeReward,
                    )
                    const formattedLastTimeReward =
                        lastTimeRewardFormat.toLocaleDateString()
                    const timeEndFormat = new Date(position.timeEnd)
                    const formattedTimeEnd = timeEndFormat.toLocaleDateString()
                    const claimableReward = divNumberWithDecimal(
                        position.claimableReward,
                        18,
                    )

                    console.log(claimableReward);
                    

                    const positionIndex = Number(position.positionIndex)
                    const handleHarvest = useHarvest(positionIndex)
                    const handleWithDraw = useWithDraw(positionIndex)


                    return (
                        <WrapDetails>
                            <Details>{position.stakedAmount}</Details>
                            <Details>{position.period}</Details>
                            <Details>{formattedTimeEnd}</Details>
                            <Details>{formattedLastTimeReward}</Details>
                            <Details>{claimableReward}</Details>

                            <Details>
                                <div>
                                    {' '}
                                    <button onClick={handleWithDraw}>
                                        Withdraw
                                    </button>
                                </div>
                                <span></span>
                                <div>
                                    {' '}
                                    <button onClick={handleHarvest}>
                                        {' '}
                                        Harvest
                                    </button>
                                </div>
                            </Details>
                        </WrapDetails>
                    )
                })}
            </SwapContainer>
            <SwapContainer>
                <Title>History (Finished Staking)</Title>
                <WrapDetails className="header-details">
                    <Details isTitle={true}>Amount</Details>
                    <Details isTitle={true}>Package</Details>
                    <Details isTitle={true}>Start Time</Details>
                    <Details isTitle={true}>End date</Details>
                    <Details isTitle={true}>Total Reward</Details>
                </WrapDetails>

                {AllStakingData.map((position: any) => {
                    // Calculate totalReward for each staking position
                    const lastTimeRewardFormat = new Date(
                        position.lastTimeReward,
                    )
                    const formattedLastTimeReward =
                        lastTimeRewardFormat.toLocaleDateString()
                    const timeEndFormat = new Date(position.timeEnd)
                    const formattedTimeEnd = timeEndFormat.toLocaleDateString()

                    return (
                        <WrapDetails>
                            <Details>{position.stakedAmount}</Details>
                            <Details>{position.period}</Details>
                            <Details>{formattedTimeEnd}</Details>
                            <Details>{formattedLastTimeReward}</Details>
                            <Details>
                                {(() => {
                                    if (
                                        position.lastTimeReward -
                                            position.timeStart <
                                        30
                                    ) {
                                        return 0
                                    } else {
                                        return divNumberWithDecimal(
                                            position.totalReward,
                                            18,
                                        )
                                    }
                                })()}
                            </Details>
                        </WrapDetails>
                    )
                })}
            </SwapContainer>
        </>
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
    grid-template-columns: 0.2fr 0.2fr 0.25fr 0.35fr 0.2fr 0.2fr;
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
