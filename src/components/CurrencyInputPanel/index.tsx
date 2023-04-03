import React from 'react'
import styled from 'styled-components'
import { Field, Token } from 'interfaces'
import Input from 'components/Input'
import { Row } from 'components/Layouts'

interface CurrencyInputPanelProps {
    value: string | undefined
    field: Field
    onUserInput: (field: Field, value: string) => void
    onUserSelect: (field: Field, token: Token) => void
    hideMaxButton?: boolean
}

const CurrencyInputPanel = ({
    value,
    field,
    onUserInput,
}: CurrencyInputPanelProps) => {
    return (
        <Wrapper>
            <Row>
                <Input value={value} field={field} onUserInput={onUserInput} />
            </Row>
        </Wrapper>
    )
}

const Wrapper = styled.div``

export default CurrencyInputPanel
