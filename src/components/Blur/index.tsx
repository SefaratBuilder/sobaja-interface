import styled, { createGlobalStyle } from 'styled-components'

const Blur = () => {
    return (
        <div>
            <Container />
            <GlobalStyle />
        </div>
    )
}

export default Blur
const Container = styled.div`
    position: fixed;
    width: 100%;
    top: 0;
    height: 100vh;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.424);
    z-index: 998;
    transition: all 0.2s linear;
    display: block;
`

const GlobalStyle = createGlobalStyle`
    body {
        overflow: hidden;
    }
`
