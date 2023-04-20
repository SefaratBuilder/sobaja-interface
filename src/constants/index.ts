import { Token, TokenList, ChainId } from '../interfaces'
import ETH_LOGO from '../assets/token-logos/eth.jpeg'
import MATIC_LOGO from '../assets/token-logos/matic.png'
import tokenList from './jsons/tokenList.json'
import { WRAPPED_NATIVE_ADDRESSES } from './addresses'

export const ZERO_ADDESS = '0x0000000000000000000000000000000000000000'

export const NATIVE_COIN: Token = {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    chainId: 324,
    name: 'Ethereum',
    logoURI: ETH_LOGO,
    decimals: 18,
}

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
        chainId: 324,
        name: 'Ethereum',
        logoURI: ETH_LOGO,
        decimals: 18,
    },
    [ChainId.MUMBAI]: {
        address: WRAPPED_NATIVE_ADDRESSES[ChainId.MUMBAI],
        symbol: 'MATIC',
        chainId: 324,
        name: 'Polygon',
        logoURI: MATIC_LOGO,
        decimals: 18,
    },
    [ChainId.ZKMAINNET]: {
        address: WRAPPED_NATIVE_ADDRESSES[ChainId.ZKMAINNET],
        symbol: 'ETH',
        chainId: 324,
        name: 'Ethereum',
        logoURI: ETH_LOGO,
        decimals: 18,
    },
    [ChainId.ZKTESTNET]: {
        address: WRAPPED_NATIVE_ADDRESSES[ChainId.ZKTESTNET],
        symbol: 'ETH',
        chainId: 324,
        name: 'Ethereum',
        logoURI: ETH_LOGO,
        decimals: 18,
    },
}

export const CommonBaseTokens: Token[] = [NATIVE_COIN, ...tokenList.slice(0, 5)]

export const DEFAULT_TOKEN_LIST: { [chainId in number]: TokenList } = {
    [ChainId.GOERLI]: [NATIVE_COIN, ...tokenList],
    [ChainId.MUMBAI]: [NATIVE_COIN, ...tokenList],
    [ChainId.ZKMAINNET]: [NATIVE_COIN, ...tokenList],
    [ChainId.ZKTESTNET]: [NATIVE_COIN, ...tokenList]
}

export const ALL_SUPPORTED_CHAIN_IDS: ChainId[] = [
    ChainId.ZKMAINNET,
    ChainId.ZKTESTNET,
    ChainId.GOERLI,
    ChainId.MUMBAI,
]

