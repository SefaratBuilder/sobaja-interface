import zIndex from '@mui/material/styles/zIndex'
import { Columns } from 'components/Layouts'
import { useActiveWeb3React } from 'hooks'
import { useAllPosition } from 'hooks/useStakingData'
import { useHarvest, useWithDraw } from 'hooks/useStakingFunction'
import { Token } from 'interfaces'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { div, divNumberWithDecimal } from 'utils/math'

const Position = ({
    position,
    setIsStakeToken,
    setUnstakeData,
    unstakeData,
    index,
}: {
    position: any
    setIsStakeToken: React.Dispatch<React.SetStateAction<boolean>>
    setUnstakeData: React.Dispatch<
        React.SetStateAction<{
            stake: string
            reward: string
            stakingId: string | undefined
            token: Token | undefined
            position: any
        }>
    >
    unstakeData: {
        stake: string
        reward: string
        stakingId: string | undefined
        token: Token | undefined
        position: any
    }
    index: number
}) => {
    const lastTimeRewardFormat = new Date(position.lastTimeReward)
    const formattedLastTimeReward = lastTimeRewardFormat.toLocaleDateString()
    const timeEndFormat = new Date(position.timeEnd)
    const formattedTimeEnd = timeEndFormat.toLocaleDateString()
    const claimableReward = divNumberWithDecimal(
        position.claimableReward,
        unstakeData.token?.decimals || 18,
    )
    const roundedClaimableReward = parseFloat(
        Number(claimableReward).toFixed(2),
    )

    const handleOnClick = () => {
        setIsStakeToken(false)
        setUnstakeData((i) => {
            return {
                ...i,
                stake: position?.stakedAmount || '0',
                stakingId: position?.positionIndex?.toString(),
                reward:
                    divNumberWithDecimal(
                        position?.claimableReward,
                        i.token?.decimals || 18,
                    ) || '0',
                position,
            }
        })
    }

    useEffect(() => {
        if (unstakeData.stakingId === position?.positionIndex?.toString()) {
            setUnstakeData((i) => {
                return {
                    ...i,
                    stake: position?.stakedAmount || '0',
                    stakingId: position?.positionIndex?.toString(),
                    reward:
                        divNumberWithDecimal(
                            position?.claimableReward,
                            i.token?.decimals || 18,
                        ) || '0',
                    position,
                }
            })
        }
    }, [position?.claimableReward])

    return (
        <WrapDetails isSelected={index === Number(unstakeData.stakingId)}>
            <Details>{position?.stakedAmount}</Details>
            <Details>{position?.period}</Details>
            <Details>{formattedTimeEnd}</Details>
            <Details>{formattedLastTimeReward}</Details>
            <Details>{roundedClaimableReward}</Details>
            <Details>
                <p className="btn-unstake" onClick={() => handleOnClick()}>
                    Unstake
                </p>
            </Details>

            {/* <Details>
                <div>
                    {' '}
                    <button onClick={handleWithDraw}>Withdraw</button>
                </div>
                <span></span>
                <div>
                    {' '}
                    <button onClick={handleHarvest}> Harvest</button>
                </div>
            </Details> */}
        </WrapDetails>
    )
}

