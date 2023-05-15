import PrimaryButton from 'components/Buttons/PrimaryButton'
import { Columns, Row } from 'components/Layouts'
import { CompTransaction } from 'components/TransactionModal'
import { Token } from 'interfaces'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import BGSoba from 'assets/icons/soba2.jpg'
import Setting from 'components/HeaderLiquidity'
import Soba from '/favicon.ico'
import { mulNumberWithDecimal } from 'utils/math'
import { useStakingContract } from 'hooks/useContract'
import { useTransactionHandler } from 'states/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { URLSCAN_BY_CHAINID } from 'constants/index'

interface IUnstakeToken {
    isStakeToken: boolean
    setIsStakeToken: React.Dispatch<React.SetStateAction<boolean>>
    balanceIn: string | undefined
    unstakeData: {
        stake: string
        reward: string
        stakingId: string
        token: Token | undefined
    }
    // inputUnstakeValue: string | number
    // setInputUnstakeValue: React.Dispatch<React.SetStateAction<string | number>>
    isShowCurrent: boolean
    setIsShowCurrent: React.Dispatch<React.SetStateAction<boolean>>
    stakingToken: Token | undefined
    initDataTransaction: CompTransaction
}
const LabelUnStake = ({
    isStakeToken,
    setIsStakeToken,
    balanceIn,
    unstakeData,
    // inputUnstakeValue,
    // setInputUnstakeValue,
    isShowCurrent,
    setIsShowCurrent,
    stakingToken,
    initDataTransaction,
}: IUnstakeToken) => {
    const stakingContract = useStakingContract()
    const { addTxn } = useTransactionHandler()
    const { chainId } = useActiveWeb3React()

    const withdraw = async () => {
        try {
            console.log('withdraw...')
            initDataTransaction.setError('')
            initDataTransaction.setPayload({
                method: 'withdraw',
                input: unstakeData.reward,
                tokenIn: stakingToken,
                onConfirm: onConfirmWithdraw,
            })
            initDataTransaction.setIsOpenConfirmModal(true)
        } catch (error) {
            console.log('failed to swap', error)
        }
    }
    const onConfirmWithdraw = async () => {
        try {
            console.log('staking id', unstakeData.stakingId)
            if (!unstakeData.stakingId) return
            initDataTransaction.setIsOpenConfirmModal(false)
            initDataTransaction.setIsOpenWaitingModal(true)

            const args = [unstakeData.stakingId]
            const method = 'withdraw'
            const gasLimit = await stakingContract?.estimateGas?.[method]?.(
                ...args,
            )
            const callResult = await stakingContract?.[method]?.(...args, {
                gasLimit: gasLimit && gasLimit.add(1000),
            })

            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)

            const txn = await callResult.wait()
            initDataTransaction.setIsOpenResultModal(false)

            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                    callResult.hash || ''
                }`,
                msg: `Withdraw`,
                status: txn.status === 1 ? true : false,
            })
        } catch (error) {
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }
    const harvest = async () => {
        try {
            console.log('harvest...')
            initDataTransaction.setError('')
            initDataTransaction.setPayload({
                method: 'harvest',
                input: unstakeData.reward,
                tokenIn: stakingToken,
                onConfirm: onConfirmHarvest,
            })
            initDataTransaction.setIsOpenConfirmModal(true)
        } catch (error) {
            console.log('failed to swap', error)
        }
    }
    const onConfirmHarvest = async () => {
        try {
            console.log('staking id', unstakeData.stakingId)
            if (!unstakeData.stakingId) return
            initDataTransaction.setIsOpenConfirmModal(false)
            initDataTransaction.setIsOpenWaitingModal(true)

            const args = [unstakeData.stakingId]
            const method = 'harvest'
            const gasLimit = await stakingContract?.estimateGas?.[method]?.(
                ...args,
            )
            const callResult = await stakingContract?.[method]?.(...args, {
                gasLimit: gasLimit && gasLimit.add(1000),
            })

            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)

            const txn = await callResult.wait()
            initDataTransaction.setIsOpenResultModal(false)

            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                    callResult.hash || ''
                }`,
                msg: `Harvest`,
                status: txn.status === 1 ? true : false,
            })
        } catch (error) {
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }

    return (
        <>
            <WrapContent image={BGSoba}>
                <Row
                    jus="space-between"
                    gap="10px"
                    className="container-header"
                >
                    <Nav gap="20px">
                        <Link
                            to=""
                            className={isStakeToken ? 'active-link' : ''}
                            onClick={() => setIsStakeToken(true)}
                        >
                            Stake Token
                        </Link>
                        {/* <Link to="/add">Add</Link> */}
                        {/* <Link to="/pools">Pool</Link> */}
                        <Link
                            className={!isStakeToken ? 'active-link' : ''}
                            to=""
                            onClick={() => setIsStakeToken(false)}
                        >
                            Unstake Token
                        </Link>
                    </Nav>
                    <Setting />
                </Row>
                <Row jus="space-between">
                    <div>Reward</div>
                    <div>
                        Balance:
                        {balanceIn ? ` ≈${Number(balanceIn).toFixed(8)}` : ' 0'}
                    </div>
                </Row>
                {/* <Row jus="space-between">
                    <div></div>
                    <div
                        onClick={() => setIsShowCurrent((isShow) => !isShow)}
                        className={isShowCurrent ? 'history' : ''}
                    >
                        <img src={Clock} alt="" />
                    </div>
                </Row> */}
                <LabelData>
                    <Row jus="space-between">
                        <WrapCustom>
                            <div className="title">
                                {stakingToken?.symbol} Token
                            </div>
                            <div className="group">
                                <img src={Soba} alt="logo-eth" />
                                <div className="value">
                                    {stakingToken?.symbol}
                                </div>
                            </div>
                        </WrapCustom>
                        <LabelRight>
                            <WrapCustom>
                                <div className="title price">≈$ 1,869.76</div>
                                <span className="label-unstake">
                                    {unstakeData?.reward}
                                </span>
                                {/* <CustomInput
                                        value={unstakeData?.stake}
                                        placeholder={
                                            unstakeData?.stake?.toString() ||
                                            '0'
                                        }
                                        onChange={(e) =>
                                            validateInputNumber(
                                                e?.target?.value,
                                            )
                                        }
                                    /> */}

                                {/* <div className="value">25</div> */}
                            </WrapCustom>
                        </LabelRight>
                    </Row>
                </LabelData>
                <CustomRow jus="space-between">
                    <div>Unicorn Power</div>
                    <div>0</div>
                </CustomRow>
                <WrapDetailsUnstake>
                    <Details>
                        <p>Stake</p>
                        <p>Tx Cost</p>
                    </Details>
                    <Details>
                        <p className="value">
                            {unstakeData.stake} {stakingToken?.symbol}
                        </p>
                        <Row gap="5px">
                            <p>Edit</p>
                            <p>Market</p>
                            <p>≈$99.99</p>
                        </Row>
                    </Details>
                </WrapDetailsUnstake>
                {/* <PrimaryButton name="Unstake" /> */}
                <LabelButton>
                    <PrimaryButton onClick={harvest} name={'Harvest'} />
                    <PrimaryButton onClick={withdraw} name={'Withdraw'} />
                </LabelButton>
            </WrapContent>
        </>
    )
}

