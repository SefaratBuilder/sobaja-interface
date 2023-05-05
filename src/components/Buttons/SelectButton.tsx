import React from 'react'
import styled from 'styled-components'
import { Token } from 'interfaces'
import LogoToken from 'components/LogoToken'
import ArrowDownDark from 'assets/icons/chevron-white.svg'

interface SelectTokenButtonProps {
    token: Token | undefined
    onClick: () => void
    name?: string
    disabled?: boolean
}

const SelectTokenButton = ({
    disabled,
    token,
    name,
    onClick,
}: SelectTokenButtonProps) => {
    return (
        <Button disabled={disabled} onClick={() => onClick()}>
            <div>
                {token ? (
                    <>
                        <LogoToken size={'24px'} token={token} />
                        <span>{token.symbol}</span>
                    </>
                ) : (
                    <span>{name || 'Select a token'}</span>
                )}
            </div>
            {
                <img
                    className="chevron-down"
                    src={ArrowDownDark}
                    alt="arrow down"
                />
            }
        </Button>
    )
}

export default SelectTokenButton

const Button = styled.button`
    
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    padding: 4px 8px;
    
    gap: 10px;
    box-shadow: rgb(0 0 0 / 25%) 0px 4px 4px 0px;
    color: #fff;
    border: 1.5px solid var(--border1);
    width: fit-content;
    background: none;
    font-size: 14px;
    width: 100%;
    font-family: Inter, sans-serif;
    cursor: pointer;
    div {
        display: flex;
        align-items: center;
        gap: 3px;
    }

    .logo-token {
        width: 25px;
        height: 25px;
        border-radius: 50%;
    }

    :hover {
        background: var(--);
    }
    .chevron-down {
        width: 16px;
    }
`
