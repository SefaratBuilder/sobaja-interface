import PrimaryButton from 'components/Buttons/PrimaryButton'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveWeb3React } from 'hooks'
import { URLSCAN_BY_CHAINID, githubAssetRepo } from 'constants/index'

import imgUpload from 'assets/icons/upload.svg'
// import { Octokit } from '@octokit/rest'
// import { useRpc } from 'hooks/useRpc'
import DatePicker from 'components/DateRangePicker/DatePicker'
import TimePicker from 'components/DateRangePicker/TimePicker'
import moment from 'moment'
import {
    useAppState,
    useUpdateApplicationState,
} from 'states/application/hooks'
import { add, mulNumberWithDecimal } from 'utils/math'
import { useLaunchpadContract } from 'hooks/useContract'
import { LAUNCHPADS } from 'constants/addresses'
import { useToken, useTokenApproval } from 'hooks/useToken'
import FAIRLAUNCH_INTERFACE from 'constants/jsons/fairlaunch'
import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import { useTransactionHandler } from 'states/transactions/hooks'
import Blur from 'components/Blur'
import { useQueryLaunchpad } from 'hooks/useQueryLaunchpad'
import Calendar from 'components/Calendar'

interface ICreateLaunchpad {
    setCurrentPage: React.Dispatch<
        React.SetStateAction<'Admin' | 'Create' | 'Details' | 'Infomation'>
    >
}
type ILaunchpadKey =
    | 'addressTokenSale'
    | 'addressTokenPayment'
    | 'softCap'
    | 'hardCap'
    | 'tokenSalePrice'
    | 'individualCap'
    | 'overflowTokenReward'
    | 'totalToken'
    | 'startTime'
    | 'endTime'

interface ILaunchpadState {
    addressTokenSale: string
    addressTokenPayment: string
    softCap: string
    hardCap: string
    tokenSalePrice: string
    individualCap: string
    overflowTokenReward: string
    totalToken: string
    startTime: string
    endTime: string
}

