// import PrimaryButton from 'components/Buttons/PrimaryButton'
// import { useCallback, useEffect, useMemo, useState } from 'react'
// import styled from 'styled-components'
// // import imgUnder from '../../assets/images/under.webp'
// // import imgStar from '../../assets/images/star.webp'
// // import imgStaking from '../../assets/images/staking-logo.webp'
// // import imgClock from '../../assets/svg/clock.svg'
// import imgUnder from 'assets/icons/check-mark.svg'
// import imgStar from 'assets/icons/check-mark.svg'
// import imgStaking from 'assets/icons/check-mark.svg'
// import imgClock from 'assets/icons/question-mark-button-dark.svg'
// import { useActiveWeb3React } from 'hooks'

// import { useStakingContract } from 'hooks/useContract'
// import {
//     useAppState,
//     useUpdateApplicationState,
// } from 'states/application/hooks'
// // import { countRewardStaking } from 'utils/countReward'
// import { useLocation } from 'react-router-dom'
// import { divNumberWithDecimal, mulNumberWithDecimal } from 'utils/math'
// import ComponentsTransaction, {
//     InitCompTransaction,
// } from 'components/TransactionModal'
// import { useTransactionHandler } from 'states/transactions/hooks'
// import { URLSCAN_BY_CHAINID } from 'constants/index'
// import { computeGasLimit, isNativeCoin } from 'utils'
// import { useToken, useTokenApproval } from 'hooks/useToken'
// import ToastMessage from 'components/ToastMessage'

// interface Data {
//     addr: string
//     endTime: string
//     lastTimestampReward: string
//     stakeAmount: string
//     startTime: string
//     tier: string
//     total_reward_received: string
// }

// export interface UserData extends Data {
//     type: string
//     id: number
//     status: number
// }

// interface Info {
//     data: { data: Data[] }
//     type: string
// }

// const StakeDetails = () => {
//     const [isAgree, setIsAgree] = useState<boolean>(false)
//     const [userInfo, setUserInfo] = useState<any>()
//     const [inputStake, setInputStake] = useState<string>()
//     const [balance, setBalance] = useState<string>()
//     const stakingContract = useStakingContract()
//     const { isUpdateApplication, refAddress } = useAppState()
//     const updateApplication = useUpdateApplicationState()
//     const location = useLocation()
//     // const { pool, logo } = location?.state
//     const initDataTransaction = InitCompTransaction()
//     const { addTxn } = useTransactionHandler()
//     const { chainId, account } = useActiveWeb3React()
//     const tokenTest = useToken('0xdEfd221072dD078d11590D58128399C2fe8cCa7e')
//     const tokenSBJ = useToken('0x1cebe52e6d399D7188986A3D6CFc881d50391932')

//     const tokenApproval = useTokenApproval(
//         account,
//         '0x6E7E86F3CE091C4a842b0D27d1c8c4059090eC65',
//         tokenTest,
//     )

//     const tokenTestApproval = useTokenApproval(
//         account,
//         '0x9f2573670491aDeFe64722cBA1453687218C8530',
//         tokenSBJ,
//     )
//     const isInsufficientAllowance = useMemo(
//         () => Number(tokenApproval?.allowance) < Number(inputStake),
//         // Number(mulNumberWithDecimal(inputStake || 0, 18)),
//         [tokenApproval, inputStake],
//     )

//     const tokenType = 'asd'
//     const tokenSymbol = useMemo(
//         () => (tokenType && tokenType?.split('::')?.[2]) || 'SBJ',
//         [tokenType],
//     )

//     const deployerAddr =
//         '0x887846952f19d5eca01fb318c1ee653f707dd2c7b9ecc655c74efe2b071aeb4b'

//     const selection = [
//         { name: 30, value: 12 },
//         { name: 60, value: 25 },
//         { name: 90, value: 40 },
//         { name: 180, value: 80 },
//         { name: 365, value: 162 },
//     ]
//     const [tiers, setTiers] = useState<number>(selection.length - 1)

//     const onChangeSelection = (idx: number) => {
//         setTiers(idx)
//     }

//     const payloadDeposit = (amount: number, tier: number, coinType: string) => {
//         return {
//             function: `${deployerAddr}::staking::deposit`,
//             type_arguments: [coinType],
//             arguments: [amount, tier + 1],
//             type: 'entry_function_payload',
//         }
//     }
//     const payloadWithdraw = (id: number, bool: boolean, coinType: string) => {
//         return {
//             function: `${deployerAddr}::staking::withdraw`,
//             type_arguments: [coinType],
//             arguments: [id, bool],
//             type: 'entry_function_payload',
//         }
//     }

//     const handleTime = (time: any, isDate: boolean) => {
//         if (time < 0) return '00:00'
//         const t = new Date(Number(time) * 1000)
//         const date =
//             t.getFullYear() +
//             '-' +
//             ((t.getMonth() + 1).toString().length > 1
//                 ? t.getMonth() + 1
//                 : `0${t.getMonth() + 1}`) +
//             '-' +
//             (t.getDate().toString().length > 1
//                 ? t.getDate()
//                 : `0${t.getDate()}`)

