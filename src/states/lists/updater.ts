import { useActiveWeb3React } from 'hooks'
import { useEffect } from 'react'
import { useTokenList, useUpdateCurrentList } from './hooks'
import { ALL_SUPPORTED_CHAIN_IDS, NATIVE_COIN, ZERO_ADDRESS } from 'constants/index'
import { ChainId } from 'interfaces'

const Updater = () => {
    const updateCurrentList = useUpdateCurrentList()
    const { chainId } = useActiveWeb3React()
    const currentList = useTokenList()

    useEffect(() => {

        if (chainId && ALL_SUPPORTED_CHAIN_IDS.includes(chainId as ChainId)) {
            // if (chainId) {
            const newList = currentList.filter(
                (item) =>
                    item.chainId === chainId ||
                    item.address === NATIVE_COIN[chainId].address,
            )
            updateCurrentList(newList)
        }
    }, [chainId])

    return null
}

export default Updater
