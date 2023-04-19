import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import SobajaswapLogo from 'assets/brand/sobajaswap-logo.svg'
import { itemNav } from '.'

interface BurgerNavProps {
    burgerNav: boolean
    setBurgerNav: React.Dispatch<React.SetStateAction<boolean>>
}
const BurgerNav = ({ burgerNav, setBurgerNav }: BurgerNavProps) => {
    const loca = useLocation()

    return (
        <>
            <Container burgerNav={burgerNav}>
                <Logo>
                    <img
                        className="logo"
                        src={SobajaswapLogo}
                        alt="sobaja swap logo"
                    />
                </Logo>
                {itemNav.map((item, index) => {
                    return (
                        <StyledLink
                            key={index + 1}
                            className="nav-text"
                            to={item.path || loca.pathname}
                        >
                            <span className="underline-name">{item.name}</span>
                        </StyledLink>
                    )
                })}
            </Container>
            {burgerNav ? <Blur onClick={() => setBurgerNav(false)} /> : <></>}
        </>
    )
}

export default BurgerNav
const Container = styled.div<{ burgerNav: boolean }>`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    background: var(--bg5);
    backdrop-filter: blur(10px);

    width: 300px;
    height: 100vh;
    z-index: 16;
    list-style: none;
    padding: 20px;
    display: flex;
    flex-direction: column;
    text-align: start;
    transition: transform 0.2s ease-in;
    transform: ${({ burgerNav }) =>
        burgerNav ? 'translateX(0px)' : 'translateX(-300px)'};

    a {
        padding: 15px 0;
        border-bottom: 1px solid white;
        color: ${({ theme }) => theme.text1};
    }
    @media screen and (max-width: 390px) {
        width: 220px;
    }
`

const Logo = styled.div`
    img {
        height: 50px;
    }
    @media screen and (max-width: 390px) {
        img {
            height: 35px;
        }
    }
`

const Blur = styled.div`
    position: fixed;
    width: 100%;
    top: 0;
    height: 100vh;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.424);
    z-index: 4;
    transition: all 0.2s linear;
`
const StyledLink = styled(NavLink)`
    font-weight: 500;
    position: relative;
    display: flex;
    font-size: 18px;
    text-decoration: none;
    text-shadow: 0 0 64px rgb(192 219 255 / 48%), 0 0 16px rgb(65 120 255 / 24%);
    align-items: center;
    color: ${({ theme }) => theme.text1};

    &:hover {
        color: ${({ theme }) => theme.text2};
    }

    span {
        font-size: 16px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        img {
            width: 20px;
        }
    }
`
