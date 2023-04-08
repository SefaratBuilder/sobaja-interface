import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import { FACTORIES, INIT_CODE_HASHES } from 'constants/addresses'
import { ChainId } from 'constants/index'
import { Field, Token } from 'interfaces'
import { FixedNumber } from 'ethers'
import { mul } from './math'

export const isSortedTokens = (tokenA: Token, tokenB: Token): Boolean => {
    const result = tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
    return result
}

export const sortsToken = (tokenA: Token, tokenB: Token): Token[] => {
    return isSortedTokens(tokenA, tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
}

export const calculateAmountOut = (
    amountIn: FixedNumber,
    reserveIn: FixedNumber,
    reserveOut: FixedNumber,
    fee: FixedNumber,
): FixedNumber => {
    const amountInWithFee = amountIn.mul(fee)
    const numerator = amountInWithFee.mul(reserveOut)
    const denominator = reserveIn.add(amountInWithFee)
    const amountOut = numerator.div(denominator)
    return amountOut
}

export const calculateAmountIn = (
    amountOut: FixedNumber,
    reserve_in: FixedNumber,
    reserve_out: FixedNumber,
    fee: FixedNumber,
): FixedNumber => {
    const numerator = reserve_in.mul(amountOut)
    const denominator = reserve_out.sub(amountOut).mul(fee)
    const amount_in = numerator.div(denominator).add(FixedNumber.fromValue(1))
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
    reserve0: FixedNumber
    reserve1: FixedNumber
    reserveLp: FixedNumber
}

export class Pair {
    token0: Token
    token1: Token
    tokenLp: Token
    reserve0: FixedNumber
    reserve1: FixedNumber
    reserveLp: FixedNumber
    fee = FixedNumber.fromValue(25, 4) //25

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

    currentShareOfPool(reserveLp: FixedNumber) {
        return reserveLp.div(this.reserveLp).mul(FixedNumber.fromValue(100))
    }

    calcShareOfPool(
        amount0: FixedNumber,
        amount1: FixedNumber,
        token0: Token,
        token1: Token,
    ) {
        const tempAmount = amount0
        amount0 = isSortedTokens(token0, token1) ? amount0 : amount1
        amount1 = isSortedTokens(token0, token1) ? amount1 : tempAmount
        if (this.reserve0 && this.reserve1 && this.reserveLp) {
            const lpShare0 = amount0.mul(this.reserveLp).div(this.reserve0)
            const lpShare1 = amount1.mul(this.reserveLp).div(this.reserve1)

            const addedLp = lpShare0.lt(lpShare1) ? lpShare0 : lpShare1
            const shareOfLp = addedLp
                .div(addedLp.add(this.reserveLp))
                .mul(FixedNumber.fromValue(100)) //%
            return shareOfLp
        }
        return FixedNumber.fromValue(100)
    }

    calcAddRate(
        amountIn: FixedNumber,
        tokenIn: Token,
        tokenOut: Token,
        field: Field,
    ) {
        if (this.reserve0 && this.reserve1) {
            const result1 = amountIn.mul(this.reserve1).div(this.reserve0)
            const result0 = amountIn.mul(this.reserve0).div(this.reserve1)
            if (
                (field === Field.INPUT && isSortedTokens(tokenIn, tokenOut)) ||
                (field === Field.OUTPUT && !isSortedTokens(tokenIn, tokenOut))
            ) {
                return result1.div(FixedNumber.fromValue(this.token1.decimals))
            } else {
                return result0.div(FixedNumber.fromValue(this.token0.decimals))
            }
        }
        return 0
    }

    calcSwapRate(
        amount: FixedNumber,
        tokenIn: Token,
        tokenOut: Token,
        field: Field,
    ) {
        if (this.reserve0 && this.reserve1 && amount) {
            const isSortedAmountOut = calculateAmountOut(
                amount,
                this.reserve0,
                this.reserve1,
                FixedNumber.fromValue(1).sub(this.fee),
            )
            const isNotSortedAmountOut = calculateAmountOut(
                amount,
                this.reserve1,
                this.reserve0,
                FixedNumber.fromValue(1).sub(this.fee),
            )
            const isSortedAmountIn = calculateAmountIn(
                amount,
                this.reserve0,
                this.reserve1,
                FixedNumber.fromValue(1).sub(this.fee),
            )
            const isNotSortedAmountIn = calculateAmountIn(
                amount,
                this.reserve1,
                this.reserve0,
                FixedNumber.fromValue(1).sub(this.fee),
            )

            if (field === Field.INPUT) {
                if (isSortedTokens(tokenIn, tokenOut)) return isSortedAmountOut
                else return isNotSortedAmountOut
            }

            if (field === Field.OUTPUT) {
                if (isSortedTokens(tokenIn, tokenOut)) return isSortedAmountIn
                else return isNotSortedAmountIn
            }
        }
        return 0
    }

    calcLPAmount(
        amount0: FixedNumber,
        amount1: FixedNumber,
        token0: Token,
        token1: Token,
    ) {
        const tempAmount = amount0
        amount0 = isSortedTokens(token0, token1) ? amount0 : amount1
        amount1 = isSortedTokens(token0, token1) ? amount1 : tempAmount
        if (this.reserve0 && this.reserve1 && this.reserveLp) {
            const lpShare0 = amount0.mul(this.reserveLp).div(this.reserve0)
            const lpShare1 = amount1.mul(this.reserveLp).div(this.reserve1)

            const addedLp = lpShare0.lt(lpShare1) ? lpShare0 : lpShare1
            return addedLp
        }
        const addedLp = Number(amount0.mul(amount1).toString()) - 1000
        return FixedNumber.fromValue(addedLp)
    }

    getToken0PerToken1Rate() {
        return this.reserve1.div(this.reserve0)
    }

    getToken1PerToken0Rate() {
        return this.reserve0.div(this.reserve1)
    }
}
