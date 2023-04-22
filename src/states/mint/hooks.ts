import { useCallback } from 'react'
import { AppState } from '../index'
import { useDispatch, useSelector } from 'react-redux'
import { MintState } from './reducer'
import { Field, Token } from '../../interfaces'
import { selectToken, switchToken, typeInput, changeMintState } from './actions'

export function useMintState(): MintState {
    return useSelector((state: AppState) => state.mint)
}

export function useMintActionHandlers(): {
    onTokenSelection: (field: Field, token: Token) => void
    onSwitchTokens: () => void
    onUserInput: (field: Field, typedValue: string) => void
    onChangeMintState: (mintState: MintState) => void
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

    const onChangeMintState = useCallback(
        (mintState: MintState) => {
            dispatch(changeMintState(mintState))
        },
        [dispatch],
    )

    return {
        onSwitchTokens,
        onTokenSelection,
        onUserInput,
        onChangeMintState,
    }
}
