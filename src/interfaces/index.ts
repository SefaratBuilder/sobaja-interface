export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
}

export interface Token {
    address: string
    symbol: string
    decimals: number
    name: string
    chainId: number
    logoURI: string
}

export type TokenList = Token[]

export enum ChainId {
    ZKMAINNET = 324,
    ZKTESTNET = 280,
    GOERLI = 5,
    MUMBAI = 80001,
}