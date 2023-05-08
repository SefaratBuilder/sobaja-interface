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
            // const newSwapState = swapState.tokenIn?.address === "0x0000000000000000000000000000000000000000" ?
            //     { ...swapState, tokenIn: NATIVE_COIN[chainId] } :
            //     swapState.tokenOut?.address === "0x0000000000000000000000000000000000000000" ?
            //         { ...swapState, tokenIn: NATIVE_COIN[chainId] }
            //         : swapState
            const newSwapState = { ...swapState, tokenIn: NATIVE_COIN[chainId], tokenOut: undefined }
            onChangeSwapState(newSwapState)
        }
        console.log('updating swap state...')
    }, [chainId])

    return null
}

export default Updater
