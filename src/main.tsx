import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './states'
import getLibrary from 'utils/getLibrary'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Web3ProviderNetwork getLibrary={getLibrary}>
                    <App />
                </Web3ProviderNetwork>
            </Web3ReactProvider>
        </Provider>
    </React.StrictMode>,
)
