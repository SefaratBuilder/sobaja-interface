import MULTICALL_ABI from '../jsons/multicall.json'
import FACTORY_ABI from '../jsons/factory.json'
import ROUTER_ABI from '../jsons/router.json'
import FAUCET_ABI from '../jsons/faucet.json'
import FAUCETSOBA_ABI from '../jsons/faucetSoba.json'
import STAKING_ABI from '../jsons/staking.json'
import { ChainId, Token } from 'interfaces'
import ETH from 'assets/token-logos/eth.svg'


const MULTICALL_NETWORKS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [ChainId.ZKTESTNET]: '0xb6d65a6e0AA575e2280427D58375Ee5cED42A764',
    [ChainId.GOERLI]: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    [ChainId.MUMBAI]: '0xB151dC6839fD13aefE69593FD12327d4F459E6eB',
}

const FACTORIES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.ZKTESTNET]: '0x01C2d40418858562f8E5852895a48E2a8B3D01b5',
    [ChainId.GOERLI]: '0x216d07bD1C0F24740b8c88Ee9088b34FFae4b445',
    [ChainId.MUMBAI]: '0x0D6E4ed8C702c387E2B0735f39d895990e5963b7',
}

const ROUTERS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295',
    // [ChainId.ZKTESTNET]: '0x765B2f78AC65ca5C45e0108A45c771528910B848', old
    [ChainId.ZKTESTNET]: '0xDCeA30E35Eb995Bc43DF40B9e43262afBc60795f', // ref
    [ChainId.GOERLI]: '0x78CFcb22e41dD58B92fF09bb54Ab1238c25ce0b1',
    // [ChainId.MUMBAI]: '0x7bA65FB5B3491c767D0345891D13480E07d41fEE', // old
    [ChainId.MUMBAI]: '0xd6E887A268b0422851c10e88D7e1CaA5F03Ee2E2', // ref
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

const LAUNCHPADS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.ZKTESTNET]: '0x01C2d40418858562f8E5852895a48E2a8B3D01b5',
    [ChainId.GOERLI]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.MUMBAI]: '0x3C7cEeD9CbfA02d5170eFA1f1D32DD5aEDAB5De9',
}

const STAKING: { [chainId: number]: string } = {
    // [ChainId.MUMBAI]: '0xbb61B03fa28502599f398326B3Bffb07e8053C49',
    [ChainId.MUMBAI]: '0x6b1d9BF7a17F80dAbf350FDFDa9087E342FBFAbA',
}

const STAKING_TOKEN: { [chainId: number]: string } = {
    [ChainId.MUMBAI]: '0xdEfd221072dD078d11590D58128399C2fe8cCa7e',
}

const LAUNCHPAD_ACCESS_MANAGERS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.ZKTESTNET]: '0x01C2d40418858562f8E5852895a48E2a8B3D01b5',
    [ChainId.GOERLI]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.MUMBAI]: '0x8C5F48F82cae6D6BC4a64E68AF62c8830394909B',
}

export const WRAPPED_NATIVE_ADDRESSES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.ZKTESTNET]: '0x20b28b1e4665fff290650586ad76e977eab90c5d',
    [ChainId.GOERLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.MUMBAI]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
}

