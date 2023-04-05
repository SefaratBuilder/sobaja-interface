import { AbstractConnector } from "@web3-react/abstract-connector";
import METAMASK_ICON_URL from "assets/icons/metamask.svg";
import { InjectedConnector } from '@web3-react/injected-connector'
import { ALL_SUPPORTED_CHAIN_IDS } from "constants/chains";
import { injected } from "components/Connectors";
interface WalletInfo {
    connector?: AbstractConnector;
    name: string;
    iconURL: string;
    description: string;
    href: string | null;
    color: string;
    primary?: true;
    mobile?: true;
    mobileOnly?: true;
}





export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    METAMASK: {
        connector: injected,
        name: "MetaMask",
        iconURL: METAMASK_ICON_URL,
        description: "Easy-to-use browser extension.",
        href: null,
        color: "#E8831D",
    },
};