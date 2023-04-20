import MULTICALL_ABI from '../jsons/multicall.json'
import FACTORY_ABI from '../jsons/factory.json'
import ROUTER_ABI from '../jsons/router.json'
import FAUCET_ABI from '../jsons/faucet.json'
import { ChainId } from 'interfaces'

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [ChainId.ZKTESTNET]: '0xb6d65a6e0AA575e2280427D58375Ee5cED42A764',
    [ChainId.GOERLI]: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    [ChainId.MUMBAI]: '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc',
}

const FACTORIES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.ZKTESTNET]: '0x01C2d40418858562f8E5852895a48E2a8B3D01b5',
    [ChainId.GOERLI]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.MUMBAI]: '0x0D6E4ed8C702c387E2B0735f39d895990e5963b7',
}

const ROUTERS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295',
    // [ChainId.ZKTESTNET]: '0x765B2f78AC65ca5C45e0108A45c771528910B848', old
    [ChainId.ZKTESTNET]: '0xDCeA30E35Eb995Bc43DF40B9e43262afBc60795f', // test
    [ChainId.GOERLI]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    [ChainId.MUMBAI]: '0x7bA65FB5B3491c767D0345891D13480E07d41fEE',
}

const INIT_CODE_HASHES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.ZKTESTNET]:
        '0xa6ef5b58f860b28d9a964786f253a12478da51b66550b2bf1561fbaf149301ae',
    [ChainId.GOERLI]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.MUMBAI]:
        '0x0c18c0437decb2e9aeb8498fc7fd556cac1a8baef62ab1920708dc852189c9d7',
}

export const WRAPPED_NATIVE_ADDRESSES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.ZKTESTNET]: '0x20b28b1e4665fff290650586ad76e977eab90c5d',
    [ChainId.GOERLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.MUMBAI]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
}

const Faucet: { [chainId: number]: string } = {
    [ChainId.ZKTESTNET]: '0x512f8823C8541e371c6eAB6eee22d5CaB9945a7E',
    [ChainId.GOERLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.MUMBAI]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    [ChainId.ZKMAINNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
}


export {
    MULTICALL_ABI,
    MULTICALL_NETWORKS,
    FACTORIES,
    FACTORY_ABI,
    ROUTERS,
    ROUTER_ABI,
    FAUCET_ABI,
    Faucet,
    INIT_CODE_HASHES,
}
