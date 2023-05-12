import { useSmartAccountContext } from "contexts/SmartAccountContext"
import { Transaction } from "interfaces/smartaccount"
import { useMemo } from "react"
import { useAppState } from "states/application/hooks"
import { useSingleCallResult } from "states/multicall/hooks"
import { useSmartAccountContract } from "./useContract"

export const useSmartAccount = () => {
    const { wallet } = useSmartAccountContext()
    const contract = useSmartAccountContract(wallet?.address)
    const { gasToken } = useAppState()

    const nonce = useSingleCallResult(
        contract,
        'nonce',
        []
    )

    const sendUserPaidTransaction = async (txns: Transaction[]) => {
        if (!wallet) throw ('Not connected')
        const feeQuotes = await wallet.getFeeQuotesForBatch({
            transactions: txns
        })
        const feeQuote = feeQuotes.find(fq => fq.address == gasToken.address)
        const paidTransaction = await wallet.createUserPaidTransactionBatch({
            transactions: txns,
            feeQuote: feeQuote || feeQuotes[0]
        })
        return await wallet.sendUserPaidTransaction({
            tx: paidTransaction
        })
    }

    return useMemo(() => {
        return {
            contract,
            data: {
                nonce: nonce?.result?.[0]?.toString()
            },
            sendUserPaidTransaction
        }
    }, [nonce])
}