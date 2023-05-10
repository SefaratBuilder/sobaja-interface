import PrimaryButton from 'components/Buttons/PrimaryButton'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveWeb3React } from 'hooks'
import { githubAssetRepo } from 'constants/index'

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

const CreateLaunchpad = () => {
    const [calendarModal, setCalendarModal] = useState(false)
    const [isOpenCategory, setIsOpenCategory] = useState(false)
    const [optionCategory, setOptionCategory] = useState('Crypto')
    const listCategories = [
        'Crypto',
        'Sports',
        'Economics',
        'Esport',
        'Politics',
    ]
    const refDatePicker = useRef(null)
    const refCategory = useRef(null)
    const [file, setFile] = useState<File>()
    const { chainId } = useActiveWeb3React()
    const [liquidity, setLiquidity] = useState<string>()
    const [fee, setFee] = useState<number>(1)
    const [ratios, setRatios] = useState({ left: 50, right: 50 })
    const [outcomes, setOutcomes] = useState({ yes: 'Yes', no: 'No' })
    const [title, setTitle] = useState<string>('')
    const [desc, setDesc] = useState<string>('')
    const [err, setErr] = useState('')
    const { refAddress } = useAppState()
    const updateApplication = useUpdateApplicationState()
    const delayDefault = 4000

    const [dateRange, setDateRange] = useState({
        startDate: new Date(
            moment(new Date().toString()).format('ddd MMM DD YYYY 00:00:00'),
        ),
        endDate: new Date(
            moment(new Date(new Date().getTime() + 86400000).toString()).format(
                'ddd MMM DD YYYY 00:00:00',
            ),
        ),
        key: 'selection',
    })
    const [hourRange, setHourRange] = useState({
        startTime: 0, //time now + 5min
        endTime: 0,
    })

    const onMaxBalance =
        // useOnMaxBalance(USDC[chainId]?.type)
        0

    // const deployer = Modules.DeployerAddress

    useOnClickOutside(refDatePicker, () => setCalendarModal(false))
    useOnClickOutside(refCategory, () => setIsOpenCategory(false))

    const handleChangeInput1 = (event) => {
        const value = event.target.value
        if (value > 100) {
            setRatios({
                left: 100,
                right: 0,
            })
        } else {
            setRatios({
                left: value,
                right: 100 - value,
            })
        }
    }

    const handleChangeInput2 = (event) => {
        const value = event.target.value
        if (value > 100) {
            setRatios({
                right: 100,
                left: 0,
            })
        } else {
            setRatios({
                right: value,
                left: 100 - value,
            })
        }
    }

    const handleChangeFee = (event) => {
        setFee(event.target.value)
    }

    const handleCreateMarket = async () => {
        try {
            const startTimeUnix =
                new Date(dateRange.startDate).getTime() / 1000 +
                hourRange.startTime
            const expiredTimeUnix =
                new Date(dateRange.endDate).getTime() / 1000 + hourRange.endTime
            const path = `assets/${Date.now()}.png`
            const thumbnailUrl = githubAssetRepo + path
            console.log({ startTimeUnix, expiredTimeUnix, ...hourRange })
            // const payload = {
            //     function: `${Modules.Scripts}::create_new_market`,
            //     type_arguments: [USDC[chainId].type],
            //     arguments: [
            //         title,
            //         desc,
            //         optionCategory,
            //         thumbnailUrl,
            //         mulNumberWithDecimal(
            //             liquidity || '100',
            //             USDC[chainId].decimals,
            //         ),
            //         0,
            //         ratios.left,
            //         0,
            //         Number(startTimeUnix.toFixed()),
            //         Number(expiredTimeUnix.toFixed()),
            //         mulNumberWithDecimal(fee, 1),
            //         [outcomes.yes || 'Yes', outcomes.no || 'No'],
            //         'btc-usd',
            //         10000
            //     ],
            //     type: 'entry_function_payload',
            // }
            const result = await uploadFile(file, path)
            console.log({ result })

            // setPayload({
            //     method: 'CreateMarket',
            //     type: 'Create Market',
            //     txnHash: hash?.hash,
            //     isSuccess: resultCreate?.success || false,
            //     delay: delayDefault,
            // })

            // setIsOpenToastMsg(true)
            // await updateApplication()
            // await handleRefAddress(address, refAddress, 'createPrediction')

            setTimeout(() => {
                window.location.replace('/#/compassshare')
            }, delayDefault)
        } catch (err) {
            console.log('failed to create market', err)
        }
    }

    const handleChangeCategory = (option) => {
        setOptionCategory(option)
        setIsOpenCategory(false)
    }

    const handleChangeFile = (file) => {
        setFile(file)
    }

    const readFile = (file) => {
        const preview = document.getElementById('preview-thumbnail')
        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/gif' ||
            file.type === 'image/png' ||
            file.type === 'image/webp'
        ) {
            const reader = new FileReader()
            reader.onload = function (e) {
                preview.innerHTML = `<img className="image-preview" src="${e?.target?.result}" alt="Image preview" />`
            }
            reader.readAsDataURL(file)
        }
    }

    const uploadFile = async (file, path) => {
        const owner = 'forbitswap'
        const repo = 'prediction-market-assets'
        const token = process.env['REACT_APP_GITHUB_TOKEN']
        console.log('github token', token)
        // const github = new Octokit({
        //     auth: token,
        //     log: console,
        // })

        // const reader = new FileReader()
        // reader.onload = function () {
        //     const content = reader?.result?.toString().split(',')[1]
        //     github.repos.createOrUpdateFileContents({
        //         owner,
        //         repo,
        //         path,
        //         message: 'Add image',
        //         content,
        //         committer: {
        //             name: 'pantinho',
        //             email: 'pantinho@github.com',
        //         },
        //         author: {
        //             name: 'pantinho',
        //             email: '@pantinho@github.com',
        //         },
        //         encoding: 'base64',
        //     })
        // }
        // return reader.readAsDataURL(file)
    }

    const handleOnMaxBalance = () => {
        const balance =
            // onMaxBalance().toString()
            0
        setLiquidity(balance)
    }
    console.log({ hourRange })

    const onChangeHourStart = (timeUnix: number) => {
        setHourRange({
            ...hourRange,
            startTime: timeUnix,
        })
    }

    const onChangeHourExpiry = (timeUnix: number) => {
        setHourRange({
            ...hourRange,
            endTime: timeUnix,
        })
    }

    useEffect(() => {
        if (file) {
            readFile(file)
        }
    }, [file])

    useEffect(() => {
        if (!title) {
            return setErr('Please set market question.')
        }
        if (!desc) {
            return setErr('Please input description.')
        }
        if (!liquidity) {
            return setErr('Please input liquidity amount.')
        }
        if (Number(liquidity) < 100) {
            return setErr('Liquidity must be greater than 100 USDC!')
        }
        if (!file) {
            return setErr('Please upload a thumnail!')
        }

        if (hourRange) {
            const startTime =
                new Date(dateRange.startDate).getTime() / 1000 +
                hourRange.startTime
            const endTime =
                new Date(dateRange.endDate).getTime() / 1000 + hourRange.endTime
            const now = new Date().getTime() / 1000
            if (startTime < now) {
                return setErr('Start time must be greater than current time!')
            }
            if (endTime <= startTime) {
                return setErr('End time must be greater than start time!')
            }
        }
        return setErr('')
    }, [file, hourRange, dateRange, liquidity, title, desc])

    {
        /* <Row gap="5px" jus="space-between">
                <form onSubmit={handleOnCreateLaunchpad}>
                    <label>Launchpad Token</label>
                    {
                        token ? (
                            <div>{token.name}({token.symbol})</div>
                        ) : <></>
                    }
                    <input type="text" placeholder="launchpad token" value={launchpadState.token} onChange={(e) => setLaunchpadState({...launchpadState, token: e.target.value})} required />
                    <label>Payment currency</label>
                    {
                        paymentToken ? (
                            <div>{paymentToken.name}({paymentToken.symbol})</div>
                        ) : <></>
                    } 
                    <input type="text" placeholder="payment currency" value={launchpadState.paymentCurrency} onChange={(e) => setLaunchpadState({...launchpadState, paymentCurrency: e.target.value})} required />
                        
                    <label>Soft cap</label>
                    <input type="text" placeholder="soft cap" value={launchpadState.softCap} onChange={(e) => setLaunchpadState({...launchpadState, softCap: e.target.value})} required />
                    <label>Hard cap</label>
                    <input type="text" placeholder="hard cap" value={launchpadState.hardCap} onChange={(e) => setLaunchpadState({...launchpadState, hardCap: e.target.value})} required />
                    <label>Price</label>
                    <input type="text" placeholder="price" value={launchpadState.price} onChange={(e) => setLaunchpadState({...launchpadState, price: e.target.value})} required />
                    <label>Individual cap</label>
                    <input type="text" placeholder="individual cap" value={launchpadState.individualCap} onChange={(e) => setLaunchpadState({...launchpadState, individualCap: e.target.value})} required />
                    <label>Overflow token reward</label>
                    <input type="text" placeholder="overflow token reward" value={launchpadState.overflow} onChange={(e) => setLaunchpadState({...launchpadState, overflow: e.target.value})} required />
                    <label>Total tokens</label>
                    <input type="text" placeholder="total tokens" value={launchpadState.totalToken} onChange={(e) => setLaunchpadState({...launchpadState, totalToken: e.target.value})} required />
                    {
                        Number(tokenApproval.allowance?._value) < Number(launchpadState.totalToken) 
                            ? <button onClick={handleOnApprove}>{`Approve ${token?.symbol}`}</button>
                            : <input type="submit" value="Create Fairlaunch" />
                    }
                </form>
                <Admin />
                <Columns gap="10px" al="flex-end">
                    <LaunchpadList gap="10px" jus="flex-end">
                        {data?.launchpads?.map((item: LaunchpadInfo) => {
                            return (
                                <LaunchpadItem key={item.id} {...item} />
                            )
                        })}
                    </LaunchpadList>
                    <button style={{width: 100}} onClick={() => refetch()}>Refetch</button>
                </Columns>
            </Row>
            <Row>
                Account abstraction testing
                <button onClick={handleOnSendTransaction}>Send transaction</button>
            </Row> */
    }

    return (
        <>
            <Container>
                <WrapFirstContent>
                    <WrapLabel>
                        <Label>Launchpad Token</Label>
                    </WrapLabel>
                    <WrapInput>
                        <Input
                            placeholder="Token address"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </WrapInput>
                    <WrapLabel>
                        <Label>Payment Currency</Label>
                    </WrapLabel>
                    <WrapInput>
                        <Input
                            placeholder="Payment token address"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </WrapInput>
                    <WrapLabel>
                        <Label>Soft cap</Label>
                    </WrapLabel>
                    <WrapInput>
                        <Input
                            placeholder="1"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </WrapInput>
                    <WrapLabel>
                        <Label>Hard cap</Label>
                    </WrapLabel>
                    <WrapInput>
                        <Input
                            placeholder="3"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </WrapInput>
                    <WrapLabel>
                        <Label>Price</Label>
                    </WrapLabel>
                    <WrapInput>
                        <Input
                            placeholder="0.1"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </WrapInput>
                    <WrapLabel>
                        <Label>Individual cap</Label>
                    </WrapLabel>
                    <WrapInput>
                        <Input
                            placeholder="1"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </WrapInput>
                    <WrapLabel>
                        <Label>Overflow token reward</Label>
                    </WrapLabel>
                    <WrapInput>
                        <Input
                            placeholder="10"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </WrapInput>
                    <WrapLabel>
                        <Label>Total tokens</Label>
                    </WrapLabel>
                    <WrapInput>
                        <Input
                            placeholder="10"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </WrapInput>
                </WrapFirstContent>

                <WrapSecondContent>
                    <WrapLabel className="title-img">
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
                        <Label htmlFor="file-upload" className="file-upload">
                            Choose image
                        </Label>
                    </LabelBtn>
                    {/* <WrapBtn>
                        <Button>
                            <NameBtn>Resolution Date</NameBtn>
                            <DescBtn onClick={() => setCalendarModal(true)}>
                                Select date
                            </DescBtn>
                        </Button>
                        <Button ref={refCategory}>
                            <NameBtn>Category</NameBtn>
                            <DescBtn
                                onClick={() => {
                                    setIsOpenCategory(!isOpenCategory)
                                }}
                            >
                                {optionCategory}
                                <span className="arrow-down" />
                            </DescBtn>
                            {isOpenCategory && (
                                <>
                                    <ul>
                                        {listCategories.map((i, index) => {
                                            return (
                                                <li key={index}>
                                                    <p
                                                        onClick={() => {
                                                            handleChangeCategory(
                                                                i,
                                                            )
                                                        }}
                                                    >
                                                        {i}
                                                    </p>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </>
                            )}
                        </Button>
                        <Button>
                            <NameBtn>Arbitrator</NameBtn>
                            <DescBtn>forbitswap</DescBtn>
                        </Button>
                        <Hr />
                    </WrapBtn> */}
                    {/* {calendarModal && <WrapDatePicker ref={refDatePicker}><DateRangePickerComponent closeModal={setCalendarModal} type="calendar" /></WrapDatePicker>} */}
                    {/* <DatePicker date={date} onPickDate={setDate} /> */}
                    <WrapDatePicker ref={refDatePicker}>
                        <DatePicker
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                        />
                        <p className="title-time">Select Time</p>
                        <Time>
                            <TimeInput>
                                <p>
                                    {moment(
                                        dateRange.startDate.toString(),
                                    ).format('DD/MM/YYYY')}
                                </p>
                                <TimePicker onChange={onChangeHourStart} />
                            </TimeInput>
                            <p>to</p>
                            <TimeInput className="time-right">
                                <p>
                                    {' '}
                                    {moment(
                                        dateRange.endDate.toString(),
                                    ).format('DD/MM/YYYY')}
                                </p>
                                <TimePicker onChange={onChangeHourExpiry} />
                            </TimeInput>
                        </Time>
                    </WrapDatePicker>
                    <ContentBottom>
                        {err && <Error>{err}</Error>}
                        {/* <WrapWarning>
						<img src={imgWarningIcon} alt="" />
						<div>
							Set the market resolution date at least 6 days after the correct outcome will be known and make sure that this market won't be{" "}
							<a href="#" target="_blank">
								invalid
							</a>
						</div>
					</WrapWarning> */}
                        <WrapSubmitBtn>
                            <PrimaryButton
                                type="transparent"
                                name="Cancel"
                                onClick={() =>
                                    window.location.replace('/#/compassshare')
                                }
                            />
                            <PrimaryButton
                                // disabled={!!err}
                                type="blue"
                                name="Continue"
                                onClick={() =>
                                    // !err &&
                                    handleCreateMarket()
                                }
                            />
                        </WrapSubmitBtn>
                    </ContentBottom>
                </WrapSecondContent>
            </Container>
        </>
    )
}
export default CreateLaunchpad

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
        font-size: 18px;
        font-weight: 600;
    }
