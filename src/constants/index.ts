import { Token, TokenList } from '../interfaces'
import ETH_LOGO from '../assets/token-logos/eth.jpeg'
import tokenList from './jsons/tokenList.json'

export const NATIVE_COIN: Token = {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    symbol: 'ETH',
    chainId: 324,
    name: 'Ethereum',
    logoURI: ETH_LOGO,
    decimals: 18,
}

export const CommonBaseTokens: Token[] = [
    NATIVE_COIN,
    NATIVE_COIN,
    NATIVE_COIN,
    NATIVE_COIN,
    NATIVE_COIN,
    NATIVE_COIN,
    NATIVE_COIN,
]

export const DEFAULT_TOKEN_LIST: TokenList = [NATIVE_COIN, ...tokenList]