//         console.log('🤦‍♂️ ⟹ handleTime ⟹ date:', date)
//         const customDate =
//             (t.getDate().toString().length > 1
//                 ? t.getDate()
//                 : `0${t.getDate()}`) +
//             '/' +
//             ((t.getMonth() + 1).toString().length > 1
//                 ? t.getMonth() + 1
//                 : `0${t.getMonth() + 1}`) +
//             '/' +
//             t.getFullYear().toString().slice(2)
//         console.log('🤦‍♂️ ⟹ handleTime ⟹ customDate:', customDate)
//         // "/" +
//         const hour = t.getHours() < 10 ? '0' + t.getHours() : t.getHours()
//         const minutes =
//             t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()
//         return isDate ? date : `${customDate} ${hour}:${minutes}`
//     }

//     const startDate = useMemo(() => {
//         const now = new Date()
//         return handleTime(now.getTime() / 1000, false)
//         // ' | ' +
//         // return handleTime(now.getTime() / 1000, true)
//     }, [inputStake])

//     const endDate = useMemo(() => {
//         const now = new Date()
//         const ONEDAYTIMESTAMP = 30
//         return handleTime(
//             now.getTime() / 1000 +
//                 ONEDAYTIMESTAMP * Number(selection[tiers].name),
//             false,
//         )
//         // +
//         // ' | ' +
//         // handleTime(
//         //     now.getTime() / 1000 +
//         //         ONEDAYTIMESTAMP * Number(selection[tiers].name),
//         //     true,
//         // )
//     }, [tiers])

//     const reward = useMemo(
//         () =>
//             (inputStake &&
//                 (Number(inputStake) * selection[tiers].value) / 100) ||
//             0,
//         [inputStake, tiers],
//     )

//     const totalReceive = useMemo(
//         () =>
//             (
//                 Number(reward) + ((inputStake && Number(inputStake)) || 0)
//             ).toFixed(2),
//         [reward],
//     )

//     const btnName = useMemo(() => {
//         return !isAgree
//             ? "Unchecked Sobajaswap Staking's Policy!"
//             : !inputStake ||
//               Number(inputStake) < 100 ||
//               Number(inputStake) > 300000
//             ? 'Invalid input!'
//             : isInsufficientAllowance
//             ? 'Approve'
//             : 'Stake'
//     }, [isAgree, inputStake])

//     const onClaim = async (dUser: UserData, isEmergency: boolean) => {
//         const {
//             type,
//             id,
//             stakeAmount,
//             tier,
//             total_reward_received,
//             lastTimestampReward,
//             startTime,
//             endTime,
//         }: UserData = dUser
//         const payload = payloadWithdraw(id, isEmergency, type)
//         // const countReward = countRewardStaking(
//         //     dUser,
//         //     selection[Number(tier) - 1]?.value,
//         //     selection[Number(tier) - 1]?.name,
//         // )
//         const countReward = 0
//         const now = new Date()
//         const output =
//             isEmergency || now.getTime() / 1000 > Number(endTime)
//                 ? divNumberWithDecimal(stakeAmount, 8) + countReward
//                 : countReward

//         initDataTransaction.setPayload({
//             payload,
//             method: 'Claim',
//             amount: divNumberWithDecimal(stakeAmount, 8),
//             output,
//             time: selection[Number(tier) - 1].name,
//             endDate:
//                 handleTime(endTime, false) + ' | ' + handleTime(endTime, true),
//             startDate:
//                 handleTime(startTime, false) +
//                 ' | ' +
//                 handleTime(startTime, true),
//             lastDate:
//                 handleTime(lastTimestampReward, false) +
//                 ' | ' +
//                 handleTime(lastTimestampReward, true),
//             APR: selection[Number(tier) - 1].value,
//             total_reward_received: divNumberWithDecimal(
//                 total_reward_received,
//                 8,
//             ),
//             isEmergency,
//             tokenSymbol,
//         })
//         initDataTransaction.setIsOpenConfirmModal(true)
//     }

//     const onDeposit = async () => {
//         if (!isAgree) return
//         const coinType =
//             '0x3da41ea4c78d23d16966064bbe5dba40263a65200dc96973a673c66c4f999999::SobajaspaceCoin::USDT'
//         const payload = payloadDeposit(
//             Number(`${inputStake}e8`),
//             tiers,
//             coinType,
//         )

//         initDataTransaction.setPayload({
//             payload,
//             method: 'Stake',
//             amount: inputStake,
//             output: reward,
//             time: selection[tiers].name,
//             endDate,
//             startDate,
//             APR: selection[tiers].value,
//             tokenSymbol,
//         })
//         initDataTransaction.setIsOpenConfirmModal(true)
//     }

//     const onMax = () => {
//         if (!balance) return
//         setInputStake(balance)
//     }

