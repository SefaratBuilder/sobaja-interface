import React from 'react'
import styled from 'styled-components'
import PrimaryButton from 'components/Buttons/PrimaryButton'

const Web3Status = () => {
    return (
        <Web3StatusWrapper>
            <PrimaryButton
                name="Connect wallet"
                type="blue"
                onClick={() => console.log('connect wallet')}
            />
        </Web3StatusWrapper>
    )
}

export const Web3StatusWrapper = styled.div`
    width: 160px;
`

export default Web3Status
