import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Row } from 'components/Layouts'
import Setting from 'components/Setting'

const Swap = () => {

    return (
        <SwapContainer>
            <Row jus="space-between">
                <Row gap="20px">
                    <Link to="swap">Swap</Link>
                    <Link to="limit">Limit</Link>
                </Row>
                <Setting />
            </Row>
        </SwapContainer>
    )
}

const SwapContainer = styled.div`
	position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: fit-content;
    min-height: 500px;
    max-width: 430px;
    background: #130f0f;
    border: 1px solid rgb(0, 59, 92);
    border-radius: 12px;
    padding: 20px 25px;
    background: linear-gradient(to top right, rgba(0, 28, 44, 0.3), rgba(0, 28, 44, 0.3));

`

export default Swap
