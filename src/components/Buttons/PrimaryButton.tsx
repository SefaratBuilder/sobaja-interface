import React from 'react'
import styled from 'styled-components'

interface PrimaryButtonProps {
    img?: string
    height?: string
    name: string
    onClick?: any
    disabled?: boolean
    type?: string
}

const PrimaryButton = ({
    img,
    height,
    name,
    onClick,
    disabled,
    type,
}: PrimaryButtonProps) => {
    return (
        <Button
            height={height}
            onClick={() => onClick()}
            disabled={disabled}
            className={type}
        >
            {img && <img src={img} alt="button image" />} <span>{name}</span>
        </Button>
    )
}

export default PrimaryButton

export const Button = styled.button<{ height: any }>`
    font-family: 'Montserrat', sans-serif;
    display: flex;
    font-style: italic;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${({ height }) => (height ? height : '40px')};
    border-radius: 8px;
    border: 1px solid #003b5c;
    outline: none;
    background: linear-gradient(to left, #002033 100%, #00263c 39%);
    color: white;
    font-size: 1rem;
    letter-spacing: 0.3;
    cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};

    :hover {
        opacity: 0.8;
    }
`
