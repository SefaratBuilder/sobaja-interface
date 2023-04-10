import { useMemo } from 'react'
import ERC20_INTERFACE from 'constants/jsons/erc20'
import { Token } from 'interfaces'
import { useMultipleContractSingleData } from 'states/multicall/hooks'
import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'
import { useTokenContract } from './useContract'
import { FixedNumber } from 'ethers'

export function useToken(address: string | undefined): Token | undefined {
    if (!address || !isAddress(address)) return
    const { chainId } = useActiveWeb3React()

    const symbolResult = useMultipleContractSingleData(
        [address],
        ERC20_INTERFACE,
        'symbol',
        [],
    )

    const nameResult = useMultipleContractSingleData(
        [address],
        ERC20_INTERFACE,
        'name',
        [],
    )

    const decimalsResult = useMultipleContractSingleData(
        [address],
        ERC20_INTERFACE,
        'decimals',
        [],
    )

    return useMemo(() => {
        const symbol = symbolResult?.[0]?.result?.[0]
        const name = nameResult?.[0]?.result?.[0]
        const decimals = decimalsResult?.[0]?.result?.[0]

        if (!symbol || !name || !decimals || !chainId || !address) return
        return {
            address,
            name,
            decimals,
            chainId,
            symbol,
            logoURI: '',
        }
    }, [address, chainId, symbolResult, nameResult, decimalsResult])
}

export function useTokenApproval(
    from: string | null | undefined,
    to: string | undefined,
    token: Token | undefined,
): {
    allowance: FixedNumber | undefined
    approve: (to: string, amount: number | string) => void
} {
    const tokenContract = useTokenContract(token?.address)

    const approve = (to: string, amount: number | string) => {
        if (!isAddress(to)) return
        return tokenContract?.approve(to, amount)
    }

    if (
        !from ||
        !isAddress(from) ||
        !isAddress(to) ||
        !isAddress(token?.address)
    )
        return { allowance: FixedNumber.fromValue(0), approve }

    const allowance = useMultipleContractSingleData(
        [token?.address],
        ERC20_INTERFACE,
        'allowance',
        [from, to],
    )

    return useMemo(() => {
        const value = allowance?.[0]?.result?.[0]?._hex || 0

        return {
            allowance: value && FixedNumber.fromValue(value, token?.decimals),
            approve,
        }
    }, [from, to, token])
}
