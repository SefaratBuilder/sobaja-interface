import React, { ReactNode, useMemo } from 'react'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { useOrderedConnections } from 'components/connection'
import useEagerlyConnect from 'hooks/useEagerlyConnect'

function Web3Provider({ children }: { children: ReactNode }) {
    useEagerlyConnect()
    const connections: any = useOrderedConnections()
    const connectors: [any, Web3ReactHooks][] = connections.map(
        ({ hooks, connector }: any) => [connector, hooks],
    )
    const key = useMemo(
        () =>
            connections
                .map((connection: any) => connection.getName())
                .join('-'),
        [connections],
    )
    return (
        <Web3ReactProvider connectors={connectors} key={key}>
            {children}
        </Web3ReactProvider>
    )
}

export default Web3Provider
