import { configureStore } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import swap from './swap/reducer'
import lists from './lists/reducer'
import application from './application/reducer'
import multicall from './multicall/reducer'
import transactions from './transactions/reducer'
import mint from './mint/reducer'
import user from './user/reducer'
import users from './users/reducer'
import connection from './user/reducer'
import { createAction } from '@reduxjs/toolkit'
export const updateVersion = createAction<void>('global/updateVersion')
import { setupListeners } from '@reduxjs/toolkit/query/react'

const PERSISTED_KEYS: string[] = ['user', 'application', 'transactions'
    , 'users'
]

const store = configureStore({
    reducer: {
        swap,
        lists,
        application,
        multicall,
        transactions,
        mint,
        user,
        connection,
        users
    },
    middleware: [save({ states: PERSISTED_KEYS })],
    preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

setupListeners(store.dispatch)

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