export default LabelUnStake

const WrapCustom = styled(Columns)`
    gap: 10px;

    .label-unstake {
        width: 100%;
        font-size: 30px;
        font-weight: 500;
        background: none;
        border: none;
        outline: none;
        color: white;
        text-align: end;
        cursor: default;
    }

    .details-token {
        min-width: 100px;
        width: 100%;
    }

    .price {
        text-align: end;
    }

    .group {
        display: flex;
        align-items: center;
        gap: 5px;
        height: 32px;
        img {
            width: 32px;
        }
    }

    .value {
        display: flex;
        align-items: center;

        height: 32px;
        justify-content: flex-end;
        font-size: 22px;
        font-weight: 400;
    }
`

const LabelData = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 470px;
    /* justify-content: center; */
    gap: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 12px;

    @media screen and (max-width: 576px) {
        min-width: unset;
    }
`
const LabelRight = styled(Row)`
    display: flex;
    align-items: center;
    gap: 10px;

    .visible-lock {
        height: 75%;
        display: flex;
        align-items: center;
        padding: 15px;
        background: rgba(0, 178, 255, 0.2);
        border-radius: 6px;
        cursor: pointer;
    }
`

const WrapDetailsUnstake = styled.div`
    display: flex;
    justify-content: space-between;
    border-radius: 10px;
    border: 2px solid #003b5c;
    padding: 15px 10px;
    .value {
        text-align: end;
    }
`
const CustomRow = styled(Row)`
    padding: 0 10px;
`
const WrapContent = styled.div<{ image: string; isStake?: boolean }>`
    display: flex;
    border-radius: ${({ isStake }) =>
        !isStake ? '16px 16px 16px 16px' : '16px 16px 0 0'};
    flex-direction: column;
    gap: 25px;
    background: url(${({ image }) => image});
    background-size: 750px;
    background-repeat: no-repeat;
    background-position: top;
    padding: 15px 25px;

    .container-header {
        text-align: center;
    }
    .numb {
        color: rgba(48, 202, 125, 1);
    }

    img {
        cursor: pointer;
        width: 18px;
    }

    .history {
        /* border: 1px solid black; */
        background: #f1f1f12f;
        backdrop-filter: calc(5px);
        padding: 5px;
    }
`
const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`
const Nav = styled(Row)`
    a {
        padding: 5px 8px;
        border-radius: 4px;
        text-decoration: none !important;
        font-size: 14px;
        font-weight: 400;
        :hover {
            text-decoration: none !important;
        }
    }

    .active-link {
        background: var(--bg6);
    }
`

const CustomInput = styled.input`
    width: 100%;
    font-size: 30px;
    font-weight: 500;
    background: none;
    border: none;
    outline: none;
    color: white;
    text-align: end;

    &::placeholder {
        opacity: 0.7;
    }
`

const LabelButton = styled.div`
    display: flex;
    gap: 40px;
    justify-content: center;
`
