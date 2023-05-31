import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useWeb3AuthContext } from 'contexts/SocialLoginContext';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { updateSelectedWallet } from 'states/user/reducer';

export function useActiveWeb3React() {
    const { address: web3AuthAccount, chainId: web3AuthChainId, ethersProvider: web3AuthProvider, connect: web3AuthConnect, disconnect: web3AuthDisconnect } = useWeb3AuthContext()
    const { account, chainId, provider, connector } = useWeb3ReactCore<Web3Provider>()
    const dispatch = useDispatch()

    const disconnect = () => {
        if (web3AuthAccount) {
            web3AuthDisconnect()
        } else {
            if (connector && connector.deactivate) {
                connector.deactivate()
            }
            connector.resetState()
            dispatch(updateSelectedWallet({ wallet: undefined }))
        }
    }

    return useMemo(() => {
        return {
            account: web3AuthAccount || account,
            chainId: web3AuthChainId || chainId,
            provider: web3AuthProvider || provider,
            disconnect,
            web3AuthConnect,

        }
    }, [
        web3AuthAccount, web3AuthChainId, web3AuthProvider, account, chainId, provider, disconnect, web3AuthConnect
    ]);
}
