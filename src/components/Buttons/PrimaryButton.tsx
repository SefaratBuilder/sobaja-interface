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

export const Button = styled.button<{
    height?: any
    color?: any
    disabled?: boolean
}>`
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

    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    letter-spacing: 0.3;
    cursor: ${({ disabled }) =>
        disabled ? 'not-allowed !important' : 'pointer'};
    opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
    color: var(--text1);
    font-family: Inter, sans-serif;

    :hover {
        opacity: 0.8;
    }

    @media screen and (max-width: 576px) {
        font-size: 0.8rem;
    }

    &.modal {
        background: #00b2ff;
        width: 85%;
        margin: auto;
        span {
            font-style: normal;
        }
    }

    &.launch-pad {
        /* width: 65%; */
        /* border-radius: 2px; */
        border: none;
        padding: 8px;
        height: fit-content;
        background: #111;
        /* font-size: 14px; */

        span {
            font-size: 14px !important;
        }
    }
`
