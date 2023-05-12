import { useMemo } from "react"
import { useSingleCallResult } from "states/multicall/hooks"
import { useSmartAccountContract } from "./useContract"

export const useSmartAccount = (address: string | undefined) => {
    const contract = useSmartAccountContract(address)

    const nonce = useSingleCallResult(
        contract,
        'nonce',
        []
    )
    return useMemo(() => {
        return {
            contract,
            data: {
                nonce: nonce?.result?.[0]?.toString()
            }
        }
    }, [nonce])
}