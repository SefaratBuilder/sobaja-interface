import React from 'react'
import { Field } from 'interfaces'
import styled from 'styled-components'

interface InputProps {
    value: string | undefined
    field: Field
    onUserInput: (field: Field, value: string) => void
}

const Input = ({ value, onUserInput, field }: InputProps) => {
    const validateInputNumber = (e: string) => {
        const value = e
            .replace(/[^0-9.,]/g, '')
            .replace(' ', '')
            .replace(',', '.')
            .replace(/(\..*?)\..*/g, '$1')
        onUserInput(field, value)
    }

    return (
        <InputWrapper
            type="text"
            placeholder="0.0"
            onChange={(e) => validateInputNumber(e.target.value)}
            value={value}
        />
    )
}

const InputWrapper = styled.input`
    width: 100%;
    font-size: 30px;
    font-weight: 500;

    &::placeholder {
        opacity: 0.7;
    }
`

export default Input
