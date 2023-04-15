import { useActiveWeb3React } from 'hooks'
import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { getContract } from 'utils'
import {
    MULTICALL_NETWORKS,
    MULTICALL_ABI,
    FACTORY_ABI,
    FACTORIES,
    ROUTER_ABI,
    ROUTERS,
    FAUCET_ABI,
    Faucet
} from 'constants/addresses'
import ERC20 from 'constants/jsons/erc20.json'
import { PAIR_ABI } from 'constants/jsons/pair'

// returns null on errors
export const useContract = (
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true,
): Contract | null => {
    const { library, account } = useActiveWeb3React()

    return useMemo(() => {
        if (!address || !ABI || !library) return null
        try {
            return getContract(
                address,
                ABI,
                library,
                withSignerIfPossible && account ? account : undefined,
            )
        } catch (error) {
            return null
        }
    }, [address, ABI, library, withSignerIfPossible, account])
}

export function useMulticallContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    if (!chainId) return null
    return useContract(MULTICALL_NETWORKS[chainId], MULTICALL_ABI)
}

export function useFactoryContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    if (!chainId) return null
    return useContract(FACTORIES[chainId], FACTORY_ABI)
}

export function useRouterContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    if (!chainId) return null
    return useContract(ROUTERS[chainId], ROUTER_ABI)
}

export function useTokenContract(address: string | undefined): Contract | null {
    return useContract(address, ERC20)
}

export function useFaucetContract(): Contract | null {
    const { chainId } = useActiveWeb3React();
    if (!chainId) return null;
    return useContract(Faucet[chainId], FAUCET_ABI)
}

export function usePairContract(address: string | undefined): Contract | null {
    return useContract(address, PAIR_ABI)
}