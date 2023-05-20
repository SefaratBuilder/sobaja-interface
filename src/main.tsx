import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './states'
import { Buffer } from 'buffer'
import { SmartAccountProvider } from 'contexts/SmartAccountContext'
import { Web3AuthProvider } from 'contexts/SocialLoginContext'
import { GlobalStyle } from 'styles'
import Web3Provider from './components/Web3Provider'
import ReactGA from 'react-ga4'

ReactGA.initialize('G-K8KM7MVBW1')

window.Buffer = Buffer

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GlobalStyle />
        <Provider store={store}>
            <Web3Provider>
                <Web3AuthProvider>
                    <SmartAccountProvider>
                        <App />
                    </SmartAccountProvider>
                </Web3AuthProvider>
            </Web3Provider>
        </Provider>
    </React.StrictMode>,
)
