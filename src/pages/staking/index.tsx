import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Columns } from 'components/Layouts'

import { useActiveWeb3React } from 'hooks'
import { useToken, useTokenApproval } from 'hooks/useToken'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import WalletModal from 'components/WalletModal'

import { URLSCAN_BY_CHAINID } from 'constants/index'
import { STAKING, STAKING_TOKEN } from 'constants/addresses'
import { mulNumberWithDecimal } from 'utils/math'

import { useTransactionHandler } from 'states/transactions/hooks'
import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import ToastMessage from 'components/ToastMessage'

import Blur from 'components/Blur'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { OpacityModal } from 'components/Web3Status'
import CurrentStake from './Components/CurrentStake'

import LabelStake from './Components/LabelStake'
import LabelUnStake from './Components/LabelUnstake'
import { Token } from 'interfaces'

const Stake = () => {
    const [isStakeToken, setIsStakeToken] = useState(true)
    const [inputStakeValue, setInputStakeValue] = useState<number | string>(
        '25',
    )

    const { chainId, account } = useActiveWeb3React()

    const stakingToken = useToken(
        chainId ? STAKING_TOKEN?.[chainId] : undefined,
    )

    const [unstakeData, setUnstakeData] = useState<{
        stake: string
        reward: string
        stakingId: string | undefined
        token: Token | undefined
        position: any
    }>({
        stake: '0',
        reward: '0',
        stakingId: undefined,
        token: stakingToken,
        position: '',
    })
    const [isShowHistory, setIsShowHistory] = useState(false)
    const [isShowCurrent, setIsShowCurrent] = useState(false)

    const [isOpenWalletModal, setIsOpenWalletModal] = useState(false)
    const routerAddress = chainId ? STAKING[chainId] : undefined
    const tokenApproval = useTokenApproval(account, routerAddress, stakingToken)
    const balanceIn = useCurrencyBalance(account, stakingToken)

    const { addTxn } = useTransactionHandler()
    const initDataTransaction = InitCompTransaction()
    const ref = useRef<any>()

    const handleOnApprove = async () => {
        try {
            initDataTransaction.setError('')
            console.log('approving....')

            if (stakingToken && inputStakeValue && routerAddress) {
                console.log('approving....')
                initDataTransaction.setIsOpenWaitingModal(true)
                const callResult: any = await tokenApproval?.approve(
                    routerAddress,
                    mulNumberWithDecimal(
                        inputStakeValue,
                        stakingToken.decimals,
                    ),
                )

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                        callResult.hash || ''
                    }`,
                    // hash: tx?.hash || '',
                    msg: 'Approve',
                    status: txn.status === 1 ? true : false,
                })
            }
        } catch (err) {
            console.log('Failed to approve token: ', err)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
        }
    }
    useOnClickOutside(ref, () => {
        setIsOpenWalletModal(false)
    })

    const openWalletModal = () => {
        setIsOpenWalletModal(!isOpenWalletModal)
    }

    return (
        <>
            <>
                <ComponentsTransaction
                    data={initDataTransaction}
                    onConfirm={() => {}}
                />
                {(initDataTransaction.isOpenConfirmModal ||
                    initDataTransaction.isOpenResultModal ||
                    initDataTransaction.isOpenWaitingModal) && <Blur />}
            </>
            {/* <ToastMessage /> */}
            <WrapContainer>
                <StakingContainer ref={ref}>
                    {!account && isOpenWalletModal && (
                        <>
                            <WalletModal
                                setToggleWalletModal={setIsOpenWalletModal}
                            />
                            <OpacityModal
                                onClick={() => setIsOpenWalletModal(false)}
                            />
                            {/* <Blur /> */}
                        </>
                    )}
                    {isStakeToken ? (
                        <LabelStake
                            data={{
                                tokenApproval,
                                inputStakeValue,
                                setInputStakeValue,
                                stakingToken,
                                openWalletModal,
                                isStakeToken,
                                setIsStakeToken,
                                balanceIn,
                                isShowHistory,
                                setIsShowHistory,
                                initDataTransaction,
                                setUnstakeData,
                            }}
                            onApprove={() => handleOnApprove()}
                        />
                    ) : (
                        <LabelUnStake
                            isStakeToken={isStakeToken}
                            setIsStakeToken={setIsStakeToken}
                            balanceIn={balanceIn}
                            unstakeData={unstakeData}
                            // inputUnstakeValue={inputUnstakeValue}
                            // setInputUnstakeValue={setInputUnstakeValue}
                            isShowCurrent={isShowCurrent}
                            setIsShowCurrent={setIsShowCurrent}
                            stakingToken={stakingToken}
                            initDataTransaction={initDataTransaction}
                        />
                    )}
                </StakingContainer>
                <CurrentStake
                    setIsStakeToken={setIsStakeToken}
                    setUnstakeData={setUnstakeData}
                    unstakeData={unstakeData}
                />

                {/* {isStakeToken && isShowHistory && <History />} */}
                {/* {!isStakeToken && isShowCurrent && <CurrentStake />} */}
            </WrapContainer>
        </>
    )
}

const WrapContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    /* position: relative; */
    /* margin: 0 auto 40px; */

    @media screen and (max-width: 1176px) {
        gap: 40px;
        flex-direction: column;
        align-items: center;
    }

    @media screen and (max-width: 576px) {
        input {
            font-size: 20px;
        }
        div,
        button,
        span,
        p,
        a {
            font-size: 12px;
        }
    }
`

const StakingContainer = styled(Columns)`
    height: fit-content;
    max-width: 520px;

    /* border: 1.5px solid var(--border2); */
    /* border-radius: 12px;  */
    border: 2px solid #003b5c;
    border-radius: 16px;
    gap: 15px;
    z-index: 0;
    .title {
        color: rgba(136, 136, 136, 1);
    }

    @media (max-width: 576px) {
        width: 90%;
    }
`

export default Stake
