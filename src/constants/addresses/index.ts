import MULTICALL_ABI from '../jsons/multicall.json'
import FACTORY_ABI from '../jsons/factory.json'
import ROUTER_ABI from '../jsons/router.json'
import { ChainId } from '..'

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [ChainId.ZKTESTNET]: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
    [ChainId.GOERLI]: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    [ChainId.MUMBAI]: '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc',
}

const FACTORIES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.ZKTESTNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.GOERLI]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.MUMBAI]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
}

const ROUTERS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    [ChainId.ZKTESTNET]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    [ChainId.GOERLI]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    [ChainId.MUMBAI]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
}

const INIT_CODE_HASHES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.ZKTESTNET]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.GOERLI]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.MUMBAI]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
}

export const WRAPPED_NATIVE_COIN: { [chainId in ChainId]: string } = {
    [ChainId.ZKMAINNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.ZKTESTNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.GOERLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.MUMBAI]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
}

export {
    MULTICALL_ABI,
    MULTICALL_NETWORKS,
    FACTORIES,
    FACTORY_ABI,
    ROUTERS,
    ROUTER_ABI,
    INIT_CODE_HASHES,
}