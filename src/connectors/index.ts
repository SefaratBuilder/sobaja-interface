import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ALL_SUPPORTED_CHAIN_IDS, ChainId } from 'constants/index'
import getLibrary from 'utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URLS: { [key in ChainId]: string } = {
    [ChainId.ZKMAINNET]: `https://mainnet.era.zksync.io`,
    [ChainId.ZKTESTNET]: `https://zksync2-testnet.zksync.dev`,
    [ChainId.GOERLI]: `https://zksync2-testnet.zksync.dev`,
    [ChainId.MUMBAI]: `https://matic-mumbai.chainstacklabs.com`,
}

export const network = new NetworkConnector({
    urls: NETWORK_URLS,
    defaultChainId: 280,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
    return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
    supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})
