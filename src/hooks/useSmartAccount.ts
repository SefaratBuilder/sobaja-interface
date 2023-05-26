import { mulNumberWithDecimal } from 'utils/math';
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

    const depositFundTxn = useCallback((txnsLength: number) => {
        const defaultGasPerTxn = 500_000
        const defaultVerificationGasLimit = 1_000_000
        const gasPrice = 3e8 // 0.3 Gwei
        const initGas = isDeployed ? 0 : 800_000
        const totalGasUse = (500000 * (txnsLength + 1) + defaultVerificationGasLimit + initGas) * gasPrice
        console.log("total gas use", totalGasUse)
        console.log('asdaskjdhasdjkashdaksdjhasdksad')
        if (totalGasUse < Number(depositedFund)) return console.log('asdo823719283712893712983')
        console.log('asdsadasdasdasdadasdasdsadasdasdasdasd')
        const diffFund = totalGasUse - Number(depositedFund)
        console.log('smartAccount address', mulNumberWithDecimal(diffFund, 0))
        return {
            target: entryPointContract.address,
            data: entryPointContract.interface.encodeFunctionData('depositTo', [smartAccountAddress]),
            value: mulNumberWithDecimal(diffFund, 0)
        }
    }, [
        smartAccountAddress, isDeployed, entryPointContract, depositedFund
    ])

    const sendTransactions = useCallback(async (txns: Transaction[]) => {
        if (!provider || !entryPointContract || !owner || !chainId) return
        const ownerAddress = owner.result?.[0] || account
        const ownerSigner = provider.getSigner(ownerAddress)
        const walletAPI = new SimpleAccountAPI({
            provider: provider,
            entryPointAddress: entryPointContract.address,
            owner: ownerSigner,
            factoryAddress: AAFactory[chainId],
            index: 0,
            accountAddress: smartAccountAddress
        })
        //add deposit into head of array txns
        // const depositTxn = depositFundTxn(txns.length)
        // if (depositTxn) {
        //     console.log('hahah')
        //     txns.unshift(depositTxn)
        // }
        console.log('txns', txns)
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
        console.log('opppppp', op)

        //Test directly call on wallet
        //Actually, we need to call to ERC4337 service to execute 
        const callGasLimit = await entryPointContract.estimateGas.handleOps([op], ownerAddress)
        console.log('callGasLimit', callGasLimit)
        return entryPointContract.handleOps([op], ownerAddress, { gasLimit: computeGasLimit(callGasLimit) })
    }, [
        provider, entryPointContract, owner, chainId, depositFundTxn
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
    }, [nonceResult, contract, sendTransactions, depositedFund, isDeployed, smartAccountAddress])
}