import { Interface } from '@ethersproject/abi'
import PAIR_ABI from './pair.json'

const ERC20_INTERFACE = new Interface(PAIR_ABI)

export default ERC20_INTERFACE
export { PAIR_ABI }
