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


export const CommonBaseTokens: Token[] = [
    NATIVE_COIN,
    ...tokenList.slice(0, 5)
]

export const DEFAULT_TOKEN_LIST: TokenList = [NATIVE_COIN, ...tokenList]

export enum ChainId {
    ZKMAINNET = 324,
    ZKTESTNET = 280,
    GOERLI = 5
}

export const WRAPPED_NATIVE_COIN: { [chainId in ChainId]: string } = {
    [ChainId.ZKMAINNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.ZKTESTNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.GOERLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
}