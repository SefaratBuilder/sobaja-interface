import { Token, TokenList, ChainId } from '../interfaces'
import ETH_LOGO from 'assets/token-logos/eth.svg'
import MATIC_LOGO from 'assets/token-logos/matic.png'
import tokenList from './jsons/tokenList.json'
import { WRAPPED_NATIVE_ADDRESSES } from './addresses'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ETHER_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const NATIVE_COIN: { [chainId in number]: Token } = {
    [ChainId.GOERLI]: {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        chainId: ChainId.GOERLI,
        name: 'Ethereum',
        logoURI: ETH_LOGO,
        decimals: 18,
    },
    [ChainId.MUMBAI]: {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'MATIC',
        chainId: ChainId.MUMBAI,
        name: 'Polygon',
        logoURI: MATIC_LOGO,
        decimals: 18,
    },
    [ChainId.ZKMAINNET]: {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        chainId: ChainId.ZKMAINNET,
        name: 'Ethereum',
        logoURI: ETH_LOGO,
        decimals: 18,
    },
    [ChainId.ZKTESTNET]: {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        chainId: ChainId.ZKTESTNET,
        name: 'Ethereum',
        logoURI: ETH_LOGO,
        decimals: 18,
    },

}
// export const NATIVE_COIN: Token = {
//     address: '0x0000000000000000000000000000000000000000',
//     symbol: 'ETH',
//     chainId: 324,
//     name: 'Ethereum',
//     logoURI: ETH_LOGO,
//     decimals: 18,
// }

export const URLSCAN_BY_CHAINID: { [chainId in number]: { url: string } } = {
    [ChainId.GOERLI]: {
        url: 'https://goerli.etherscan.io/',
    },
    [ChainId.MUMBAI]: {
        url: 'https://mumbai.polygonscan.com/',
    },
    [ChainId.ZKMAINNET]: {
        url: 'https://explorer.zksync.io/',
    },
    [ChainId.ZKTESTNET]: {
        url: 'https://goerli.explorer.zksync.io/',
    },
}

export const WRAPPED_NATIVE_COIN: { [chainId in number]: Token } = {
    [ChainId.GOERLI]: {
        address: WRAPPED_NATIVE_ADDRESSES[ChainId.GOERLI],
        symbol: 'ETH',
        chainId: ChainId.GOERLI,
        name: 'Ethereum',
        logoURI: ETH_LOGO,
        decimals: 18,
    },
    [ChainId.MUMBAI]: {
        address: WRAPPED_NATIVE_ADDRESSES[ChainId.MUMBAI],
        symbol: 'MATIC',
        chainId: ChainId.MUMBAI,
        name: 'Polygon',
        logoURI: MATIC_LOGO,
        decimals: 18,
    },
    [ChainId.ZKMAINNET]: {
        address: WRAPPED_NATIVE_ADDRESSES[ChainId.ZKMAINNET],
        symbol: 'ETH',
        chainId: ChainId.ZKMAINNET,
        name: 'Ethereum',
        logoURI: ETH_LOGO,
        decimals: 18,
    },
    [ChainId.ZKTESTNET]: {
        address: WRAPPED_NATIVE_ADDRESSES[ChainId.ZKTESTNET],
        symbol: 'ETH',
        chainId: ChainId.ZKTESTNET,
        name: 'Ethereum',
        logoURI: ETH_LOGO,
        decimals: 18,
    },
}

// export const CommonBaseTokens: Token[] = [NATIVE_COIN[ChainId.GOERLI], ...tokenList.slice(0, 5)]

export const CommonBaseTokens: { [chainId in number]: Token[] } = {
    [ChainId.GOERLI]: [NATIVE_COIN[ChainId.GOERLI], ...tokenList.filter(token => token.chainId === ChainId.GOERLI).slice(0, 5)],
    [ChainId.MUMBAI]: [NATIVE_COIN[ChainId.MUMBAI], ...tokenList.filter(token => token.chainId === ChainId.MUMBAI).slice(0, 5)],
    [ChainId.ZKMAINNET]: [NATIVE_COIN[ChainId.ZKMAINNET], ...tokenList.filter(token => token.chainId === ChainId.ZKMAINNET).slice(0, 5)],
    [ChainId.ZKTESTNET]: [NATIVE_COIN[ChainId.ZKTESTNET], ...tokenList.filter(token => token.chainId === ChainId.ZKTESTNET).slice(0, 5)],
}

export const DEFAULT_TOKEN_LIST: { [chainId in number]: TokenList } = {
    [ChainId.GOERLI]: [NATIVE_COIN[ChainId.GOERLI], ...tokenList.filter(token => token.chainId === ChainId.GOERLI).slice(0, 5)],
    [ChainId.MUMBAI]: [NATIVE_COIN[ChainId.MUMBAI], ...tokenList.filter(token => token.chainId === ChainId.MUMBAI).slice(0, 5)],
    [ChainId.ZKMAINNET]: [NATIVE_COIN[ChainId.ZKMAINNET], ...tokenList.filter(token => token.chainId === ChainId.ZKMAINNET).slice(0, 5)],
    [ChainId.ZKTESTNET]: [NATIVE_COIN[ChainId.ZKTESTNET], ...tokenList.filter(token => token.chainId === ChainId.ZKTESTNET).slice(0, 5)],
}

export const ALL_SUPPORTED_CHAIN_IDS: ChainId[] = [
    ChainId.ZKMAINNET,
    ChainId.ZKTESTNET,
    ChainId.GOERLI,
    ChainId.MUMBAI,
]

export const LAUNCHPAD_SUBGRAPH_URL: { [chainId in number]: string } = {
    [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/anvospace/launchpad',
    [ChainId.MUMBAI]: 'https://api.thegraph.com/subgraphs/name/anvospace/launchpad',
    [ChainId.ZKMAINNET]: 'https://api.thegraph.com/subgraphs/name/anvospace/launchpad',
    [ChainId.ZKMAINNET]: 'https://api.thegraph.com/subgraphs/name/anvospace/launchpad'
}