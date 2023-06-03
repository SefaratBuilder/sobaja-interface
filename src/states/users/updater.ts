import { useActiveWeb3React } from 'hooks';
import { useEffect } from "react"
import { useAddUser, useUsersState } from "./hooks"
import { initBalanceToken } from './reducer';
import { useSmartAccountContext } from 'contexts/SmartAccountContext';

export default function Updater() {
    const addUser = useAddUser()
    const { chainId, account } = useActiveWeb3React()
    const userData = useUsersState()
    const { smartAccountAddress } = useSmartAccountContext()

    /**
     * @init init data balance when not exist
     */
    useEffect(() => {
        if (!chainId) return

        if (!userData) {
            addUser({
                balances: [{ ...initBalanceToken(chainId) }],
                activity: [],
            })
        }
    }, [chainId, smartAccountAddress, account])
    return null
}