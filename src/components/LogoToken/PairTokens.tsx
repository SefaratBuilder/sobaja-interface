import React from 'react'
import styled from 'styled-components'

const PairTokens = ({ tokenA, tokenB }: any) => {
    return (
        <LabelToken>
            <div>
                <img src={tokenA} alt="" />
            </div>
            <div className="right">
                <img src={tokenB} alt="" />
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
    }
`

export default PairTokens
