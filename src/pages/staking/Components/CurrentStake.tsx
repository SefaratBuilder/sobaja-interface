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
        <WrapCurrentStake>
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
            </WrapCurrentStake>
        </>
    )
}
const WrapCurrentStake = styled.div`
    max-width: 100%;
`;
const SwapContainer = styled(Columns)`
    /* margin: 0 auto 40px; */
    height: fit-content;
    max-height: 442px;
    width: 100%;
    

    max-width: 600px;
    border: 2px solid #003b5c;
    border-radius: 16px 16px 0 0;
    position: sticky;
    z-index: 0;
    overflow: scroll;
    margin-bottom: 40px;

    ::-webkit-scrollbar {
        display: none;
    }
    .title {
        color: rgba(136, 136, 136, 1);
    }

    .header-details {
        padding-top: 10px;
        padding-bottom: 10px;
    }
    @media (max-width: 500px) {
        width: 90%;
    }
    @media (max-width: 1250px) {
        margin: auto;
        margin-bottom: 50px;
    }
`
const Details = styled.div<{ isTitle?: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    /* text-align: center; */
    padding: 10px;
    @media screen and (max-width: 399px){
        font-size: 10px;
        padding: 5px;
    }
    @media screen and (min-width: 400px) and (max-width: 767px){
        font-size: 13px;
        padding: 5px;
    }
    // background: ${({ isTitle }) =>isTitle ? 'rgba(0,38,59,0.6)' : 'rgba(255,255,255,0.1)'};

    div {
        cursor: pointer;
    }
    span {
        border: 0.5px solid #fff;
        width: 50%;
    }
`
const WrapDetails = styled.div`
    // display: grid;
    // grid-template-columns: 0.2fr 0.2fr 0.25fr 0.35fr 0.2fr 0.2fr;
    display: flex;
    justify-content: space-between;
    text-align: center;
    border: 2px solid black;
    overflow: auto;
    background: rgba(0,38,59,0.6)
`
const Title = styled.div`
    max-width: 600px;
    // position: fixed;
    padding: 10px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: calc(10px);
    border-radius: 16px 16px 0 0;
    @media (max-width: 399px){
        font-size: 12px;
    }
    @media screen and (min-width: 400px) and (max-width: 767px){
        font-size: 14px;
    }
`

export default CurrentStake
