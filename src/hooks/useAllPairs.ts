import { FixedNumber } from 'ethers'
import { Token } from 'interfaces'
import { useMemo } from 'react'
import {
    useSingleContractMultipleData,
    useSingleCallResult,
    useMultipleContractSingleData,
} from 'states/multicall/hooks'
import { computePairAddress, Pair } from 'utils/pair'
import { useFactoryContract } from './useContract'
import { useToken } from './useToken'
import PAIR_INTERFACE from 'constants/jsons/pair'
import { WRAPPED_NATIVE_COIN } from 'constants/index';
import { ChainId } from 'interfaces'
import { isNativeCoin } from 'utils'

/**
 * Returns pairs length.
 */
export function usePairsLength() {
    const factory = useFactoryContract()

    const results = useSingleCallResult(factory, 'allPairsLength')

    return useMemo(() => {
        const value = results?.result?.[0]
        if (!value) return
        return FixedNumber.fromValue(value._hex, 0)
    }, [results])
}

/**
 * Returns a map of the given ids to their eventually consistent Pair addresses.
 */
export function usePairAddressesByIds(ids: number[]): {
    [id: string]: string | undefined
} {
    const factory = useFactoryContract()
    const pairsLength = usePairsLength()

    const results = useSingleContractMultipleData(
        factory,
        'allPairs',
        ids.map((id) => [id]),
    )

    return useMemo(
        () =>
            ids.reduce<{ [id: string | number]: string | undefined }>(
                (memo, id, i) => {
                    const value = results?.[i]?.result?.[0]
                    if (value) memo[id] = value
                    return memo
                },
                {},
            ),
        [pairsLength, results, ids],
    )
}

/**
 * Returns a map of the given tokenA, tokenB to their eventually consistent Pair info.
 */
export function usePair(
    chainId: ChainId | undefined,
    tokenA: Token | undefined,
    tokenB: Token | undefined,
): Pair | undefined {
    tokenA = chainId && isNativeCoin(tokenA) ? WRAPPED_NATIVE_COIN[chainId] : tokenA
    tokenB = chainId && isNativeCoin(tokenB) ? WRAPPED_NATIVE_COIN[chainId] : tokenB
    const lpAddress = computePairAddress({ chainId, tokenA, tokenB })
    const tokenLp = useToken(lpAddress)

    const balanceResult = useMultipleContractSingleData(
        [lpAddress],
        PAIR_INTERFACE,
        'totalSupply',
        [],
    )

    const reservesResult = useMultipleContractSingleData(
        [lpAddress],
        PAIR_INTERFACE,
        'getReserves',
        [],
    )

    return useMemo(() => {
        const balance = balanceResult?.[0]?.result?.[0]
        const reserves = reservesResult?.[0]?.result
        const pair =
            tokenA &&
            tokenB &&
            reserves &&
            balance &&
            tokenLp &&
            new Pair({
                token0: tokenA,
                token1: tokenB,
                tokenLp,
                reserve0: Number(reserves[0]._hex),
                reserve1: Number(reserves[1]._hex),
                reserveLp: Number(balance._hex),
            })
        return pair
    }, [lpAddress, balanceResult, reservesResult])
}
