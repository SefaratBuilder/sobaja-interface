import { getAddress } from '@ethersproject/address';
import { useWeb3AuthContext } from 'contexts/SocialLoginContext';
import { useActiveWeb3React } from "hooks"
import { useEffect, useMemo, useState } from "react"
import { useSingleCallResult } from "states/multicall/hooks"
import { useAAFactoryContract } from "./useContract"

export const useAAFactory = () => {
    const { chainId, account, provider } = useActiveWeb3React()
    const contract = useAAFactoryContract()
    const [isDeployed, setIsDeyloyed] = useState(false)

    const basicImplementation = useSingleCallResult(
        contract,
        'basicImplementation',
        []
    )

    const smartAccountAtZero = useSingleCallResult(
        contract,
        'getAddressForCounterFactualAccount',
        [account || undefined, '0']
    )

    useEffect(() => {
        const checkIsDeployed = async () => {
            if (smartAccountAtZero.result?.[0]) {
                const code = await provider?.getCode(smartAccountAtZero.result?.[0])
                code && code.length > 2 ? setIsDeyloyed(true) : setIsDeyloyed(false)
            } else {
                setIsDeyloyed(false)
            }
        }
        checkIsDeployed()
    }, [smartAccountAtZero, provider, contract])

    return useMemo(() => {
        return {
            contract,
            basicImplementation: basicImplementation.result?.[0],
            smartAccountAtZero: smartAccountAtZero.result?.[0],
            isDeployed
        }
    }, [contract, basicImplementation, smartAccountAtZero])
}