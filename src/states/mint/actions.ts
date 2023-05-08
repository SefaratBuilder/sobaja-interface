import { Field, Token } from '../../interfaces'
import { createAction } from '@reduxjs/toolkit'
import { MintState } from './reducer'

export const typeInput = createAction<{
    field: Field
    value: string
}>('mint/typeInput')

export const changeMintState = createAction<MintState>('mint/changeMintState')

export const selectToken = createAction<{
    field: Field
    token: Token
}>('mint/selectToken')

export const switchToken = createAction('mint/switchCurrencies')
