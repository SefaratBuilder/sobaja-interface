import { createReducer } from '@reduxjs/toolkit'
import {
    updateBlockNumber,
    toggleAgreement,
    updateSlippageTolerance,
    updateTransactionDeadline,
    updateApplicationState,
    toggleDarkMode,
} from './actions'

export interface ApplicationState {
    blockNumber: { [chainId: number]: number }
    setting: {
        slippagePercent: number
    }
    isAgreePolicy: boolean
    slippage: string
    deadline: number
    isUpdateApplication: boolean
    userDarkMode: boolean
    refAddress: string | undefined
}

const initialState: ApplicationState = {
    blockNumber: {},
    setting: {
        slippagePercent: 5,
    },
    isAgreePolicy: false,
    slippage: '0.3', //%
    deadline: 1200, //default 20m,
    isUpdateApplication: false,
    userDarkMode: false,
    refAddress: undefined,
}

export default createReducer(initialState, (builder) => {
    builder
        .addCase(updateBlockNumber, (state, action) => {
            const { chainId, blockNumber } = action.payload
            if (typeof state.blockNumber[chainId] !== 'number') {
                state.blockNumber[chainId] = blockNumber
            } else {
                state.blockNumber[chainId] = Math.max(
                    blockNumber,
                    state.blockNumber[chainId],
                )
            }
        })
        .addCase(toggleAgreement, (state, action) => {
            state.isAgreePolicy = action.payload
        })
        .addCase(updateSlippageTolerance, (state, action) => {
            state.slippage = action.payload
        })
        .addCase(updateTransactionDeadline, (state, action) => {
            state.deadline = action.payload
        })
        .addCase(updateApplicationState, (state, action) => {
            state.isUpdateApplication = action.payload
        })
        .addCase(toggleDarkMode, (state, action) => {
            state.userDarkMode = action.payload
        })
})
