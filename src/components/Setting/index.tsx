import SettingIcon from 'assets/icons/setting.svg'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import Blur from 'components/Blur'
import {
    useSlippageTolerance,
    useTransactionDeadline,
} from 'states/application/hooks'
import SwitchButton from 'components/Buttons/SwitchButton'

interface TransactionProps {
    setSetting: React.Dispatch<React.SetStateAction<boolean>>
    setting: boolean
}

const Transaction = ({ setSetting, setting }: TransactionProps) => {
    const [active, setActive] = useState('')
    const { slippage, setSlippage } = useSlippageTolerance()
    const { deadline, setDeadline } = useTransactionDeadline()
    const selection = '1'
    const [activeExpertMode] = useState(false)
    const [multihop] = useState(false)

    const [textError, setTextError] = useState<string>('')

    const validateInputNumber = (e: string) => {
        const value = e
            .replace(/[^0-9.,]/g, '')
            .replace(' ', '')
            .replace(',', '.')
            .replace(/(\..*?)\..*/g, '$1')
        if (Number(value) < 0.1) {
            setSlippage(value)
            setTextError('Your transaction may be failed')
            setActive('setIcon')
        } else if (Number(value) > 100) {
            setTextError('Enter a valid slippage percentage')
            setActive('setWarning')
        } else {
            setActive('')
            setTextError('')
            setSlippage(value)
        }
    }
    const validateInputDealine = (e: string) => {
        const value = e
            .replace(/[^0-9.,]/g, '')
            .replace(' ', '')
            .replace(',', '.')
            .replace(/(\..*?)\..*/g, '$1')
        if (Number(value) < 1) {
            const value2 = e
            setDeadline(Number(value2) * 60)
            setTextError('Your transaction may be failed')
        } else if (Number(value) > 60) {
            setTextError('Your transaction can take a long time')
        } else {
            const value2 = e
            setTextError('')
            setDeadline(Number(value2) * 60)
        }
    }

    const ref = useRef<any>()
    useOnClickOutside(ref, () => setSetting(false))

    return (
        <>
            <Container className={setting ? 'active' : ''}>
                <Wrap className={setting ? 'active' : ''} ref={ref}>
                    <TransactionSetting>
                        <Title>Settings</Title>
                        <SubTitle>
                            <span>Slippage tolerance</span>
                            <IconQuestion>
                                ?
                                <SlippageText>
                                    Your transaction will revert if the price
                                    changes unfavorably by more than this
                                    percentage.
                                </SlippageText>
                            </IconQuestion>
                        </SubTitle>
                        <GroupButton>
                            <WrapButton>
                                <Item
                                    setting={setting}
                                    className={
                                        slippage === selection ? 'active' : ''
                                    }
                                    onClick={() => {
                                        validateInputNumber(selection)
                                    }}
                                >
                                    Auto
                                </Item>
                                {/* <p>Auto</p> */}
                            </WrapButton>
                            <WrapInputPercent>
                                <span
                                    className={`${
                                        active === 'setIcon' ? 'active' : ''
                                    }`}
                                >
                                    ⚠️
                                </span>
                                <Input
                                    className={`${
                                        active === 'setWarning' ? 'red' : ''
                                    }`}
                                    type={'text'}
                                    value={slippage}
                                    style={{ padding: '0.1rem 1.7rem 0 1rem' }}
                                    placeholder="0.10"
                                    onChange={(e) =>
                                        validateInputNumber(e.target.value)
                                    }
                                />
                                <Percent
                                    className={`${
                                        active === 'setWarning' ? 'red' : ''
                                    }`}
                                >
                                    %
                                </Percent>
                            </WrapInputPercent>
                        </GroupButton>
                        <WarningText
                            className={`${textError ? 'active' : ''} ${
                                active === 'setWarning' ? 'warning' : ''
                            }`}
                        >
                            {textError}
                        </WarningText>
                        <SubTitle>
                            <span>Transaction deadline</span>
                            <IconQuestion>
                                ?
                                <SlippageText>
                                    Your transaction will revert if it is
                                    pending for more than this period of time.
                                </SlippageText>
                            </IconQuestion>
                        </SubTitle>
                        <SubTitle>
                            <InputTime
                                placeholder="0.0 "
                                type={'text'}
                                // value={Number(deadline)/60}
                                onChange={(e) =>
                                    validateInputDealine(e.target.value)
                                }
                            />
                            <p> minutes</p>
                        </SubTitle>
                    </TransactionSetting>
                    {/* <InterfaceSetting>
						<Title>Interface Settings</Title>
						<Toggle>
							<SubTitle>
								<span>Auto Rounter API</span>
								<IconQuestion>
									?<SlippageText>Allow high price impact trades and skip the confirm screen. Use at your own risk.</SlippageText>
								</IconQuestion>
							</SubTitle>
							<SwitchButton active={activeExpertMode} />
						</Toggle>
						<Multihop>
							<SubTitle>
								<span>Expert Mode</span>
								<IconQuestion>
									?<SlippageText>Restricts swaps to direct pairs only.</SlippageText>
								</IconQuestion>
							</SubTitle>
							<SwitchButton active={multihop} />
						</Multihop>
					</InterfaceSetting> */}
                </Wrap>
            </Container>
            <Blur />
        </>
    )
}

