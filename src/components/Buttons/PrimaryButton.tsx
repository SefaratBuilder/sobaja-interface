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
    size?: string
}

const PrimaryButton = ({
    img,
    height,
    name,
    onClick,
    disabled,
    type,
    color,
    isLoading,
    size,
}: PrimaryButtonProps) => {
    return (
        <Button
            height={height}
            onClick={() => onClick()}
            disabled={disabled}
            className={type}
            color={color}
            isLoading={isLoading}
            size={size}
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
    isLoading?: boolean
    size?: string
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
    font-size: ${({ size }) => (size ? size : '1rem')};

    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    letter-spacing: 0.3;
    cursor: ${({ disabled }) =>
        disabled ? 'not-allowed !important' : 'pointer'};
    opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
    color: var(--text1);
    font-family: Inter, sans-serif;
    span {
        font-weight: 400;
        font-size: ${({ size }) => (size ? size : '1rem')};
    }
    @media screen and (max-width: 767px) {
        height: ${({ height }) => (height ? height : '40px')};
        span {
            font-size: ${({ size }) => (size ? size : '14px')};
        }
    }

    &.option-login {
        gap: 10px;
        height: 48px;
        @media screen and (max-width: 767px) {
            height: 42px;
        }
        img {
            height: 35px;
            width: 35px;
            border-radius: 50%;
            @media screen and (max-width: 767px) {
                height: 30px;
                width: 30px;
            }
        }
    }

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
    &.white-black {
        color: black;
        background: white;
        span {
            font-weight: 500;
        }
    }

    &.faucet {
        img {
            height: 25px;
            width: 25px;
            border-radius: 50%;
        }
        justify-content: flex-start;
        gap: 5px;
        padding: 5px 10px;
    }
    ${({ isLoading }) =>
        isLoading &&
        `
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
