import { useActiveWeb3React } from 'hooks'
import { useEffect } from 'react'
import { useMintActionHandlers, useMintState } from './hooks'
import { NATIVE_COIN } from 'constants/index'

const Updater = () => {
    const { chainId } = useActiveWeb3React()
    const { onChangeMintState } = useMintActionHandlers()
    const mintState = useMintState()

    useEffect(() => {
        if (chainId) {
            // const newMintState = mintState.tokenIn?.address === "0x0000000000000000000000000000000000000000" ?
            //     { ...mintState, tokenIn: NATIVE_COIN[chainId] } :
            //     mintState.tokenOut?.address === "0x0000000000000000000000000000000000000000" ?
            //         { ...mintState, tokenIn: NATIVE_COIN[chainId] }
            //         : mintState
            const newMintState = { ...mintState, tokenIn: NATIVE_COIN[chainId], tokenOut: undefined }
            onChangeMintState(newMintState)
        }
        console.log('updating mint state...')
    }, [chainId])

    return null
}

export default Updater
