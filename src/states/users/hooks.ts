import { AppState } from "states";
import { useDispatch, useSelector } from "react-redux";
import { addUser, updateActivity, updateBalanceTokens, updateUser } from "./action";
import { User, UserActivity, UserBalance, UsersDetails, initUser } from "./reducer";
import { useActiveWeb3React } from "hooks";

export function useUsersState(): User {
    const { chainId, account } = useActiveWeb3React()

    return useSelector((state: AppState) =>
        chainId && account ? state.users.users[chainId][account] : initUser)
}

// export const useUpdateActivity = () => {
//     const dispatch = useDispatch()
//     const { chainId, account } = useActiveWeb3React()
//     return (activity: Array<UserActivity>) => dispatch(updateActivity({ account, chainId, activity }))
// }

// export const useUpdateBalanceTokens = () => {
//     const dispatch = useDispatch()
//     const { chainId, account } = useActiveWeb3React()
//     return (balances: Array<UserBalance>) => dispatch(updateBalanceTokens({ account, chainId, balances }))
// }

export const useAddUser = () => {
    const dispatch = useDispatch()
    const { chainId, account } = useActiveWeb3React()
    return (user: User) => {
        chainId && account &&
            dispatch(
                addUser({
                    chainId,
                    account,
                    users: user
                })
            )
    }
}