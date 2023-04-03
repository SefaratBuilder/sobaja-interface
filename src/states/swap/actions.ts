import { Field, Token } from '../../interfaces'
import { createAction } from '@reduxjs/toolkit'
import { SwapState } from './reducer'

export const typeInput = createAction<{
    field: Field
    value: string
}>('swap/typeInput')

export const changeSwapState = createAction<SwapState>('swap/changeSwapState')

export const selectToken = createAction<{
    field: Field
    token: Token
}>('swap/selectToken')

export const switchToken = createAction('swap/switchCurrencies')

export const replaceSwapState = createAction<{
    field: Field
    typedValue: string
    inputCurrencyId?: string
    outputCurrencyId?: string
    recipient: string | null
}>('swap/replaceSwapState')
