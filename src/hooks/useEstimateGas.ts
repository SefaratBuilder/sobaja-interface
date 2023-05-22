import { useState, useEffect } from 'react'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import useDebounce from './useDebounce'
import { ZERO_ADDRESS } from 'constants/index'
import { useTokenContract } from './useContract'

type SwapArgs = {
    args: (string | string[] | null | undefined)[]
    value: string
}

export function useEstimateGas(
    contract: Contract | null,
    method: () => string | undefined | any,
    args: () => SwapArgs | undefined | void,
) {

    const [gasUsed, setGasUsed] = useState<string | undefined>(undefined)


    const delay = 2000 // debounce delay 2s

    // create debounce version
    // const debouncedContract = useDebounce(contract, delay)
    const debouncedMethod = useDebounce(method(), delay)
    const debouncedArgs = useDebounce(args(), delay)

    const getGasEstimate = async () => {
        try {
            if (!debouncedArgs || !debouncedMethod || !contract) {
                throw new Error('Invalid args parameter')
            }
            if (debouncedMethod === 'approve') {
                const gasEstimate = await contract?.estimateGas?.[
                    debouncedMethod
                ]?.(...debouncedArgs.args)
                if (!gasEstimate) {
                    throw new Error('Gas estimate not found')
                }
                const gasPrice =
                    await contract?.provider?.getGasPrice()
                if (!gasPrice) {
                    throw new Error('Gas price not found')
                }
                console.log('Real gas', formatUnits(gasPrice))

                const gasUsed = gasEstimate.mul(gasPrice)
                console.log('Actual gas used:', formatUnits(gasUsed))

                return setGasUsed(formatUnits(gasUsed))
            }

            const gasEstimate = await contract?.estimateGas?.[
                debouncedMethod
            ]?.(...debouncedArgs.args, {
                value: debouncedArgs.value,
            })
            if (!gasEstimate) {
                throw new Error('Gas estimate not found')
            }
            const gasPrice =
                await contract?.provider?.getGasPrice()
            if (!gasPrice) {
                throw new Error('Gas price not found')
            }
            console.log('Real gas', formatUnits(gasPrice))

            const gasUsed = gasEstimate.mul(gasPrice)
            console.log('Actual gas used:', formatUnits(gasUsed))

            return setGasUsed(formatUnits(gasUsed))
        } catch (e) {
            // console.log(e)
            setGasUsed(undefined)
        }
    }
    useEffect(() => {
        getGasEstimate()
    }, [contract, debouncedMethod, debouncedArgs])
    return gasUsed
}

//The delay parameter determines how long to wait before treating rapid changes as "settled"
//For example, if delay is 300, then the useEffect will run no more than once every 300 milliseconds, even if contract, method, or args change more frequently than that.
