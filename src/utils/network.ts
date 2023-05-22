
import detectEthereumProvider from '@metamask/detect-provider'

export const changeNetwork = async (mainnet: any, mainnetString: string) => {
    await detectEthereumProvider().then((res: any) => {
        if (mainnetString !== 'ethereum') {
            res.request({
                method: 'wallet_addEthereumChain',
                params: mainnet,
            })
        } else
            res.request({
                method: 'wallet_switchEthereumChain',
                params: mainnet,
            })
    })
}