import { configureStore } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import swap from './swap/reducer'
import lists from './lists/reducer'
import application from './application/reducer'
import multicall from './multicall/reducer'

const PERSISTED_KEYS: string[] = ['application', 'multicall']

const store = configureStore({
    reducer: {
        swap,
        lists,
        application,
        multicall,
    },
    middleware: [save({ states: PERSISTED_KEYS })],
    preloadedState: load({ states: PERSISTED_KEYS }),
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
