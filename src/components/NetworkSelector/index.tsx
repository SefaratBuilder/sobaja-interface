import React from 'react'
import styled from 'styled-components'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import LogoETH from 'assets/token-logos/eth.svg'
import imgDownArrowWhite from 'assets/icons/chevron-white.svg'

const NetworkSelector = () => {
    return (
        <NetworkSelectorWrapper>
            {/* <PrimaryButton
                name="Change"
                type="blue"
                onClick={() => console.log('change')}
            /> */}
            <NetworkButton>
                <img src={LogoETH} alt="logo-eth" />
                <img src={imgDownArrowWhite} alt="arrow-down" />
            </NetworkButton>
        </NetworkSelectorWrapper>
    )
}

const NetworkSelectorWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: flex-end;

    @media screen and (max-width: 576px) {
        display: none;
    }
`

const NetworkButton = styled.div`
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background: linear-gradient(90deg, #002033 0%, rgba(0, 38, 60, 0.39) 100%);
    z-index: 1;
    padding: 3px;
    border: 1px solid #003b5c;
    border-radius: 6px;
    cursor: pointer;

    img {
        width: 24px;
    }

    img:nth-child(2) {
        width: 14px;
    }
`

export default NetworkSelector
