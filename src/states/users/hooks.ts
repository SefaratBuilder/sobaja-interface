import { AppState } from "states";
import { useDispatch, useSelector } from "react-redux";
import { updateActivity, updateBalanceTokens } from "./action";
import { UserActivity, UserBalance, UserState } from "./reducer";
import { useActiveWeb3React } from "hooks";

export function useUsersState(): UserState {
    return useSelector((state: AppState) => state.users)
}

export const useUpdateBalanceTokens = () => {
    const dispatch = useDispatch()
    const { chainId } = useActiveWeb3React()
    return (balances: Array<UserBalance>) => dispatch(updateBalanceTokens({ chainId, balances }))
}
export const useUpdateActivity = () => {
    const dispatch = useDispatch()
    const { chainId } = useActiveWeb3React()
    return (activity: Array<UserActivity>) => dispatch(updateActivity({ chainId, activity }))
}