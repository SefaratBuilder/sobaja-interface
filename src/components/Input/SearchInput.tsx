import React, { ChangeEventHandler } from 'react'
import styled from 'styled-components'
import imgGlass from 'assets/icons/magnifying-glass.svg'

interface SearchInputProps {
    value: string | number | undefined
    placeholder: string
    onChange: ChangeEventHandler<HTMLInputElement>
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
    return (
        <WrapInput>
            <img src={imgGlass} alt="Search Icon" />
            <Input
                type="text"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
            />
        </WrapInput>
    )
}

export default SearchInput

const WrapInput = styled.div`
    border: 0.3px solid var(--border1);
    position: relative;
    border-radius: 8px;
    img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 10px;
        width: 18px;
        height: 18px;
    }
`
const Input = styled.input`
    width: 100%;
    padding: 0 2rem;
    height: 40px;
    border: none;
    background: none;
    
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    font-weight: 200;

    :focus {
        outline: 1px solid #fff;
    }
    ::placeholder {
        color: var(--border1);
    }
`
