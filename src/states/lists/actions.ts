import { Token, TokenList } from '../../interfaces'
import { createAction } from '@reduxjs/toolkit'

export const updateCurrentList = createAction<{
    chainId: number
    newList: TokenList
}>('lists/updateCurrentList')
