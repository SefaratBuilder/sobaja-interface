import { createReducer } from '@reduxjs/toolkit'
import { addUser, updateActivity, updateBalanceTokens, updateUser } from './action'
import { ChainId, Token } from 'interfaces'
import { WRAPPED_NATIVE_ADDRESSES } from 'constants/addresses'
import { getKeyValue } from 'utils/handleType'
import { NATIVE_COIN } from 'constants/index'
import { useUpdateUser } from './hooks'
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
    address: NATIVE_COIN[chainId].address,
    symbol: 'ETH',
    chainId: chainId,
    name: 'Ethereum',
    logoURI: '',
    decimals: 18,
    balance: '0'
  }
}

export const initUser: User = {
  balances: [],
  activity: [],
}

export interface User {
  balances: Array<UserBalance> | []
  activity: Array<UserActivity> | []
}

export interface UsersDetails {
  users: {
    [chainId in number]: {
      [x in string]: User
    }
  }
}
// export interface UsersDetails {
//   users: {
//     [ChainId.GOERLI]: {
//       [address: string]: User
//     },
//     [ChainId.MUMBAI]: {
//       [address: string]: User
//     },
//     [ChainId.ZKMAINNET]: {
//       [address: string]: User
//     },
//     [ChainId.ZKTESTNET]: {
//       [address: string]: User
//     },
//   }
// }

export const initialState: UsersDetails = {
  users: {
    [ChainId.GOERLI]: { '0x': initUser },
    [ChainId.MUMBAI]: { '0x': initUser },
    [ChainId.ZKMAINNET]: { '0x': initUser },
    [ChainId.ZKTESTNET]: { '0x': initUser },
  }
}
// export const initialState: UsersDetails = {
//   users: {
//     [ChainId.GOERLI]: undefined,
//     [ChainId.MUMBAI]: undefined,
//     [ChainId.ZKMAINNET]: undefined,
//     [ChainId.ZKTESTNET]: undefined,
//   }
// }

export default createReducer(initialState, (builder) => {
  builder.addCase(addUser, (state, action) => {
    const { users, account, chainId } = action.payload
    return {
      users:
      {
        ...state.users,
        [chainId]: {
          ...state.users[chainId],
          [account]: users
        }
      }

    }
  })
})