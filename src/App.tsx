import React from 'react'
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'
import { GlobalStyle } from './styles'
import Swap from 'pages/swap'
import AddLiquidity from 'pages/add'
import styled from 'styled-components'
import Header from 'components/Header'
import Web3ReactManager from 'components/Web3ReactManager'
import SwapUpdater from 'states/swap/updater'
import AppUpdater from 'states/application/updater'
import MulticallUpdater from 'states/multicall/updater'
import Polling from 'components/Polling'
import Pools from 'pages/pool'

const App = () => {
    const Updater = () => {
        return (
            <>
                <SwapUpdater />
                <AppUpdater />
                <MulticallUpdater />
            </>
        )
    }

    return (
        <Web3ReactManager>
            <HashRouter>
                <GlobalStyle />
                <Updater />
                <Header />
                <AppContainer>
                    <Routes>
                        <Route path="/swap" element={<Swap />} />
                        <Route path="/pools" element={<Pools />} />
                        <Route path="/add" element={<AddLiquidity />} />
                        <Route path="*" element={<Navigate to="/swap" />} />
                    </Routes>
                    <Polling />
                </AppContainer>
            </HashRouter>
        </Web3ReactManager>
    )
}

const AppContainer = styled.div`
    position: relative;
`

export default App
