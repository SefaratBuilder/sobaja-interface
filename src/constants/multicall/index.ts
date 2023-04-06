import MULTICALL_ABI from "./abi.json";
import { ChainId } from "..";

const MULTICALL_NETWORKS: { [chainId in any]: string } = {
    [ChainId.ZKMAINNET]: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
    [ChainId.ZKTESTNET]: "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
    [ChainId.GOERLI]: "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb"
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
