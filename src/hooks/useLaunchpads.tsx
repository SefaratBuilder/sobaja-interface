import { useMemo } from "react"
import { useSingleCallResult } from "states/multicall/hooks"
import { useFairLaunchContract } from "./useContract"
import { useToken } from "./useToken"

export enum LaunchpadResult {
    Cancel = "Cancel",
    Fairlure = "Fairlure",
    Success = "Success",
    Overflow = "Overflow"
}

export const LaunchpadResultObj: { [n in number]: LaunchpadResult } = {
    0: LaunchpadResult.Cancel,
    1: LaunchpadResult.Fairlure,
    2: LaunchpadResult.Success,
    3: LaunchpadResult.Overflow
}

export interface LaunchpadInfo {
    startTime: number,
    endTime: number,
    hardcap: number,
    softcap: number,
    overflow: number,
    individualCap: number,
    totalTokenSale: number,
    totalCommitment: number,
    finalized: boolean,
    launchpadResult: LaunchpadResult
}

export const useLaunchpadInfo = (address: string | undefined) : LaunchpadInfo | undefined => {
    const contract = useFairLaunchContract(address)
    const launchpadInfo = useSingleCallResult(
        contract,
        'getLaunchpadInfo'        
    )

    return useMemo(() => {
        if(!launchpadInfo.result) return undefined
        const info = launchpadInfo.result[4]
        const status = launchpadInfo.result[5]
        console.log({status})
        if(!info || !status) return undefined
        return {
            startTime: Number(info.startTime),
            endTime: Number(info.endTime),
            hardcap: Number(info.hardcap) / 1e18,
            softcap: Number(info.softcap) / 1e18,
            overflow: Number(info.overflow) / 1e18,
            individualCap: Number(info.individualCap) / 1e18,
            totalTokenSale: Number(info.totalTokenSale) / 1e18,
            totalCommitment: Number(status.totalCommitment) / 1e18,
            finalized: status.finalized,
            launchpadResult: LaunchpadResultObj[status.result]
        }
    },[launchpadInfo])
}