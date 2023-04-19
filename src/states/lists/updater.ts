import { useActiveWeb3React } from 'hooks'
import { useEffect } from 'react'
import { useTokenList, useUpdateCurrentList } from './hooks'
import { NATIVE_COIN, ZERO_ADDESS } from 'constants/index'
import { DEFAULT_TOKEN_LIST } from 'constants/index'

const Updater = () => {
    const updateCurrentList = useUpdateCurrentList()
    const { chainId } = useActiveWeb3React()

    useEffect(() => {
        if (chainId) {
            const newList = DEFAULT_TOKEN_LIST.filter((item) => item.chainId === chainId || item.address === NATIVE_COIN.address)
            updateCurrentList(newList)
        }
    }, [chainId])

    return null
}

export default Updater
