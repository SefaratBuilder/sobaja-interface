import { DEFAULT_TOKEN_LIST } from './../../constants/index'
import { TokenList, ChainId } from '../../interfaces'
import { createReducer } from '@reduxjs/toolkit'
import { updateCurrentList } from './actions'

export interface ListState {
    currentList: {
        [chainId in number]: TokenList
    }
}

const initialState: ListState = {
    currentList: DEFAULT_TOKEN_LIST,
}

export default createReducer(initialState, (builder) => {
    builder.addCase(updateCurrentList, (state, action) => {
        const { chainId, newList } = action.payload
        return {
            currentList: {
                ...state.currentList,
                [chainId]: newList,
            },
        }
    })
})
