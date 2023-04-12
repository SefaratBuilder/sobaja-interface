import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import { FACTORIES, INIT_CODE_HASHES } from 'constants/addresses'
import { ChainId } from 'constants/index'
import { Field, Token } from 'interfaces'
import { FixedNumber } from 'ethers'
import { mul, div, add, sub, divNumberWithDecimal } from './math'

export const isSortedTokens = (tokenA: Token, tokenB: Token): Boolean => {
    const result = tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
    return result
}

export const sortsToken = (tokenA: Token, tokenB: Token): Token[] => {
    return isSortedTokens(tokenA, tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
}

export const calculateAmountOut = (
    amountIn: string | number,
    reserveIn: string | number,
    reserveOut: string | number,
    fee: string | number,
): string => {
    console.log({ amountIn, reserveIn, reserveOut })
    const amountInWithFee = mul(amountIn, fee)
    const numerator = mul(amountInWithFee, reserveOut)
    const denominator = add(reserveIn, amountInWithFee)
    const amountOut = div(numerator, denominator)
    return amountOut
}

export const calculateAmountIn = (
    amountOut: string | number,
    reserve_in: string | number,
    reserve_out: string | number,
    fee: string | number,
): string => {
    const numerator = mul(reserve_in, amountOut)
    const denominator = mul(fee, sub(reserve_out, amountOut))
    const amount_in = add(div(numerator, denominator), 1)
    return amount_in
}

export const computePairAddress = ({
    chainId,
    tokenA,
    tokenB,
}: {
    chainId: ChainId | undefined
    tokenA: Token | undefined
    tokenB: Token | undefined
}): string | undefined => {
    if (!tokenA || !tokenB || !chainId) return
    const [token0, token1] = sortsToken(tokenA, tokenB) // does safety checks
    return getCreate2Address(
        FACTORIES[chainId],
        keccak256(
            ['bytes'],
            [pack(['address', 'address'], [token0.address, token1.address])],
        ),
        INIT_CODE_HASHES[chainId],
    )
}

export interface IPair {
    token0: Token
    token1: Token
    tokenLp: Token
    reserve0: string | number
    reserve1: string | number
    reserveLp: string | number
}

export class Pair {
    token0: Token
    token1: Token
    tokenLp: Token
    reserve0: string | number
    reserve1: string | number
    reserveLp: string | number
    fee = 0.0025 //25

    constructor(pair: IPair) {
        const isSorted = isSortedTokens(pair.token0, pair.token1)
        this.token0 = isSorted ? pair.token0 : pair.token1
        this.token1 = isSorted ? pair.token1 : pair.token0
        this.tokenLp = pair.tokenLp
        this.reserve0 = pair.reserve0
        this.reserve1 = pair.reserve1
        this.reserveLp = pair.reserveLp
        this.reserve0 = pair.reserve0
        this.reserve1 = pair.reserve1
        this.reserveLp = pair.reserveLp
    }

    currentShareOfPool(reserveLp: string) {
        return mul(div(reserveLp, this.reserveLp), 100)
    }

    calcShareOfPool(
        amount0: string | number,
        amount1: string | number,
        token0: Token,
        token1: Token,
    ) {
        const tempAmount = amount0
        amount0 = isSortedTokens(token0, token1) ? amount0 : amount1
        amount1 = isSortedTokens(token0, token1) ? amount1 : tempAmount
        if (this.reserve0 && this.reserve1 && this.reserveLp) {
            // const lpShare0 = amount0.mul(this.reserveLp).div(this.reserve0)
            // const lpShare1 = amount1.mul(this.reserveLp).div(this.reserve1)

            const lpShare0 = div(mul(amount0, this.reserveLp), this.reserve0)
            const lpShare1 = div(mul(amount1, this.reserveLp), this.reserve1)

            const addedLp = lpShare0.lt(lpShare1) ? lpShare0 : lpShare1
            const shareOfLp = addedLp
                .div(addedLp.add(this.reserveLp))
                .mul(100) //%
            return shareOfLp
        }
        return 100
    }

    calcAddRate(
        amountIn: string | number,
        tokenIn: Token,
        tokenOut: Token,
        field: Field,
    ) {
        if (this.reserve0 && this.reserve1) {

            const result1 = div(mul(amountIn, this.reserve1), this.reserve0);
            const result0 = div(mul(amountIn, this.reserve0), this.reserve1);

            if (
                (field === Field.INPUT && isSortedTokens(tokenIn, tokenOut)) ||
                (field === Field.OUTPUT && !isSortedTokens(tokenIn, tokenOut))
            ) {
                return divNumberWithDecimal(result1, (this.token1.decimals))
            } else {
                return divNumberWithDecimal(result0, (this.token0.decimals))
            }
        }
        return ''
    }

    calcSwapRate(
        amount: string | number,
        tokenIn: Token,
        tokenOut: Token,
        field: Field,
    ) {
        if (this.reserve0 && this.reserve1 && amount) {
            const isSortedAmountOut = calculateAmountOut(
                amount,
                this.reserve0,
                this.reserve1,
                sub(1, this.fee),

            )
            const isNotSortedAmountOut = calculateAmountOut(
                amount,
                this.reserve1,
                this.reserve0,
                sub(1, this.fee),
            )
            const isSortedAmountIn = calculateAmountIn(
                amount,
                this.reserve0,
                this.reserve1,
                sub(1, this.fee),
            )
            const isNotSortedAmountIn = calculateAmountIn(
                amount,
                this.reserve1,
                this.reserve0,
                sub(1, this.fee),
            )

            if (field === Field.INPUT) {
                if (isSortedTokens(tokenIn, tokenOut))
                    return divNumberWithDecimal(isSortedAmountOut, tokenOut.decimals)
                else
                    return divNumberWithDecimal(isNotSortedAmountOut, tokenOut.decimals)
            }

            if (field === Field.OUTPUT) {
                if (isSortedTokens(tokenIn, tokenOut))
                    return divNumberWithDecimal(isSortedAmountIn, tokenIn.decimals)
                else
                    return divNumberWithDecimal(isNotSortedAmountIn, tokenIn.decimals)
            }
        }
        return ''
    }

    calcLPAmount(
        amount0: string | number,
        amount1: string | number,
        token0: Token,
        token1: Token,
    ) {
        const tempAmount = amount0
        amount0 = isSortedTokens(token0, token1) ? amount0 : amount1
        amount1 = isSortedTokens(token0, token1) ? amount1 : tempAmount
        if (this.reserve0 && this.reserve1 && this.reserveLp) {
            const lpShare0 = div(mul(amount0, this.reserveLp), this.reserve0)
            const lpShare1 = div(mul(amount1, this.reserveLp), this.reserve1)

            const addedLp = lpShare0.lt(lpShare1) ? lpShare0 : lpShare1
            return addedLp
        }
        const addedLp = Number(mul(amount0, amount1).toString()) - 1000
        return addedLp
    }

    getToken0PerToken1Rate() {
        return div(this.reserve1, this.reserve0)
    }

    getToken1PerToken0Rate() {
        return div(this.reserve0, this.reserve1)
    }
}
