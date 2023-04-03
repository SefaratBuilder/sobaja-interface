import { Token, TokenList } from '../../interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../index'
import { ListState } from './reducer'
import { updateCurrentList, addTokenToCurrentList } from './actions'

export function useTokenList(): ListState {
    return useSelector((state: AppState) => state.lists)
}

export function useUpdateCurrentList() {
    const dispatch = useDispatch()
    return (tokenList: TokenList) => dispatch(updateCurrentList(tokenList))
}

export function useAddTokenToCurrentList() {
    const dispatch = useDispatch()
    return (token: Token) => dispatch(addTokenToCurrentList(token))
}
