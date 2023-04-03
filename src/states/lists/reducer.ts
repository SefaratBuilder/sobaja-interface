import { DEFAULT_TOKEN_LIST } from './../../constants/index'
import { TokenList } from '../../interfaces'
import { createReducer } from '@reduxjs/toolkit'
import { addTokenToCurrentList, updateCurrentList } from './actions'

export interface ListState {
    currentList: TokenList
}

const initialState: ListState = {
    currentList: DEFAULT_TOKEN_LIST,
}

export default createReducer(initialState, (builder) => {
    builder
        .addCase(updateCurrentList, (state, action) => {
            state.currentList = action.payload
        })
        .addCase(addTokenToCurrentList, (state, action) => {
            const newToken = action.payload
            const newCurrentList = state.currentList
            newCurrentList.splice(1, 0, newToken)
            state.currentList = state.currentList
        })
})
