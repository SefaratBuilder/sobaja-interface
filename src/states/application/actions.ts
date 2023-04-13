import { createAction } from '@reduxjs/toolkit'

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
