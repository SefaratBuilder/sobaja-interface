import { useActiveWeb3React } from 'hooks';
import { useEffect } from "react"
import { useAddUser, useUsersState } from "./hooks"
import { initBalanceToken } from './reducer';

export default function Updater() {
    const addUser = useAddUser()
    const { chainId } = useActiveWeb3React()
    const userData = useUsersState()

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
    }, [chainId])
    return null
}