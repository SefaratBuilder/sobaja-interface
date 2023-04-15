import React, { useState } from 'react'
import styled from 'styled-components'
import Navigator from 'components/Navigator'
import NetworkSelector from 'components/NetworkSelector'
import Web3Status from 'components/Web3Status'
import SobajaLogo from 'assets/brand/sobajaswap-logo.svg'
import { Columns } from 'components/Layouts'
import { useNavigate } from 'react-router-dom'
import Faucet from 'components/Faucet'
import { useActiveWeb3React } from 'hooks'

const Header = () => {
    const [burgerNav, setBurgerNav] = useState(false)
    const navigate = useNavigate()
    const { account, chainId, deactivate } = useActiveWeb3React()

    return (
        <HeaderWrapper>
            <Logo onClick={() => navigate('/')}>
                <img className="logo" src={SobajaLogo} alt="sobaja swap logo" />
                <img
                    className="logo-mobile"
                    src="/favicon.ico"
                    alt="sobaja swap logo mobile"
                />
            </Logo>
            <Navigator burgerNav={burgerNav} setBurgerNav={setBurgerNav} />

            <Connector>
                <Faucet />
                <NetworkSelector />
                <Web3Status />
            </Connector>
            <WrapperNavigator onClick={() => setBurgerNav((i) => !i)}>
                {!burgerNav ? (
                    <>
                        <MenuIcon>
                            <span />
                            <span />
                            <span />
                        </MenuIcon>
                    </>
                ) : (
                    'X'
                )}
            </WrapperNavigator>
        </HeaderWrapper>
    )
}

export const HeaderWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr 400px;
    grid-gap: 10px;
    width: 100%;
    padding: 20px;
    align-items: center;
    justify-content: flex-end;

    @media screen and (max-width: 1100px) {
        grid-template-columns: 1fr 2fr 26px;
    }
    @media screen and (max-width: 576px) {
        grid-gap: 10px;
    }
`

const WrapperNavigator = styled.div`
    display: none;
    @media screen and (max-width: 1100px) {
        width: 38px;
        display: flex;
        height: 38px;
        background: linear-gradient(
            90deg,
            #002033 0%,
            rgba(0, 38, 60, 0.39) 100%
        );
        justify-content: center;
        font-weight: 600;
        font-style: normal;
        border-radius: 5px;
        padding: 8px;
        border: 1px solid #003b5c;
    }
`

export const Logo = styled.div`
    display: flex;
    width: 280px;
    cursor: pointer;

    img {
        width: 100%;
    }

    img:nth-child(2) {
        display: none;
        width: 50px;
    }

    @media screen and (max-width: 576px) {
        img:nth-child(1) {
            display: none;
        }
        img:nth-child(2) {
            display: flex;
        }
        width: 100px;
    }
`

export const Connector = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-end;
`

const MenuIcon = styled(Columns)`
    gap: 5px;
    height: 100%;
    width: 100%;
    justify-content: center;
    span {
        height: 2px;
        width: 100%;
        background: white;
    }
`

export default Header
