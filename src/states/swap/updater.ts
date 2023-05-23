import { useActiveWeb3React } from 'hooks'
import { useEffect } from 'react'
import { useSwapActionHandlers, useSwapState } from './hooks'
import { NATIVE_COIN } from 'constants/index'

const Updater = () => {
    const { chainId } = useActiveWeb3React()
    const { onChangeSwapState } = useSwapActionHandlers()
    const swapState = useSwapState()

    useEffect(() => {
        if (chainId) {
            const newSwapState = { ...swapState, tokenIn: NATIVE_COIN[chainId], tokenOut: undefined }
            onChangeSwapState(newSwapState)
        }
    }, [chainId])

    return null
}

export default Updater
