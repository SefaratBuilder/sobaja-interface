import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { web3AuthConfig, openLoginAdapterConfig, chainConfig } from '../utils/web3AuthConfig'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import {
    OpenloginAdapter,
    OpenloginLoginParams,
} from '@web3auth/openlogin-adapter'
import { WALLET_ADAPTER_TYPE } from '@web3auth/base'
import { ChainId } from 'interfaces'

interface web3AuthContextType {
    connect: (
        method?: WALLET_ADAPTER_TYPE,
        params?: OpenloginLoginParams,
    ) => Promise<Web3AuthNoModal | null | undefined>
    disconnect: () => Promise<void>
    switchNetwork: (chainId: ChainId) => Promise<void>
    provider: any
    ethersProvider: ethers.providers.Web3Provider | null
    web3Provider: ethers.providers.Web3Provider | null
    loading: boolean
    chainId: number
    address: string
}
export const Web3AuthContext = React.createContext<web3AuthContextType>({
    connect: () => Promise.resolve(null),
    disconnect: () => Promise.resolve(),
    switchNetwork: (chainId: ChainId) => Promise.resolve(),
    loading: false,
    provider: null,
    ethersProvider: null,
    web3Provider: null,
    chainId: ChainId.ZKTESTNET,
    address: '',
})
export const useWeb3AuthContext = () => useContext(Web3AuthContext)

export enum SignTypeMethod {
    PERSONAL_SIGN = 'PERSONAL_SIGN',
    EIP712_SIGN = 'EIP712_SIGN',
}

type StateType = {
    provider?: any
    web3Provider?: ethers.providers.Web3Provider | null
    ethersProvider?: ethers.providers.Web3Provider | null
    address?: string
    chainId?: number
}
const initialState: StateType = {
    provider: null,
    web3Provider: null,
    ethersProvider: null,
    address: '',
    chainId: ChainId.ZKTESTNET,
}

export const Web3AuthProvider = ({ children }: any) => {
    const [web3State, setWeb3State] = useState<StateType>(initialState)
    const { provider, web3Provider, ethersProvider, address, chainId } =
        web3State
    const [loading, setLoading] = useState(false)
    const [socialLoginSDK, setSocialLoginSDK] =
        useState<Web3AuthNoModal | null>(null)

        useEffect(() => {
        const initWallet = async () => {
            const sdk = new Web3AuthNoModal(web3AuthConfig)
            await sdk.init()
            setSocialLoginSDK(sdk)
        }
        if (!socialLoginSDK) initWallet()
    }, [socialLoginSDK])

    const afterConnect = useCallback(async () => {
        if (socialLoginSDK?.provider) {
            setLoading(true)
            const web3Provider = new ethers.providers.Web3Provider(
                socialLoginSDK.provider,
            )
            const signer = web3Provider.getSigner()
            const gotAccount = await signer.getAddress()
            const network = await web3Provider.getNetwork()
            setWeb3State({
                provider: socialLoginSDK.provider,
                web3Provider: web3Provider,
                ethersProvider: web3Provider,
                address: gotAccount,
                chainId: Number(network.chainId),
            })
            setLoading(false)
            return
        }
    }, [address, socialLoginSDK])

    const autoConnect = async () => {
        try {
            const sdk = new Web3AuthNoModal(web3AuthConfig)
            const openloginAdapter = new OpenloginAdapter(openLoginAdapterConfig)
            sdk.configureAdapter(openloginAdapter)
            await sdk.init()
            await sdk.addChain(chainConfig[ChainId.GOERLI])
            await sdk.addChain(chainConfig[ChainId.MUMBAI])
            await sdk.addChain(chainConfig[ChainId.ZKMAINNET])
            await sdk.addChain(chainConfig[ChainId.ZKTESTNET])
            await sdk.getUserInfo()
            setSocialLoginSDK(sdk)
        } catch(err) {
            console.log(err)
        }
    }

    const connect = useCallback(
        async (method?: WALLET_ADAPTER_TYPE, params?: OpenloginLoginParams) => {
            try {
                if (!method || !params || address) return

                setLoading(true)
                const sdk = new Web3AuthNoModal(web3AuthConfig)
                const openloginAdapter = new OpenloginAdapter(openLoginAdapterConfig)
                sdk.configureAdapter(openloginAdapter)
                await sdk.init()
                try {
                    await sdk.connectTo(method, params)
                }
                catch(err) {
                    console.log('failed', err)
                    try {
                        await sdk.getUserInfo()
                    } catch(err) {
                        throw err
                    }
                }
                await sdk.addChain(chainConfig[ChainId.GOERLI])
                await sdk.addChain(chainConfig[ChainId.MUMBAI])
                await sdk.addChain(chainConfig[ChainId.ZKMAINNET])
                await sdk.addChain(chainConfig[ChainId.ZKTESTNET])
                setSocialLoginSDK(sdk)
                setLoading(false)
                return socialLoginSDK
            } catch (err) {
                console.log('failed to connect', err)
            }
        },
        [address, socialLoginSDK],
    )

    const disconnect = useCallback(async () => {
        if (!socialLoginSDK || !socialLoginSDK) {
            console.error('Web3Modal not initialized.')
            return
        }
        await socialLoginSDK.logout()
        setWeb3State({
            provider: null,
            web3Provider: null,
            ethersProvider: null,
            address: '',
            chainId: ChainId.ZKTESTNET,
        })
    }, [socialLoginSDK])

    const switchNetwork = useCallback(async (chainId: ChainId) => {
        try {
            if (!socialLoginSDK) {
                console.error('Web3Modal not initialized.')
                return
            }
            const cloneSdk = socialLoginSDK
            await cloneSdk.switchChain({chainId: chainConfig[chainId].chainId})
            await cloneSdk.getUserInfo()
            setSocialLoginSDK(cloneSdk)
            afterConnect()
        } catch(err) {
            console.log('failed to switch', err)
        }
    }, [socialLoginSDK])

    // after social login -> set provider info
    useEffect(() => {
        (async () => {
            if (socialLoginSDK?.provider && !address) {
                afterConnect()
            }
        })()
    }, [address, connect, socialLoginSDK, socialLoginSDK?.provider])

    // auto connect if user is already connected
    useEffect(() => {
        autoConnect()
    }, [])

    return (
        <Web3AuthContext.Provider
            value={{
                connect,
                disconnect,
                switchNetwork,
                loading,
                provider: provider,
                ethersProvider: ethersProvider || null,
                web3Provider: web3Provider || null,
                chainId: chainId || 0,
                address: address || '',
            }}
        >
            {children}
        </Web3AuthContext.Provider>
    )
}
