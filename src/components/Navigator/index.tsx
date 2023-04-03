import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Navigator = () => {
    return (
        <NavigatorWrapper>
            <Link to="swap">Swap</Link>
            <Link to="pools">Pool</Link>
            <Link to="earn">Earn</Link>
            <Link to="nft">NFTs</Link>
            <Link to="launchpad">Luanchpad</Link>
        </NavigatorWrapper>
    )
}

const NavigatorWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`

export default Navigator
