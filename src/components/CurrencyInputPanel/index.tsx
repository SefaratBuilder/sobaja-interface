import React from 'react'
import styled from 'styled-components'
import { Field, Token } from 'interfaces'
import Input from 'components/Input'
import TokenListModal from 'components/TokenListModal'
import { Columns } from 'components/Layouts'

interface CurrencyInputPanelProps {
    token: Token | undefined
    value: string | undefined
    field: Field
    onUserInput: (field: Field, value: string) => void
    onUserSelect: (field: Field, token: Token) => void
    hideMaxButton?: boolean
}

const CurrencyInputPanel = ({
    token,
    value,
    field,
    onUserInput,
    onUserSelect,
}: CurrencyInputPanelProps) => {
    return (
        <Wrapper>
            <Row>
                <Input value={value} field={field} onUserInput={onUserInput} />
                <TokenListModal
                    onUserSelect={onUserSelect}
                    field={field}
                    token={token}
                />
            </Row>
            <Row>
                <div className="t2">$</div>
                <div className="t2 to">Balance: {value || '0'}</div>
            </Row>
        </Wrapper>
    )
}

const Wrapper = styled(Columns)`
    background: var(--bg3);
    padding: 15px;
    gap: 10px;
    border-radius: 8px;
`

const Row = styled.div`
    display: grid;
    grid-template-columns: 1fr max(150px);

    .t2 {
        font-size: 14px;
    }
`

export default CurrencyInputPanel
