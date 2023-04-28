import { AbstractConnector } from '@web3-react/abstract-connector'
import METAMASK_ICON_URL from 'assets/icons/metamask.svg'
import COINBASE_ICON_URL from 'assets/icons/coinbase.svg'
import BINANCECONNECT_ICON_URL from 'assets/icons/binance.svg'
import WALLETCONNECT_ICON_URL from 'assets/icons/wallet-connect.svg'
import BITKEEP_ICON from 'assets/icons/BitKeep.jpeg';
import OKEX_ICON from 'assets/token-logos/okex.png'
import { InjectedConnector } from '@web3-react/injected-connector';

import { injected, CoinbaseWallet, walletconnect, bitkeep, okex } from 'connectors'
interface WalletInfo {
    connector?: AbstractConnector
    name: string
    iconURL: string
    description: string
    href: string | null
    color: string
    primary?: true
    mobile?: true
    mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    METAMASK: {
        connector: injected,
        name: 'MetaMask',
        iconURL: METAMASK_ICON_URL,
        description: 'Easy-to-use browser extension.',
        href: 'https://metamask.io/',
        color: '#E8831D',
    },
    WALLET_LINK: {
        connector: CoinbaseWallet,
        name: 'Coinbase Wallet',
        iconURL: COINBASE_ICON_URL,
        description: 'Use Coinbase Wallet app on mobile device',
        href: null,
        color: '#315CF5',
    },
    WALLET_CONNECT: {
        connector: walletconnect,
        name: 'WalletConnect',
        iconURL: WALLETCONNECT_ICON_URL,
        description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
        href: null,
        color: '#4196FC',
        mobile: true,
    },
    BitKeep: {
        connector: bitkeep,
        name: 'BitKeep Wallet',
        iconURL: BITKEEP_ICON,
        description: 'Login using BitKeep hosted wallet',
        href: 'https://bitkeep.com/',
        color: '#4A6C9B',
        mobile: true,
    },
    OkexChain: {
        connector: okex,
        name: 'OKX Wallet',
        iconURL: OKEX_ICON,
        description: 'Login using OKX hosted wallet',
        href: 'https://www.okx.com/vi/download',
        color: '#4A6C9B',
        mobile: true,
    },
}
