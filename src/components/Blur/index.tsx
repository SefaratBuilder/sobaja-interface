import styled from 'styled-components'

const Blur = () => {
    return (
        <>
            <Container />
        </>
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
    z-index: 1;
    transition: all 0.2s linear;
    display: block;
`
