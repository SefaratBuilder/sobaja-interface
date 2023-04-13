import MULTICALL_ABI from '../jsons/multicall.json'
import FACTORY_ABI from '../jsons/factory.json'
import ROUTER_ABI from '../jsons/router.json'
import { ChainId } from 'interfaces'

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [ChainId.ZKTESTNET]: '0xb6d65a6e0AA575e2280427D58375Ee5cED42A764',
    [ChainId.GOERLI]: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    [ChainId.MUMBAI]: '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc',
}

const FACTORIES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.ZKTESTNET]: '0xeac28210FaAb564f3A922d84416dA8b43800Ab35',
    [ChainId.GOERLI]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.MUMBAI]: '0x011DfB37B3d1AB94C9C598785aA6fe948D079Cb0',
}

const ROUTERS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    [ChainId.ZKTESTNET]: '0x8092Ab17e351ac382143a84e4a6F8424dF2F9976',
    [ChainId.GOERLI]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    [ChainId.MUMBAI]: '0x6D0DB9992Fa4309CbF781Ea6134f50CB437d9Ad4',
}

const INIT_CODE_HASHES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.ZKTESTNET]:
        '0x1cafd7f831ed50a8def8f323b2387e7e26d406e121b1c70dc59ef4f00ff0601e',
    [ChainId.GOERLI]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.MUMBAI]:
        '0x17f3f03b4063530632eba024ef5b90dd5ab3efaa82f6a54a1a7d1025bb81c1dd',
}

export const WRAPPED_NATIVE_ADDRESSES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.ZKTESTNET]: '0x20b28b1e4665fff290650586ad76e977eab90c5d',
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
