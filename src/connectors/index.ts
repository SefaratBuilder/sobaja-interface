import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ALL_SUPPORTED_CHAIN_IDS } from 'constants/index'
import getLibrary from 'utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ChainId } from 'interfaces'
import web3modal from 'bitkeep-web3modal';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const NETWORK_URLS: { [key in ChainId]: string } = {
    [ChainId.ZKMAINNET]: `https://mainnet.era.zksync.io`,
    [ChainId.ZKTESTNET]: `https://zksync2-testnet.zksync.dev`,
    [ChainId.GOERLI]: `https://zksync2-testnet.zksync.dev`,
    [ChainId.MUMBAI]: `https://matic-mumbai.chainstacklabs.com`,
}

export const network = new NetworkConnector({
    urls: NETWORK_URLS,
    defaultChainId: 324,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
    return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
    supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})

export const CoinbaseWallet = new WalletLinkConnector({
    url: `https://zksync2-testnet.zksync.dev`,
    appName: 'Coin base',
    supportedChainIds: [1, 3, 4, 5, 42, 280],
})

export const walletconnect = new WalletConnectConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 280],
    // rpc: 'https://mainnet.infura.io/v3/',
    // bridge: "https://bridge.walletconnect.org",
    // qrcode: true,
})

export const binance = new BscConnector({
    supportedChainIds: [1, 56, 137, 280],
})

export const bitkeep = new web3modal({
    network: 'mainnet', // optional
    cacheProvider: true, // optional
    providerOptions: {
        bitkeep: {
            package: true,
        },
        walletconnect: {
            display: {
                logo: 'data:image/gif;base64,INSERT_BASE64_STRING',
                name: 'Mobile',
                description: 'Scan qrcode with your mobile wallet',
            },
            package: WalletConnectProvider,
            options: {
                infuraId: 'INFURA_ID', // required
            },
        },
    }, // required
});