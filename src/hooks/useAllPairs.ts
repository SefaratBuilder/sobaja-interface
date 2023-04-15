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
import { useToken, useTokens } from './useToken'
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
 * Returns a map of the given ids to their eventually consistent Pair addresses.
 */
export function usePairByAddresses(addresses: (string | undefined)[]): {
    [address: string]: (Pair | undefined)[]
} {
    const tokenAResults = useMultipleContractSingleData(
        addresses,
        PAIR_INTERFACE,
        'token0',
        [],
    )

    const tokenBResult = useMultipleContractSingleData(
        addresses,
        PAIR_INTERFACE,
        'token1',
        [],
    )

    const balanceResults = useMultipleContractSingleData(
        addresses,
        PAIR_INTERFACE,
        'totalSupply',
        [],
    )

    const reservesResults = useMultipleContractSingleData(
        addresses,
        PAIR_INTERFACE,
        'getReserves',
        [],
    )

    const tokenAddresses = tokenAResults?.[0]?.result?.[0] && tokenBResult?.[0]?.result?.[0] && [
        ...tokenAResults.map((token) => token.result?.[0]),
        ...tokenBResult.map((token) => token.result?.[0]),
        ...addresses
    ]

    const tokens = useTokens(tokenAddresses)

    return useMemo(
        () =>
            addresses.reduce<{ [address: string]: (Pair | undefined)[] }>(
                (memo, address, i) => {
                    const balance = balanceResults?.[i]?.result?.[0]
                    const reserves = reservesResults?.[i]?.result
                    const tokenA = tokens?.[i]
                    const tokenB = tokens?.[i * 2]
                    const tokenLp = tokens?.[i * 3]
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
                    if (pair && address) memo[address] = pair
                    return memo
                },
                {},
            ),
        [addresses, tokenAResults, tokenBResult, balanceResults, reservesResults]
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
    console.log({ lpAddress })
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

/**
 * Returns a map of the given ids to their eventually consistent Pair addresses.
 */
export function useAllPairs(): {
    [id: string]: (Pair | undefined)[]
} {
    const factory = useFactoryContract()
    const pairsLength = usePairsLength()
    let ids: number[] = []
    if (pairsLength?._value) {
        for (let i = 0; i < Number(pairsLength._value); i++)
            ids.push(i)
    }
    const allPairsResult = useSingleContractMultipleData(
        factory,
        'allPairs',
        ids.map((id) => [id]),
    )
    const addresses: (string | undefined)[] = allPairsResult && allPairsResult.map(i => i.result?.[0])
    const pairs = usePairByAddresses(addresses)
    console.log({ pairs })

    return useMemo(
        () => pairs,
        [pairs],
    )
}