//     const testOnApprove = async () => {
//         try {
//             initDataTransaction.setError('')

//             if (tokenSBJ && inputStake) {
//                 console.log('approving....', tokenTestApproval)
//                 initDataTransaction.setIsOpenWaitingModal(true)
//                 const callResult: any = await tokenTestApproval?.approve(
//                     '0x9f2573670491aDeFe64722cBA1453687218C8530',
//                     mulNumberWithDecimal(inputStake, tokenSBJ.decimals),
//                 )
//                 console.log('🤦‍♂️ ⟹ testOnApprove ⟹ callResult:', callResult)

//                 initDataTransaction.setIsOpenWaitingModal(false)
//                 initDataTransaction.setIsOpenResultModal(true)

//                 const txn = await callResult.wait()
//                 initDataTransaction.setIsOpenResultModal(false)

//                 addTxn({
//                     hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
//                         callResult.hash || ''
//                     }`,
//                     // hash: tx?.hash || '',
//                     msg: 'Approve',
//                     status: txn.status === 1 ? true : false,
//                 })
//             }
//         } catch (err) {
//             console.log('Failed to approve token: ', err)
//             initDataTransaction.setError('Failed')
//             initDataTransaction.setIsOpenWaitingModal(false)
//             initDataTransaction.setIsOpenResultModal(true)
//         }
//     }
//     const onApprove = async () => {
//         try {
//             initDataTransaction.setError('')

//             if (tokenTest && inputStake) {
//                 console.log('approving....')
//                 initDataTransaction.setIsOpenWaitingModal(true)
//                 const callResult: any = await tokenApproval?.approve(
//                     '0x6E7E86F3CE091C4a842b0D27d1c8c4059090eC65',
//                     mulNumberWithDecimal(inputStake, tokenTest.decimals),
//                 )

//                 initDataTransaction.setIsOpenWaitingModal(false)
//                 initDataTransaction.setIsOpenResultModal(true)

//                 const txn = await callResult.wait()
//                 initDataTransaction.setIsOpenResultModal(false)

//                 addTxn({
//                     hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
//                         callResult.hash || ''
//                     }`,
//                     // hash: tx?.hash || '',
//                     msg: 'Approve',
//                     status: txn.status === 1 ? true : false,
//                 })
//             }
//         } catch (err) {
//             console.log('Failed to approve token: ', err)
//             initDataTransaction.setError('Failed')
//             initDataTransaction.setIsOpenWaitingModal(false)
//             initDataTransaction.setIsOpenResultModal(true)
//         }
//     }

//     const onConfirm = useCallback(async () => {
//         try {
//             initDataTransaction.setIsOpenConfirmModal(false)
//             initDataTransaction.setIsOpenWaitingModal(true)

//             let value = mulNumberWithDecimal(Number(inputStake), 18)
//             // let value = 100
//             const args = [value, selection[tiers].name.toString()]
//             console.log('🤦‍♂️ ⟹ onConfirm ⟹ args:', args)
//             console.log('🤦‍♂️ ⟹ onConfirm ⟹ value:', value)
//             console.log('🤦‍♂️ ⟹ onConfirm ⟹ stakingContract:', stakingContract)

//             const gasLimit = await stakingContract?.estimateGas['deposit'](
//                 ...args,
//             )
//             console.log('🤦‍♂️ ⟹ onConfirm ⟹ gasLimit:', gasLimit)

//             const callResult = await stakingContract?.['deposit'](...args, {
//                 gasLimit: computeGasLimit(gasLimit),
//             })

//             initDataTransaction.setIsOpenWaitingModal(false)
//             initDataTransaction.setIsOpenResultModal(true)

//             const txn = await callResult.wait()
//             initDataTransaction.setIsOpenResultModal(false)

//             addTxn({
//                 hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
//                     callResult.hash || ''
//                 }`,
//                 // hash: tx?.hash || '',
//                 msg: 'Staking',
//                 status: txn.status === 1 ? true : false,
//             })
//         } catch (error) {
//             console.log('🤦‍♂️ ⟹ onConfirm ⟹ error:', error)
//             initDataTransaction.setError('Failed')
//             initDataTransaction.setIsOpenResultModal(true)
//         }
//     }, [initDataTransaction])

