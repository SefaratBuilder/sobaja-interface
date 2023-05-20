import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcProvider, JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, Token } from 'interfaces'
import { add, div, divNumberWithDecimal, mul, sub } from './math'
import { WRAPPED_NATIVE_COIN } from 'constants/index'

export function convertNativeToWrappedToken(token: Token, chainId: number): Token {
    if (isNativeCoin(token)) return WRAPPED_NATIVE_COIN[chainId]
    return token
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}

//gas limit + 1000
export function computeGasLimit(gas: BigNumber | undefined) {
    if (!gas) return
    return gas.add(1000)
}

//is native coin
export function isNativeCoin(token: Token | undefined) {
    if (!token) return
    return token.address === AddressZero
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export const shortenAddress = (address: string | null | undefined, chars = 4): string => {
    if (!address) return ''
    const parsed = isAddress(address) && address
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars)}...${parsed.substring(42 - chars)}`
}

function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
    return provider.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(provider: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
    return account ? getSigner(provider, account) : provider
}

// account is optional
export function getContract(address: string, ABI: any, provider: JsonRpcProvider, account?: string): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(address, ABI, getProviderOrSigner(provider, account) as any)
}


const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
    [ChainId.GOERLI]: 'goerli.etherscan.io',
    [ChainId.MUMBAI]: 'mumbai.polygonscan.com',
    [ChainId.ZKMAINNET]: 'explorer.zksync.io',
    [ChainId.ZKTESTNET]: 'goerli.explorer.zksync.io',
}

export function getEtherscanLink(
    chainId: ChainId,
    data: string,
    type: 'transaction' | 'token' | 'address' | 'block',
): string {
    const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[ChainId.ZKMAINNET]
        }`

    switch (type) {
        case 'transaction': {
            return `${prefix}/tx/${data}`
        }
        case 'token': {
            return `${prefix}/token/${data}`
        }
        case 'block': {
            return `${prefix}/block/${data}`
        }
        case 'address':
        default: {
            return `${prefix}/address/${data}`
        }
    }
}

//current time + deadline second
export function calcTransactionDeadline(deadline: number) {
    return (new Date().getTime() / 1000 + deadline).toFixed()
}

export const calcSlippageAmount = (
    amount: string | number,
    slippage: string | number,
): [string, string] => {
    if (Number(slippage) < 0 || Number(slippage) > 100) {
        throw new Error(`Please input properly slippage amount`)
    }

    const amountOut = mul(amount, sub(1, div(slippage, 100)))
    const amountIn = div(amount, sub(1, div(slippage, 100)))

    return [amountOut, amountIn]
}
