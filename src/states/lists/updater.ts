import { useActiveWeb3React } from 'hooks'
import { useEffect } from 'react'
import { useTokenList, useUpdateCurrentList } from './hooks'
import { NATIVE_COIN, ZERO_ADDESS } from 'constants/index'

const Updater = () => {
    const { currentList } = useTokenList()
    const updateCurrentList = useUpdateCurrentList()
    const { chainId } = useActiveWeb3React()

    useEffect(() => {
        if (chainId) {
            const newList = currentList.filter((item) => item.chainId === chainId || item.address === NATIVE_COIN.address)
            updateCurrentList(newList)
        }
    }, [chainId])

    return null
}

export default Updater