//     return (
//         <>
//             <ComponentsTransaction
//                 data={initDataTransaction}
//                 onConfirm={() => onConfirm()}
//             />
//             <ToastMessage />
//             <WrapContainer>
//                 <Container>
//                     <ContentRight>
//                         <WrapContentTop>
//                             <Title>
//                                 <div>Fixed savings</div>
//                                 <div>APR {selection[tiers].value}%</div>
//                             </Title>
//                             <WrapSelection>
//                                 <TitleSelect>
//                                     <p>Period</p>
//                                     <p>Reward</p>
//                                 </TitleSelect>
//                                 <GroupButton>
//                                     {selection.map((item, index) => {
//                                         return (
//                                             <Button
//                                                 onClick={() =>
//                                                     onChangeSelection(index)
//                                                 }
//                                                 key={index}
//                                             >
//                                                 <div key={index}>
//                                                     {item.name}
//                                                 </div>
//                                             </Button>
//                                         )
//                                     })}
//                                     <div>{selection[tiers].value}%</div>
//                                 </GroupButton>
//                             </WrapSelection>
//                             <NumberOf>
//                                 <div>Number of {tokenSymbol}</div>
//                                 <div>
//                                     <WrapInput>
//                                         <input
//                                             value={inputStake || ''}
//                                             type="text"
//                                             placeholder={`Please input ${tokenSymbol} amount`}
//                                             onChange={(e) => {
//                                                 const regex = /[0-9.]/g
//                                                 // console.log("🤦‍♂️ ⟹ StakeDetails ⟹ e.target.value.match(regex)", )
//                                                 setInputStake(
//                                                     e.target.value
//                                                         .match(regex)
//                                                         ?.join(''),
//                                                 )
//                                             }}
//                                         />
//                                         <span>
//                                             <img src={imgClock} />
//                                             SBJ
//                                         </span>
//                                     </WrapInput>
//                                     <MaxButton onClick={() => onMax()} />
//                                 </div>
//                                 <Desc>
//                                     min: 100 {tokenSymbol} - max: 300000{' '}
//                                     {tokenSymbol}
//                                 </Desc>
//                             </NumberOf>
//                         </WrapContentTop>
//                         {/* <WrapImage>
//                             <img src={imgStaking} alt="" />
//                             <img src={imgStar} alt="" />
//                             <img src={imgUnder} alt="" />
//                             <ImageRing>
//                                 <InsideRing>
//                                     <div></div>
//                                 </InsideRing>
//                             </ImageRing>
//                         </WrapImage> */}
//                     </ContentRight>
//                     <ContentLeft>
//                         <Title>Summary</Title>
//                         <Amount>
//                             <span>Amount</span>
//                             <span>
//                                 {inputStake} {tokenSymbol}
//                             </span>
//                         </Amount>
//                         <Reward>
//                             <span>Reward</span>
//                             <span>
//                                 {reward.toFixed(4)} {tokenSymbol} (
//                                 {selection[tiers].value}%)
//                             </span>
//                         </Reward>
//                         <StartDate>
//                             <span>Start date</span>
//                             <span>{startDate}</span>
//                         </StartDate>
//                         <EndDate>
//                             <span>End date</span>
//                             <span>{endDate}</span>
//                         </EndDate>
//                         <TotalReceived>
//                             <span>Total receive</span>
//                             <span>
//                                 {totalReceive} {tokenSymbol}
//                             </span>
//                         </TotalReceived>
//                         <WrapHr>
//                             <div />
//                             <div />
//                         </WrapHr>
//                         {/* <WrapAccept>
// 							<ButtonSwitch onClick={() => setToggle(!toggle)}>
// 								<Circle className={`${toggle ? "active" : ""}`} />
// 							</ButtonSwitch>
// 							<DescButton>
// 								<span>Accept renewal proposal notifications</span>
// 							</DescButton>
// 						</WrapAccept> */}
//                         <CheckBox>
//                             <input
//                                 type="checkbox"
//                                 onClick={(e: any) =>
//                                     setIsAgree(e?.target?.checked)
//                                 }
//                             />
//                             <span>
//                                 I agree to{' '}
//                                 <a href="#">Sobajaswap Staking's Policy</a>
//                             </span>
//                         </CheckBox>
//                         <PrimaryButton
//                             name={btnName}
//                             onClick={() =>
//                                 isInsufficientAllowance
//                                     ? onApprove()
//                                     : onDeposit()
//                             }
//                             disabled={
//                                 false
//                                 // btnName !== 'Stake' || btnName !== 'Approve'
//                             }
//                         />
//                     </ContentLeft>
//                     <button className="lock" onClick={() => testOnApprove()}>
//                         Approve
//                     </button>
//                     <ContentBottom>
//                         <Title className="lock">Locked</Title>

