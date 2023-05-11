import { Interface } from '@ethersproject/abi'
import { STAKING_ABI } from 'constants/addresses'

const STAKING_INTERFACE = new Interface(STAKING_ABI)
export {STAKING_INTERFACE}