`
const WrapInputPercent = styled.div<{ percentage: number }>`
    div {
        width: 100%;
        position: relative;
        align-items: center;
        display: flex;
        input {
            height: 3px;
            -webkit-appearance: none;
            width: 100%;
            ::-webkit-slider-thumb {
                appearance: none;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                background: rgba(0, 102, 255, 1);
                cursor: pointer;
            }
        }
    }
    .color {
        position: absolute;
        height: 3px;
        background: rgba(0, 102, 255, 1);
        width: ${({ percentage }) => `${percentage}%`};
    }
    display: flex;
    gap: 25px;
    align-items: center;

    button {
        max-width: 140px;
    }
    @media screen and (max-width: 576px) {
        flex-direction: column;
    }
`
const InputPercent = styled.input`
    max-width: 140px;
    height: 40px;
    background: none;
    border: 1px solid #fff;
    border-radius: 8px;
    color: #fff;
    padding: 0.8rem;
    text-align: center;
    ::placeholder {
        color: #fff;
    }
    @media screen and (max-width: 576px) {
        margin-bottom: 1rem;
    }
`
const TitleMarket = styled.div`
    font-weight: 600;
    font-size: 18px;
    margin: 1rem 0 2rem;
`
const WrapMarket = styled.div``
const WrapInputRatio = styled.div`
    display: flex;
    gap: 30px;
    div {
        display: flex;
        align-items: center;
        height: 40px;
        border-radius: 8px;
        border: 1px solid #fff;
        width: 100%;
        .label {
            padding: 1rem;
            border-radius: 8px 0 0 8px;
            border-right: 1px solid white;
            width: 120px;
            height: 100%;
            display: flex;
            align-items: center;
            color: #fff;
        }
        input {
            background: none;
            border: none;
            height: 100%;
            color: #fff;
            text-align: center;
            width: 60px;
            appearance: none;
            -moz-appearance: textfield;

            ::-webkit-inner-spin-button,
            ::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            :focus {
                outline: none;
            }
        }
    }
    @media screen and (max-width: 992px) {
        gap: 50px;
        div {
            width: 100%;
        }
    }
    @media screen and (max-width: 576px) {
        flex-wrap: wrap;
        gap: 10px;
        div {
            width: 100%;
            label {
                flex-basis: 30%;
                justify-content: center;
            }
            input {
                width: 100%;
            }
        }
    }
