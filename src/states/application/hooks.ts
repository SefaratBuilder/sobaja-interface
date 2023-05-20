import { useActiveWeb3React } from 'hooks'
import { Token } from 'interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../index'
import {
    toggleAgreement,
    updateSlippageTolerance,
    updateTransactionDeadline,
    updateApplicationState,
    toggleDarkMode,
    updateRefAddress,
    updateGasToken
} from './actions'
import { ApplicationState } from './reducer'

export function useAppState(): ApplicationState {
    return useSelector((state: AppState) => state.application)
}

export const useToggleAgreement = () => {
    const dispatch = useDispatch()
    const { isAgreePolicy } = useAppState()
    return () => dispatch(toggleAgreement(!isAgreePolicy))
}

export const useUpdateApplicationState = () => {
    const dispatch = useDispatch()
    const { isUpdateApplication } = useAppState()
    return () => dispatch(updateApplicationState(!isUpdateApplication))
}

export const useSlippageTolerance = () => {
    const dispatch = useDispatch()
    const { slippage } = useAppState()
    return {
        slippage,
        setSlippage: (s: string) => dispatch(updateSlippageTolerance(s)),
    }
}

export const useTransactionDeadline = () => {
    const dispatch = useDispatch()
    const { deadline } = useAppState()

    return {
        deadline,
        setDeadline: (d: number) => dispatch(updateTransactionDeadline(d)),
    }
}

export const useToggleDarkMode = () => {
    const dispatch = useDispatch()
    const { userDarkMode } = useAppState()
    return () => dispatch(toggleDarkMode(!userDarkMode))
}

export function useBlockNumber(): number | undefined {
    const { chainId } = useActiveWeb3React()
    return useSelector(
        (state: AppState) => state.application.blockNumber[chainId ?? -1],
    )
}

export const useUpdateRefAddress = () => {
    const dispatch = useDispatch()
    return (ref: string | undefined) => dispatch(updateRefAddress(ref))
}

export const useUpdateGasToken = () => {
    const dispatch = useDispatch()
    return (token: Token) => dispatch(updateGasToken(token))
}
