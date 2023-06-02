import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useWeb3AuthContext } from 'contexts/SocialLoginContext';
import { ChainId } from 'interfaces';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useAppState, useUpdateIsSmartAccount } from 'states/application/hooks';
import { updateSelectedWallet } from 'states/user/reducer';

export function useActiveWeb3React() {
    const { address: web3AuthAccount, chainId: web3AuthChainId, ethersProvider: web3AuthProvider, connect: web3AuthConnect, disconnect: web3AuthDisconnect, switchNetwork } = useWeb3AuthContext()
    const { account, chainId, provider, connector } = useWeb3ReactCore<Web3Provider>()
    const { isSmartAccount } = useAppState()
    const updateIsSmartAccount = useUpdateIsSmartAccount()

    const dispatch = useDispatch()

    const disconnect = () => {
        if (isSmartAccount) {
            updateIsSmartAccount(false)
        } else if (web3AuthAccount) {
            web3AuthDisconnect()
        } else {
            {
                if (connector && connector.deactivate) {
                    connector.deactivate()
                }
                connector.resetState()
                dispatch(updateSelectedWallet({ wallet: undefined }))
            }
        }
    }

    return {
        account: web3AuthAccount || account,
        chainId: web3AuthAccount ? web3AuthChainId : chainId && Object.keys(ChainId).includes(chainId.toString()) ? chainId : 280,
        provider: web3AuthAccount ? web3AuthProvider : provider,
        disconnect,
        web3AuthConnect,
        connector,
        isSmartAccount,
        switchNetwork: web3AuthAccount ? switchNetwork : undefined,
    }
}