const CurrentStake = ({
    setIsStakeToken,
    setUnstakeData,
    unstakeData,
}: {
    setIsStakeToken: React.Dispatch<React.SetStateAction<boolean>>
    setUnstakeData: React.Dispatch<
        React.SetStateAction<{
            stake: string
            reward: string
            stakingId: string | undefined
            token: Token | undefined
            position: any
        }>
    >
    unstakeData: {
        stake: string
        reward: string
        stakingId: string | undefined
        token: Token | undefined
        position: any
    }
}) => {
    const { account } = useActiveWeb3React()
    const { currentStake, history } = useAllPosition(account)
    const [scrollTopCurrentStake, setScrollTopCurrentStake] = useState(0)
    const [scrollTopHistory, setScrollTopHistory] = useState(0)

    const handleScroll = (event: any) => {
        setScrollTopCurrentStake(event.currentTarget.scrollTop)
    }
    const handleScrollHistory = (event: any) => {
        setScrollTopHistory(event.currentTarget.scrollTop)
    }

    return (
        <>
            <WrapCurrentStake>
                <SwapContainer
                    onScroll={handleScroll}
                    isScroll={scrollTopCurrentStake > 11}
                >
                    <Title>Your current stake:</Title>
                    <div className="overflow-details">
                        <WrapDetails className="header-details">
                            <Details isTitle={true}>Amount</Details>
                            <Details isTitle={true}>Package</Details>
                            <Details isTitle={true}>End date</Details>
                            <Details isTitle={true}>Last Time Reward</Details>
                            <Details isTitle={true}>Claimable Reward</Details>
                            <Details isTitle={true}>Action</Details>
                        </WrapDetails>
                        {currentStake.map((position: any, index: number) => {
                            return (
                                <Position
                                    key={index}
                                    position={position}
                                    setIsStakeToken={setIsStakeToken}
                                    setUnstakeData={setUnstakeData}
                                    unstakeData={unstakeData}
                                    index={position?.positionIndex}
                                />
                            )
                        })}
                    </div>
                </SwapContainer>
                <SwapContainer
                    onScroll={handleScrollHistory}
                    isScroll={scrollTopHistory > 11}
                >
                    <Title>History</Title>
                    <div className="overflow-details">
                        <WrapDetails className="header-details">
                            <Details isTitle={true}>Status</Details>
                            <Details isTitle={true}>Amount</Details>
                            <Details isTitle={true}>Package</Details>
                            <Details isTitle={true}>Start Time</Details>
                            <Details isTitle={true}>End date</Details>
                            <Details isTitle={true}>Total Reward</Details>
                        </WrapDetails>

                        {history.map((position: any, index: number) => {
                            // Calculate totalReward for each staking position
                            const lastTimeRewardFormat = new Date(
                                position.lastTimeReward,
                            )
                            const formattedLastTimeReward =
                                lastTimeRewardFormat.toLocaleDateString()
                            const timeEndFormat = new Date(position.timeEnd)
                            const formattedTimeEnd =
                                timeEndFormat.toLocaleDateString()
                            const totalReward = divNumberWithDecimal(
                                position.totalReward,
                                18,
                            )
                            const roundedTotalReward = parseFloat(
                                Number(totalReward).toFixed(2),
                            )

                            return (
                                <WrapDetails
                                    key={index}
                                    isSelected={
                                        index === Number(unstakeData.stakingId)
                                    }
                                >
                                    <Details>Finished</Details>
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
                                                return roundedTotalReward
                                            }
                                        })()}
                                    </Details>
                                </WrapDetails>
                            )
                        })}
                    </div>
                </SwapContainer>
            </WrapCurrentStake>
        </>
    )
}
const WrapCurrentStake = styled.div`
    max-width: 100%;
`
const SwapContainer = styled(Columns)<{ isScroll?: boolean }>`
    /* margin: 0 auto 40px; */
    height: fit-content;
    width: 100%;
    max-height: 350px;
    background: rgba(0, 38, 59, 0.6);
    /* max-width: 600px; */
    border: 2px solid #003b5c;
    border-radius: 8px 8px 0 0;
    position: relative;
    z-index: 0;
    margin-bottom: 40px;

    .overflow-details {
        overflow: scroll;

        ::-webkit-scrollbar {
            display: none;
        }
    }

    .line {
        border-bottom: 1px solid #fff;
    }

    .header-details {
        padding: 5px 5px;
        border-top-right-radius: ${({ isScroll }) =>
            isScroll ? '10px' : 'unset'};
        border-top-left-radius: ${({ isScroll }) =>
            isScroll ? '10px' : 'unset'};
    }

    @media (max-width: 711px) {
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
    padding: 10px 0;

    .btn-unstake {
        padding: 2px 5px;
        border: 1px solid #fff;
        cursor: pointer;
        border-radius: 4px;

        :hover {
            color: #111;
            background: #fff;
            box-shadow: 0 0 0 #111;
        }
    }
    @media screen and (max-width: 399px) {
        font-size: 10px;
        padding: 5px;
    }
    @media screen and (min-width: 400px) and (max-width: 767px) {
        font-size: 13px;
        padding: 5px;
    }

    div {
        cursor: pointer;
    }
    span {
        border: 0.5px solid #fff;
        width: 50%;
    }
`
const WrapDetails = styled.div<{ isSelected?: boolean }>`
    display: grid;
    grid-template-columns: 100px 80px 100px 100px 100px 100px;
    /* display: flex;
    justify-content: space-between; */
    text-align: center;
    /* border: 2px solid black; */
    /* background: ${({ isSelected }) =>
        isSelected ? '#302e2d82' : 'rgba(0,38,59,0.6)'}; */
    gap: 10px;
    padding: 0 5px;
`
const Title = styled.div`
    /* max-width: 600px; */

    width: 100%;
    position: sticky;
    top: 0;
    padding: 10px;
    background: #302e2d82;
    backdrop-filter: blur(5px);
    border-radius: 8px 8px 0 0;
    @media (max-width: 399px) {
        font-size: 12px;
    }
    @media screen and (min-width: 400px) and (max-width: 767px) {
        font-size: 14px;
    }
`

const Line = styled.div`
    padding: 0.4rem 0;
    border-bottom: 0.1rem solid white;
`

export default CurrentStake
