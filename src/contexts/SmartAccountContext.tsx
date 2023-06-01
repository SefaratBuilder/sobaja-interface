import React, { useCallback, useContext } from 'react'
import { ethers } from 'ethers'
import { useAAFactory } from 'hooks/useAAFactory'
import { useAAEntryPointContract, useSmartAccountContract } from 'hooks/useContract'
import { useAAEntryPoint } from 'hooks/useAAEntryPoint'
import { useSingleCallResult } from 'states/multicall/hooks'
import { mulNumberWithDecimal } from 'utils/math'
import { Transaction } from "interfaces/smartAccount"
import { SimpleAccountAPI } from 'pantinho-aa'
import { AAFactory } from 'constants/addresses'
import { computeGasLimit } from 'utils'
import { useActiveWeb3React } from 'hooks'
import { ChainId } from 'interfaces'
import axios from 'axios'

interface SmartAccountContextType {
    contract: ethers.Contract | null,
    nonce: string | undefined,
    depositedFund: string | undefined,
    smartAccountAddress: string | undefined,
    isDeployed: boolean,
    sendTransactions: (txns: Transaction[]) => Promise<any>,
}
export const SmartAccountContext = React.createContext<SmartAccountContextType>({
    contract: null,
    nonce: undefined,
    depositedFund: undefined,
    smartAccountAddress: undefined,
    isDeployed: false,
    sendTransactions: async () => {},
})

export const useSmartAccountContext = () => useContext(SmartAccountContext)

export const SmartAccountProvider = ({ children }: any) => {
    const { smartAccountAddress, isDeployed } = useAAFactory()
    const contract = useSmartAccountContract(isDeployed ? smartAccountAddress : undefined)
    const entryPointContract = useAAEntryPointContract()
    const { depositedFund } = useAAEntryPoint()
    const { account, chainId, provider } = useActiveWeb3React()

    const nonceResult = useSingleCallResult(
        contract,
        'nonce',
        []
    )

    const depositFundTxn = useCallback((txnsLength: number) => {
        if (!entryPointContract) return
        const defaultVerificationGasLimit = 1_000_000
        const gasPrice = 3e8 // 0.3 Gwei
        const initGas = isDeployed ? 0 : 800_000
        const totalGasUse = (500000 * (txnsLength + 1) + defaultVerificationGasLimit + initGas) * gasPrice
        if (totalGasUse < Number(depositedFund)) return
        const diffFund = totalGasUse - Number(depositedFund)
        console.log(diffFund)
        return {
            target: entryPointContract.address,
            data: entryPointContract.interface.encodeFunctionData('depositTo', [smartAccountAddress]),
            // value: mulNumberWithDecimal(diffFund, 0)
            value: mulNumberWithDecimal(0.5, 18)
        }
    }, [
        smartAccountAddress, isDeployed, entryPointContract, depositedFund
    ])

    const executeUserOp = async (userOp: any, chainId: ChainId) => {
        try {
            const result = await axios.post('http://localhost:3000/user-operations/execute', {
                userOp,
                chainId
            })
            return result.data.hash as string
        } catch(err) {
            return ""
        }
    }

    const sendTransactions = useCallback(async (txns: Transaction[]) => {
        if (!provider || !entryPointContract || !chainId) return
        const ownerAddress = account
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
            chainId !== ChainId.ZKTESTNET && chainId !== ChainId.ZKMAINNET ? 100_000 : 3_000_000,
            !isDeployed ? 500000 : undefined
        )
        op.signature = await op.signature
        op.nonce = await op.nonce
        op.sender = await op.sender
        op.preVerificationGas = await op.preVerificationGas
        console.log('op', op)
        // //Test directly call on wallet
        // //Actually, we need to call to ERC4337 service to execute 
        // const callGasLimit = await entryPointContract.estimateGas.handleOps([op], ownerAddress)
        // return entryPointContract.handleOps([op], ownerAddress, { gasLimit: computeGasLimit(callGasLimit) })
        const hash = await executeUserOp(op, chainId)
        console.log('hashhhh', hash)
        return await provider.getTransaction(hash)
    }, [
        provider, entryPointContract, chainId, depositFundTxn
    ])

    return (
        <SmartAccountContext.Provider
            value={{
                contract,
                nonce: nonceResult?.result?.[0]?.toString() ?? '0',
                depositedFund,
                smartAccountAddress,
                isDeployed,
                sendTransactions,
            }}
        >
            {children}
        </SmartAccountContext.Provider>
    )
}