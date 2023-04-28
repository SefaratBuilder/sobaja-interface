import { NATIVE_COIN } from '../../constants/index'
import { Field, Token } from '../../interfaces/index'
import { createReducer } from '@reduxjs/toolkit'
import { typeInput, selectToken, switchToken, changeMintState } from './actions'

export interface MintState {
    inputAmount: string | undefined
    outputAmount: string | undefined
    tokenIn: Token | undefined
    tokenOut: Token | undefined
    swapType: Field
}

const initialState: MintState = {
    inputAmount: '',
    outputAmount: '',
    tokenIn: NATIVE_COIN[324],
    tokenOut: undefined,
    swapType: Field.INPUT,
}

export default createReducer(initialState, (builder) => {
    builder
        .addCase(changeMintState, (state, action) => {
            const { inputAmount, outputAmount, tokenIn, tokenOut, swapType } =
                action.payload
            return {
                inputAmount,
                outputAmount,
                tokenIn,
                tokenOut,
                swapType,
            }
        })
        .addCase(typeInput, (state, action) => {
            const { field, value } = action.payload
            const inputAmount =
                field === Field.INPUT ? value : state.inputAmount
            const outputAmount =
                field === Field.OUTPUT ? value : state.outputAmount
            return {
                ...state,
                swapType: field,
                inputAmount,
                outputAmount,
            }
        })
        .addCase(switchToken, (state) => {
            return {
                ...state,
                inputAmount: state.outputAmount,
                outputAmount: state.inputAmount,
                tokenIn: state.tokenOut,
                tokenOut: state.tokenIn,
            }
        })
        .addCase(selectToken, (state, action) => {
            const { field, token } = action.payload
            const tokenIn = field === Field.INPUT ? token : state.tokenIn
            const tokenOut = field === Field.OUTPUT ? token : state.tokenOut
            if (
                tokenIn?.address === state.tokenOut?.address ||
                tokenOut?.address === state.tokenIn?.address
            ) {
                return {
                    ...state,
                    tokenIn: state.tokenOut,
                    tokenOut: state.tokenIn,
                }
            }
            return {
                ...state,
                tokenIn,
                tokenOut,
            }
        })
})