//                         <WrapHr>
//                             <div />
//                             <div />
//                         </WrapHr>
//                         <WrapTable>
//                             <Table>
//                                 <thead>
//                                     <tr>
//                                         <TH>
//                                             <div>
//                                                 Status
//                                                 {/* <img onClick={() => onFilter()} src="https://cdn-icons-png.flaticon.com/512/2561/2561951.png" alt="filter-arrow" /> */}
//                                             </div>
//                                         </TH>
//                                         <TH>Amount</TH>
//                                         <TH>Days</TH>
//                                         <TH>Start time</TH>
//                                         <TH>End time</TH>
//                                         <TH>Available reward</TH>
//                                         <TH>Already claimed</TH>
//                                         <TH>Actions</TH>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {userInfo &&
//                                         userInfo
//                                             ?.filter(
//                                                 (i: UserData) => i?.status == 1,
//                                             )
//                                             ?.map(
//                                                 (
//                                                     d: UserData,
//                                                     index: number,
//                                                 ) => {
//                                                     // let now = new Date()
//                                                     const [start, end, last] = [
//                                                         handleTime(
//                                                             d.startTime,
//                                                             false,
//                                                         ),
//                                                         handleTime(
//                                                             d.endTime,
//                                                             false,
//                                                         ),
//                                                         handleTime(
//                                                             d.lastTimestampReward,
//                                                             false,
//                                                         ),
//                                                     ]
//                                                     // let timeStart = handleTime(d.startTime)
//                                                     // let timeEnd = handleTime(d.endTime)
//                                                     const countReward = 0
//                                                     // countRewardStaking(
//                                                     //     d,
//                                                     //     selection[
//                                                     //         Number(d.tier) -
//                                                     //             1
//                                                     //     ]?.value,
//                                                     //     selection[
//                                                     //         Number(d.tier) -
//                                                     //             1
//                                                     //     ]?.name,
//                                                     // ).toFixed(4)
//                                                     return (
//                                                         <tr key={index}>
//                                                             <TD>
//                                                                 {Number(
//                                                                     d.status,
//                                                                 ) === 1 ? (
//                                                                     <img
//                                                                         src={
//                                                                             imgClock
//                                                                         }
//                                                                         alt=""
//                                                                     />
//                                                                 ) : (
//                                                                     'Finished'
//                                                                 )}
//                                                             </TD>
//                                                             <TD>
//                                                                 {divNumberWithDecimal(
//                                                                     d?.stakeAmount,
//                                                                     8,
//                                                                 )}{' '}
//                                                                 {tokenSymbol}
//                                                             </TD>
//                                                             {/* <TD>{Number(d.status) === 1 ? selection[Number(d.tier) - 1].name : 0}</TD> */}
//                                                             <TD>
//                                                                 {
//                                                                     selection[
//                                                                         Number(
//                                                                             d.tier,
//                                                                         ) - 1
//                                                                     ].name
//                                                                 }
//                                                             </TD>
//                                                             <TD>{start}</TD>
//                                                             <TD>{end}</TD>
//                                                             <TD>
//                                                                 {countReward}
//                                                             </TD>
//                                                             <TD>
//                                                                 {Number(
//                                                                     divNumberWithDecimal(
//                                                                         d.total_reward_received,
//                                                                         8,
//                                                                     ),
//                                                                 ).toFixed(4)}
//                                                             </TD>
//                                                             <TD>
//                                                                 <WrapButton>
//                                                                     <PrimaryButton
//                                                                         name="Claim"
//                                                                         onClick={() =>
//                                                                             onClaim(
//                                                                                 d,
//                                                                                 false,
//                                                                             )
//                                                                         }
//                                                                         disabled={
//                                                                             Number(
//                                                                                 d.status,
//                                                                             ) ===
//                                                                             0
//                                                                         }
//                                                                     />
//                                                                     <PrimaryButton
//                                                                         name="Withdraw"
//                                                                         onClick={() =>
//                                                                             onClaim(
//                                                                                 d,
//                                                                                 true,
//                                                                             )
//                                                                         }
//                                                                         disabled={
//                                                                             Number(
//                                                                                 d.status,
//                                                                             ) ===
//                                                                             0
//                                                                         }
//                                                                     />
//                                                                 </WrapButton>
//                                                             </TD>
//                                                         </tr>
//                                                     )
//                                                 },
//                                             )}
//                                 </tbody>
//                             </Table>
//                         </WrapTable>
//                         {/* <Pagination>
// 							<img src={imgArrow} alt="" />
// 						</Pagination> */}
//                     </ContentBottom>
//                     <ContentBottom>
//                         <Title className="lock">History</Title>
//                         <WrapHr>
//                             <div />
//                             <div />
//                         </WrapHr>
//                         <WrapTable>
//                             <Table>
//                                 <thead>
//                                     <tr>
//                                         <TH>
//                                             <div>
//                                                 Status
//                                                 {/* <img onClick={() => onFilter()} src="https://cdn-icons-png.flaticon.com/512/2561/2561951.png" alt="filter-arrow" /> */}
//                                             </div>
//                                         </TH>
//                                         <TH>Amount</TH>
//                                         <TH>Days</TH>
//                                         <TH>Start time</TH>
//                                         <TH>End time</TH>
//                                         <TH>Last time</TH>
//                                         <TH>Total reward</TH>
//                                         {/* <TH>Actions</TH> */}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {userInfo &&
//                                         userInfo
//                                             ?.filter(
//                                                 (i: UserData) => i?.status == 0,
//                                             )
//                                             .map(
//                                                 (
//                                                     d: UserData,
//                                                     index: number,
//                                                 ) => {
//                                                     // let now = new Date()
//                                                     const [start, end, last] = [
//                                                         handleTime(
//                                                             d.startTime,
//                                                             false,
//                                                         ),
//                                                         handleTime(
//                                                             d.endTime,
//                                                             false,
//                                                         ),
//                                                         handleTime(
//                                                             d.lastTimestampReward,
//                                                             false,
//                                                         ),
//                                                     ]
//                                                     // let timeStart = handleTime(d.startTime)
//                                                     // let timeEnd = handleTime(d.endTime)
//                                                     return (
//                                                         <tr key={index}>
//                                                             <TD>
//                                                                 {Number(
//                                                                     d.status,
//                                                                 ) === 1 ? (
//                                                                     <img
//                                                                         src={
//                                                                             imgClock
//                                                                         }
//                                                                         alt=""
//                                                                     />
//                                                                 ) : (
//                                                                     'Finished'
//                                                                 )}
//                                                             </TD>
//                                                             <TD>
//                                                                 {divNumberWithDecimal(
//                                                                     d?.stakeAmount,
//                                                                     8,
//                                                                 )}{' '}
//                                                                 {tokenSymbol}
//                                                             </TD>
//                                                             {/* <TD>{Number(d.status) === 1 ? selection[Number(d.tier) - 1].name : 0}</TD> */}
//                                                             <TD>
//                                                                 {
//                                                                     selection[
//                                                                         Number(
//                                                                             d.tier,
//                                                                         ) - 1
//                                                                     ].name
//                                                                 }
//                                                             </TD>
//                                                             <TD>{start}</TD>
//                                                             <TD>{end}</TD>
//                                                             <TD>{last}</TD>
//                                                             <TD>
//                                                                 {Number(
//                                                                     divNumberWithDecimal(
//                                                                         d.total_reward_received,
//                                                                         8,
//                                                                     ),
//                                                                 ).toFixed(4)}
//                                                             </TD>
//                                                         </tr>
//                                                     )
//                                                 },
//                                             )}
//                                 </tbody>
//                             </Table>
//                         </WrapTable>
//                         {/* <Pagination>
// 							<img src={imgArrow} alt="" />
// 						</Pagination> */}
//                     </ContentBottom>
//                 </Container>
//             </WrapContainer>
//         </>
//     )
// }

