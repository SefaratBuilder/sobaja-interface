import React, { Suspense, useEffect, useState } from 'react'
import {
    Routes,
    Route,
    Navigate,
    HashRouter,
    useLocation,
} from 'react-router-dom'
import { GlobalStyle } from './styles'
import styled from 'styled-components'
import Header from 'components/Header'
import Web3ReactManager from 'components/Web3ReactManager'
import SwapUpdater from 'states/swap/updater'
import MintUpdater from 'states/mint/updater'
import AppUpdater from 'states/application/updater'
import MulticallUpdater from 'states/multicall/updater'
import ListUpdater from 'states/lists/updater'
import Polling from 'components/Polling'
import Swap from 'pages/swap'
import AddLiquidity from 'pages/add'
import Pools from 'pages/pool'
import NFTs from 'pages/nfts'
import Bridge from 'pages/bridge'
import ReactGA from 'react-ga4'
import StakeDetails from 'pages/staking/index'
import Launchpad from 'pages/launchpad'
import ToastMessage from 'components/ToastMessage'

const App = () => {
    const Updater = () => {
        const { pathname, search } = useLocation()
        useEffect(() => {
            ReactGA.send({ hitType: 'pageview', page: `${pathname}${search}` })
        }, [pathname, search])

        return (
            <>
                <SwapUpdater />
                <MintUpdater />
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
                    <ToastMessage />
                    {/* <TestTransaction /> */}
                    <Routes>
                        <Route path="/swap" element={<Swap />} />
                        <Route path="/pools" element={<Pools />} />
                        <Route path="/add" element={<AddLiquidity />} />
                        <Route path="/test-launchpad" element={<Launchpad />} />
                        <Route path="/staking" element={<StakeDetails />} />
                        <Route path="/bridge" element={<Bridge />} />
                        <Route path="/nfts" element={<NFTs />} />
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
