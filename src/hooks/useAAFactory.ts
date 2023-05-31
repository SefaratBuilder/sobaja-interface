import { ZERO_ADDRESS } from 'constants/index';
import { useActiveWeb3React } from 'hooks';
import { ChainId } from 'interfaces';
import { useEffect, useMemo, useState } from "react"
import { useBlockNumber } from 'states/application/hooks';
import { useSingleCallResult } from "states/multicall/hooks"
import { useAAFactoryContract } from "./useContract"


export const useAAFactory = () => {
    const { account, isSmartAccount, chainId, provider } = useActiveWeb3React()
    const contract = useAAFactoryContract()
    const [isDeployed, setIsDeyloyed] = useState(false)
    const [smartAccountAddress, setSmartAccountAddress] = useState<string>()
    const block = useBlockNumber()

    const basicImplementation = useSingleCallResult(
        contract,
        'basicImplementation',
        []
    )

    useEffect(() => {
        const getAddress = async () => {
            try {
                if (!account || !contract || !isSmartAccount || !provider) return (() => {
                    setSmartAccountAddress(undefined)
                    setIsDeyloyed(false)
                })()
                let address: string
                if (chainId === ChainId.ZKTESTNET || chainId === ChainId.ZKMAINNET) {
                    address = await contract.getDeployedAccount(account, '0')
                    if (address == ZERO_ADDRESS) {
                        setIsDeyloyed(false)
                        address = await contract.callStatic.deployCounterFactualAccount(account, '0')
                    } else {
                        setIsDeyloyed(true)
                    }
                } else {
                    address = await contract.callStatic.deployCounterFactualAccount(account, '0')
                    const code = await provider.getCode(address)
                    if (code.length > 2) {
                        setIsDeyloyed(true)
                    } else {
                        setIsDeyloyed(false)
                    }
                }
                setSmartAccountAddress(address)
            }
            catch (err) {
                console.log('failed to get smart account address', err)
                setSmartAccountAddress(undefined)
                setIsDeyloyed(false)
            }
        }
        getAddress()
    }, [block, account, isSmartAccount, chainId])

    return useMemo(() => {
        return {
            contract,
            basicImplementation: basicImplementation.result?.[0],
            smartAccountAddress: smartAccountAddress,
            isDeployed
        }
    }, [contract, basicImplementation, smartAccountAddress, isDeployed])
}