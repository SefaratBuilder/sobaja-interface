import { createAction } from "@reduxjs/toolkit";
import { User, UserActivity, UserBalance, UsersDetails } from "./reducer";

export const updateBalanceTokens = createAction<{
    chainId?: number
    account?: string
    balances: Array<UserBalance>
}>('user/updateBalanceTokens')

export const updateActivity = createAction<{
    chainId?: number
    account?: string
    activity: Array<UserActivity>
}>('user/updateActivity')

export const updateUser = createAction<{
    chainId?: number
    account?: string
    data: User
}>('user/updateUser')

export const addUser = createAction<{
    chainId: number
    account: string
    users: User
}>('user/updateUser')