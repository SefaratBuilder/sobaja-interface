import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './states'
import getLibrary from 'utils/getLibrary'
import { Web3ReactProvider, Web3ReactHooks } from '@web3-react/core'
// createWeb3ReactRoot
import { Buffer } from 'buffer'
import { SmartAccountProvider } from 'contexts/SmartAccountContext'
import { Web3AuthProvider } from 'contexts/SocialLoginContext'
import { GlobalStyle } from 'styles'
import { Connector } from '@web3-react/types'
// const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK')
import Web3Provider from './components/Web3Provider'
import ReactGA from 'react-ga4'

ReactGA.initialize('G-K8KM7MVBW1')

window.Buffer = Buffer

// const connections = useOrderedConnections()
// const connectors: [Connector, Web3ReactHooks][] = connections.map(({ hooks, connector }) => [connector, hooks])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GlobalStyle />
        <Provider store={store}>
            <Web3Provider>
                {/* <Web3ReactProvider connectors={connectors}> */}
                {/* <Web3ProviderNetwork getLibrary={getLibrary}> */}
                <Web3AuthProvider>
                    <SmartAccountProvider>
                        <App />
                    </SmartAccountProvider>
                </Web3AuthProvider>
                {/* </Web3ProviderNetwork> */}
            </Web3Provider>
            {/* </Web3ReactProvider> */}
        </Provider>
    </React.StrictMode>,
)
