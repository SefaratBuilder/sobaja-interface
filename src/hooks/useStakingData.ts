import { useActiveWeb3React } from 'hooks'
import React, { useMemo } from 'react'
import {
    useMultipleContractSingleData,
    useSingleCallResult,
    useSingleContractMultipleData,
} from 'states/multicall/hooks'
import { isAddress } from 'utils'
import { useContract, useStakingContract } from './useContract'
import { divNumberWithDecimal } from 'utils/math'

export function usePosition(
    address: string | undefined | null,
    positionIndex: Number | undefined,
) {
    address = address && isAddress(address) ? address : undefined
    const stakingContract = useStakingContract()

    const PositionResult = useSingleCallResult(
        stakingContract,
        'getPositionsByIndex',
        [address, positionIndex?.toString()],
    )

    const ClaimableResult = useSingleCallResult(
        stakingContract,
        'displayClaimableReward',
        [address, positionIndex?.toString()],
    )

    return useMemo(() => {
        const positionIndex = Number(PositionResult.result?.[0]?.positionId)
        const period = Number(PositionResult.result?.[0]?.period)
        const stakedAmount = Number(PositionResult.result?.[0]?.stakedAmount)
        const timeEnd = Number(PositionResult.result?.[0]?.[4])
        const lastTimeReward = Number(
            PositionResult.result?.[0]?.lastTimeReward,
        )
        const claimableReward = Number(ClaimableResult.result?.[0])

        if (
            !positionIndex ||
            !period ||
            !stakedAmount ||
            !timeEnd ||
            !lastTimeReward ||
            !claimableReward
        )
            return
        return {
            positionIndex,
            period,
            stakedAmount,
            timeEnd,
            lastTimeReward,
            claimableReward,
        }
    }, [address, PositionResult, ClaimableResult])
}

export function useClaimableReward(
    address: string | undefined | null,
    positionIndex: Number | undefined | null,
) {
    address = address && isAddress(address) ? address : undefined
    const stakingContract = useStakingContract()

    const ClaimableResult = useSingleCallResult(
        stakingContract,
        'displayClaimableReward',
        [address, positionIndex?.toString()],
    )

    console.log('From useClaimableReward hook:', ClaimableResult.result)

    console.log(ClaimableResult.result)
    const SingleClaimableReward = useMemo(() => {
        if (ClaimableResult.result) {
            const claimableReward = Number(ClaimableResult.result?.[0])
            console.log(claimableReward)

            if (!claimableReward) return
            return {
                claimableReward,
            }
        } else return
    }, [address, ClaimableResult.result])
    return SingleClaimableReward
}

export function useAllPosition(address: string | undefined | null) {
    address = address && isAddress(address) ? address : undefined
    const stakingContract = useStakingContract()

    const AllPositionResult = useSingleCallResult(
        stakingContract,
        'getUserStakingHistory',
        [address],
    )
    console.log("🤦‍♂️ ⟹ useAllPosition ⟹ AllPositionResult:", AllPositionResult)
    const ids = AllPositionResult?.result?.[0]
        ? AllPositionResult?.result?.[0]?.map((pos: any) => {
            return [address, pos?.positionId?.toString()]
        })
        : undefined

    const ClaimableRewards = useSingleContractMultipleData(
        stakingContract,
        'displayClaimableReward',
        ids,
    )

    const TotalRewards = useSingleContractMultipleData(
        stakingContract,
        'getTotalReward',
        ids,
    )

    // const SetStakingRates = useSingleContractMultipleData(
    //     stakingContract,
    //     'setStakingRate',
    //     ids
    // 
    const AllPosition = useMemo(() => {
        if (AllPositionResult.result) {
            return AllPositionResult.result[0].map(
                (position: any, index: number) => {
                    try {
                        const positionIndex = parseInt(position.positionId)
                        const period = parseInt(position.period)
                        const stakedAmount = divNumberWithDecimal(
                            parseFloat(position.stakedAmount),
                            18,
                        )
                        const timeEnd = new Date(
                            parseInt(position.timeEnd) * 1000,
                        )
                        const timeStart = new Date(
                            parseInt(position.timeStart) * 1000,
                        )
                        const lastTimeReward = new Date(
                            parseInt(position.lastTimeReward) * 1000,
                        )
                        const claimableReward =
                            ClaimableRewards?.[positionIndex]?.result?.[0]

                        const totalReward =
                            TotalRewards?.[positionIndex]?.result?.[0]
                        return {
                            positionIndex,
                            period,
                            stakedAmount,
                            timeEnd,
                            timeStart,
                            lastTimeReward,
                            claimableReward:
                                claimableReward && Number(claimableReward),
                            totalReward: totalReward && Number(totalReward)
                            // SetStakingRates
                        }
                    } catch (error) {
                        console.log(error)
                    }
                },
            )
        } else {
            return []
        }
    }, [address, AllPositionResult.result])

    const currentStake = useMemo(() => {
        return AllPosition && AllPosition?.length > 0 ? AllPosition.filter((position: any) => Number(position?.timeEnd) !== Number(position?.lastTimeReward)) : []
    }, [AllPosition])
    console.log("🤦‍♂️ ⟹ currentStake ⟹ currentStake:", currentStake)
    const history = useMemo(() => {
        return AllPosition && AllPosition?.length > 0 ? AllPosition.filter((position: any) => Number(position?.timeEnd) === Number(position?.lastTimeReward)) : []
    }, [AllPosition])

    return { currentStake, history }
}
