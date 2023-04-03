import React from 'react'
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'
import { GlobalStyle } from './styles'
import Swap from './pages/swap'
import styled from 'styled-components'
import { useSwapState } from './states/swap/hooks'
import { useTokenList } from './states/lists/hooks'
import Header from './components/Header'

const App = () => {
    const swapState = useSwapState()
    const listState = useTokenList()

    return (
        <HashRouter>
            <GlobalStyle />
            <Header />
            <AppContainer>
                <Routes>
                    <Route path="/swap" element={<Swap />} />
                    <Route path="*" element={<Navigate to="/swap" />} />
                </Routes>
            </AppContainer>
        </HashRouter>
    )
}

const AppContainer = styled.div``

export default App
