import React, { useState } from 'react'
import { Row } from 'components/Layouts'
import styled from 'styled-components'
import BridgeIcon from 'assets/icons/bridge.svg'
import { Switch } from '@mui/material'

const Bridge = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <BridgeWrapper al="center" jus="space-between">
            <Row gap="10px" al="center">
                <img className="bridge-icon" src={BridgeIcon} alt="bridge" />
                <div className="b">Bridge</div>
            </Row>
            <Row al="center">
                <Switch onClick={() => setIsOpen(!isOpen)} checked={isOpen} />
            </Row>
        </BridgeWrapper>
    )
}

const BridgeWrapper = styled(Row)`
    width: 100%;
    height: 60px;
    background: var(--primary-bg);
    padding: 5px;
    border-radius: 8px;

    .bridge-icon {
        width: 35px;
    }
`

export default Bridge
