import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './states'
import getLibrary from 'utils/getLibrary'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Buffer } from 'buffer'
import { SmartAccountProvider } from 'contexts/SmartAccountContext'
import { Web3AuthProvider } from 'contexts/SocialLoginContext'
import { GlobalStyle } from 'styles'

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK')
import ReactGA from 'react-ga4'

ReactGA.initialize('G-K8KM7MVBW1')

window.Buffer = Buffer

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GlobalStyle />
        <Provider store={store}>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Web3ProviderNetwork getLibrary={getLibrary}>
                    <Web3AuthProvider>
                        <SmartAccountProvider> 
                            <App />
                        </SmartAccountProvider>
                    </Web3AuthProvider>
                </Web3ProviderNetwork>
            </Web3ReactProvider>
        </Provider>
    </React.StrictMode>,
)
