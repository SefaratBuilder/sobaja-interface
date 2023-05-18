
import {
    useWeb3React,
    Web3ReactHooks,
    Web3ReactProvider,
    initializeConnector,
} from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { MetaMask } from '@web3-react/metamask'
import { useCallback, useMemo } from 'react'
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { GnosisSafe } from '@web3-react/gnosis-safe'
import store from 'states'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import METAMASK_ICON_URL from 'assets/icons/metamask.svg'
import COINBASE_ICON_URL from 'assets/icons/coinbase.svg'
import BINANCECONNECT_ICON_URL from 'assets/icons/binance.svg'
import WALLETCONNECT_ICON_URL from 'assets/icons/wallet-connect.svg'
import BITKEEP_ICON from 'assets/icons/BitKeep.jpeg';
import OKEX_ICON from 'assets/token-logos/okex.png'
import { Network } from '@web3-react/network';
import { WalletConnect } from '@web3-react/walletconnect'
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector
export enum ConnectionType {
    INJECTED = 'INJECTED',
    NETWORK = 'NETWORK',
    GNOSIS_SAFE = 'GNOSIS_SAFE',
    COINBASE_WALLET = 'COINBASE_WALLET',
    WALLET_CONNECT = 'WALLET_CONNECT',
}


export interface Connection {
    getName(): string
    connector: Connector
    hooks: Web3ReactHooks
    type: string
    getIcon?: string
    shouldDisplay(): boolean
    overrideActivate?: () => boolean
    isNew?: boolean
}


export function onError(error: Error) {
    console.debug(`web3-react error: ${error}`)
}


const MAINNET_CHAINS = {
    324: {
        urls: ['https://mainnet.era.zksync.io'].filter(Boolean),
        name: 'Mainnet',

    },
    1: {
        urls: [`https://mainnet.infura.io/v3/`].filter(Boolean),
        name: 'Ether',
    }
}

const CHAINS: any = {
    ...MAINNET_CHAINS
}
const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
    (accumulator, chainId) => {
        const validURLs: string[] = CHAINS[Number(chainId)].urls

        if (validURLs.length) {
            accumulator[Number(chainId)] = validURLs
        }

        return accumulator
    },
    {}
)

export const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
    (actions) => new Network({ actions, urlMap: URLS, defaultChainId: 324 })
)



// export const [network, hooks] = initializeConnector<Network>((actions) => new Network({ actions, urlMap: URLS }))
export const networkConnection: Connection = {
    getName: () => 'Network',
    connector: web3Network,
    hooks: web3NetworkHooks,
    type: ConnectionType.NETWORK,
    shouldDisplay: () => false,
}


const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
    (actions) =>
        new CoinbaseWallet({
            actions,
            options: {
                url: 'https://mainnet.era.zksync.io',
                appName: 'SobajaSwap',
                appLogoUrl: COINBASE_ICON_URL,
                reloadOnDisconnect: false,
            },
            onError,
        })
)

const coinbaseWalletConnection: Connection = {
    getName: () => 'Coinbase Wallet',
    connector: web3CoinbaseWallet,
    hooks: web3CoinbaseWalletHooks,
    type: ConnectionType.COINBASE_WALLET,
    getIcon: COINBASE_ICON_URL,
    shouldDisplay: () =>
        false,
    // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
    overrideActivate: () => false,
}

const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnect>(
    (actions) => new WalletConnect({ actions, options: { qrcode: true, rpc: URLS }, onError })
)
export const walletConnectConnection: Connection = {
    getName: () => 'WalletConnect',
    connector: web3WalletConnect,
    hooks: web3WalletConnectHooks,
    type: ConnectionType.WALLET_CONNECT,
    getIcon: WALLETCONNECT_ICON_URL,
    shouldDisplay: () => false,
}


const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>((actions) => new GnosisSafe({ actions }))
export const gnosisSafeConnection: Connection = {
    getName: () => 'Gnosis Safe',
    connector: web3GnosisSafe,
    hooks: web3GnosisSafeHooks,
    type: ConnectionType.GNOSIS_SAFE,
    getIcon: METAMASK_ICON_URL,
    shouldDisplay: () => false,
}

export const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
    (actions) => new MetaMask({ actions, onError }),
)

export const injectedConnection: Connection = {
    // TODO(WEB-3131) re-add "Install MetaMask" string when no injector is present
    getName: () => 'MetaMask',
    connector: web3Injected,
    hooks: web3InjectedHooks,
    type: ConnectionType.INJECTED,
    getIcon: METAMASK_ICON_URL,
    shouldDisplay: () => true,
    // If on non-injected, non-mobile browser, prompt user to install Metamask
    overrideActivate: () => {
        return false
    },
}


export function getConnections() {
    return [
        injectedConnection,
        networkConnection,
        coinbaseWalletConnection,
        walletConnectConnection
    ]
}

export function useGetConnection() {
    return useCallback((c: Connector | ConnectionType) => {
        if (c instanceof Connector) {
            const connection = getConnections().find((connection) => connection.connector === c)
            if (!connection) {
                throw Error('unsupported connector')
            }
            return connection
        } else {
            switch (c) {
                case ConnectionType.INJECTED:
                    return injectedConnection
                case ConnectionType.NETWORK:
                    return networkConnection
                case ConnectionType.COINBASE_WALLET:
                    return coinbaseWalletConnection
                case ConnectionType.WALLET_CONNECT:
                    return walletConnectConnection
                // case ConnectionType.GNOSIS_SAFE:
                //     return gnosisSafeConnection
            }
        }
    }, [])
}



export const SELECTABLE_WALLETS = [
    ConnectionType.INJECTED,
    ConnectionType.COINBASE_WALLET,
    ConnectionType.WALLET_CONNECT,
]

export function useOrderedConnections() {
    const selectedWallet = useAppSelector((state) => state.user.selectedWallet);
    console.log("selectedWallet=>>>>>>>>>>>", selectedWallet)
    const getConnection = useGetConnection()
    return useMemo(() => {
        const orderedConnectionTypes: ConnectionType[] = []

        // Always attempt to use to Gnosis Safe first, as we can't know if we're in a SafeContext.
        // orderedConnectionTypes.push(ConnectionType.GNOSIS_SAFE)

        // Add the `selectedWallet` to the top so it's prioritized, then add the other selectable wallets.
        if (selectedWallet) {
            orderedConnectionTypes.push(selectedWallet)
        }
        orderedConnectionTypes.push(...SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet))

        // Add network connection last as it should be the fallback.
        orderedConnectionTypes.push(ConnectionType.NETWORK)

        return orderedConnectionTypes.map((connectionType) => getConnection(connectionType))
    }, [getConnection, selectedWallet])
}
