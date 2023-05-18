import { useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { useGetConnection, Connection, networkConnection, gnosisSafeConnection, web3Network, web3NetworkHooks, } from 'components/connection'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'states/hook'
import { updateSelectedWallet, } from 'states/user/reducer'


async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      console.log("connectEagerly1")
      await connector.connectEagerly()
    } else {
      console.log("connectEagerly2");
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function useEagerlyConnect() {
  const dispatch = useAppDispatch()
  // const { chainId, account } = useWeb3React();

  const selectedWallet = useAppSelector((state) => {
    return state.user.selectedWallet
  });
  const getConnection = useGetConnection()

  let selectedConnection: Connection | undefined
  if (selectedWallet) {
    try {
      selectedConnection = getConnection(selectedWallet)
    } catch {
      dispatch(updateSelectedWallet({ wallet: undefined }))
    }
  }

  useEffect(() => {
    console.log("0000000009>>>>>>>>>>>>>>>>>>>",)

    // const supportedChainIds = [1, 3, 4, 42];
    // connect(gnosisSafeConnection.connector)
    connect(networkConnection.connector)

    if (selectedConnection) {
      connect(selectedConnection.connector)
    } // The dependency list is empty so this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps




}