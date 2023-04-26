import React from 'react'
import styled from 'styled-components'
import UNKNOWN from 'assets/icons/question-mark-button-dark.svg'
import tokenList from 'constants/jsons/tokenList.json'

const PairTokens = ({ tokenA, tokenB }: { tokenA: string, tokenB: string}) => {
    const logoA = tokenList.find(t => t.address == tokenA || t.symbol == tokenA)?.logoURI || UNKNOWN
    const logoB = tokenList.find(t => t.address == tokenB || t.symbol == tokenB)?.logoURI || UNKNOWN

    return (
        <LabelToken>
            <div>
                <img src={logoA} alt="token logo" />
            </div>
            <div className="right">
                <img src={logoB} alt="token logo" />
            </div>
        </LabelToken>
    )
}

const LabelToken = styled.div`
    display: flex;

    .right {
        position: relative;
        left: -6px;
        z-index: 1;
    }

    img {
        width: 25px;
        border-radius: 50%;
    }
`

export default PairTokens
