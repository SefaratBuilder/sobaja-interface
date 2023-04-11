import { ChainId } from 'constants/index'
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
    const lpAddress = computePairAddress({ chainId, tokenA, tokenB })
    const tokenLp = useToken(lpAddress)
    const balance = useMultipleContractSingleData(
        [lpAddress],
        PAIR_INTERFACE,
        'totalSupply',
        [],
    )?.[0].result?.[0]

    const reserves = useMultipleContractSingleData(
        [lpAddress],
        PAIR_INTERFACE,
        'getReserves',
        [],
    )?.[0].result

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
            reserve0: FixedNumber.fromValue(reserves[0]._hex, 0),
            reserve1: FixedNumber.fromValue(reserves[1]._hex, 0),
            reserveLp: FixedNumber.fromValue(balance._hex, 0),
        })

    return useMemo(() => pair, [lpAddress])
}
