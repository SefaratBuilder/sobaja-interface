import { AbstractConnector } from '@web3-react/abstract-connector'
import METAMASK_ICON_URL from 'assets/icons/metamask.svg';
import COINBASE_ICON_URL from "assets/icons/coinbase.svg";
import BINANCECONNECT_ICON_URL from "assets/icons/binance.svg";
import WALLETCONNECT_ICON_URL from "assets/icons/wallet-connect.svg"
import { InjectedConnector } from '@web3-react/injected-connector'
import { ALL_SUPPORTED_CHAIN_IDS } from 'constants/chains'
import {
    injected, CoinbaseWallet, walletconnect,
    binance
} from 'components/Connectors'


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
        href: "https://metamask.io/",
        color: '#E8831D',
    },
    WALLET_LINK: {
        connector: CoinbaseWallet,
        name: "Coinbase Wallet",
        iconURL: COINBASE_ICON_URL,
        description: "Use Coinbase Wallet app on mobile device",
        href: null,
        color: "#315CF5",
    },
    WALLET_CONNECT: {
        connector: walletconnect,
        name: "WalletConnect",
        iconURL: WALLETCONNECT_ICON_URL,
        description: "Connect to Trust Wallet, Rainbow Wallet and more...",
        href: null,
        color: "#4196FC",
        mobile: true,
    },
    Binance: {
        connector: binance,
        name: "Binance Chain Wallet",
        iconURL: BINANCECONNECT_ICON_URL,
        description: "Login using Binance hosted wallet",
        href: "https://www.bnbchain.world/en",
        color: "#4A6C9B",
        mobile: true,
    },

}
