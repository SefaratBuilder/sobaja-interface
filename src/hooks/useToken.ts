import { useMemo } from 'react'
import ERC20_INTERFACE from 'constants/jsons/erc20'
import { Token } from 'interfaces'
import { useMultipleContractSingleData } from 'states/multicall/hooks'
import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'
import { useTokenContract } from './useContract'
import { FixedNumber } from 'ethers'

export function useToken(address: string | undefined): Token | undefined {
    const { chainId } = useActiveWeb3React()
    address = isAddress(address) ? address : undefined
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
    to: string | null | undefined,
    token: Token | undefined,
): {
    allowance: FixedNumber | undefined
    approve: (to: string, amount: number | string) => void
} {
    from = from == null ? undefined : from
    to = to == null ? undefined : to
    const tokenContract = useTokenContract(token?.address)

    const approve = async (to: string, amount: number | string) => {
        try {
            if (!isAddress(to)) return
            const gasLimit = await tokenContract?.estimateGas.approve(to, amount)
            console.log({ gasLimit: gasLimit && gasLimit.add(1000) })
            return tokenContract?.approve(to, amount, {
                gasLimit: gasLimit && gasLimit.add(1000)
            })
        } catch (err) {
            return
        }
    }

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
    }, [from, to, token, tokenContract, allowance])
}
