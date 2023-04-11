import MULTICALL_ABI from '../jsons/multicall.json'
import FACTORY_ABI from '../jsons/factory.json'
import ROUTER_ABI from '../jsons/router.json'
import { ChainId } from '..'

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [ChainId.ZKTESTNET]: '0xb6d65a6e0AA575e2280427D58375Ee5cED42A764',
    [ChainId.GOERLI]: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    [ChainId.MUMBAI]: '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc',
}

const FACTORIES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.ZKTESTNET]: '0x02D74f4b3C3b55dC7Ecae36C7CFA696828CDF348',
    [ChainId.GOERLI]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.MUMBAI]: '0x011DfB37B3d1AB94C9C598785aA6fe948D079Cb0',
}

const ROUTERS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    [ChainId.ZKTESTNET]: '0x8Ad6de397Ab44bD0b7C34801A8D4d71CE75EfF4f',
    [ChainId.GOERLI]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    [ChainId.MUMBAI]: '0x93Ff755a30F1C1F7cCEfD06a1412C88e700D87c7',
}

const INIT_CODE_HASHES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.ZKTESTNET]:
        '0x3475adab255cd0db7772175d9a78d13d335e88a5a2924b8f36bb48684791cb11',
    [ChainId.GOERLI]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.MUMBAI]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
}

export const WRAPPED_NATIVE_COIN: { [chainId in ChainId]: string } = {
    [ChainId.ZKMAINNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.ZKTESTNET]: '0x20b28b1e4665fff290650586ad76e977eab90c5d',
    [ChainId.GOERLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.MUMBAI]: '0x062f24cb618e6ba873EC1C85FD08B8D2Ee9bF23e',
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
