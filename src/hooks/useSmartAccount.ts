import { Transaction } from "interfaces/smartAccount"
import { useCallback, useMemo } from "react"
import { useSingleCallResult } from "states/multicall/hooks"
import { useSmartAccountContract } from "./useContract"
import { SimpleAccountAPI } from 'pantinho-aa'
import { useActiveWeb3React } from "hooks"
import { AAEntryPoints, AAFactory } from "constants/addresses"
import { useAAEntryPointContract } from "./useContract"
import { useAAFactory } from './useAAFactory'
import { useAAEntryPoint } from './useAAEntryPoint'
import { computeGasLimit } from "utils"

export const useSmartAccount = () => {
    const { smartAccountAddress, isDeployed } = useAAFactory()
    const contract = useSmartAccountContract(isDeployed ? smartAccountAddress : undefined)
    const { provider, chainId, account } = useActiveWeb3React()
    const entryPointContract = useAAEntryPointContract()
    const { depositedFund } = useAAEntryPoint()

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

    const sendTransactions = useCallback(async (txns: Transaction[]) => {
        if (!provider || !entryPointContract || !owner || !contract || !chainId) return
        const ownerAddress = owner.result?.[0]
        const ownerSigner = provider.getSigner(ownerAddress)
        const walletAPI = new SimpleAccountAPI({
            provider: provider,
            entryPointAddress: entryPointContract.address,
            owner: ownerSigner,
            factoryAddress: AAFactory[chainId],
            index: 0,
            accountAddress: smartAccountAddress
        })

        const op = await walletAPI.createSignedUserOp(
            txns,
            nonceResult?.result?.[0]?.toString(),
            ownerSigner._address,
            !isDeployed ? 500000 : undefined
        )
        op.signature = await op.signature
        op.nonce = await op.nonce
        op.sender = await op.sender
        op.preVerificationGas = await op.preVerificationGas

        //Test directly call on wallet
        //Actually, we need to call to ERC4337 service to execute 
        const callGasLimit = await entryPointContract.estimateGas.handleOps([op], ownerAddress)
        return entryPointContract.handleOps([op], ownerAddress, { gasLimit: computeGasLimit(callGasLimit) })
    }, [
        provider, entryPointContract, owner, chainId, contract
    ])

    return useMemo(() => {
        return {
            contract,
            nonce: nonceResult?.result?.[0]?.toString() ?? '0',
            depositedFund,
            smartAccountAddress,
            isDeployed,
            sendTransactions,
        }
    }, [nonceResult, contract, sendTransactions, depositedFund, isDeployed])
}