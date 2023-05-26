import { getAddress } from '@ethersproject/address';
import { ZERO_ADDRESS } from 'constants/index';
import { useWeb3AuthContext } from 'contexts/SocialLoginContext';
import { useActiveWeb3React } from "hooks"
import { useEffect, useMemo, useState } from "react"
import { useBlockNumber } from 'states/application/hooks';
import { useSingleCallResult } from "states/multicall/hooks"
import { useAAFactoryContract } from "./useContract"

export const useAAFactory = () => {
    const { chainId, account, provider } = useActiveWeb3React()
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
                if (!account || !contract) return () => {
                    setSmartAccountAddress(undefined)
                    setIsDeyloyed(false)
                }
                let address: string
                //get and check is address deployed
                address = await contract.getDeployedAccount(account, '0')
                if (address == ZERO_ADDRESS) {
                    setIsDeyloyed(false)
                    address = await contract.callStatic.deployCounterFactualAccount(account, '0')
                } else {
                    setIsDeyloyed(true)
                }

                setSmartAccountAddress(address)
            }
            catch (err) {
                setSmartAccountAddress(undefined)
                setIsDeyloyed(false)
            }
        }
        getAddress()
    }, [account, chainId, block])


    return useMemo(() => {
        return {
            contract,
            basicImplementation: basicImplementation.result?.[0],
            smartAccountAddress: smartAccountAddress,
            isDeployed
        }
    }, [contract, basicImplementation, smartAccountAddress])
}