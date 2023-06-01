import React from 'react'
import { Token } from 'interfaces'
import styled from 'styled-components'
import { Row } from 'components/Layouts'
import LogoToken from 'components/LogoToken'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'hooks'
import { useWeb3AuthContext } from 'contexts/SocialLoginContext'
import { useSmartAccountContext } from 'contexts/SmartAccountContext'

interface TokenSelectionProps {
    token: Token
    onUserSelect: (token: Token) => void
    hideAddButton?: boolean
    onAdd?: () => void
}

const TokenSelection = ({
    token,
    onUserSelect,
    hideAddButton = true,
    onAdd,
}: TokenSelectionProps) => {
    const { account } = useActiveWeb3React()
    const { smartAccountAddress } = useSmartAccountContext()
    const balance = useCurrencyBalance(smartAccountAddress || account, token)

    return (
        <WrapperSelection onClick={() => onUserSelect(token)}>
            <div className={'element-selection'}>
                <LogoToken token={token} size={'28px'} />
            </div>
            <div className={'element-selection'}>
                <div className="token-symbol">{token.symbol}</div>
                <div className="token-name">
                    <span>{token.name}</span>
                </div>
            </div>
            <div className={'element-selection'}>
                <div>{balance ? Number(balance).toFixed(4) : 0}</div>
                {!hideAddButton && (
                    <div className={'add-btn'} onClick={onAdd}>
                        Add to coin list
                    </div>
                )}
            </div>
        </WrapperSelection>
    )
}

const WrapperSelection = styled(Row)`
    width: 100%;
    cursor: pointer;
    box-shadow: none;
    justify-content: space-between;
    font-style: normal;
    padding: 10px;

    .add-btn {
        color: #0089ff;
        position: relative;
        z-index: 1;
    }

    &:hover {
        background: var(--hover2);
    }

    .element-selection {
        display: flex;
        align-items: center;
    }

    .element-selection:nth-child(2) {
        width: 45%;
        flex-direction: column;
        align-items: flex-start;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        gap: 2px;
        .token-name {
            font-size: 12px;
            color: ${({ theme }) => theme.text1};
            display: flex;
            gap: 4px;
            align-items: center;

            .dot {
                width: 4px;
                height: 4px;
                background: ${({ theme }) => theme.bgc1};
                border-radius: 50%;
            }
        }
        .token-symbol {
            font-size: 12.5px;
        }
    }

    .element-selection:nth-child(3) {
        width: 45%;
        overflow: hidden;
        align-items: flex-end;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-direction: column;
        padding-right: 2px;
        .add-btn:hover {
            text-decoration: underline;
        }
    }
`

export default TokenSelection
