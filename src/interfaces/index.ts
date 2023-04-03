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
    logo: string
}

export type TokenList = Token[]
