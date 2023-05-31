import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { activeChainId } from '../utils/chainConfig'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import {
    OpenloginAdapter,
    OpenloginLoginParams,
} from '@web3auth/openlogin-adapter'
import { WALLET_ADAPTER_TYPE } from '@web3auth/base'

interface web3AuthContextType {
    connect: (
        method?: WALLET_ADAPTER_TYPE,
        params?: OpenloginLoginParams,
    ) => Promise<Web3AuthNoModal | null | undefined>
    disconnect: () => Promise<void>
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
    loading: false,
    provider: null,
    ethersProvider: null,
    web3Provider: null,
    chainId: activeChainId,
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
    chainId: activeChainId,
}

export const Web3AuthProvider = ({ children }: any) => {
    const [web3State, setWeb3State] = useState<StateType>(initialState)
    const { provider, web3Provider, ethersProvider, address, chainId } =
        web3State
    const [loading, setLoading] = useState(false)
    const [socialLoginSDK, setSocialLoginSDK] =
        useState<Web3AuthNoModal | null>(null)
    // create socialLoginSDK and call the init
    useEffect(() => {
        const initWallet = async () => {
            const sdk = new Web3AuthNoModal({
                clientId:
                    'BE7tc_MkDFzJp3ujQwPTeptBbTCE87628dJ7bcndPvcJYKT5NSRnbDk0NIYjW_4iAbNsxbPhoLwlMLMcsFA87Qc', // get from https://dashboard.web3auth.io
                web3AuthNetwork: 'testnet',
                chainConfig: {
                    chainNamespace: 'eip155',
                    chainId: '0x5', // EVM chain's Chain ID
                    rpcTarget:
                        'https://goerli.infura.io/v3/8f8561738d754550b1b5fdc095c6e0a9', // EVM chain's RPC endpoint
                    // Avoid using public rpcTarget in production.
                    // Use services like Infura, Quicknode, Alchemy, Ankr etc.
                    displayName: 'Goerli', // EVM chain's Name
                    blockExplorer: 'https://goerli.etherscan.io/', // EVM chain's Blockexplorer
                    ticker: 'ETH', // EVM chain's Ticker
                    tickerName: 'Ethereum', // EVM chain's Ticker Name
                },
            })
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

    const connect = useCallback(
        async (method?: WALLET_ADAPTER_TYPE, params?: OpenloginLoginParams) => {
            try {
                if (!method || !params || address) return

                setLoading(true)
                const sdk = new Web3AuthNoModal({
                    clientId:
                        'BE7tc_MkDFzJp3ujQwPTeptBbTCE87628dJ7bcndPvcJYKT5NSRnbDk0NIYjW_4iAbNsxbPhoLwlMLMcsFA87Qc', // get from https://dashboard.web3auth.io
                    web3AuthNetwork: 'testnet',
                    chainConfig: {
                        chainNamespace: 'eip155',
                        chainId: '0x5', // EVM chain's Chain ID
                        rpcTarget:
                            'https://goerli.infura.io/v3/8f8561738d754550b1b5fdc095c6e0a9', // EVM chain's RPC endpoint
                        // Avoid using public rpcTarget in production.
                        // Use services like Infura, Quicknode, Alchemy, Ankr etc.
                        displayName: 'Goerli', // EVM chain's Name
                        blockExplorer: 'https://goerli.etherscan.io/', // EVM chain's Blockexplorer
                        ticker: 'ETH', // EVM chain's Ticker
                        tickerName: 'Ethereum', // EVM chain's Ticker Name
                    },
                })
                const openloginAdapter = new OpenloginAdapter({
                    adapterSettings: {
                        uxMode: 'popup',
                        whiteLabel: {
                            name: 'Sobajaswap',
                            logoLight:
                                'https://web3auth.io/images/w3a-L-Favicon-1.svg',
                            logoDark:
                                'https://web3auth.io/images/w3a-D-Favicon-1.svg',
                            defaultLanguage: 'en',
                            dark: true, // whether to enable dark mode. defaultValue: false
                        },
                    },
                })
                sdk.configureAdapter(openloginAdapter)
                // console.log('connecting.....')
                await sdk.init()
                console.log('sdkkkkk123123', sdk)
                await sdk.connectTo(method, params)
                setSocialLoginSDK(sdk)
                setLoading(false)
                console.log('sdkkkkkk', sdk)
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
            chainId: activeChainId,
        })
    }, [socialLoginSDK])

    // after social login -> set provider info
    useEffect(() => {
        ;(async () => {
            if (socialLoginSDK?.provider && !address) {
                afterConnect()
            }
        })()
    }, [address, connect, socialLoginSDK, socialLoginSDK?.provider])

    // after metamask login -> get provider event
    // useEffect(() => {
    //     const interval = setInterval(async () => {
    //         if (address) {
    //             clearInterval(interval)
    //         }
    //         if (socialLoginSDK?.provider && !address) {
    //             afterConnect()
    //         }
    //     }, 1000)
    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [address, connect, socialLoginSDK])

    return (
        <Web3AuthContext.Provider
            value={{
                connect,
                disconnect,
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
