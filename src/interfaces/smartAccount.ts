import { BigNumberish } from "ethers";

export type Transaction = {
    to: string;
    value?: BigNumberish;
    data?: string;
    nonce?: BigNumberish;
    gasLimit?: BigNumberish;
};