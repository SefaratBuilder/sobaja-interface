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

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
    uncheckedAddresses?: (string | null | undefined)[],
): { [address: string]: FixedNumber | undefined } {
    const multicallContract = useMulticallContract()
    const addresses: string[] = useMemo(
        () =>
            uncheckedAddresses
                ? uncheckedAddresses
                      .map(isAddress)
                      .filter((a): a is string => a !== false)
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
            addresses.reduce<{ [address: string]: FixedNumber | undefined }>(
                (memo, address, i) => {
                    const value = results?.[i]?.result?.[0]
                    if (value)
                        memo[address] = FixedNumber.fromBytes(value?._hex)
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
    address?: string,
    tokens?: (Token | undefined)[],
): [{ [tokenAddress: string]: FixedNumber | undefined }, boolean] {
    const validatedTokens: Token[] = useMemo(
        () =>
            tokens?.filter(
                (t?: Token): t is Token => isAddress(t?.address) !== false,
            ) ?? [],
        [tokens],
    )

    const validatedTokenAddresses = useMemo(
        () => validatedTokens.map((vt) => vt.address),
        [validatedTokens],
    )

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
                          [tokenAddress: string]: FixedNumber | undefined
                      }>((memo, token, i) => {
                          const value = balances?.[i]?.result?.[0]
                          if (value) {
                              memo[token.address] = FixedNumber.fromBytes(
                                  value._hex,
                              )
                          }
                          return memo
                      }, {})
                    : {},
            [address, validatedTokens, balances],
        ),
        anyLoading,
    ]
}

export function useTokenBalances(
    address?: string,
    tokens?: (Token | undefined)[],
): { [tokenAddress: string]: FixedNumber | undefined } {
    return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(
    account?: string,
    token?: Token,
): FixedNumber | undefined {
    const tokenBalances = useTokenBalances(account, [token])
    if (!token) return undefined
    return tokenBalances[token.address]
}

export function useCurrencyBalances(
    account?: string,
    currencies?: (Token | undefined)[],
): (FixedNumber | undefined)[] {
    const { chainId } = useActiveWeb3React()

    const tokens = currencies

    const tokenBalances = useTokenBalances(account, tokens)
    const ethBalance = useETHBalances([account])

    return useMemo(
        () =>
            currencies?.map((currency) => {
                if (!account || !currency) return undefined
                if (currency.address === NATIVE_COIN.address)
                    return ethBalance[account]
                if (currency) return tokenBalances[currency.address]
                return undefined
            }) ?? [],
        [account, currencies, ethBalance, tokenBalances, chainId],
    )
}

export function useCurrencyBalance(
    account?: string,
    currency?: Token | undefined,
): FixedNumber | undefined {
    return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): {
    [tokenAddress: string]: FixedNumber | undefined
} {
    const { account } = useActiveWeb3React()
    const { currentList } = useTokenList()
    const balances = useTokenBalances(account ?? undefined, currentList)
    let ethBalanceWithAccountKey = useETHBalances([account])
    let ethBalanceWithTokenKey = {}

    Object.keys(ethBalanceWithAccountKey).map((k) => {
        ethBalanceWithTokenKey = {
            [NATIVE_COIN.address]: ethBalanceWithAccountKey[k],
            ...ethBalanceWithTokenKey,
        }
    })

    return { ...ethBalanceWithTokenKey, ...balances } ?? {}
}
