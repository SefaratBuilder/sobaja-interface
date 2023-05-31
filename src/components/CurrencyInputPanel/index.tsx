import React from 'react'
import styled from 'styled-components'
import { Field, Token } from 'interfaces'
import Input from 'components/Input'
import TokenListModal from 'components/TokenListModal'
import { Columns } from 'components/Layouts'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'hooks'
import { fixNum } from 'utils/math'
import { useSmartAccountContext } from 'contexts/SmartAccountContext'

interface CurrencyInputPanelProps {
    token: Token | undefined
    value: string | undefined
    field: Field
    onUserInput: (field: Field, value: string) => void
    onUserSelect: (field: Field, token: Token) => void
    hideMaxButton?: boolean
}

const CurrencyInputPanel = ({
    token,
    value,
    field,
    onUserInput,
    onUserSelect,
    hideMaxButton,
}: CurrencyInputPanelProps) => {
    const { account, chainId } = useActiveWeb3React()
    const { wallet } = useSmartAccountContext()
    const balance = useCurrencyBalance(wallet?.address || account, token)
    const handleOnMax = () => {
        if (balance) onUserInput(field, balance)
    }

    return (
        <Wrapper>
            <Row>
                <Input value={value} field={field} onUserInput={onUserInput} />
                {chainId && (
                    <TokenListModal
                        onUserSelect={onUserSelect}
                        field={field}
                        token={token}
                    />
                )}
            </Row>
            <Row>
                <div className="t2">$</div>
                <div className="t2 balance">
                    <span className="to">
                        Balance: {balance ? balance?.toString() : 0}
                    </span>
                    {!hideMaxButton && (
                        <span className="max-btn" onClick={handleOnMax}>
                            Max
                        </span>
                    )}
                </div>
            </Row>
        </Wrapper>
    )
}

const Wrapper = styled(Columns)`
    background: var(--bg3);
    padding: 15px;
    gap: 10px;
    border-radius: 8px;
`

const Row = styled.div`
    display: grid;
    grid-template-columns: 1fr max(150px);
    grid-gap: 12px;

    .t2 {
        font-size: 14px;
    }
    .balance {
        display: flex;
        align-items: center;
        gap: 5px;
        justify-content: space-between;
    }

    .to {
        padding: 0 2px;
    }
    .max-btn {
        background: var(--bg6);
        color: white;
        padding: 4px 10px;
        border-radius: 5px;
        font-size: 10px;
        cursor: pointer;
        transition: all ease-in-out 0.1s;
        :hover {
            opacity: 0.7;
        }
    }
`

export default CurrencyInputPanel
