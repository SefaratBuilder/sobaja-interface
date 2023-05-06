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
