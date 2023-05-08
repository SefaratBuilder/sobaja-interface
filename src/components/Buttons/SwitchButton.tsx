import React from 'react'
import styled from 'styled-components'

interface SwitchButtonProps {
    active: boolean
}
const SwitchButton = ({ active }: SwitchButtonProps) => {
    return (
        <Container>
            <p>On</p>
            <p>Off</p>
            <Overlay active={active} />
        </Container>
    )
}

export default SwitchButton
const Container = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    height: 26px;
    padding: 4px;
    font-size: 14px;
    background: rgba(157, 195, 230, 0.8);
    font-family: Inter, sans-serif;
    border-radius: 10px;
    border: none;
    width: fit-content;
    cursor: pointer;
    outline: none;
    padding: 2px;
    p {
        padding: 0.25rem 0.6rem;
        font-size: 14px;
        font-weight: 500;
        z-index: 1;
        width: 42px;
    }
`
const Overlay = styled.div<{ active: boolean }>`
    position: absolute;
    background: rgb(191, 194, 203, 0.6);
    left: ${({ active }) => (active ? '25%' : '75%')};
    top: 50%;
    border-radius: 8px;
    width: 40px;
    height: 23px;
    transform: translate(-50%, -50%);
`
