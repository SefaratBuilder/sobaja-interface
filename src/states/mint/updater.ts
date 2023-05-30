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
            const newMintState = { ...mintState, tokenIn: NATIVE_COIN[chainId], tokenOut: undefined }
            onChangeMintState(newMintState)
        }
    }, [chainId])

    return null
}

export default Updater
