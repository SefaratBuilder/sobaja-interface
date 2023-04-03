import { Token, TokenList } from '../interfaces'
import ETH_LOGO from '../assets/token-logos/eth.jpeg'
import tokenList from './jsons/tokenList.json'

export const NATIVE_COIN: Token = {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    symbol: 'ETH',
    chainId: 280,
    name: 'Ethereum',
    logo: ETH_LOGO,
    decimals: 18,
}

export const DEFAULT_TOKEN_LIST: TokenList = [NATIVE_COIN, ...tokenList]