const CreateLaunchpad = ({ setCurrentPage }: ICreateLaunchpad) => {
    const refDatePicker = useRef(null)
    const { refetch } = useQueryLaunchpad()

    // const [file, setFile] = useState<File>()
    const { chainId, account } = useActiveWeb3React()
    const [err, setErr] = useState('')
    const [launchpadState, setLaunchpadState] = useState<ILaunchpadState | any>(
        {
            addressTokenSale: '0xdEfd221072dD078d11590D58128399C2fe8cCa7e',
            addressTokenPayment: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            softCap: '',
            hardCap: '',
            tokenSalePrice: '',
            individualCap: '',
            overflowTokenReward: '',
            totalToken: '',
            startTime: '',
            endTime: '',
        },
    )

    const [indexType, setIndexType] = useState(0)
    const types = ['Normal', 'FairLaunch', 'WhiteList']

    const initDataTransaction = InitCompTransaction()
    const { addTxn } = useTransactionHandler()

    const token = useToken(
        launchpadState.addressTokenSale
            ? launchpadState.addressTokenSale
            : undefined,
    )
    const tokenPayment = useToken(
        launchpadState.addressTokenPayment
            ? launchpadState.addressTokenPayment
            : undefined,
    )

    const tokenApproval = useTokenApproval(
        account,
        chainId ? LAUNCHPADS[chainId] : null,
        token,
    )

    const handleOnChange = (type: ILaunchpadKey | string, value: string) => {
        const newState = { ...launchpadState, [type]: value }
        setLaunchpadState(newState)
    }
    const [dateRange, setDateRange] = useState({
        startDate: new Date(
            moment(new Date().toString()).format('ddd MMM DD YYYY 00:00:00'),
        ),
        endDate: new Date(
            moment(new Date(new Date().getTime()).toString()).format(
                'ddd MMM DD YYYY 00:00:00',
            ),
        ),
        // key: 'selection',
    })

    // useOnClickOutside(refDatePicker, () => setCalendarModal(false))
    // useOnClickOutside(refCategory, () => setIsOpenCategory(false))

    const launchpadContract = useLaunchpadContract()

    const handleOnCreate = async () => {
        try {
            console.log('creating...')
            if (!err) {
                const startTimeUnix =
                    new Date(dateRange.startDate).getTime() / 1000 +
                    Number(launchpadState.startTime)
                const expiredTimeUnix =
                    new Date(dateRange.endDate).getTime() / 1000 +
                    // Number(launchpadState.endTime)
                    Number(launchpadState.startTime) +
                    10

                initDataTransaction.setError('')
                initDataTransaction.setPayload({
                    method: 'create launchpad',
                    launchpad: launchpadState,
                    tokenSale: token,
                    tokenPayment,
                    startTime: startTimeUnix,
                    endTime: expiredTimeUnix,
                })
                initDataTransaction.setIsOpenConfirmModal(true)
            }
        } catch (error) {
            console.log('failed to swap', error)
        }
    }

    const onConfirm = useCallback(async () => {
        try {
            if (!token || !chainId) return
            initDataTransaction.setIsOpenConfirmModal(false)
            initDataTransaction.setIsOpenWaitingModal(true)
            const startTimeUnix =
                new Date(dateRange.startDate).getTime() / 1000 +
                Number(launchpadState.startTime)
            const expiredTimeUnix =
                new Date(dateRange.endDate).getTime() / 1000 +
                Number(launchpadState.startTime) +
                10
            // Number(launchpadState.endTime)

            const args = [
                LAUNCHPADS[chainId],
                launchpadState.addressTokenSale,
                account,
                launchpadState.addressTokenPayment,
                startTimeUnix,
                expiredTimeUnix,
                mulNumberWithDecimal(launchpadState.softCap, 18),
                mulNumberWithDecimal(launchpadState.hardCap, 18),
                mulNumberWithDecimal(launchpadState.tokenSalePrice, 18),
                mulNumberWithDecimal(launchpadState.individualCap, 18),
                mulNumberWithDecimal(
                    launchpadState.overflowTokenReward,
                    token.decimals,
                ),
            ]

            const data = FAIRLAUNCH_INTERFACE._abiCoder.encode(
                [
                    'address',
                    'address',
                    'address',
                    'address',
                    'uint256',
                    'uint256',
                    'uint256',
                    'uint256',
                    'uint256',
                    'uint256',
                    'uint256',
                ],
                args,
            )
            const amountToken = launchpadState.totalToken

            const gasLimit = await launchpadContract?.estimateGas[
                'createLaunchpad'
            ](
                1,
                token.address,
                mulNumberWithDecimal(amountToken, token.decimals),
                data,
            )
            console.log({ gasLimit })
            const callResult = await launchpadContract?.createLaunchpad(
                1,
                token.address,
                mulNumberWithDecimal(amountToken, token.decimals),
                data,
            )

            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)

            const txn = await callResult.wait()
            initDataTransaction.setIsOpenResultModal(false)

            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                    callResult.hash || ''
                }`,
                msg: `Create launchpad`,
                status: txn.status === 1 ? true : false,
            })

            setTimeout(() => {
                refetch()
                setCurrentPage('Infomation')
            }, 10000)
        } catch (error) {
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }, [initDataTransaction])

    const handleOnApprove = async () => {
        try {
            initDataTransaction.setError('')
            console.log({ launchpadState })
            if (
                launchpadState.addressTokenSale &&
                launchpadState.totalToken &&
                chainId
            ) {
                console.log('approving....')
                initDataTransaction.setIsOpenWaitingModal(true)
                const callResult: any = await tokenApproval?.approve(
                    LAUNCHPADS[chainId],
                    mulNumberWithDecimal(launchpadState.totalToken, 18),
                )

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                        callResult.hash || ''
                    }`,
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

    // const handleChangeFile = (file) => {
    //     setFile(file)
    // }

    // const readFile = (file) => {
    //     const preview = document.getElementById('preview-thumbnail')
    //     if (
    //         file.type === 'image/jpeg' ||
    //         file.type === 'image/jpg' ||
    //         file.type === 'image/gif' ||
    //         file.type === 'image/png' ||
    //         file.type === 'image/webp'
    //     ) {
    //         const reader = new FileReader()
    //         reader.onload = function (e) {
    //             preview.innerHTML = `<img className="image-preview" src="${e?.target?.result}" alt="Image preview" />`
    //         }
    //         reader.readAsDataURL(file)
    //     }
    // }

    // const uploadFile = async (file, path) => {
    //     const owner = 'forbitswap'
    //     const repo = 'prediction-market-assets'
    //     const token = process.env['REACT_APP_GITHUB_TOKEN']
    //     console.log('github token', token)
    //     // const github = new Octokit({
    //     //     auth: token,
    //     //     log: console,
    //     // })

    //     // const reader = new FileReader()
    //     // reader.onload = function () {
    //     //     const content = reader?.result?.toString().split(',')[1]
    //     //     github.repos.createOrUpdateFileContents({
    //     //         owner,
    //     //         repo,
    //     //         path,
    //     //         message: 'Add image',
    //     //         content,
    //     //         committer: {
    //     //             name: 'pantinho',
    //     //             email: 'pantinho@github.com',
    //     //         },
    //     //         author: {
    //     //             name: 'pantinho',
    //     //             email: '@pantinho@github.com',
    //     //         },
    //     //         encoding: 'base64',
    //     //     })
    //     // }
    //     // return reader.readAsDataURL(file)
    // }

    const onChangeHourStart = (timeUnix: number) => {
        handleOnChange('startTime', timeUnix.toFixed())
        console.log(
            '🤦‍♂️ ⟹ onChangeHourStart ⟹  timeUnix.toFixed():',
            timeUnix.toFixed(),
        )
    }

    const onChangeHourExpiry = (timeUnix: number) => {
        handleOnChange('endTime', timeUnix.toFixed())
    }

    // useEffect(() => {
    //     if (file) {
    //         readFile(file)
    //     }
    // }, [file])

    const handleErr = () => {
        const keys = Object.keys(launchpadState)
        const findErr = keys.find((i) => !launchpadState?.[i])
        if (Number(launchpadState.startTime) > Number(launchpadState.endTime))
            return setErr('Wrong time!')
        if (!findErr) return setErr('')

        const err =
            'Please fill ' +
            findErr.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
        return setErr(err)
    }

    const listState = [
        { name: 'Token sale', key: 'addressTokenSale', plh: '0x' },
        { name: 'Payment currency', key: 'addressTokenPayment', plh: '0x' },
        { name: 'Soft cap', key: 'softCap', plh: '1' },
        { name: 'Hard cap', key: 'hardCap', plh: '3' },
        { name: 'Token sale price', key: 'tokenSalePrice', plh: '0.1' },
        { name: 'Individual cap', key: 'individualCap', plh: '1' },
        {
            name: 'Overflow token reward',
            key: 'overflowTokenReward',
            plh: '10',
        },
        { name: 'Total tokens', key: 'totalToken', plh: '40' },
    ]

    useEffect(() => {
        return handleErr()
    }, [launchpadState])

    return (
        <>
            <>
                <ComponentsTransaction
                    data={initDataTransaction}
                    onConfirm={onConfirm}
                />
                {(initDataTransaction.isOpenConfirmModal ||
                    initDataTransaction.isOpenResultModal ||
                    initDataTransaction.isOpenWaitingModal) && <Blur />}
            </>
            <Container>
                <NavTitle onClick={() => setCurrentPage('Infomation')}>
                    {'<'} Back Launchpad
                </NavTitle>
                <WrapBody>
                    <WrapFirstContent>
                        <WrapSelect>
                            <WrapLabel>
                                <Label>Type launchpad</Label>
                            </WrapLabel>
                            <Select>
                                {types.map((t, index) => {
                                    return (
                                        <div
                                            onClick={() => setIndexType(index)}
                                            className={
                                                index === indexType
                                                    ? 'active'
                                                    : ''
                                            }
                                            key={index}
                                        >
                                            {t}
                                        </div>
                                    )
                                })}
                            </Select>
                        </WrapSelect>
                        {listState.map((d, index) => {
                            return (
                                <WrapInput key={index}>
                                    <WrapLabel>
                                        <Label>{d.name}</Label>
                                    </WrapLabel>
                                    <Input
                                        placeholder={d.plh}
                                        value={launchpadState?.[d.key]}
                                        onChange={(e) =>
                                            handleOnChange(
                                                d.key,
                                                e.target.value,
                                            )
                                        }
                                    />
                                </WrapInput>
                            )
                        })}
                    </WrapFirstContent>

                    <WrapSecondContent>
                        {/* <WrapLabel className="title-img">
                            <Label>Upload thumbnail</Label>
                        </WrapLabel>

                        <WrapInput>
                            <Input
                                id="file-upload"
                                accept="image/png, image/jpeg, image/gif, image/png, image/webp"
                                type="file"
                                placeholder="1USDC"
                                onChange={(e) =>
                                    handleChangeFile(e?.target?.files[0])
                                }
                            />
                            <PreviewThumbnail id="preview-thumbnail">
                                {!file !== undefined && (
                                    <img src={imgUpload} alt="upload" />
                                )}
                            </PreviewThumbnail>
                        </WrapInput>
                        {file && <p className="file-name">{file.name}</p>}
                        <LabelBtn>
                            <Label
                                htmlFor="file-upload"
                                className="file-upload"
                            >
                                Choose image
                            </Label>
                        </LabelBtn> */}

                        <WrapDatePicker ref={refDatePicker}>
                            {/* <DatePicker
                                dateRange={dateRange}
                                setDateRange={setDateRange}
                            /> */}
                            <Calendar setDateRange={setDateRange} />
                            <p className="title-time">Select Time</p>
                            <Time>
                                <TimeInput>
                                    <p>
                                        {moment(
                                            dateRange.startDate.toString(),
                                        ).format('DD/MM/YYYY')}
                                    </p>
                                    <TimePicker
                                        onChange={onChangeHourStart}
                                        idx={0}
                                    />
                                </TimeInput>
                                <p>to</p>
                                <TimeInput className="time-right">
                                    <p>
                                        {' '}
                                        {moment(
                                            dateRange.endDate.toString(),
                                        ).format('DD/MM/YYYY')}
                                    </p>
                                    <TimePicker
                                        onChange={onChangeHourExpiry}
                                        idx={1}
                                    />
                                </TimeInput>
                            </Time>
                        </WrapDatePicker>
                        <ContentBottom>
                            {err && (
                                <>
                                    <WrapWarning>
                                        {/* <img src={'imgWarningIcon'} alt="" /> */}
                                        <Error>{err}</Error>
                                    </WrapWarning>
                                </>
                            )}
                            <WrapSubmitBtn>
                                <PrimaryButton
                                    type="transparent"
                                    name="Cancel"
                                    onClick={() => setCurrentPage('Infomation')}
                                />
                                {Number(tokenApproval.allowance?._value) <
                                Number(launchpadState.totalToken) ? (
                                    <PrimaryButton
                                        disabled={!!err}
                                        type="blue"
                                        name="Approve"
                                        onClick={() => handleOnApprove()}
                                    />
                                ) : (
                                    <PrimaryButton
                                        disabled={!!err}
                                        type="blue"
                                        name="Continue"
                                        onClick={() => handleOnCreate()}
                                    />
                                )}
                            </WrapSubmitBtn>
                        </ContentBottom>
                    </WrapSecondContent>
                </WrapBody>
            </Container>
        </>
    )
}
export default CreateLaunchpad

const Container = styled.div`
    display: block;
    max-width: 990px;
    padding: 0 2rem;
    margin: 20px auto;
    font-size: 16px;
    .calendar {
        position: inherit;
    }
`
const Error = styled.div`
    color: #f03535;
    font-size: 14px;
    font-weight: 600;
`

const Time = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    @media screen and (max-width: 576px) {
        flex-direction: column;
        gap: 15px;
    }
`
const TimeInput = styled.div`
    display: flex;
    flex-basis: 45%;
    border: 0.75px solid rgba(255, 255, 255, 0.3);
    padding: 0.8rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 8px;
    gap: 6px;
    position: relative;
    justify-content: space-between;
    z-index: 2;
    &.time-right {
        z-index: 1;
    }
    @media screen and (max-width: 576px) {
        flex-basis: 100%;
        width: 100%;
        justify-content: space-between;
        div {
            flex-basis: 20%;
        }
    }
`
const ContentBottom = styled.div`
    width: 100%;

    @media screen and (max-width: 992px) {
        position: unset;
        padding: 0;
    }
`
const WrapDatePicker = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    .title-time {
        margin: 1rem 0;
        font-size: 16px;
        font-weight: 600;
    }
`

const WrapSubmitBtn = styled.div`
    display: flex;
    gap: 20px;
    justify-content: space-between;
    button {
        max-width: 240px;
    }
`
const WrapWarning = styled.div`
    background: rgba(255, 99, 99, 0.1);
    padding: 1rem;
    border-radius: 8px;
    margin: 3rem 0 1rem;
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 10px;
    img {
        object-fit: contain;
        height: 32px;
        width: 32px;
    }
    a {
        color: rgba(0, 102, 255, 1);
        text-decoration: none;
    }
    @media screen and (max-width: 992px) {
        margin: 1.5rem 0;
    }
    @media screen and (max-width: 576px) {
        margin: 0.5rem 0 1.5rem;
    }
`
const WrapFirstContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 1rem 15px 0;
    flex-basis: 50%;
    /* border-right: 0.75px solid rgba(255, 255, 255, 0.5); */
    div {
        /* margin-top: 0.75rem; */
    }
    .file-name {
        text-align: center;
        word-wrap: break-word;
        max-width: 400px;
        margin: 1rem auto;
    }
    @media screen and (max-width: 576px) {
        padding: 25px 15px 10px 15px;
    }
`
const WrapSecondContent = styled(WrapFirstContent)`
    padding: 15px 35px 10px 35px;
    border-right: none;
    letter-spacing: normal;
    padding-bottom: 25px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: relative;
    div {
        /* :nth-child(3) { */
        margin-top: 0.1rem;
        /* } */
    }

    .title-img {
        display: flex;
        justify-content: center;
    }

    @media screen and (max-width: 576px) {
        padding: 25px 15px 10px 15px;
    }
`

const WrapInput = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    button {
        position: absolute;
        right: 20px;
        width: 80px;
        height: 30px;
        border: none;
        img {
            height: 20px;
        }
    }
`
const WrapLabel = styled.div`
    display: flex;
    justify-content: space-between;
    button {
        color: rgba(0, 102, 255, 1);
        border: none;
        background: none;
        font-size: inherit;
    }
    @media screen and (max-width: 576px) {
        font-size: 14px;
    }
`

const LabelBtn = styled.div`
    display: flex;
    justify-content: center;
`

const Label = styled.label`
    font-weight: 600;
    font-size: 18px;
    /* width: 50%; */

    &.file-upload {
        background: rgba(0, 102, 255, 1);
        right: 20px;
        height: 40px;
        padding: 0 20px;
        font-size: unset;
        margin-top: 1rem;
        font-weight: unset;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        :hover {
            opacity: 0.8;
        }
    }
`
const Input = styled.input`
    width: 100%;
    padding: 5px 10px;
    border: 1px solid #ffffff;
    height: 40px;
    border-radius: 6px;
    background: none;
    :focus {
        outline: none;
    }
    ::placeholder {
        color: #7b7777;
    }
    font-size: 14px;
    color: #fff;
    @media screen and (max-width: 576px) {
        input {
            padding: 2px 5px;
        }
    }
    &#file-upload {
        display: none;
    }
`
const TextArea = styled.textarea`
    width: 100%;
    padding: 5px 10px;
    resize: none;
    border: 1px solid #ffffff;
    height: 100px;
    border-radius: 6px;
    background: none;
    font-size: 14px;

    :focus {
        outline: none;
    }
    ::placeholder {
        color: #fff;
    }
    color: #fff;
    ::-webkit-scrollbar {
        display: none;
    }
    @media screen and (max-width: 576px) {
    }
`
const WrapBody = styled.div``

const NavTitle = styled.div`
    cursor: pointer;
    /* padding: 5px 8px; */
    /* padding: 0 0 3.5rem; */
    margin-bottom: 1.5rem;
    /* font-size: 20px; */
    /* border: 2px solid white; */
    /* border-radius: 12px; */
    /* width: 22%; */
    max-width: 200px;
`
const WrapSelect = styled.div`
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    gap: 10px;
`
const Select = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    max-width: 300px;
    background: rgba(0, 178, 255, 0.3);
    /* border: 1px solid white; */
    border-radius: 6px;
    text-align: center;
    div {
        margin: auto 0;
        padding: 10px;
        cursor: pointer;
    }
    .active {
        background: #00b2ff;
        border-radius: 6px;

        /* scale: 1.1; */
    }
`

const PreviewThumbnail = styled.div`
    width: 300px;
    height: 240px;
    border: 0.75px solid #fff;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem;
    img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: contain;
    }
    .image-preview {
        border-radius: 8px;
    }
`
