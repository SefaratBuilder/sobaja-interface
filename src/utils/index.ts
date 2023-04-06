import { isAddress, Contract, JsonRpcProvider, JsonRpcSigner } from "ethers";


// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export const shortenAddress = (address: string, chars = 4): string => {
    const parsed = isAddress(address) && address;
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    return `${parsed.substring(0, chars)}...${parsed.substring(42 - chars)}`;
}

// account is not optional
export function getSigner(
    library: JsonRpcProvider,
    account: string
): Promise<JsonRpcSigner> {
    return library.getSigner(account);
}

// account is optional
export function getProviderOrSigner(
    library: JsonRpcProvider,
    account?: string
): Promise<JsonRpcSigner> | JsonRpcProvider {
    return account ? getSigner(library, account) : library;
}

export function getContract(
    address: string,
    ABI: any,
    library: JsonRpcProvider,
    account?: string
): Contract {
    if (!isAddress(address)) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new Contract(
        address,
        ABI,
        getProviderOrSigner(library, account) as any
    );
}