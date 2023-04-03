import { useCallback } from 'react'
import { AppState } from './../index'
import { useDispatch, useSelector } from 'react-redux'
import { SwapState } from './reducer'
import { Field, Token } from '../../interfaces'
import { selectToken, switchToken, typeInput, changeSwapState } from './actions'

export function useSwapState(): SwapState {
    return useSelector((state: AppState) => state.swap)
}

export function useSwapActionHandlers(): {
    onTokenSelection: (field: Field, token: Token) => void
    onSwitchTokens: () => void
    onUserInput: (field: Field, typedValue: string) => void
    onChangeSwapState: (swapState: SwapState) => void
} {
    const dispatch = useDispatch()

    const onTokenSelection = useCallback(
        (field: Field, token: Token) => {
            dispatch(selectToken({ field, token }))
        },
        [dispatch],
    )

    const onSwitchTokens = useCallback(() => {
        dispatch(switchToken())
    }, [dispatch])

    const onUserInput = useCallback(
        (field: Field, value: string) => {
            dispatch(typeInput({ field, value }))
        },
        [dispatch],
    )

    const onChangeSwapState = useCallback(
        (swapSate: SwapState) => {
            dispatch(changeSwapState(swapSate))
        },
        [dispatch],
    )

    return {
        onSwitchTokens,
        onTokenSelection,
        onUserInput,
        onChangeSwapState,
    }
}