// export default StakeDetails

// const WrapButton = styled.div`
//     display: flex;
//     flex-direction: column;
//     gap: 5px;
//     button {
//         padding: 4px;
//         height: 32px;
//     }
//     /* button:first-child {
// 		cursor: no-drop;
// 	} */
// `
// const TH = styled.th`
//     /* width: 13.33%; */
//     font-weight: 500;

//     div {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         gap: 6px;
//         /* margin-left: 12px; */
//         img {
//             cursor: pointer;
//         }
//     }
//     img {
//         height: 21px;
//         /* border-radius: 50%; */
//         @media screen and (max-width: 390px) {
//             height: 18px;
//         }
//     }
// `
// const TD = styled.td`
//     text-align: center;
//     img {
//         height: 30px;
//     }
// `

// const WrapTable = styled.div`
//     /* height: 275px; */
//     overflow: scroll;
//     padding-bottom: 25px;
//     /* overflow: hidden scroll; */
//     ::-webkit-scrollbar {
//         display: none;
//     }
// `
// const Table = styled.table`
//     min-width: 800px;
//     width: 100%;
//     border-collapse: collapse;
//     /* border-radius: 0.5rem 0.5rem 0rem; */
//     overflow: hidden;
//     border-radius: 8px 8px 0 0;

//     td {
//         padding-top: 8px;
//     }
//     thead {
//         /* border: 2px solid rgba(157, 195, 230, 1); */
//         background: var(--bg5);
//         height: 36px;
//     }
// `
// const MaxButton = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     width: fit-content;
//     height: 35px;
//     border-radius: 8px;
//     border: 1.5px solid ${({ theme }) => theme.bd1};
//     color: ${({ theme }) => theme.text1};
//     font-size: 1rem;
//     letter-spacing: 0.3;
//     cursor: pointer;
//     :hover {
//         background-position: right;
//     }
//     background-size: 150%;
//     background-position: center;
//     transition: all 0.3s ease-in-out;
//     z-index: 1;
//     padding: 0 8px;
//     ::before {
//         content: 'Maximum';
//         font-weight: 100;
//     }
//     @media screen and (max-width: 576px) {
//         ::before {
//             content: 'Max';
//             font-weight: 100;
//         }
//     }
// `
// const WrapContentTop = styled.div`
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
// `
// const WrapImage = styled.div`
//     width: 100%;
//     max-height: 110px;
//     min-height: 110px;
//     overflow: hidden;
//     position: relative;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     z-index: 1;
//     @media screen and (max-width: 992px) {
//         display: none;
//     }
//     img:nth-child(1) {
//         position: absolute;
//         top: 50%;
//         height: 80px;
//         width: 80px;
//         left: 50%;
//         z-index: 2;
//         transform: translate(-50%, -50%);
//         animation: jump 5s linear infinite;
//     }
//     img:nth-child(2) {
//         height: 180px;
//         width: 180px;
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//         animation: fade 5s linear infinite;
//     }
//     img:nth-child(3) {
//         position: absolute;
//         bottom: 0;
//     }
//     img {
//         width: 100px;
//     }

