import { createSlice } from '@reduxjs/toolkit'
import { SerializedPair, SerializedToken, SlippageTolerance } from './types'
import { ConnectionType } from 'components/connection'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  selectedWallet?: ConnectionType
}



export const initialState: UserState = {
  selectedWallet: undefined,
}




const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSelectedWallet(state, { payload: { wallet } }) {
      state.selectedWallet = wallet
    },
  },
})

export const {
  updateSelectedWallet,
} = userSlice.actions

export default userSlice.reducer
