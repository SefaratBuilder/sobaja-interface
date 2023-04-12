import React from 'react'
import styled from 'styled-components'

interface PrimaryButtonProps {
    img?: string
    height?: string
    name: string
    onClick?: any
    disabled?: boolean
    type?: string
    color?: string
}

const PrimaryButton = ({
    img,
    height,
    name,
    onClick,
    disabled,
    type,
    color,
}: PrimaryButtonProps) => {
    return (
        <Button
            height={height}
            onClick={() => onClick()}
            disabled={disabled}
            className={type}
            color={color}
        >
            {img && <img src={img} alt="button image" />} <span>{name}</span>
        </Button>
    )
}

export default PrimaryButton

export const Button = styled.button<{ height?: any; color?: any }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${({ height }) => (height ? height : '40px')};
    border-radius: 8px;
    border: 1px solid var(--border2);
    outline: none;
    background: ${({ color }) =>
        color
            ? color
            : 'linear-gradient(87.2deg, #00B2FF 2.69%, #003655 98.02%);'};
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