//     @keyframes fade {
//         0% {
//             opacity: 0.3;
//         }
//         50% {
//             opacity: 1;
//         }
//         100% {
//             opacity: 0.3;
//         }
//     }
//     @keyframes jump {
//         0% {
//             top: 50%;
//         }
//         50% {
//             top: 40%;
//         }
//         100% {
//             top: 50%;
//         }
//     }
// `

// const ImageRing = styled.div`
//     position: absolute;
//     width: 120px;
//     height: 120px;
//     border-radius: 50%;
//     top: 8px;
//     transform: rotate3d(46, -15, 1, 75deg);
//     z-index: 1;
//     animation: jump 5s linear infinite;
// `
// const InsideRing = styled.div`
//     position: absolute;
//     width: 120px;
//     height: 120px;
//     top: -220px;
//     left: -58px;
//     transform: rotate3d(46, -15, 1, 15deg);
//     z-index: 1;
//     border-radius: 50%;
//     animation: change-color 5s linear infinite;
//     background: linear-gradient(
//             216deg,
//             rgb(16, 79, 248) 30%,
//             rgb(0, 246, 21) 100%
//         )
//         0% 0% / 400% 400%;
//     div {
//         position: absolute;
//         border-radius: 50%;
//         top: 20px;
//         left: 22px;
//         background: rgb(0, 20, 38);
//         transform: rotate3d(45, -18, 33, 16deg);
//         width: 75px;
//         height: 75px;
//     }
//     @keyframes change-color {
//         0% {
//             background: linear-gradient(
//                     216deg,
//                     rgb(16, 79, 248) 30%,
//                     rgb(0, 246, 21) 100%
//                 )
//                 0% 0% / 400% 400%;
//         }
//         50% {
//             background: linear-gradient(
//                     216deg,
//                     rgb(16, 79, 248) 30%,
//                     rgb(0, 246, 21) 100%
//                 )
//                 0% 0% / 400% 100%;
//         }
//         100% {
//             background: linear-gradient(
//                     216deg,
//                     rgb(16, 79, 248) 30%,
//                     rgb(0, 246, 21) 100%
//                 )
//                 0% 0% / 400% 400%;
//         }
//     }
// `

// const CheckBox = styled.div`
//     display: flex;
//     gap: 5px;
//     align-items: center;
//     a {
//         color: rgb(0, 252, 58);
//         text-decoration: none;
//     }
//     @media screen and (max-width: 375px) {
//         span {
//             white-space: nowrap;
//         }
//     }
// `

// const Amount = styled.div`
//     display: flex;
//     justify-content: space-between;
// `
// const Reward = styled.div`
//     display: flex;
//     justify-content: space-between;
// `
// const StartDate = styled.div`
//     display: flex;
//     justify-content: space-between;
// `
// const EndDate = styled.div`
//     display: flex;
//     justify-content: space-between;
// `
// const TotalReceived = styled.div`
//     display: flex;
//     justify-content: space-between;
//     span:last-child {
//         font-size: 18px;
//     }
// `

// const WrapHr = styled.div`
//     display: flex;
//     div:first-child {
//         display: flex;
//         gap: 0px;
//         max-width: 1500px;
//         width: 100%;
//         width: 80%;
//         height: 1.2px;
//         margin: 10px auto;
//         background: linear-gradient(
//             to right,
//             rgba(13, 3, 217, 0) 0%,
//             rgb(255 255 255 / 35%) 20%,
//             rgb(124 188 255 / 64%) 100%
//         );
//     }
//     div:last-child {
//         display: flex;
//         gap: 0px;
//         max-width: 1500px;
//         width: 100%;
//         width: 80%;
//         height: 1.2px;
//         margin: 10px auto;
//         background: linear-gradient(
//             to left,
//             rgba(13, 3, 217, 0) 0%,
//             rgb(255 255 255 / 35%) 20%,
//             rgb(124 188 255 / 64%) 100%
//         );
//     }
// `

// const Desc = styled.div`
//     font-size: 12px;
// `
// const NumberOf = styled.div`
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//     div:nth-child(2) {
//         display: flex;
//         gap: 10px;
//         button {
//             flex: 1 20%;
//         }
//     }
//     @media screen and (max-width: 576px) {
//         div:nth-child(2) {
//             gap: 5px;
//             button {
//                 flex: 1 30%;
//             }
//         }
//     }
// `
// const WrapInput = styled.div`
//     display: flex;
//     align-items: center;

//     height: 35px;
//     border-radius: 8px;
//     width: 80%;
//     flex: 1 80%;
//     justify-content: space-between;
//     border: 1.5px solid ${({ theme }) => theme.bd1};
//     background: var(--bg5);

