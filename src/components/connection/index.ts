
import {
    initializeConnector,
} from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { MetaMask } from '@web3-react/metamask'
import { useCallback, useMemo } from 'react'
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import store from 'states'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import METAMASK_ICON_URL from 'assets/icons/metamask.svg'
import COINBASE_ICON_URL from 'assets/icons/coinbase.svg'
import WALLETCONNECT_ICON_URL from 'assets/icons/wallet-connect.svg'
import BITKEEP_ICON from 'assets/icons/BitKeep.jpeg';
import OKEX_ICON from 'assets/token-logos/okex.png'
import ARGENT_ICON from 'assets/icons/argent.svg'
import { Network } from '@web3-react/network';
import { WalletConnect } from '@web3-react/walletconnect'
import { Connection, ConnectionType } from './types';
import { BitKeep } from './bitkeep/src';
import { Okex } from './okex/src';

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector



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
const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnect>(
    (actions) => new WalletConnect({ actions, options: { qrcode: true, rpc: URLS }, onError })
)

export const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
    (actions) => new MetaMask({ actions, onError }),
)

export const [web3Bitkeep, web3BitkeepHooks] = initializeConnector<BitKeep>(
    (actions) => new BitKeep({ actions, onError }),
)
export const [web3WalletOkex, web3WalletOkexHooks] = initializeConnector<Okex>(
    (actions) => new Okex({ actions, onError }),
)



export const argentConnection: Connection = {
    // TODO(WEB-3131) re-add "Install MetaMask" string when no injector is present
    getName: () => 'Argent',
    connector: web3Network,
    hooks: web3NetworkHooks,
    type: ConnectionType.OKEX,
    getIcon: () => ARGENT_ICON,
    shouldDisplay: () => true,
    overrideActivate: () => false,
    href: null,
}

export const okexConnection: Connection = {
    // TODO(WEB-3131) re-add "Install MetaMask" string when no injector is present
    getName: () => 'OKX Wallet',
    connector: web3WalletOkex,
    hooks: web3WalletOkexHooks,
    type: ConnectionType.OKEX,
    getIcon: () => OKEX_ICON,
    shouldDisplay: () => true,
    overrideActivate: () => false,
    href: 'https://www.okx.com/vi/download',
}

export const bitkeepConnection: Connection = {
    // TODO(WEB-3131) re-add "Install MetaMask" string when no injector is present
    getName: () => 'BitKeep Wallet',
    connector: web3Bitkeep,
    hooks: web3BitkeepHooks,
    type: ConnectionType.BITKEEP,
    getIcon: () => BITKEEP_ICON,
    shouldDisplay: () => true,
    overrideActivate: () => false,
    href: 'https://bitkeep.com/',
}


export const networkConnection: Connection = {
    getName: () => 'Network',
    connector: web3Network,
    hooks: web3NetworkHooks,
    type: ConnectionType.NETWORK,
    shouldDisplay: () => false,
    href: null,
}
const coinbaseWalletConnection: Connection = {
    getName: () => 'Coinbase Wallet',
    connector: web3CoinbaseWallet,
    hooks: web3CoinbaseWalletHooks,
    type: ConnectionType.COINBASE_WALLET,
    getIcon: () => COINBASE_ICON_URL,
    shouldDisplay: () => true,
    overrideActivate: () => false,
    href: null,
}
export const walletConnectConnection: Connection = {
    getName: () => 'WalletConnect',
    connector: web3WalletConnect,
    hooks: web3WalletConnectHooks,
    type: ConnectionType.WALLET_CONNECT,
    getIcon: () => WALLETCONNECT_ICON_URL,
    shouldDisplay: () => true,
    href: null,
}

export const injectedConnection: Connection = {
    // TODO(WEB-3131) re-add "Install MetaMask" string when no injector is present
    getName: () => 'MetaMask',
    connector: web3Injected,
    hooks: web3InjectedHooks,
    type: ConnectionType.INJECTED,
    getIcon: () => METAMASK_ICON_URL,
    shouldDisplay: () => true,
    overrideActivate: () => false,
    href: 'https://metamask.io/',
}





export function getConnections() {
    return [
        injectedConnection,
        argentConnection,
        networkConnection,
        coinbaseWalletConnection,
        walletConnectConnection,
        okexConnection,
        bitkeepConnection,
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
                case ConnectionType.BITKEEP:
                    return bitkeepConnection
                case ConnectionType.OKEX:
                    return okexConnection
                // case ConnectionType.ARGENT:
                //     return argentConnection
            }
        }
    }, [])
}




export const SELECTABLE_WALLETS = [
    ConnectionType.INJECTED,
    ConnectionType.COINBASE_WALLET,
    ConnectionType.WALLET_CONNECT,
    ConnectionType.BITKEEP,
    ConnectionType.OKEX
]



export function useOrderedConnections() {
    const selectedWallet = useAppSelector((state) => state.user.selectedWallet);
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

