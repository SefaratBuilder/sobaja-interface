import { useActiveWeb3React } from 'hooks'
import { useMulticallContract } from 'hooks/useContract'
import { useMemo } from 'react'
import {
    useMultipleContractSingleData,
    useSingleContractMultipleData,
} from 'states/multicall/hooks'
import { isAddress } from 'utils'
import { FixedNumber } from 'ethers'
import { Token } from 'interfaces'
import ERC20_INTERFACE from 'constants/jsons/erc20'
import { NATIVE_COIN } from 'constants/index'
import { useTokenList } from 'states/lists/hooks'
import { divNumberWithDecimal, fixNum } from 'utils/math'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
    uncheckedAddresses?: (string | null | undefined)[],
): { [address: string]: string | undefined } {
    const multicallContract = useMulticallContract()
    const addresses: string[] = useMemo(
        () =>
            uncheckedAddresses
                ? uncheckedAddresses
                    .filter((a): a is string => a !== null && a !== undefined)
                    .sort()
                : [],
        [uncheckedAddresses],
    )

    const results = useSingleContractMultipleData(
        multicallContract,
        'getEthBalance',
        addresses.map((address) => [address]),
    )

    return useMemo(
        () =>
            addresses.reduce<{ [address: string]: string | undefined }>(
                (memo, address, i) => {
                    const value = results?.[i]?.result?.[0]
                    if (value && value._hex)
                        memo[address] = divNumberWithDecimal(
                            Number(value._hex),
                            18,
                        )
                    return memo
                },
                {},
            ),
        [addresses, results],
    )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
    address?: string | null,
    tokens?: (Token | undefined)[],
    isUpdateApplication?: boolean
): [{ [tokenAddress: string]: string | undefined }, boolean] {
    const validatedTokens: Token[] = useMemo(
        () =>
            tokens?.filter?.(
                (t?: Token): t is Token => isAddress(t?.address) !== false,
            ) ?? [],
        [tokens],
    )

    const validatedTokenAddresses = useMemo(
        () => validatedTokens.map((vt) => vt.address),
        [validatedTokens],
    )
    address = address == null ? undefined : address
    const balances = useMultipleContractSingleData(
        validatedTokenAddresses,
        ERC20_INTERFACE,
        'balanceOf',
        [address],
    )

    const anyLoading: boolean = useMemo(
        () => balances.some((callState) => callState.loading),
        [balances],
    )

    return [
        useMemo(
            () =>
                address && validatedTokens.length > 0
                    ? validatedTokens.reduce<{
                        [tokenAddress: string]: string | undefined
                    }>((memo, token, i) => {
                        const value = balances?.[i]?.result?.[0]

                        if (value && value._hex) {

                            memo[token.address] = divNumberWithDecimal(
                                fixNum(value),
                                token.decimals,
                            )
                        }
                        return memo
                    }, {})
                    : {},
            [address, validatedTokens, balances, isUpdateApplication],
        ),
        anyLoading,
    ]
}

export function useTokenBalances(
    address?: string | null,
    tokens?: (Token | undefined)[],
    isUpdateApplication?: boolean
): { [tokenAddress: string]: string | undefined } {
    return useTokenBalancesWithLoadingIndicator(address, tokens, isUpdateApplication)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(
    account?: string | null,
    token?: Token,
): string | undefined {
    const tokenBalances = useTokenBalances(account, [token])
    return token && tokenBalances[token.address]
}

export function useCurrencyBalances(
    account?: string | null,
    currencies?: (Token | undefined)[],
): (string | undefined)[] {
    const { chainId } = useActiveWeb3React()
    const tokens = currencies
    const tokenBalances = useTokenBalances(account, tokens)
    const ethBalance = useETHBalances([account])
    console.log({ ethBalance })
    return useMemo(
        () =>
            currencies?.map((currency) => {
                if (!account || !currency || !chainId) return undefined
                if (currency.address === NATIVE_COIN[chainId].address) {
                    console.log('eth balance', ethBalance[account], account)
                    return ethBalance[account]
                }
                if (currency) return tokenBalances[currency.address]
                return undefined
            }) ?? [],
        [account, currencies, ethBalance, tokenBalances, chainId],
    )
}

export function useCurrencyBalance(
    account?: string | null,
    currency?: Token | undefined,
): string | undefined {
    return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): {
    [tokenAddress: string]: string | undefined
} {
    const { account, chainId } = useActiveWeb3React()
    const currentList = useTokenList()
    const balances = useTokenBalances(account ?? undefined, currentList)
    let ethBalanceWithAccountKey = useETHBalances([account])
    let ethBalanceWithTokenKey = {}
    chainId &&
        Object.keys(ethBalanceWithAccountKey).map((k) => {
            ethBalanceWithTokenKey = {
                [NATIVE_COIN[chainId].address]: ethBalanceWithAccountKey[k],
                ...ethBalanceWithTokenKey,
            }
        })

    return { ...ethBalanceWithTokenKey, ...balances } ?? {}
}
