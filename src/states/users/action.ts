import { createAction } from "@reduxjs/toolkit";
import { UserActivity, UserBalance } from "./reducer";

export const updateBalanceTokens = createAction<{
    chainId?: number
    balances: Array<UserBalance>
}>('user/updateBalanceTokens')
export const updateActivity = createAction<{
    chainId?: number
    activity: Array<UserActivity>
}>('user/updateActivity')
