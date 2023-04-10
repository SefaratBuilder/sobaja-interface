import { useMemo } from 'react'
import ERC20_INTERFACE from 'constants/jsons/erc20'
import { Token } from 'interfaces'
import { useMultipleContractSingleData } from 'states/multicall/hooks'
import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'

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
        "name",
        []
    )

    const decimalsResult = useMultipleContractSingleData(
        [address],
        ERC20_INTERFACE,
        "decimals",
        []
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
            logoURI: ''
        }
    }, [address, chainId, symbolResult, nameResult, decimalsResult])
}
