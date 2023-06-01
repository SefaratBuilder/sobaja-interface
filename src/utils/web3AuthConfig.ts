import { CustomChainConfig } from "@web3auth/base";
import { Web3AuthNoModalOptions } from "@web3auth/no-modal";
import { OpenloginAdapterOptions } from "@web3auth/openlogin-adapter";
import { ChainId } from "interfaces";

export const chainConfig: { [chainId in number]: CustomChainConfig } = {
    [ChainId.ZKTESTNET]: {
        chainNamespace: 'eip155',
        chainId: '0x118', // EVM chain's Chain ID
        rpcTarget:
            'https://testnet.era.zksync.dev', // EVM chain's RPC endpoint
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode, Alchemy, Ankr etc.
        displayName: 'zkSync Era testnet', // EVM chain's Name
        blockExplorer: 'https://goerli.explorer.zksync.io/', // EVM chain's Blockexplorer
        ticker: 'ETH', // EVM chain's Ticker
        tickerName: 'Ethereum', // EVM chain's Ticker Name
    },
    [ChainId.ZKMAINNET]: {
        chainNamespace: 'eip155',
        chainId: '0x144', // EVM chain's Chain ID
        rpcTarget:
            'https://mainnet.era.zksync.io', // EVM chain's RPC endpoint
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode, Alchemy, Ankr etc.
        displayName: 'zkSync Era', // EVM chain's Name
        blockExplorer: 'https://explorer.zksync.io/', // EVM chain's Blockexplorer
        ticker: 'ETH', // EVM chain's Ticker
        tickerName: 'Ethereum', // EVM chain's Ticker Name
    },
    [ChainId.MUMBAI]: {
        chainNamespace: 'eip155',
        chainId: '0x13881', // EVM chain's Chain ID
        rpcTarget:
            'https://polygon-mumbai.blockpi.network/v1/rpc/public', // EVM chain's RPC endpoint
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode, Alchemy, Ankr etc.
        displayName: 'Matic', // EVM chain's Name
        blockExplorer: 'https://polygonscan.com/', // EVM chain's Blockexplorer
        ticker: 'MATIC', // EVM chain's Ticker
        tickerName: 'Polygon', // EVM chain's Ticker Name
    },
    [ChainId.GOERLI]: {
        chainNamespace: 'eip155',
        chainId: '0x5', // EVM chain's Chain ID
        rpcTarget:
            'https://goerli.infura.io/v3/8f8561738d754550b1b5fdc095c6e0a9', // EVM chain's RPC endpoint
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode, Alchemy, Ankr etc.
        displayName: 'Goerli', // EVM chain's Name
        blockExplorer: 'https://goerli.etherscan.io/', // EVM chain's Blockexplorer
        ticker: 'ETH', // EVM chain's Ticker
        tickerName: 'Ethereum', // EVM chain's Ticker Name
    },
}

export const web3AuthConfig: Web3AuthNoModalOptions = {
    clientId:
        // 'BE7tc_MkDFzJp3ujQwPTeptBbTCE87628dJ7bcndPvcJYKT5NSRnbDk0NIYjW_4iAbNsxbPhoLwlMLMcsFA87Qc', // get from https://dashboard.web3auth.io
        'BBXxtX2BNExyTOqn90Mhh4KKL_OV-aMQbapEKD_fBzKUGfOh3Ha0kav783hmQc1e36hy_QffFlICBbGXRG1JWhk', // get from https://dashboard.web3auth.io
    web3AuthNetwork: 'mainnet',
    chainConfig: chainConfig[ChainId.ZKTESTNET],
}


export const openLoginAdapterConfig: OpenloginAdapterOptions = {
    adapterSettings: {
        uxMode: 'popup',
        whiteLabel: {
            name: 'Sobajaswap',
            logoLight:
                'https://web3auth.io/images/w3a-L-Favicon-1.svg',
            logoDark:
                'https://web3auth.io/images/w3a-D-Favicon-1.svg',
            defaultLanguage: 'en',
            dark: true, // whether to enable dark mode. defaultValue: false
        },
    },
}