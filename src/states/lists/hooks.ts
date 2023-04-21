import { Token, TokenList } from '../../interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../index'
import { ListState } from './reducer'
import { updateCurrentList } from './actions'
import { useActiveWeb3React } from 'hooks'

export function useTokenList(): TokenList {
    const { chainId } = useActiveWeb3React()
    return useSelector((state: AppState) =>
        chainId ? state.lists.currentList[chainId] : [],
    )
}

export function useUpdateCurrentList() {
    const dispatch = useDispatch()
    const { chainId } = useActiveWeb3React()
    return (newList: TokenList) =>
        chainId && dispatch(updateCurrentList({ chainId, newList }))
}

export function useAddTokenToCurrentList() {
    const dispatch = useDispatch()
    const { chainId } = useActiveWeb3React()
    const currentList = useTokenList()

    return (newToken: Token) => {
        chainId &&
            dispatch(
                updateCurrentList({
                    chainId,
                    newList: [...currentList, newToken],
                }),
            )
    }
}
