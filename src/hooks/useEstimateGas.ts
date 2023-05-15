import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Contract } from '@ethersproject/contracts'

export function useEstimateGas(
    contract: Contract | null,
    method: string | undefined | any,
    args: Function,
) {
    const [gasEstimate, setGasEstimate] = useState<BigNumber | undefined>(
        undefined,
    )

    useEffect(() => {
        console.log('contract:', contract)
        console.log('method:', method)
        const getGasEstimate = async () => {
            try {
                const gasEstimate = await contract?.estimateGas[method](
                    ...args().args,
                    {
                        value: args().value,
                    },
                )
                setGasEstimate(gasEstimate)
            } catch (e) {
                console.log(e)
                setGasEstimate(undefined)
            }
        }

        getGasEstimate()
    }, [contract, method, args])

    return gasEstimate
}