//     input {
//         background: none;
//         font-style: italic;
//         border: none;
//         outline: none;
//         color: #fff;
//         border-radius: 8px 0px 0px 8px;
//         padding: 0 10px;
//         flex: 1;
//         ::placeholder {
//             color: ${({ theme }) => theme.text4};
//             font-style: italic;
//             padding: 5px;
//         }
//     }
//     span {
//         display: flex;
//         align-items: center;
//         padding: 5px;
//         gap: 3px;
//     }
//     img {
//         height: 25px;
//         border-radius: 50%;
//         @media screen and (max-width: 390px) {
//             height: 21px;
//         }
//     }
//     @media screen and (max-width: 390px) {
//         width: 100%;
//     }
//     @media screen and (max-width: 390px) {
//         input {
//             padding: 0 6px;
//             font-size: 12px;
//         }
//     }
// `
// const WrapSelection = styled.div`
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
// `
// const TitleSelect = styled.div`
//     display: flex;
//     justify-content: space-between;
// `
// const GroupButton = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
// `
// const Button = styled.div`
//     display: flex;
//     gap: 5px;
//     cursor: pointer;
//     transition: all ease-in-out 0.1s;

//     :hover {
//         /* zoom: 1.2; */
//         transform: scale(1.2);
//     }

//     div {
//         /* width: 20%; */
//         padding: 4px 12px;
//         border-radius: 8px;
//         border: 2px solid ${({ theme }) => theme.bd2};
//         background: var(--bg5);
//         @media screen and (max-width: 576px) {
//             padding: 4px 8px;
//         }
//         @media screen and (max-width: 375px) {
//             padding: 2px 4px;
//         }
//     }
// `
// const WrapContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     width: 100%;
//     align-items: center;
//     min-height: calc(100vh - 140px);
//     position: relative;
//     padding: 30px 20px;
//     @media screen and (max-width: 576px) {
//         padding: 20px 10px;
//     }
// `
// const Container = styled.div`
//     box-shadow: ${({ theme }) => theme.boxShadow};
//     border: 2px solid ${({ theme }) => theme.bd0};
//     background: var(--bg5);
//     max-width: 920px;
//     width: 100%;
//     border-radius: 20px;
//     padding: 24px;
//     display: flex;
//     justify-content: space-between;
//     color: ${({ theme }) => theme.text1};
//     flex-wrap: wrap;
//     @media screen and (min-width: 1480px) {
//         margin-top: 7.5vh;
//     }
//     @media screen and (max-width: 1024px) {
//         padding: 20px;
//         gap: 10px;
//     }
//     @media screen and (max-width: 992px) {
//         flex-direction: column;
//     }
//     @media screen and (max-width: 576px) {
//         padding: 12px;
//     }
//     @media screen and (max-width: 375px) {
//         padding: 8px;
//     }
// `
// const ContentRight = styled.div`
//     max-width: 490px;
//     border: 2px solid ${({ theme }) => theme.bd0};
//     background: var(--bg5);

//     box-shadow: ${({ theme }) => theme.boxShadow};
//     border-radius: 20px;
//     width: 100%;
//     padding: 14px;
//     height: 250px;
//     display: flex;
//     flex-direction: column;
//     gap: 25px;
//     :hover {
//         box-shadow: none;
//     }
//     @media screen and (max-width: 992px) {
//         max-width: unset;
//     }
//     @media screen and (max-width: 390px) {
//         padding: 14px 8px;
//     }
// `
// const ContentLeft = styled.div`
//     max-width: 350px;
//     /* height: 350px; */
//     padding: 14px;
//     border: 2px solid ${({ theme }) => theme.bd0};
//     background: var(--bg5);
//     box-shadow: ${({ theme }) => theme.boxShadow};
//     border-radius: 20px;
//     width: 100%;
//     max-height: 500px;
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//     :hover {
//         box-shadow: none;
//     }
//     @media screen and (max-width: 992px) {
//         max-width: unset;
//         button {
//             max-width: 320px;
//             align-self: center;
//         }
//     }
//     @media screen and (max-width: 390px) {
//         padding: 14px 8px;
//     }
//     @media screen and (max-width: 390px) {
//         height: 380px;
//     }
// `
// const Title = styled.div`
//     display: flex;
//     justify-content: space-between;
//     font-size: 22px;
//     align-items: center;
//     &.lock {
//         justify-content: center;
//     }
//     div:last-child {
//         font-size: 14px;
//     }
// `
// const ContentBottom = styled.div`
//     margin-top: 3rem;
//     position: relative;
//     /* height: 420px; */
//     padding: 14px;
//     border: 2px solid ${({ theme }) => theme.bd0};
//     background: var(--bg5);

//     box-shadow: ${({ theme }) => theme.boxShadow};
//     border-radius: 20px;
//     width: 100%;
//     max-height: 500px;
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//     :hover {
//         box-shadow: none;
//     }
//     &.lock {
//         text-align: center;
//     }
// `
