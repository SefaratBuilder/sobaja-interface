import React, { useEffect, useState } from 'react'
import {
    Routes,
    Route,
    Navigate,
    HashRouter,
    useLocation,
} from 'react-router-dom'
import { GlobalStyle } from './styles'
import Swap from 'pages/swap'
import AddLiquidity from 'pages/add'
import styled from 'styled-components'
import Header from 'components/Header'
import Web3ReactManager from 'components/Web3ReactManager'
import SwapUpdater from 'states/swap/updater'
import AppUpdater from 'states/application/updater'
import MulticallUpdater from 'states/multicall/updater'
import ListUpdater from 'states/lists/updater'
import Polling from 'components/Polling'
import Pools from 'pages/pool'
import ToastMessage from 'components/ToastMessage'
import TestTransaction from 'components/TestTransaction'
import ReactGA from 'react-ga4'

const App = () => {
    const Updater = () => {
        const { pathname, search } = useLocation()
        useEffect(() => {
            ReactGA.send({ hitType: 'pageview', page: `${pathname}${search}` })
        }, [pathname, search])

        return (
            <>
                <SwapUpdater />
                <AppUpdater />
                <MulticallUpdater />
                <ListUpdater />
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
                    {/* <ToastMessage /> */}
                    {/* <TestTransaction /> */}
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
    padding: 20px 0;
`

export default App
