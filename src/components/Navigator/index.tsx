import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import BurgerNav from './BugerNav'

interface NavigationProps {
    burgerNav: boolean
    setBurgerNav: React.Dispatch<React.SetStateAction<boolean>>
}

export const itemNav = [
    { path: '/swap', name: 'Swap', img: '' },
    { path: '/pools', name: 'Pools', img: '' },
    { path: 'https://portal.zksync.io/bridge', name: 'Bridge', img: '', target: '_blank' },
    { path: '/earns', name: 'Earn', img: '' },
    { path: '/nfts', name: 'NFTs', img: '' },
    { path: '/launchpad', name: 'Launchpad', img: '' },
]

const Navigator = ({ burgerNav, setBurgerNav }: NavigationProps) => {
    return (
        <>
            <NavigatorWrapper>
                {
                    itemNav.map(item => {
                        return <Link to={item.path} target={item.target} >{item.name}</Link>
                    })
                }
            </NavigatorWrapper>
            <BurgerNav burgerNav={burgerNav} setBurgerNav={setBurgerNav} />
        </>
    )
}

const NavigatorWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    @media screen and (max-width: 1100px) {
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
