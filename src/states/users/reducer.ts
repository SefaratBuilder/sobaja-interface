import { createReducer } from '@reduxjs/toolkit'
import { updateActivity, updateBalanceTokens } from './action'
import { ChainId, Token } from 'interfaces'
import { WRAPPED_NATIVE_ADDRESSES } from 'constants/addresses'
export interface UserActivity {
  method: string,
  timestamp: string,
  hash: string
}

export interface UserBalance extends Token {
  balance: string
}

export const initBalanceToken = (chainId: ChainId): UserBalance => {
  return {
    address: WRAPPED_NATIVE_ADDRESSES[chainId],
    symbol: 'ETH',
    chainId: chainId,
    name: 'Ethereum',
    logoURI: '',
    decimals: 18,
    balance: '0'
  }
}

export interface User {
  balances: Array<UserBalance> | []
  activity: Array<UserActivity> | []
}

export interface UserState {
  users: {
    [ChainId.GOERLI]: User,
    [ChainId.MUMBAI]: User,
    [ChainId.ZKMAINNET]: User,
    [ChainId.ZKTESTNET]: User,
  }
}

export const initialState: UserState = {
  users: {
    [ChainId.GOERLI]: { balances: [initBalanceToken(ChainId.GOERLI)], activity: [] },
    [ChainId.MUMBAI]: { balances: [initBalanceToken(ChainId.MUMBAI)], activity: [] },
    [ChainId.ZKMAINNET]: { balances: [initBalanceToken(ChainId.ZKMAINNET)], activity: [] },
    [ChainId.ZKTESTNET]: { balances: [initBalanceToken(ChainId.ZKTESTNET)], activity: [] },
  }
}

const typeChain = [ChainId.GOERLI, ChainId.MUMBAI, ChainId.ZKMAINNET, ChainId.ZKTESTNET]

export default createReducer(initialState, (builder) => {
  builder

    .addCase(updateBalanceTokens, (state: any, action) => {
      const { chainId, balances } = action.payload
      if (chainId && typeChain.includes(chainId)) {
        state.users[chainId].balances = balances
      }
    })
    .addCase(updateActivity, (state: any, action) => {
      const { chainId, activity } = action.payload
      if (chainId && typeChain.includes(chainId)) {
        state.users[chainId].activity = activity
      }
    })

})