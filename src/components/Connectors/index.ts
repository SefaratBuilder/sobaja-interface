import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import getLibrary from 'utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { BscConnector } from '@binance-chain/bsc-connector'
const NETWORK_URLS: { [key in SupportedChainId]: string } = {
    [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847`,
    [SupportedChainId.ZKSYNC_GOERLI]: `https://zksync2-testnet.zksync.dev`,
}

export const network = new NetworkConnector({
    urls: NETWORK_URLS,
    defaultChainId: 1,
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
    appName: "Coin base",
    supportedChainIds: [1, 3, 4, 5, 42, 280],
});

export const walletconnect = new WalletConnectConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 280],
    // rpc: 'https://mainnet.infura.io/v3/',
    // bridge: "https://bridge.walletconnect.org",
    // qrcode: true,
});

export const binance = new BscConnector({
    supportedChainIds: [1, 56, 137, 280],
});