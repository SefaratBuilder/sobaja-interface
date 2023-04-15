import React from 'react'
import styled from 'styled-components'
import PairTokens from 'components/LogoToken/PairTokens'
import { Columns } from 'react-feather'
import { Row } from 'components/Layouts'
import { Token } from 'interfaces'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'hooks'
import { useAllPairs } from 'hooks/useAllPairs'

const Pool = ({tokenA, tokenB, tokenLp} : {tokenA:  Token, tokenB: Token, tokenLp: Token}) => {
    const { account } = useActiveWeb3React()
    const balanceTokenA = useCurrencyBalance(account, tokenA)
    const balanceTokenB = useCurrencyBalance(account, tokenB)
    const balanceTokenLp = useCurrencyBalance(account, tokenLp)

    return(
        <PoolWrapper>
            <Columns>
                <Row>
                    <PairTokens tokenA={tokenA.logoURI} tokenB={tokenB.logoURI} />
                </Row>
                <Row>
                    <div>
                        Your pool share:
                    </div>
                    <div>
                        {balanceTokenLp?._value} %
                    </div>
                </Row>
            </Columns>
            <Columns>
                <Row>
                    <PairTokens tokenA={tokenA.logoURI} tokenB={tokenB.logoURI} />
                </Row>
                <Row>
                    <div>
                        Your pool share:
                    </div>
                    <div>
                        {0.123213} %
                    </div>
                </Row>
            </Columns>
            <Columns>
                <Row>
                    <div>{tokenA.symbol}</div>
                    <div>{tokenB.symbol}</div>
                </Row>
                <Row>
                    <div>
                        {balanceTokenA?._value}
                    </div>
                    <div>
                        {balanceTokenB?._value} %
                    </div>
                </Row>
            </Columns>
        </PoolWrapper>
    )
}

const Positions = () => {
    const allPair = useAllPairs()
    console.log({allPair})
    return(
        <PositionsWrapper>
            
        </PositionsWrapper>
    )
}

const PositionsWrapper = styled.div`
    padding: 16px;
    border-top: .5px solid gray;
`

const PoolWrapper = styled.div`

`

export default Positions

