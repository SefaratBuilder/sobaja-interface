import { BigNumberish } from "ethers";

export type Transaction = {
    target: string;
    data: string;
    value?: BigNumberish;
    nonce?: BigNumberish;
    gasLimit?: BigNumberish;
};