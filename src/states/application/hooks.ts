import { useDispatch, useSelector } from "react-redux"
import { AppState } from "../index"
import { toggleAgreement, updateSlippageTolerance, updateTransactionDeadline, updateApplicationState, toggleDarkMode, updateRefAddress } from "./actions"

export function useAppState() {
    return useSelector(
        (state: AppState) => state.application
    )
}

export const useToggleAgreement = () => {
    const dispatch = useDispatch();
    const { isAgreePolicy } = useAppState();
    return () => dispatch(toggleAgreement(!isAgreePolicy))
}

export const useUpdateApplicationState = () => {
    const dispatch = useDispatch();
    const { isUpdateApplication } = useAppState();
    return () => dispatch(updateApplicationState(!isUpdateApplication))
}

export const useUpdateRefAddress = () => {
    const dispatch = useDispatch();
    // const { refAddress } = useAppState();
    return (ref: string | undefined) => dispatch(updateRefAddress(ref))
}



export const useSlippageTolerance = () => {
    const dispatch = useDispatch();
    const { slippage } = useAppState();
    return {
        slippage,
        setSlippage: (s: string) => dispatch(updateSlippageTolerance(s))
    }
}

export const useTransactionDeadline = () => {
    const dispatch = useDispatch();
    const { deadline } = useAppState();

    return {
        deadline,
        setDeadline: (d: number) => dispatch(updateTransactionDeadline(d))
    }
}

export const useToggleDarkMode = () => {
    const dispatch = useDispatch();
    const { userDarkMode } = useAppState()
    return () => dispatch(toggleDarkMode(!userDarkMode))
}