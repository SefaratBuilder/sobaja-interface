import { Columns, Row } from 'components/Layouts'
import { CompTransaction } from 'components/TransactionModal'
import { URLSCAN_BY_CHAINID } from 'constants/index'
import { FixedNumber } from 'ethers'
import { useActiveWeb3React } from 'hooks'
import { useStakingContract } from 'hooks/useContract'
import { Token } from 'interfaces'
import { useMemo, useState } from 'react'
import { useSwapActionHandlers } from 'states/swap/hooks'
import { useTransactionHandler } from 'states/transactions/hooks'
import styled from 'styled-components'
import { isNativeCoin } from 'utils'
import { mulNumberWithDecimal } from 'utils/math'
import ArrowUp from 'assets/icons/arrow-up.svg'
import { Link } from 'react-router-dom'
import Setting from 'components/HeaderLiquidity'
import Lock from 'assets/icons/lock.svg'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import BGSoba from 'assets/icons/soba2.jpg'
import Soba from '/favicon.ico'

interface IStakeToken {
    data: {
        tokenApproval: {
            allowance: FixedNumber | undefined
            approve: (to: string, amount: string | number) => void
        }
        inputStakeValue: string | number
        setInputStakeValue: React.Dispatch<
            React.SetStateAction<string | number>
        >
        stakingToken: Token | undefined
        openWalletModal: () => void
        isStakeToken: boolean
        setIsStakeToken: React.Dispatch<React.SetStateAction<boolean>>
        isShowHistory: boolean
        setIsShowHistory: React.Dispatch<React.SetStateAction<boolean>>
        balanceIn: string | undefined
        initDataTransaction: CompTransaction
    }
    onApprove: () => void
}
const StakeToken = ({ data, onApprove }: IStakeToken) => {
    const {
        tokenApproval,
        inputStakeValue,
        setInputStakeValue,
        stakingToken,
        openWalletModal,
        isStakeToken,
        setIsStakeToken,
        isShowHistory,
        setIsShowHistory,
        balanceIn,
        initDataTransaction,
    } = data

    const { account, chainId } = useActiveWeb3React()
    const stakingContract = useStakingContract()
    // const tokenTest = useToken('0xdEfd221072dD078d11590D58128399C2fe8cCa7e')
    const { addTxn } = useTransactionHandler()
    const { onUserInput } = useSwapActionHandlers()

    const [isOpenEdit, setIsOpenEdit] = useState(false)
    const selection = [
        { name: 30, value: 12 },
        { name: 60, value: 25 },
        { name: 90, value: 40 },
        { name: 180, value: 80 },
        { name: 365, value: 162 },
    ]
    const percents = [25, 50, 75, 100]
    const [tiers, setTiers] = useState<number>(0)
    const validateInputNumber = (e: string) => {
        const value = e
            .replace(/[^0-9.,]/g, '')
            .replace(' ', '')
            .replace(',', '.')
            .replace(/(\..*?)\..*/g, '$1')
        setInputStakeValue(value)
    }
    const handleTime = (time: any) => {
        if (time < 0) return '00:00'
        const t = new Date(Number(time) * 1000)

        const customDate =
            (t.getDate().toString().length > 1
                ? t.getDate()
                : `0${t.getDate()}`) +
            '/' +
            ((t.getMonth() + 1).toString().length > 1
                ? t.getMonth() + 1
                : `0${t.getMonth() + 1}`) +
            '/' +
            t.getFullYear().toString()
        console.log('🤦‍♂️ ⟹ handleTime ⟹ customDate:', customDate)
        const hour = t.getHours() < 10 ? '0' + t.getHours() : t.getHours()
        const minutes =
            t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()
        return `${customDate} ${hour}:${minutes}`
    }

    const handleChangeBalance = (percent: number | string) => {
        setInputStakeValue((i) => (Number(balanceIn) * Number(percent)) / 100)
    }
    const endDate = useMemo(() => {
        const now = new Date()
        const ONEDAYTIMESTAMP = 86400
        return handleTime(
            now.getTime() / 1000 +
                ONEDAYTIMESTAMP * Number(selection[tiers].name),
        )
    }, [tiers])

    const deposit = async () => {
        try {
            if (!inputStakeValue || !selection || !stakingToken) return
            console.log('staking...')
            initDataTransaction.setError('')
            initDataTransaction.setPayload({
                method: 'staking',
                input: inputStakeValue,
                tokenIn: stakingToken,
                onConfirm: onConfirmDeposit,
            })
            initDataTransaction.setIsOpenConfirmModal(true)
        } catch (error) {
            console.log('failed to swap', error)
        }
    }
    const onConfirmDeposit = async () => {
        try {
            if (!stakingToken?.decimals) return
            initDataTransaction.setIsOpenConfirmModal(false)
            initDataTransaction.setIsOpenWaitingModal(true)

            const inputStakingValue = mulNumberWithDecimal(
                inputStakeValue,
                stakingToken?.decimals,
            )

            const args = [inputStakingValue, selection[tiers].name]
            const method = 'deposit'
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
                msg: `Staking`,
                status: txn.status === 1 ? true : false,
            })
        } catch (error) {
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }

    const handleOnDeposit = async () => {
        console.log('..........Testing')

        try {
            if (!inputStakeValue || !selection || !stakingToken) return
            console.log('Staking .........')

            const inputStakingValue = mulNumberWithDecimal(
                inputStakeValue,
                stakingToken?.decimals,
            )

            const args = [inputStakingValue, selection[tiers].name]
            const method = 'deposit'
            const gasLimit = await stakingContract?.estimateGas?.[method]?.(
                ...args,
            )
            const callResult = await stakingContract?.[method]?.(...args, {
                gasLimit: gasLimit && gasLimit.add(1000),
            })
            console.log('🤦‍♂️ ⟹ handleOnDeposit ⟹ callResult:', { callResult })

            const txn = await callResult.wait()
            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx${
                    callResult.hash || ''
                }`,
                msg: `Staking ${inputStakeValue} for ${selection}`,
                status: txn.status === 1 ? true : false,
            })

            // reset user input
            // onUserInput(Field.INPUT, '')
        } catch (error) {
            console.log('====================================')
            console.log('Error with cause:', error)
            console.log('====================================')
        }
    }

    const isInsufficientAllowance = inputStakeValue
        ? Number(tokenApproval?.allowance) < Number(inputStakeValue) &&
          !isNativeCoin(stakingToken)
        : true

    // console.log(tokenApproval.allowance);

    const StakeButton = ({ isInsufficientAllowance, inputStakeValue }: any) => {
        const isNotConnected = !account
        const minimumRequired =
            Number(inputStakeValue) < 100 || !inputStakeValue
        console.log('🤦‍♂️ ⟹ StakeButton ⟹ minimumRequired:', minimumRequired)

        return (
            <LabelButtonStake>
                {isNotConnected ? (
                    <PrimaryButton
                        name="Connect Wallet"
                        onClick={openWalletModal}
                    />
                ) : minimumRequired ? (
                    <ButtonStake isStake={true}>
                        <PrimaryButton
                            name={'Minimum required'}
                            disabled={true}
                        />
                    </ButtonStake>
                ) : isInsufficientAllowance ? (
                    <ButtonStake onClick={() => onApprove()}>
                        <div>
                            <img src={Lock} alt="lock" />
                        </div>
                        <div>Unlock Token</div>
                    </ButtonStake>
                ) : (
                    <ButtonStake isStake={true}>
                        <PrimaryButton onClick={deposit} name={'Stake'} />
                    </ButtonStake>
                )}
            </LabelButtonStake>
        )
    }
    return (
        <Container>
            <WrapContent image={BGSoba} isStake={true}>
                <Row jus="space-between">
                    <Nav gap="20px">
                        <Link
                            to=""
                            className={isStakeToken ? 'active-link' : ''}
                            onClick={() => setIsStakeToken(true)}
                        >
                            Stake Token
                        </Link>

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
                    <div>Amount</div>
                    <div>
                        Balance:
                        {balanceIn ? ` ≈${Number(balanceIn).toFixed(8)}` : ' 0'}
                    </div>
                </Row>
                {/* <Row jus="space-between">
                    <div></div>
                    <div
                        onClick={() => setIsShowHistory((isShow) => !isShow)}
                        className={isShowHistory ? 'history' : ''}
                    >
                        <img src={Clock} alt="" />
                    </div>
                </Row> */}
                <LabelData>
                    <Row jus="space-between" gap="20px">
                        <WrapCustom>
                            <div className="title details-token">
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
                                <div>
                                    <CustomInput
                                        value={inputStakeValue}
                                        placeholder={
                                            inputStakeValue?.toString() || '0'
                                        }
                                        onChange={(e) =>
                                            validateInputNumber(
                                                e?.target?.value,
                                            )
                                        }
                                    />
                                </div>
                            </WrapCustom>
                            {isInsufficientAllowance && inputStakeValue && (
                                <div
                                    className="visible-lock"
                                    onClick={() => onApprove()}
                                >
                                    <img src={Lock} alt="lock" />
                                </div>
                            )}
                        </LabelRight>
                    </Row>
                    <LabelPercent>
                        {percents.map((item) => {
                            return (
                                <div onClick={() => handleChangeBalance(item)}>
                                    {item}%
                                </div>
                            )
                        })}
                    </LabelPercent>
                </LabelData>
                <StakeButton
                    isInsufficientAllowance={isInsufficientAllowance}
                    inputStakeValue={inputStakeValue}
                />

                <WrapDetailsStake>
                    <Row jus="space-between" gap="20px">
                        <div>Minimum require:</div>
                        <Row gap="5px">
                            <div className="stats">100</div>
                            <div>{stakingToken?.symbol}</div>
                        </Row>
                    </Row>
                    <Row jus="space-between" gap="20px">
                        <div>Stake:</div>
                        <Row gap="5px">
                            <div className="stats">{inputStakeValue || 0}</div>
                            <div>{stakingToken?.symbol}</div>
                        </Row>
                    </Row>
                    <Row jus="space-between">
                        <div>Lock time:</div>
                        <Row gap="5px">
                            <div
                                className="edit"
                                onClick={() => setIsOpenEdit((open) => !open)}
                            >
                                {!isOpenEdit ? 'Edit' : 'Hide'}
                            </div>
                            <div>{selection[tiers].name} days</div>
                        </Row>
                    </Row>
                    {isOpenEdit && (
                        <Row jus="space-between" className="field-days">
                            {selection.map((item, index) => {
                                return (
                                    <div
                                        className="days"
                                        onClick={() => setTiers(index)}
                                    >
                                        {item.name}
                                    </div>
                                )
                            })}
                        </Row>
                    )}
                    {/* <Row jus="space-between">
                        <div>Start time:</div>
                        <Row gap="5px">
                            <div>30-04-1975</div>
                        </Row>
                    </Row> */}
                    <Row jus="space-between">
                        <div>End date:</div>
                        <Row gap="5px">
                            <div>{endDate}</div>
                        </Row>
                    </Row>
                </WrapDetailsStake>

                <LabelDetails>
                    <Row jus="space-between">
                        <div className="title">Voting Balance</div>
                        <div>0.0</div>
                    </Row>
                    <Row jus="space-between">
                        <div className="title">Voting Power</div>
                        <div className="label-power">
                            <span>0.0%</span>
                            <span className="numb">+0.0001 %</span>
                        </div>
                    </Row>
                </LabelDetails>
            </WrapContent>

            <LabelBottom>
                <WrapCustom>
                    <div className="title">Voting Balance</div>
                    <div>2,345</div>
                    <CustomMsg>
                        <div>
                            <img src={ArrowUp} alt="arrow-up" />
                        </div>
                        <span className="numb">+9.99%</span>
                        <span>vs last week</span>
                    </CustomMsg>
                </WrapCustom>
                <WrapCustom>
                    <div className="title">Staked Token</div>
                    <div>12,345,678.099</div>
                    <CustomMsg>
                        <div>
                            <img src={ArrowUp} alt="arrow-up" />
                        </div>
                        <span className="numb">+1.66%</span>
                        <span>vs last week</span>
                    </CustomMsg>
                </WrapCustom>
            </LabelBottom>
        </Container>
    )
}
export default StakeToken

const Container = styled.div`
    /* @media screen and (max-width: 576px) {
        font-size: 12px;
    } */
`

const LabelButtonStake = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
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

const WrapCustom = styled(Columns)`
    gap: 10px;
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

const WrapDetailsStake = styled.div`
    .stats {
        max-width: 200px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .edit {
        color: rgba(0, 178, 255, 1);
        cursor: pointer;
    }

    .field-days {
        padding: 10px 0;
    }

    .days {
        width: 100px;
        background: rgba(0, 38, 59, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        /* color: rgba(0, 178, 255, 1); */
        /* border-radius: 6px; */
        cursor: pointer;

        :hover {
            background: rgba(14, 15, 15, 0.6);
        }
    }
`

const CustomMsg = styled.div`
    display: flex;
    gap: 5px;

    span {
        color: rgba(136, 136, 136, 1);
    }
    .numb {
        color: rgba(48, 202, 125, 1);
    }
`

const LabelData = styled.div`
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    gap: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 12px;
`
const LabelBottom = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 25px;
`
const LabelDetails = styled.div`
    border: 2px solid #003b5c;
    border-radius: 10px;
    padding: 10px;
    .label-power {
        display: flex;
        gap: 6px;
    }
`

const LabelPercent = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;

    @media screen and (max-width: 376px) {
        flex-wrap: wrap;
    }
    div {
        width: 100px;
        background: rgba(0, 38, 59, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        color: rgba(0, 178, 255, 1);
        border-radius: 6px;
        cursor: pointer;

        :hover {
            background: rgba(14, 15, 15, 0.6);
        }
    }
`
const ButtonStake = styled.div<{ isStake?: boolean }>`
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: ${({ isStake }) => (isStake ? '0' : '10px')};
    background: rgba(0, 178, 255, 0.2);
    border-radius: 8px;
    color: rgba(0, 178, 255, 1);
    cursor: pointer;
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
