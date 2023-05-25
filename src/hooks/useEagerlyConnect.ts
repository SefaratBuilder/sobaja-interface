import { Connector } from '@web3-react/types'
import { useGetConnection, networkConnection, } from 'components/connection'
import { Connection } from 'components/connection/types'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'states/hook'
import { updateSelectedWallet, } from 'states/user/reducer'


async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function useEagerlyConnect() {
  const dispatch = useAppDispatch()
  const selectedWallet = useAppSelector((state) => {
    return state.user.selectedWallet
  });
  const getConnection = useGetConnection()

  let selectedConnection: Connection | undefined
  console.log("selectedWallet", selectedWallet)
  if (selectedWallet && selectedWallet !== 'ARGENT') {
    try {
      selectedConnection = getConnection(selectedWallet)
    } catch {
      dispatch(updateSelectedWallet({ wallet: undefined }))
    }
  }

  useEffect(() => {
    connect(networkConnection.connector)
    if (selectedConnection) {
      connect(selectedConnection.connector)

    } // The dependency list is empty so this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps




}