const Faucet: { [chainId: number]: string } = {
    [ChainId.ZKTESTNET]: '0x512f8823C8541e371c6eAB6eee22d5CaB9945a7E',
    [ChainId.GOERLI]: '0x433468E86fFb24b79df22E0b11d14517f967aabe',
    [ChainId.MUMBAI]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    [ChainId.ZKMAINNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
}

const FaucetSoba: { [chainId: number]: string } = {
    [ChainId.ZKTESTNET]: '0x7B988Ce49935878E415914B1e5fbc1DA27f91325',
    [ChainId.GOERLI]: '0x4000b56201b6bC61328991Ab21C2fe0dc8A1D849',
    [ChainId.MUMBAI]: '0x4000b56201b6bC61328991Ab21C2fe0dc8A1D849',
    [ChainId.ZKMAINNET]: '0x4000b56201b6bC61328991Ab21C2fe0dc8A1D849',
}

const AAEntryPoints: { [chainId: number]: string } = {
    [ChainId.ZKTESTNET]: '0x8E1f025D386C6A1DBF0D4143AB4f69945F39aEEf',
    [ChainId.GOERLI]: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    [ChainId.MUMBAI]: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    [ChainId.ZKMAINNET]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
}

const AAFactory: { [chainId: number]: string } = {
    [ChainId.ZKTESTNET]: '0x27aD0F9905BD47C1C46F51BbaBB2509717918fBD',
    [ChainId.GOERLI]: '0x000000F9eE1842Bb72F6BBDD75E6D3d4e3e9594C',
    [ChainId.MUMBAI]: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    [ChainId.ZKMAINNET]: '0xAAC689E7b679F03CD5ef2b8A888e7a709966cF84',
}

const PAYMASTERS: { [chainId: number]: string } = {
    [ChainId.ZKTESTNET]: '0xe21b991650Bf6a3065Abb0eAC543846fb5f0af07',
    [ChainId.GOERLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.MUMBAI]: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    [ChainId.ZKMAINNET]: '0xAAC689E7b679F03CD5ef2b8A888e7a709966cF84',
}

const FaucetTokens: { [chainId: number]: Array<Token> } = {
    [ChainId.ZKTESTNET]: [
        {
            "address": '0x0000000000000000000000000000000000000000',
            "symbol": "ETH",
            "decimals": 18,
            "logoURI": ETH,
            "name": "Ethereum",
            "chainId": ChainId.ZKTESTNET,
        },
        {
            "address": "0x4cD67E306ecaD1Cac71a2BD4abC1A4c22B55d331",
            "symbol": "Soba",
            "decimals": 18,
            "logoURI": "/images/sbj.svg",
            "name": "Sobaja test token",
            "chainId": ChainId.ZKTESTNET
        },
        {
            "address": "0x14b92edf57277eBd00c3B7C3C3C714f7F7aa45AB",
            "symbol": "DAI",
            "decimals": 18,
            "logoURI": "https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/dai.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615",
            "name": "DAI",
            "chainId": ChainId.ZKTESTNET,
        },
        {
            "address": "0x400de4eC1f3B697aAb2f60dFEb089859c85db58d",
            "symbol": "USDC",
            "decimals": 18,
            "logoURI": "https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/usdc.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615",
            "name": "USD Coin",
            "chainId": ChainId.ZKTESTNET,
        },
        {
            "address": "0xDf9acc0a00Ae6Ec5eBc8D219d12A0157e7F18A68",
            "symbol": "USDT",
            "decimals": 18,
            "logoURI": "https://raw.githubusercontent.com/forbitspace/icons/main/token/usdt.jpg",
            "name": "USDT Coin",
            "chainId": ChainId.ZKTESTNET,
        },

    ],
    [ChainId.ZKMAINNET]: [],
    [ChainId.GOERLI]: [
        {
            "address": '0x0000000000000000000000000000000000000000',
            "symbol": "ETH",
            "decimals": 18,
            "logoURI": ETH,
            "name": "Ethereum",
            "chainId": ChainId.GOERLI,
        },
        {
            "address": "0x9f49D892597ED5F08fe058fF3826859bEDC987a6",
            "symbol": "Soba",
            "decimals": 18,
            "logoURI": "/images/sbj.svg",
            "name": "Sobaja test token",
            "chainId": ChainId.GOERLI
        },
        {
            "address": "0x161d04115afA19Ce3eEe85cca184E7e07811Ce8b",
            "symbol": "DAI",
            "decimals": 18,
            "logoURI": "https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/dai.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615",
            "name": "DAI",
            "chainId": ChainId.GOERLI,
        },
        {
            "address": "0xC4a71a882D95B97d4356B0FA1169f9d262A0396b",
            "symbol": "USDC",
            "decimals": 18,
            "logoURI": "https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/usdc.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615",
            "name": "USD Coin",
            "chainId": ChainId.GOERLI,
        },
        {
            "address": "0xA6fB84257E1Abf6903d9d8d8c5CA4ce8bE9B2920",
            "symbol": "USDT",
            "decimals": 18,
            "logoURI": "https://raw.githubusercontent.com/forbitspace/icons/main/token/usdt.jpg",
            "name": "USDT Coin",
            "chainId": ChainId.GOERLI,
        },

    ],
    [ChainId.MUMBAI]: []
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
    LAUNCHPADS,
    LAUNCHPAD_ACCESS_MANAGERS,
    STAKING,
    STAKING_TOKEN,
    STAKING_ABI,
    AAEntryPoints,
    AAFactory,
    FaucetTokens,
    FaucetSoba,
    FAUCETSOBA_ABI,
    PAYMASTERS
}
