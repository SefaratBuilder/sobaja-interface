import { useState, useEffect } from 'react'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import useDebounce from './useDebounce'
import { ZERO_ADDRESS } from 'constants/index'

type SwapArgs = {
    args: (string | string[] | null | undefined)[]
    value: string
}

export function useEstimateGas(
    contract: Contract | null,
    method: string | undefined | any,
    args: () => SwapArgs | undefined | void,
) {
    const [gasUsed, setGasUsed] = useState<BigNumber | undefined>(undefined)
    const [latestArgs, setLatestArgs] = useState<SwapArgs | undefined>()

    const delay = 2000 // debounce delay 3s

    useEffect(() => {
        const currentArgs = args()
        if (currentArgs) {
            setLatestArgs(currentArgs)
        }
    }, [args])

    // create debounce version
    const debouncedContract = useDebounce(contract, delay)
    const debouncedMethod = useDebounce(method, delay)
    const debouncedArgs = useDebounce(latestArgs, delay)

    useEffect(() => {
        const getGasEstimate = async () => {
            try {
                const argsObj = debouncedArgs
                const med = debouncedMethod

                if (!argsObj) {
                    throw new Error('Invalid args parameter')
                }

                const gasEstimate = await debouncedContract?.estimateGas?.[
                    med
                ]?.(...argsObj.args, {
                    value: argsObj.value,
                })
                if (!gasEstimate) {
                    throw new Error('Gas estimate not found')
                }
                const gasPrice =
                    await debouncedContract?.provider?.getGasPrice()
                if (!gasPrice) {
                    throw new Error('Gas price not found')
                }
                console.log('Real gas', formatUnits(gasPrice))

                const gasUsed = gasEstimate.mul(gasPrice)
                console.log('Actual gas used:', formatUnits(gasUsed))

                setGasUsed(gasUsed)
            } catch (e) {
                console.log(e)
                setGasUsed(undefined)
            }
        }
        getGasEstimate()
    }, [debouncedContract, debouncedMethod, debouncedArgs])
    return gasUsed
}

//The delay parameter determines how long to wait before treating rapid changes as "settled"
//For example, if delay is 300, then the useEffect will run no more than once every 300 milliseconds, even if contract, method, or args change more frequently than that.
