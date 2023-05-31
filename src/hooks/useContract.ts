import { ChainId } from 'interfaces';
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
    Faucet,
    FaucetSoba,
    FAUCETSOBA_ABI,

    LAUNCHPADS,
    STAKING_ABI,
    STAKING,
    // AAEntryPoints
    AAEntryPoints,
    AAFactory
} from 'constants/addresses'
import ERC20 from 'constants/jsons/erc20.json'
import { PAIR_ABI } from 'constants/jsons/pair'
import LAUNCHPAD_ABI from 'constants/jsons/launchpad.json'
import { FAIRLAUNCH_ABI } from 'constants/jsons/fairlaunch'
import ACCESS_MANAGER_ABI from 'constants/jsons/accessManager.json'
import { LAUNCHPAD_ACCESS_MANAGERS } from 'constants/addresses'
import AAEntryPoint_ABI from 'constants/jsons/aaentry.json'
import { useWeb3AuthContext } from 'contexts/SocialLoginContext'
import { ethers } from 'ethers'
import NFT_ABI from 'constants/jsons/nft.json'
import AA_ABI from 'constants/jsons/aa.json'
import AAFACTORY_ABI from 'constants/jsons/aaFactory.json'
import Web3 from 'web3'

// returns null on errors
export const useContract = (
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true,
): Contract | null => {
    const { account, provider } = useActiveWeb3React()

    return useMemo(() => {
        if (!address || !ABI || !provider) return null
        try {
            return getContract(
                address,
                ABI,
                provider,
                withSignerIfPossible && account ? account : undefined,
            )
        } catch (error) {
            return null
        }
    }, [address, ABI, provider, withSignerIfPossible, account])
}

export function useMulticallContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(MULTICALL_NETWORKS[chainId || 80001], MULTICALL_ABI, false)
}

export function useFactoryContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(FACTORIES[chainId || 80001], FACTORY_ABI)
}

export function useRouterContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(ROUTERS[chainId || 80001], ROUTER_ABI)
}

export function useStakingContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    if (!chainId) return null
    return useContract(STAKING[chainId], STAKING_ABI)
}

export function useTokenContract(address: string | undefined): Contract | null {
    return useContract(address, ERC20)
}

export function useFaucetContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(Faucet[chainId || 80001], FAUCET_ABI)
}



export function useFaucetSobaContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(FaucetSoba[chainId || 80001], FAUCETSOBA_ABI)
}


export function usePairContract(address: string | undefined): Contract | null {
    return useContract(address, PAIR_ABI)
}

export function useLaunchpadContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(LAUNCHPADS[chainId || 80001], LAUNCHPAD_ABI)
}


export function useFairLaunchContract(address: string | undefined): Contract | null {
    return useContract(address, FAIRLAUNCH_ABI)
}

export function useAccessManagerContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(LAUNCHPAD_ACCESS_MANAGERS[chainId || 80001], ACCESS_MANAGER_ABI)
}

export function useAAEntryPointContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(AAEntryPoints[chainId || 80001], AAEntryPoint_ABI)
}

export function useAAFactoryContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(AAFactory[chainId || 80001], AAFACTORY_ABI)
}

export function useNftSmartAccountContract() {
    const { web3Provider } = useWeb3AuthContext()
    const { chainId } = useActiveWeb3React()
    if (!web3Provider || !chainId) return
    return new ethers.Contract('0xdd526eba63ef200ed95f0f0fb8993fe3e20a23d0', NFT_ABI, web3Provider)
}

export function useTokenSmartAccountContract(address: string | undefined) {
    const { web3Provider } = useWeb3AuthContext()
    const { chainId } = useActiveWeb3React()
    if (!web3Provider || !chainId || !address) return
    return new ethers.Contract(address, ERC20, web3Provider)
}

export function useRouterSmartAccountContract(): Contract | null {
    const { web3Provider } = useWeb3AuthContext()
    const { chainId } = useActiveWeb3React()
    if (!web3Provider || !chainId) return null
    return new ethers.Contract(ROUTERS[chainId || 80001], ROUTER_ABI, web3Provider)
}

export function useSmartAccountContract(address: string | undefined): Contract | null {
    return useContract(address, AA_ABI)
}

export function useMulticallWeb3Contract() {
    const { chainId } = useActiveWeb3React()
    const web3 = new Web3(Web3.givenProvider || 'https://rpc-mumbai.maticvigil.com')
    const abi: any = MULTICALL_ABI
    return new web3.eth.Contract(abi, MULTICALL_NETWORKS[chainId || 80001])
}