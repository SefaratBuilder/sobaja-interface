import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'

import { useSwapActionHandlers, useSwapState } from 'states/swap/hooks'
import PrimaryButton from 'components/Buttons/PrimaryButton'

import { useActiveWeb3React } from 'hooks'
import { usePair } from 'hooks/useAllPairs'
import Setting from 'components/HeaderLiquidity'
import { useToken, useTokenApproval } from 'hooks/useToken'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import WalletModal from 'components/WalletModal'

import { URLSCAN_BY_CHAINID } from 'constants/index'
import { ROUTERS, WRAPPED_NATIVE_ADDRESSES } from 'constants/addresses'
import { ZeroAddress } from 'ethers'
import { mulNumberWithDecimal } from 'utils/math'
import { useRouterContract } from 'hooks/useContract'
import { isNativeCoin } from 'utils'
import {
    useAppState,
    useSlippageTolerance,
    useTransactionDeadline,
    useUpdateRefAddress,
} from 'states/application/hooks'
import { useTransactionHandler } from 'states/transactions/hooks'
import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import ToastMessage from 'components/ToastMessage'

import Blur from 'components/Blur'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { OpacityModal } from 'components/Web3Status'
import ETH from 'assets/token-logos/eth.svg'
import BGSoba from 'assets/icons/soba2.jpg'
import ArrowUp from 'assets/icons/arrow-up.svg'
import Lock from 'assets/icons/lock.svg'
import { useStakingContract } from 'hooks/useContract'
import { sendEvent } from 'utils/analytics'
import { Field } from 'interfaces'

