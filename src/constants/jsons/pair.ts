import { Interface } from '@ethersproject/abi'
import PAIR_ABI from './pair.json'

const PAIR_INTERFACE = new Interface(PAIR_ABI)

export default PAIR_INTERFACE
export { PAIR_ABI }
