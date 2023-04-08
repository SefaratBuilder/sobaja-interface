import { Token, TokenList } from '../interfaces'
import ETH_LOGO from '../assets/token-logos/eth.jpeg'
import tokenList from './jsons/tokenList.json'

export const NATIVE_COIN: Token = {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    chainId: 324,
    name: 'Ethereum',
    logoURI: ETH_LOGO,
    decimals: 18,
}

export const CommonBaseTokens: Token[] = [NATIVE_COIN, ...tokenList.slice(0, 5)]

export const DEFAULT_TOKEN_LIST: TokenList = [NATIVE_COIN, ...tokenList]

export enum ChainId {
    ZKMAINNET = 324,
    ZKTESTNET = 280,
    GOERLI = 5,
    MUMBAI = 80001,
}

export const ALL_SUPPORTED_CHAIN_IDS: ChainId[] = [
    ChainId.ZKMAINNET,
    ChainId.ZKTESTNET,
    ChainId.GOERLI,
    ChainId.MUMBAI,
]