const Stake = () => {
    const swapState = useSwapState()
    const { inputAmount, outputAmount, swapType, tokenIn, tokenOut } = swapState
    const { onUserInput, onSwitchTokens, onTokenSelection, onChangeSwapState } =
        useSwapActionHandlers()
    const [isStakeToken, setIsStakeToken] = useState(true)

    const [inputStakeValue, setInputStakeValue] = useState<number | string>(
        '25',
    )
    const [inputUnstakeValue, setInputUnstakeValue] = useState<number | string>(
        '0',
    )
    const tokenTest = useToken(WRAPPED_NATIVE_ADDRESSES[80001]);
    const { chainId, library, account } = useActiveWeb3React()
    const stakingContract = useStakingContract();
    const [isOpenWalletModal, setIsOpenWalletModal] = useState(false)
    const routerAddress = chainId ? ROUTERS[chainId] : undefined
    const tokenApproval = useTokenApproval(account, routerAddress, tokenTest)
    const balanceIn = useCurrencyBalance(account, tokenIn)
    const initDataTransaction = InitCompTransaction()
    const loca = useLocation()
    const updateRef = useUpdateRefAddress()
    const ref = useRef<any>()
    const [isOpenEdit, setIsOpenEdit] = useState(false)
    const { addTxn } = useTransactionHandler()

    const selection = [
        { name: 30, value: 12 },
        { name: 60, value: 25 },
        { name: 90, value: 40 },
        { name: 180, value: 80 },
        { name: 365, value: 162 },
    ]
    const percents = [25, 50, 75, 100]
    const [tiers, setTiers] = useState<number>(0)

    const positionIndex = 0;



    useOnClickOutside(ref, () => {
        setIsOpenWalletModal(false)
    })

    useEffect(() => {
        if (loca.search && loca.search.includes('?')) {
            updateRef(loca.search.slice(1))
        }
    }, [loca])

    const handleChangeBalance = (percent: number | string) => {
        setInputStakeValue((i) => Number(i) * Number(`0.${percent}`))
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
        // "/" +
        const hour = t.getHours() < 10 ? '0' + t.getHours() : t.getHours()
        const minutes =
            t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()
        return `${customDate} ${hour}:${minutes}`
    }
    const endDate = useMemo(() => {
        const now = new Date()
        const ONEDAYTIMESTAMP = 86400
        return handleTime(
            now.getTime() / 1000 +
                ONEDAYTIMESTAMP * Number(selection[tiers].name),
        )
    }, [tiers])

    const handleOnApprove = async () => {
        try {
            initDataTransaction.setError('')

            if (tokenIn && inputAmount && routerAddress) {
                console.log('approving....')
                initDataTransaction.setIsOpenWaitingModal(true)
                const callResult: any = await tokenApproval?.approve(
                    routerAddress,
                    mulNumberWithDecimal(inputAmount, tokenIn.decimals),
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

    const openWalletModal = () => {
        setIsOpenWalletModal(!isOpenWalletModal)
    }

    // params : amount, period <=> inputSelectionValue, selection.name
    const handleOnDeposit = async () =>{
        console.log('..........Testing');
        
        try {
            if(!inputStakeValue || !selection || !tokenTest) return
                console.log('Staking .........');

                const inputStakingValue = mulNumberWithDecimal(inputStakeValue, tokenTest?.decimals);

                const args = [
                    inputStakingValue,
                    selection[tiers].name
                ]
                const method = 'deposit'
                const gasLimit = await stakingContract?.estimateGas?.[method]?.(
                    ...args
                )
                const callResult = await stakingContract?.[method]?.(...args,{
                    gasLimit: gasLimit && gasLimit.add(1000)
                })
                console.log('🤦‍♂️ ⟹ handleOnDeposit ⟹ callResult:', { callResult })
                
                sendEvent({
                    category: 'Defi',
                    action: 'Staking',
                    label:[
                        inputStakeValue,
                        selection
                    ].join('/'),
                })

                const txn = await callResult.wait();
                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx${
                        callResult.hash || ''
                    }`,
                    msg:`Staking ${inputStakeValue} for ${selection}`,
                    status: txn.status === 1 ? true :false
                })

                // reset user input
                onUserInput(Field.INPUT,'')
            
        } catch (error) {
            console.log('====================================');
            console.log('Error with cause:', error);
            console.log('====================================');
        }
    }

    const handleOnHarvest = async() =>{
        console.log("Testing harvest ....");
        try {
            const positionsIndex = 
            console.log('Harvesting ....');

            const args = [
                positionIndex
            ]
            const method = 'harvest'
            const gasLimit = await stakingContract?.estimateGas?.[method]?.(
                ...args
            )
            const callResult = await stakingContract?.[method]?.(...args,{
                gasLimit: gasLimit && gasLimit.add(1000)
            })
            console.log('🤦‍♂️ ⟹ handleOnHarvest ⟹ callResult:', { callResult })

            sendEvent({
                category: "Defi",
                action: 'Harvesting',
                label:[
                    positionIndex
                ].join('/'),
            })
            const txn = await callResult.wait();
            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx${
                    callResult.hash || ''
                }`,
                msg: `Harvesting at index ${positionIndex}`,
                status: txn.status === 1 ? true : false 
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    const handleOnWithDraw = async() =>{
        console.log('Testing withdraw .....');
        try {
            console.log('Withdrawing ....');
            const args = [
                positionIndex
            ]
            const method = 'withdraw'
            const gasLimit = await stakingContract?.estimateGas?.[method]?.(
                ...args
            )
            const callResult = await stakingContract?.[method]?.(...args,{
                gasLimit: gasLimit && gasLimit.add(1000)
            })
            console.log('🤦‍♂️ ⟹ handleOnWithdraw ⟹ callResult:', { callResult })

            sendEvent({
                category: "Defi",
                action: 'Withdrawing',
                label: [
                    positionIndex
                ].join('/'),
            })
            const txn = await callResult.wait();
            addTxn({
                hash:`${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx${
                    callResult.hash || ''
                }`,
                msg:`Withdrawing at index ${positionIndex}`,
                status: txn.status === 1 ? true : false 
            })
        } catch (error) {
            console.log(error);
            
        }
        
    }


    const StakeButton = ({ isInsufficientAllowance }: any) => {
        const isNotConnected = !account

        return (
            <LabelButtonStake>
                {isNotConnected ? (
                    <PrimaryButton
                        name="Connect Wallet"
                        onClick={openWalletModal}
                    />
                ) : isInsufficientAllowance ? (
                    <ButtonStake>
                        <div>
                            <img src={Lock} alt="lock" />
                        </div>
                        <div>Unlock Token</div>
                    </ButtonStake>
                ) : (
                    <ButtonStake isStake={true}>
                        <PrimaryButton onClick={handleOnDeposit} name={'Stake'} />
                    </ButtonStake>
                    
                )}
            </LabelButtonStake>
        )
    }

    const StakeToken = () => {
        const isInsufficientAllowance =
            Number(tokenApproval?.allowance) < Number(inputAmount) &&
            !isNativeCoin(tokenIn)

        return (
            <>
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
                        <div>Amount</div>
                        <div>
                            Balance:
                            {balanceIn
                                ? ` ≈${Number(balanceIn).toFixed(8)}`
                                : ' 0'}
                        </div>
                    </Row>
                    <LabelData>
                        <Row jus="space-between">
                            <WrapCustom>
                                <div className="title details-token">
                                    ETH Token
                                </div>
                                <div className="group">
                                    <img src={ETH} alt="logo-eth" />
                                    <div className="value">ETH</div>
                                </div>
                            </WrapCustom>
                            <LabelRight>
                                <WrapCustom>
                                    <div className="title price">
                                        ≈$ 1,869.76
                                    </div>
                                    <div>
                                        <CustomInput
                                            value={inputStakeValue}
                                            placeholder={
                                                inputStakeValue?.toString() ||
                                                '0'
                                            }
                                            onChange={(e) =>
                                                setInputStakeValue(
                                                    e?.target?.value,
                                                )
                                            }
                                        />
                                    </div>

                                    {/* <div className="value">25</div> */}
                                </WrapCustom>
                                {isInsufficientAllowance && (
                                    <div className="visible-lock">
                                        <img src={Lock} alt="lock" />
                                    </div>
                                )}
                            </LabelRight>
                        </Row>
                        <LabelPercent>
                            {percents.map((item) => {
                                return (
                                    <div
                                        onClick={() =>
                                            handleChangeBalance(item)
                                        }
                                    >
                                        {item}%
                                    </div>
                                )
                            })}
                        </LabelPercent>
                    </LabelData>
                    <StakeButton
                        isInsufficientAllowance={isInsufficientAllowance}
                    />
                    <ButtonStake isStake={true}>
                        <PrimaryButton onClick={handleOnHarvest} name={'Harvest'} />
                    </ButtonStake>
                    <ButtonStake isStake={true}>
                        <PrimaryButton onClick={handleOnWithDraw} name={'Withdraw'} />
                    </ButtonStake>

                    <WrapDetailsStake>
                        <Row jus="space-between">
                            <div>Stake:</div>
                            <Row gap="5px">
                                <div>30 ETH</div>
                            </Row>
                        </Row>
                        <Row jus="space-between">
                            <div>Lock time:</div>
                            <Row gap="5px">
                                <div
                                    className="edit"
                                    onClick={() =>
                                        setIsOpenEdit((open) => !open)
                                    }
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
            </>
        )
    }

    const UnStakeToken = () => {
        return (
            <>
                <WrapContent image={BGSoba}>
                    <Row jus="space-between">
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
                        <div>Amount</div>
                        <div>
                            Balance:
                            {balanceIn
                                ? ` ≈${Number(balanceIn).toFixed(8)}`
                                : ' 0'}
                        </div>
                    </Row>
                    <LabelData>
                        <Row jus="space-between">
                            <WrapCustom>
                                <div className="title">ETH Token</div>
                                <div className="group">
                                    <img src={ETH} alt="logo-eth" />
                                    <div className="value">ETH</div>
                                </div>
                            </WrapCustom>
                            <LabelRight>
                                <WrapCustom>
                                    <div className="title price">
                                        ≈$ 1,869.76
                                    </div>
                                    <div>
                                        <CustomInput
                                            value={inputUnstakeValue}
                                            placeholder={
                                                inputUnstakeValue?.toString() ||
                                                '0'
                                            }
                                            onChange={(e) =>
                                                setInputUnstakeValue(
                                                    e?.target?.value,
                                                )
                                            }
                                        />
                                    </div>

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
                            <p className="value">0 ETH</p>
                            <Row gap="5px">
                                <p>Edit</p>
                                <p>Market</p>
                                <p>≈$99.99</p>
                            </Row>
                        </Details>
                    </WrapDetailsUnstake>
                    <PrimaryButton name="Unstake" />
                </WrapContent>
            </>
        )
    }

    return (
        <>
            <>
                <ComponentsTransaction
                    data={initDataTransaction}
                    onConfirm={
                        Number(tokenApproval?.allowance) <
                            Number(inputAmount) && !isNativeCoin(tokenIn)
                            ? handleOnApprove
                            : handleOnDeposit
                    }
                />
                {(initDataTransaction.isOpenConfirmModal ||
                    initDataTransaction.isOpenResultModal ||
                    initDataTransaction.isOpenWaitingModal) && <Blur />}
            </>
            <ToastMessage />
            <SwapContainer ref={ref}>
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
                {isStakeToken ? <StakeToken /> : <UnStakeToken />}
            </SwapContainer>
        </>
    )
}

const SwapContainer = styled(Columns)`
    margin: 0 auto 40px;
    height: fit-content;
    max-width: 520px;

    /* border: 1.5px solid var(--border2); */
    /* border-radius: 12px;  */
    border: 2px solid #003b5c;
    border-radius: 16px;
    gap: 15px;
    position: relative;
    z-index: 0;
    .title {
        color: rgba(136, 136, 136, 1);
    }

    @media (max-width: 500px) {
        width: 90%;
    }
`

const Referral = styled.div`
    display: grid;
    grid-template-columns: 55px 1fr 12px;
    font-size: 14px;
    span {
        color: rgba(0, 255, 163, 1);
    }
    p {
        opacity: 0.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
    img {
        cursor: pointer;
    }
`

const CopyBtn = styled.div`
    position: relative;
    :hover .tooltip {
        transition: all 0.1s ease-in-out;
        opacity: 1;
        visibility: visible;
    }
`
const Tooltip = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    width: 100px;
    height: 30px;
    font-size: 12px;
    right: -45px;
    text-align: center;
    border: 1px solid;
    /* border-radius: 6px; */
    background: rgba(157, 195, 230, 0.1);

    backdrop-filter: blur(3px);
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

const CopyAccountAddress = styled.img`
    height: 12px;
    cursor: pointer;
`
const Icon = styled.div`
    width: 35px;
    height: 35px;
    margin: -10px auto;
    cursor: pointer;
    border-radius: 50%;
    transition: all ease-in-out 0.3s;
    background: var(--bg4);
    border: 2px solid var(--border3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    :hover {
        transform: rotate(180deg);
    }
    img {
        width: 20px;
    }
`
const LabelMsg = styled.div`
    margin: auto;
    opacity: 0.5;
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

const LabelPercent = styled.div`
    display: flex;
    justify-content: space-between;
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
const LabelDetails = styled.div`
    border: 2px solid #003b5c;
    border-radius: 10px;
    padding: 10px;
    .label-power {
        display: flex;
        gap: 6px;
    }
`

const LabelBottom = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 25px;
`

const LabelButtonStake = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
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

const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`
const CustomRow = styled(Row)`
    padding: 0 10px;
`

const WrapDetailsStake = styled.div`
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
export default Stake
