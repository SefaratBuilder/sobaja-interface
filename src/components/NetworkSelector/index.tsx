import React from 'react'
import styled from 'styled-components'
import PrimaryButton from 'components/Buttons/PrimaryButton'

const NetworkSelector = () => {
    return (
        <NetworkSelectorWrapper>
            <PrimaryButton
                name="Change"
                type="blue"
                onClick={() => console.log('change')}
            />
        </NetworkSelectorWrapper>
    )
}

const NetworkSelectorWrapper = styled.div`
    position: relative;
    width: 140px;
`

export default NetworkSelector
