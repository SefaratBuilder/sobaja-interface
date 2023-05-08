import { Interface } from '@ethersproject/abi'
import FAIRLAUNCH_ABI from './fairlaunch.json'

const ERC20_INTERFACE = new Interface(FAIRLAUNCH_ABI)

export default ERC20_INTERFACE
export { FAIRLAUNCH_ABI }
