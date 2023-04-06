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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${({ height }) => (height ? height : '40px')};
    border-radius: 8px;
    border: 1px solid var(--border2);
    outline: none;
    background: var(--btn1);
    font-size: 1rem;
    font-style: italic;
    font-weight: 300;
    letter-spacing: 0.3;
    cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
    color: var(--text1);

    :hover {
        opacity: 0.8;
    }
`
