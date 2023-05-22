


import { AbstractConnector } from "@web3-react/abstract-connector";
import { ethers } from "ethers";
import { getEthereumProvider } from "@argent/login";
import warning from 'tiny-warning'
import { Web3Provider } from '@ethersproject/providers'


export class ArgentConnector extends AbstractConnector {

    provider: Web3Provider | null = null;
    chainId: number | null = null;

    constructor(kwargs: any) {
        super(kwargs)
        this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    }

    private handleAccountsChanged(accounts: string[]): void {
        if (accounts.length === 0) {
            this.emitDeactivate()
        } else {

            this.emitUpdate({ account: accounts[0] })
        }
    }
    async activate(): Promise<any> {
        console.log("activate")
        try {
            const ethereumProvider = await getEthereumProvider({
                chainId: 1,
                rpcUrl: "https://ethereum.publicnode.com",
            });
            const provider = new Web3Provider(ethereumProvider);
            provider.on('accountsChanged', this.handleAccountsChanged)
            // try to activate + get account via eth_requestAccounts
            let account: any;
            if (!account) {
                account = (await ethereumProvider.enable())[0];
            } else {
                account = (await ethereumProvider.request({ method: 'eth_requestAccounts' }) as any)[0];
            }
            // const signer = provider.getSigner();
            // const address = await signer.getAddress();
            // const chainId = await provider.getNetwork().then(network => network.chainId);
            return { provider: ethereumProvider, ...(account ? { account } : {}) }

        } catch (error) {
            throw new Error("Failed to activate Metamask connector");
        }
    }

    async getProvider(): Promise<Web3Provider> {
        console.log("getProvider")
        if (this.provider) {
            return this.provider;
        } else {
            throw new Error("ArgentConnector: provider is not available");
        }
    }

    async getChainId(): Promise<string | number> {
        console.log("getChainId")

        let chainId;
        try {
            const ethereumProvider = await getEthereumProvider({
                chainId: 1,
                rpcUrl: "https://ethereum.publicnode.com",
            });

            chainId = await ethereumProvider.request({ method: "eth_chainId" });
            console.log("chainId", chainId)
        } catch {
            warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
        }
        return '0x1';
    }
    async getAccount(): Promise<string | null> {
        console.log("getAccount")
        return '0x1'
        // if (this.account !== undefined) {
        //     return this.account;
        // } else {
        //     throw new Error("ArgentConnector: account is not available");
        // }
    }
    async deactivate(): Promise<void> {
        console.log("deactivate")
        // this.emitDeactivate();
        // this.provider = null;
        // this.chainId = null;
        // this.account = null;
        const ethereumProvider = await getEthereumProvider({
            chainId: 1,
            rpcUrl: "https://ethereum.publicnode.com",
        });
        const provider = new Web3Provider(ethereumProvider);

        if (provider) {
            // window.bitkeep.ethereum.removeListener('chainChanged', this.handleChainChanged)
            provider.removeListener('accountsChanged', this.handleAccountsChanged)
            // window.bitkeep.ethereum.removeListener('close', this.handleClose)
            // window.bitkeep.ethereum.removeListener('networkChanged', this.handleNetworkChanged);
            localStorage.removeItem("walletconnect");
        }
    }

}