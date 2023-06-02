import React, { Suspense, useEffect } from 'react'
import {
    Routes,
    Route,
    Navigate,
    HashRouter,
    useLocation,
} from 'react-router-dom'
import styled from 'styled-components'
import Header from 'components/Header'
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
import StakeDetails from 'pages/staking'
import Launchpad from 'pages/launchpad'
import AA from 'pages/account-abstraction'
import ToastMessage from 'components/ToastMessage'
import StakePools from 'pages/staking/listpoolstake'
import UsersUpdater from 'states/users/updater'

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
                <UsersUpdater />
            </>
        )
    }

    return (
        <HashRouter>
            <Updater />
            <Header />

            <AppContainer>
                <ToastMessage />
                {/* {smartLoading && <HiddenWeb3Auth />} */}
                <Routes>
                    <Route path="/swap" element={<Swap />} />
                    <Route path="/pools" element={<Pools />} />
                    <Route path="/add" element={<AddLiquidity />} />
                    <Route path="/test-launchpad" element={<Launchpad />} />
                    <Route path="/test-staking" element={<StakePools />} />
                    <Route path="/staking" element={<StakeDetails />} />
                    <Route path="/bridge" element={<Bridge />} />
                    <Route path="/nfts" element={<NFTs />} />
                    <Route path="/account-abstraction" element={<AA />} />
                    <Route path="*" element={<Navigate to="/swap" />} />
                </Routes>
                <Polling />
            </AppContainer>
        </HashRouter>
    )
}

const AppContainer = styled.div`
    position: relative;
    padding: 20px 0;
`

export default App
