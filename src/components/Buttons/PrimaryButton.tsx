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
    isLoading?: boolean
}

const PrimaryButton = ({
    img,
    height,
    name,
    onClick,
    disabled,
    type,
    color,
    isLoading
}: PrimaryButtonProps) => {
    return (
        <Button
            height={height}
            onClick={() => onClick()}
            disabled={disabled}
            className={type}
            color={color}
            isLoading={isLoading}
        >
            {img && <img src={img} alt="button image" />} <span>{name}</span>
        </Button>
    )
}

export default PrimaryButton

export const Button = styled.button<{ height?: any; color?: any, isLoading? :boolean }>`
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
    cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
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

    ${({isLoading}) => isLoading && `
        :after {
            content: '.';
            animation: loading linear 3s infinite;
            @keyframes loading {
                0% {
                    content: '.';
                }
                50% {
                    content: '..';
                }
                100% {
                    content: '...';
                }
            }
        }
    `}
`
