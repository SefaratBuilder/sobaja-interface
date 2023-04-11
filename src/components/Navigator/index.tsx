import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import BurgerNav from './BugerNav'
interface NavigationProps {
    burgerNav: boolean
    setBurgerNav: React.Dispatch<React.SetStateAction<boolean>>
}

const Navigator = ({ burgerNav, setBurgerNav }: NavigationProps) => {
    return (
        <>
            <NavigatorWrapper>
                <Link to="swap">Swap</Link>
                <Link to="pools">Pool</Link>
                <Link to="earn">Earn</Link>
                <Link to="nft">NFTs</Link>
                <Link to="launchpad">Launchpad</Link>
            </NavigatorWrapper>
            <BurgerNav burgerNav={burgerNav} setBurgerNav={setBurgerNav} />
        </>
    )
}

const NavigatorWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    @media screen and (max-width: 992px) {
        display: none;
        /* position: absolute;
        flex-direction: column;
        background: black;
        inset: 0;

        width: 400px;
        height: 100vh;
        z-index: 2; */
    }
`

export default Navigator
