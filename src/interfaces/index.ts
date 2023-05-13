export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
}

export interface Token {
    address: string
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

export enum LaunchpadResult {
    Cancel = "Cancel",
    Fairlure = "Fairlure",
    Success = "Success",
    Overflow = "Overflow"
}

export interface LaunchpadInfo {
    id: string,
    startTime: number,
    endTime: number,
    hardcap: number,
    softcap: number,
    overflow: number,
    individualCap: number,
    totalTokenSale: number,
    totalCommitment: number,
    finalized: boolean,
    result: string,
    launchpadOwner: string
}
export interface LaunchpadInfoX {
    claims: any
    endTime: string
    finalized: boolean
    hardcap: string
    id: string
    individualCap: string
    launchpadOwner: string
    overflow: string
    price: string
    result: string
    softcap: string
    startTime: string
    totalCommitment: string
    totalTokenSale: string
    launchpadToken: string
    paymentCurrency: string
}
