import { createAction } from '@reduxjs/toolkit'
import { Token } from 'interfaces'

export const updateBlockNumber = createAction<{
    chainId: number
    blockNumber: number
}>('application/updateBlockNumber')

export const toggleAgreement = createAction<boolean>(
    'application/toggleAgreement',
)

export const updateSlippageTolerance = createAction<string>(
    'application/updateSlippageTolerance',
)

export const updateTransactionDeadline = createAction<number>(
    'application/updateTransactionDeadline',
)

export const updateApplicationState = createAction<boolean>(
    'application/updateApplicationState',
)

export const toggleDarkMode = createAction<boolean>(
    'application/toggleDarkMode',
)

export const updateRefAddress = createAction<string | undefined>(
    'application/updateRefAddress',
)

export const updateGasToken = createAction<Token>(
    'application/updateGasToken',
)

export const updateStepFaucet = createAction<number>(
    'application/updateStepFaucet'
)

