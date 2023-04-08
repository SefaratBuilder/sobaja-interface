import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from 'constants/index'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export const shortenAddress = (address: string, chars = 4): string => {
    const parsed = isAddress(address) && address
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars)}...${parsed.substring(42 - chars)}`
}

// account is not optional
export function getSigner(
    library: Web3Provider,
    account: string,
): JsonRpcSigner {
    return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(
    library: Web3Provider,
    account?: string,
): Web3Provider | JsonRpcSigner {
    return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(
    address: string,
    ABI: any,
    library: Web3Provider,
    account?: string,
): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(
        address,
        ABI,
        getProviderOrSigner(library, account) as any,
    )
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
    const prefix = `https://${
        ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[ChainId.ZKMAINNET]
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