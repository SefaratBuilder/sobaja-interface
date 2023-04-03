import { Token, TokenList } from '../../interfaces'
import { createAction } from '@reduxjs/toolkit'

export const updateCurrentList = createAction<TokenList>(
    'lists/updateCurrentList',
)

export const addTokenToCurrentList = createAction<Token>(
    'lists/addTokenToCurrentList',
)
