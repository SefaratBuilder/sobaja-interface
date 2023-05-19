import { useSmartAccountContext } from "contexts/SmartAccountContext"
import { useWeb3AuthContext } from "contexts/SocialLoginContext"
import { Transaction } from "interfaces/smartAccount"
import { useEffect, useMemo } from "react"
import { useAppState } from "states/application/hooks"
import { useSingleCallResult } from "states/multicall/hooks"
import { useSmartAccountContract } from "./useContract"
import { SimpleAccountAPI } from 'pantinho-aa'
import { useActiveWeb3React } from "hooks"
import { AAEntryPoints, AAFactory } from "constants/addresses"
import { ethers } from "ethers"
import { useAAEntryPointContract } from "./useContract"

export const useSmartAccount = () => {
    const { web3Provider } = useWeb3AuthContext()
    const { wallet, state } = useSmartAccountContext()
    const contract = useSmartAccountContract('0xCB7c527e22307529F803A5A3CB73BFe5E60b39d9')
    const { gasToken } = useAppState()
    const { library, chainId, account } = useActiveWeb3React()
    const entryPointContract = useAAEntryPointContract()

    const nonceResult = useSingleCallResult(
        contract,
        'nonce',
        []
    )
    const owner = useSingleCallResult(
        contract,
        'owner',
        []
    )
    console.log({ nonceResult, owner })
    const sendUserPaidTransaction = async (txns: Transaction[]) => {
        if (!wallet) throw ('Not connected')
        console.log({ txns })
        const feeQuotes = await wallet.getFeeQuotesForBatch({
            transactions: txns
        })
        console.log(txns, feeQuotes)
        const feeQuote = feeQuotes.find(fq => fq.address == gasToken.address)
        const paidTransaction = await wallet.createUserPaidTransactionBatch({
            transactions: txns,
            feeQuote: feeQuote || feeQuotes[0]
        })
        return await wallet.sendUserPaidTransaction({
            tx: paidTransaction
        })
    }
    const signAndSendUserOps = async (txns: Transaction) => {
        if (!library || !chainId || !account || !web3Provider || !entryPointContract) return
        const owner = library.getSigner(account)
        console.log(library)
        console.log(web3Provider)
        const walletAPI = new SimpleAccountAPI({
            provider: library,
            entryPointAddress: AAEntryPoints[chainId],
            owner,
            factoryAddress: AAFactory[chainId],
            index: 0,
            accountAddress: '0xCB7c527e22307529F803A5A3CB73BFe5E60b39d9'
        })
        console.log({ walletAPI, owner })
        const op = await walletAPI.createSignedUserOp({
            target: txns.to,
            data: txns.data ?? '0x',
            nonce: txns.nonce,
            value: txns.value ?? '0'
        })
        op.signature = await op.signature
        op.nonce = await op.nonce
        op.sender = await op.sender
        op.preVerificationGas = await op.preVerificationGas
        op.initCode = '0x'
        console.log({ op })
        const callResult = await entryPointContract.handleOps([op], account)
        console.log('callResult', callResult)
    }
    // console.log({ wallet })

    useEffect(() => {
        if (library)
            console.log('signer =>>>>>>>>>', library.getSigner())
    }, [library])
    return useMemo(() => {
        return {
            contract,
            data: {
                nonce: nonceResult?.result?.[0]?.toString() ?? '0'
            },
            sendUserPaidTransaction,
            signAndSendUserOps
        }
    }, [nonceResult, contract, sendUserPaidTransaction, signAndSendUserOps])
}