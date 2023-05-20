import { Connector } from "@web3-react/types";
import { getEthereumProvider } from "@argent/login";
import { Web3Provider } from '@ethersproject/providers'


import type {
    Actions,
    AddEthereumChainParameter,
    Provider,
    ProviderConnectInfo,
    ProviderRpcError,
    WatchAssetParameters,
} from '@web3-react/types'
import detectEthereumProvider from "@metamask/detect-provider";


type MetaMaskProvider = Provider & {
    isConnected?: () => boolean
    providers?: MetaMaskProvider
    get chainId(): string
    get accounts(): string[]
}

function parseChainId(chainId: string) {
    return Number.parseInt(chainId, 16)
}


export class Argent extends Connector {
    public provider?: MetaMaskProvider = undefined;
    private readonly options?: Parameters<typeof detectEthereumProvider>[0]
    private eagerConnection?: Promise<void>

    constructor({ actions, options, onError }: any) {
        super(actions, onError)
        this.options = options
    }
    public async ArgentEthereumProvider() {
        const ethereumProvider = await getEthereumProvider({
            chainId: 1,
            rpcUrl: "https://ethereum.publicnode.com",
        });
        const provider = new Web3Provider(ethereumProvider);
        if (provider) {
            this.provider = provider as any
            if (!this.provider) return
            return this.provider
        }
    }

    private async isomorphicInitialize(): Promise<void> {
        if (this.eagerConnection) return
        return this.eagerConnection = await this.ArgentEthereumProvider()

    }




    public async activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter): Promise<void> {
        let cancelActivation: () => void
        if (!this.provider?.isConnected?.()) cancelActivation = this.actions.startActivation()
        return this.isomorphicInitialize()
            .then(async () => {
                if (!this.provider) throw new Error('provider is not exits')

                // Wallets may resolve eth_chainId and hang on eth_accounts pending user interaction, which may include changing
                // chains; they should be requested serially, with accounts first, so that the chainId can settle.
                const accounts = (await this.provider.request({ method: 'eth_requestAccounts' })) as string[]
                const chainId = (await this.provider.request({ method: 'eth_chainId' })) as string
                const receivedChainId = parseChainId(chainId)
                const desiredChainId =
                    typeof desiredChainIdOrChainParameters === 'number'
                        ? desiredChainIdOrChainParameters
                        : desiredChainIdOrChainParameters?.chainId

                // if there's no desired chain, or it's equal to the received, update
                if (!desiredChainId || receivedChainId === desiredChainId) {
                    const ss = this.actions.update({ chainId: receivedChainId, accounts })
                    console.log("ss=>>>>", ss)
                    return this.actions.update({ chainId: receivedChainId, accounts });
                }
            })
            .catch((error) => {
                cancelActivation?.()
                throw error
            })
    }

}