`
const TitleRatio = styled.div`
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 0.8rem;
`
const Ratio = styled.div``
const Hr = styled.div`
    position: absolute;
    height: 1px;
    right: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.3);
`
const DescBtn = styled.div`
    font-weight: 600;
    text-align: center;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    gap: 5px;
    .arrow-down {
        display: block;
        height: 0;
        width: 0;
        border: 5px solid white;
        border-left: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-right: 5px solid transparent;
    }
    :hover {
        opacity: 0.8;
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
const NameBtn = styled.div`
    text-align: center;
`
const Button = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: relative;

    img {
        display: none;
    }
    :last-child {
        button {
            justify-content: space-between;
        }
        img {
            display: inline;
        }
    }
    ul {
        z-index: 1;
        position: absolute;

        left: 50%;
        text-align: center;
        border-radius: 8px;
        background: rgba(157, 195, 230, 0.6);
        backdrop-filter: invert(1);
        transform: translate(-50%, 50%);
        backdrop-filter: revert(1%);
        li {
            cursor: pointer;
            width: 100px;
            list-style: none;
            padding: 0.25rem;
            :hover {
                opacity: 0.7;
            }
        }
    }
    ul::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
    }
`

const WrapBtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
    position: relative;
`

const WrapFirstContent = styled.div`
    padding: 0 15px;
    flex-basis: 50%;
    border-right: 0.75px solid rgba(255, 255, 255, 0.5);
    div {
        margin-top: 0.75rem;
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

const Container = styled.div`
    display: flex;
    .calendar {
        position: inherit;
    }
    @media screen and (max-width: 992px) {
        display: block;
    }
`
const WrapInput = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 1rem;
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
        cursor: pointer;
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
    height: 50px;
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
