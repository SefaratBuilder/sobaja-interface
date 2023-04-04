import React from 'react'
import { Token } from 'interfaces'
import styled from 'styled-components'
import { Row } from 'components/Layouts'
import LogoToken from 'components/LogoToken'

interface CommonBaseProps {
    token: Token
    onUserSelect: (token: Token) => void
}

const CommonBase = ({ token, onUserSelect }: CommonBaseProps) => {
    return (
        <WrapperCommonBase onClick={() => onUserSelect(token)}>
            <LogoToken token={token} />
            <div>{token.symbol}</div>
        </WrapperCommonBase>
    )
}

const WrapperCommonBase = styled(Row)`
    background: none;
    padding: 6px 10px;
    border-radius: 8px;
    gap: 5px;
    cursor: pointer;
    align-items: center;
    border: 1px solid var(--border1);
    transition: all ease-in-out 0.3s;

    &:hover {
        background: #19a5f739;
    }
`

export default CommonBase