export default Transaction
const Toggle = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`

const Multihop = styled(Toggle)``

const InputTime = styled.input`
    // height: 2rem;
    outline: none;
    background: none;
    max-width: 80px;
    padding: 11px 11px;
    color: #c9c9c9;
    border: 0.589301px solid #ffffff;
    backdrop-filter: blur(2.9465px);
    border-radius: 6px;
    text-align: right;
    ::placeholder {
        font-family: 'Montserrat', sans-serif;
        font-style: italic;
        color: #c9c9c9;
    }
`
const TransactionSetting = styled.div`
    gap: 8px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
`
const InterfaceSetting = styled(TransactionSetting)``
const Container = styled.div`
    position: absolute;
    /* width: 360px; */
    height: fit-content;
    top: 54px;
    left: -140px;
    transform: translateX(-50%);
    opacity: 0;
    transition: all 0.2s linear;
    z-index: -1;
    &.active {
        opacity: 1;
        z-index: 3;
    }
    @media screen and (max-width: 375px) {
        /* width: 310px; */
        scale: 0.8;
    }
`

const Wrap = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    margin: auto;
    color: ${({ theme }) => theme.text1};
    font-size: 14px;
    /* max-width: 385px; */
    width: 100%;
    backdrop-filter: blur(10px);

    // border: 1.5px solid ${({ theme }) => theme.bd0};
    box-shadow: ${({ theme }) => theme.bs0};
    border-radius: 8px;
    padding: 15px;
    // width: 360px;
    // height: 360px;
    background: var(--bg5);
    border: 1px solid #003b5c;

    @media screen and (max-width: 390px) {
        /* max-width: 370px; */
    }
    @media screen and (max-width: 375px) {
        padding: 15px 8px;
    }
`
const Title = styled.div`
    font-weight: 600;
    margin: auto;
    font-size: 20px;
    line-height: 23px;
`
const SubTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
`
const GroupButton = styled.div`
    display: flex;
    width: 100%;
`
const WrapButton = styled.div`
    display: flex;
    // border: 1px solid ${({ theme }) => theme.bd1};

    text-align: center;
    width: 80px;
    // border-radius: 12px;
    align-items: center;
    justify-content: space-around;
    margin-right: 12px;
    padding: 2px;
    background: #00b2ff;
    backdrop-filter: blur(2.9465px);
    border-radius: 6px;
    @media screen and (max-width: 375px) {
        /* margin-right: 6px; */
    }
    p {
        padding: 10px 20px;
    }
`
const Item = styled.div<{ setting: boolean }>`
    font-size: 1rem;
    padding: 4px 6px;
    border-radius: 8px;
    width: 100%;
    // max-width: 25%;
    height: 27px;
    cursor: pointer;
    transition: all 0.2s linear;
    visibility: ${({ setting }) => (setting ? '' : 'hidden')};
    &.active {
        background: ${({ theme }) => theme.bg1};
    }
    @media screen and (max-width: 375px) {
    }
`

const IconQuestion = styled.div`
    background: ${({ theme }) => theme.bg3};
    border-radius: 50%;
    border: 1px solid #ffffff;
    height: 18px;
    width: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 1px;
    cursor: default;
    font-style: initial;
    :hover {
        background: ${({ theme }) => theme.bg9};
        div {
            display: block;
        }
    }
`
const WarningText = styled.div`
    color: rgb(243, 132, 30);
    width: 100%;
    height: 15px;
    font-size: 15px;
    display: none;
    &.active {
        display: block;
    }
    &.warning {
        color: rgb(255, 0, 0);
    }
`
const Percent = styled.div`
    position: absolute;
    top: 50%;
    font-size: 16px;

    right: 10px;
    transform: translate(0, -50%);

    &.red {
        color: red;
    }
`

const SlippageText = styled.div`
    position: absolute;
    top: 20px;
    z-index: 2;
    transform: translate3d(-40%, 25px, 0px);
    inset: 0px auto auto 0px;
    width: 256px;
    padding: 0.6rem 1rem;
    font-weight: 400;
    word-break: break-word;
    font-style: italic;
    background: rgba(157, 195, 230, 0.8);
    box-shadow: ${({ theme }) => theme.boxShadow};
    border: 1px solid ${({ theme }) => theme.bd1};
    backdrop-filter: blur(10px);
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 300;
    letter-spacing: 0.4px;

    display: none;

    ::before {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        border-top: 1px solid ${({ theme }) => theme.bd1};
        border-left: 1px solid ${({ theme }) => theme.bd1};
        transform: rotate(45deg);
        background: ${({ theme }) => theme.bg9};
        top: -5px;
        left: 42%;
        margin: auto;
    }
`

const WrapInputPercent = styled.div`
    border: 0.589301px solid #ffffff;
    border-radius: 5px;
    position: relative;
    span {
        color: rgb(243, 132, 30);
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translate(0, -50%);
        z-index: 1;
        display: none;
        &.active {
            display: block;
        }
    }
`

const Input = styled.input`
    border: none;
    height: 2rem;
    position: relative;
    padding: 0px 0.5rem;
    flex: 1 1 0%;
    /* min-width: unset; */
    /* max-width: 90px; */
    color: #c9c9c9;
    align-items: center;
    height: 2rem;
    border-radius: 12px;
    font-size: 1rem;
    text-align: right;
    width: auto;
    min-width: 1.5rem;
    /* border: 1px solid ${({ theme }) => theme.bd1}; */
    outline: none;
    background: none;
    &.red {
        /* border: 1px solid rgb(255, 67, 67); */
        color: rgb(255, 67, 67);
    }
    ::placeholder {
        color: ${({ theme }) => theme.text2};
    }
`
