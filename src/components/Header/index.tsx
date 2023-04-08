import styled from 'styled-components'
import Navigator from 'components/Navigator'
import NetworkSelector from 'components/NetworkSelector'
import Web3Status from 'components/Web3Status'
import SobajaLogo from 'assets/brand/sobajaswap-logo.svg'

const Header = () => {
    return (
        <HeaderWrapper>
            <Logo>
                <img className="logo" src={SobajaLogo} alt="sobaja swap logo" />
            </Logo>
            <Navigator />
            <Connector>
                <NetworkSelector />
                <Web3Status />
            </Connector>
        </HeaderWrapper>
    )
}

export const HeaderWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    grid-gap: 20px;
    width: 100%;
    padding: 10px;
`

export const Logo = styled.div`
    width: 270px;

    img {
        width: 100%;
    }
`

export const Connector = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-end;
`

export default Header
