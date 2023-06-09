import LogoERA from 'assets/token-logos/era.svg'
import LogoMatic from 'assets/token-logos/matic.svg'
import LogoETH from 'assets/token-logos/eth.svg'
import { Token, TokenList, ChainId } from 'interfaces/index'

export const ListNetwork = [
    {
        name: 'Mainnet',
        chainId: 324,
        logo: LogoERA,
        switchNetwork: [
            {
                chainId: 324,
                chainName: 'ZkSync',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://zksync2-mainnet.zksync.io'],
                blockExplorerUrls: ['https://explorer.zksync.io/'],
            },
        ],
    },
    {
        name: 'Testnet',
        chainId: 280,
        logo: LogoERA,
        switchNetwork: [
            {
                chainId: 280,
                chainName: 'ZkSync Testnet',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://zksync2-testnet.zksync.dev'],
                blockExplorerUrls: ['https://zksync2-testnet.zkscan.io'],
            },
        ],
    },
    // {
    //     name: 'Mumbai',
    //     chainId: 80001,
    //     logo: LogoMatic,
    //     switchNetwork: [
    //         {
    //             chainId: 80001,
    //             chainName: 'Mumbai',
    //             nativeCurrency: {
    //                 name: 'MATIC',
    //                 symbol: 'MATIC',
    //                 decimals: 18,
    //             },
    //             rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    //             blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
    //         },
    //     ],
    // },
    {
        name: 'Goerli',
        chainId: ChainId.GOERLI,
        logo: LogoETH,
        switchNetwork: [
            {
                chainId: ChainId.GOERLI,
                chainName: 'Goerli',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://goerli.infura.io/v3/4ce320c5dbb64931a12d1e2f34e582cf'],
                blockExplorerUrls: ['https://goerli.etherscan.io'],
            },
        ],
    },
    // { name: 'Mainet', logo: LogoERA, className: 'button-era', url: '' },
    // { name: 'Testnet', logo: LogoERA, className: 'button-era', url: '' },
]

export const InfoNetwork: {
    [chainId: number]: { name: string; logo: string }
} = {
    [ChainId.ZKMAINNET]: {
        name: 'Mainnet',
        logo: LogoERA,
    },
    [ChainId.ZKTESTNET]: {
        name: 'Testnet',
        logo: LogoERA,
    },
    [ChainId.MUMBAI]: {
        name: 'Mumbai',
        logo: LogoMatic,
    },
    [ChainId.GOERLI]: {
        name: 'Goerli',
        logo: LogoETH,
    },
}
