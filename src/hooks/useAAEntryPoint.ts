import { useMemo } from "react"
import { useAppState } from "states/application/hooks"
import { useSingleCallResult } from "states/multicall/hooks"
import { useAAFactory } from './useAAFactory';
import { useAAEntryPointContract } from "./useContract";

export const useAAEntryPoint = () => {
    const { smartAccountAddress } = useAAFactory()
    const contract = useAAEntryPointContract()

    const depositInfo = useSingleCallResult(
        contract,
        'getDepositInfo',
        [smartAccountAddress]
    )

    return useMemo(() => {
        return {
            contract,
            depositedFund: depositInfo?.result?.[0]?.deposit?.toString() ?? '0'
        }
    }, [depositInfo])
}