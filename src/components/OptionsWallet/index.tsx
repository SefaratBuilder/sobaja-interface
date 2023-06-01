import React, { useState } from 'react'
import styled from 'styled-components'
import imgClose from 'assets/icons/icon-close.svg'
import {
    getConnections,
    injectedConnection,
    bitkeepConnection,
    okexConnection,
} from 'components/connection'
import { Connection } from 'components/connection/types'
import { useAppDispatch } from 'states/hook'
import { updateSelectedWallet } from 'states/user/reducer'
import Loader from 'components/Loader'
import BgWallet from 'assets/brand/bg-connect-wallet.png'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { useActiveWeb3React } from 'hooks'
import { WALLET_ADAPTERS } from '@web3auth/base'
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber'

const WALLET_VIEWS = {
    OPTIONS: 'options',
    ACCOUNT: 'account',
    PENDING: 'pending',
}

interface actionWallet {
    setWalletView: React.Dispatch<React.SetStateAction<string>>
    setPendingWallet: React.Dispatch<React.SetStateAction<string | undefined>>
    setToggleWalletModal: React.Dispatch<React.SetStateAction<boolean>>
    walletView: string
    pendingWallet: string | undefined
}

function OptionsWallet({
    walletView,
    pendingWallet,
    setWalletView,
    setPendingWallet,
    setToggleWalletModal,
}: actionWallet) {
    const connections = getConnections()
    const dispatch = useAppDispatch()
    const { web3AuthConnect } = useActiveWeb3React()
    const [typeConnect, setTypeConnect] = useState<'Wallet' | 'Social'>(
        'Wallet',
    )
    const [phoneNumber, setPhoneNumber] = useState('')

    const tryActivation = async (connector: Connection | undefined) => {
        try {
            setWalletView(WALLET_VIEWS.PENDING)
            connector?.getName() && setPendingWallet(connector?.getName())
            if (connector?.type == 'ARGENT') {
                dispatch(updateSelectedWallet({ wallet: undefined }))
            } else {
                dispatch(updateSelectedWallet({ wallet: connector?.type }))
            }
            await connector?.connector?.activate()
        } catch (error) {
            console.log('err', error)
            setWalletView(WALLET_VIEWS.OPTIONS)
            setPendingWallet('')
        }
    }

    const installWallet = (option: Connection) => {
        return (
            <Item key={option + option.getName()}>
                <ItemContent
                    onClick={() => {
                        option.href &&
                            option.href !== null &&
                            window.open(option.href)
                    }}
                >
                    <img src={option.getIcon?.(true)}></img>
                    <span>Install {option.getName()}</span>
                </ItemContent>
            </Item>
        )
    }

    const getOptions = () => {
        return connections
            .filter((item) => item.shouldDisplay())
            .map((key, index) => {
                const option = key
                if (option.connector === injectedConnection.connector) {
                    // don't show injected if there's no injected provider
                    if (!(window.web3 || window.ethereum)) {
                        return installWallet(option)
                    }
                }
                if (option.connector == bitkeepConnection.connector) {
                    //don't show injected if there's no injected provider
                    if (!window.bitkeep) {
                        return installWallet(option)
                    }
                }
                if (option.connector == okexConnection.connector) {
                    //don't show injected if there's no injected provider
                    if (!window.okexchain) {
                        return installWallet(option)
                    }
                }
                return (
                    <Item key={key + option.getName()}>
                        <ItemContent
                            onClick={() => {
                                tryActivation(option)
                            }}
                        >
                            <img src={option.getIcon?.(true)}></img>
                            <span>{option.getName()}</span>
                        </ItemContent>
                        {walletView === WALLET_VIEWS.PENDING &&
                        pendingWallet === option.getName() ? (
                            <StyledLoader />
                        ) : (
                            ''
                        )}
                    </Item>
                )
            })
    }

    /**
     *
     * @param isPhone connect by phone: true | by social: false
     * @param name: connect by phone: undefined | by social: social name
     * @returns
     */
    const handleConnect = (isPhone: boolean, name?: string) => {
        try {
            // * login by phone
            if (isPhone) {
                const utilPhone: any =
                    PhoneNumberUtil.getInstance().parseAndKeepRawInput(
                        phoneNumber,
                    )
                const convertPhone = `+${utilPhone?.values_?.['1']}-${utilPhone?.values_?.['2']}`
                return web3AuthConnect(WALLET_ADAPTERS.OPENLOGIN, {
                    loginProvider: 'sms_passwordless',
                    extraLoginOptions: {
                        login_hint: convertPhone,
                    },
                })
            }

            // * login by social
            return (
                name &&
                web3AuthConnect(WALLET_ADAPTERS.OPENLOGIN, {
                    loginProvider: name,
                })
            )
        } catch (error) {
            console.log({ error })
        }
    }
    const [isActive, setActive] = useState(false);
    const ToggleClass = () => {
        setActive(!isActive);
      };

    const socialLoginList = [
        {
            name: 'twitter',
            img: 'https://images.web3auth.io/login-twitter-active.svg',
        },
        {
            name: 'discord',
            img: 'https://images.web3auth.io/login-discord-active.svg',
        },
        {
            name: 'facebook',
            img: 'https://images.web3auth.io/login-facebook-active.svg',
        },
        {
            name: 'reddit',
            img: 'https://images.web3auth.io/login-reddit-active.svg',
        },
        {
            name: 'twitch',
            img: 'https://images.web3auth.io/login-twitch-active.svg',
        },
        {
            name: 'apple',
            img: 'https://images.web3auth.io/login-apple-active.svg',
        },
        {
            name: 'line',
            img: 'https://images.web3auth.io/login-line-active.svg',
        },
        {
            name: 'github',
            img: 'https://images.web3auth.io/login-github-active.svg',
        },
        {
            name: 'kakao',
            img: 'https://images.web3auth.io/login-kakao-active.svg',
        },
        {
            name: 'linkedin',
            img: 'https://images.web3auth.io/login-linkedin-active.svg',
        },
        {
            name: 'weibo',
            img: 'https://images.web3auth.io/login-weibo-active.svg',
        },
        {
            name: 'wechat',
            img: 'https://images.web3auth.io/login-wechat-active.svg',
        },
    ]

    return (
        <Container>
            <Header>
                <div className="label-btn">
                    <span
                        className={`${
                            typeConnect === 'Wallet' ? 'active' : ''
                        }`}
                        onClick={() => setTypeConnect('Wallet')}
                    >
                      <p>Connect a wallet</p>
                    </span>
                    <span
                        className={`${
                            typeConnect === 'Social' ? 'active' : ''
                        }`}
                        onClick={() => setTypeConnect('Social')}
                    >
                        <p>Social Login</p>
                    </span>
                </div>
            </Header>
            <WrapContent>
                {typeConnect === 'Wallet' && (
                    <WrapItem>{getOptions()}</WrapItem>
                )}
                {typeConnect === 'Social' && (
                    <WrapItem>
                        <PrimaryButton
                            name="Continue with Google"
                            onClick={() => handleConnect(false, 'google')}
                            img="https://images.web3auth.io/login-google-active.svg"
                            type="option-login"
                        />
                        <LabelSocialConnect className={isActive ? "active" : "inactive"}>
                            {socialLoginList.map((social, index) => {
                                return (
                                    <div
                                        onClick={() =>
                                            handleConnect(false, social.name)
                                        }
                                        key={index}
                                    >
                                        <img src={social.img} alt="" />
                                    </div>
                                )
                            })}
                        </LabelSocialConnect>
                        <div className="content-social">
                            We do not store any data related to your social
                            logins.
                        </div>
                        <div onClick={ToggleClass} className={isActive ? "active more-social" : "inactive more-social"} >
                        <p className='p1'>View more options</p>
                        <p className='p2'>View less options</p>
                        </div>
                        <div className="line"></div>

                        <div className="email">Email or phone</div>
                        <input
                            type="text"
                            placeholder="sobajaswap@gmail.com || +123666666666"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <PrimaryButton
                            name="Continue"
                            onClick={() => handleConnect(true)}
                            type="option-login"
                        />
                    </WrapItem>
                )}

                <Title>
                    {/* {typeConnect === 'Social' && (
                        <div>
                            We do not store any data related to your social
                            logins.
                        </div>
                    )} */}
                    {typeConnect === 'Wallet' && (
                        <div>
                            By connecting a wallet, you agree to Sobajaswap
                            &nbsp;
                            <a href="#" target="_blank" rel="noreferrer">
                                Terms of Service &nbsp;
                            </a>
                            and
                            <a href="#" target="_blank" rel="noreferrer">
                                &nbsp; Privacy Policy.
                            </a>
                        </div>
                    )}
                </Title>
            </WrapContent>
        </Container>
    )
}

const Container = styled.div`
    position: fixed;
    background: url(${BgWallet});
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 1;
    border: 1px solid #003b5c;
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    overflow: auto;
    max-width: 420px;
    width: 100%;
    right: 0px;
    bottom: 0px;
    top: 0px;
    height: 100vh;
    margin: auto;
    z-index: 9999;
    color: ${({ theme }) => theme.text1};
    animation: 'fadeUp 0.3s linear';

    @media screen and (max-width: 640px) {
        top: 10rem;
        max-width: unset;
        border-radius: 12px 12px 0px 0px;
        animation: fadeUp 0.3s linear;
        height: calc(100vh - 10rem);
    }
    @keyframes fadeIn {
        from {
            transform: translateX(100%);
            opacity: 1;
        }
        to {
            transform: translateX(0px);
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        from {
            transform: translateX(0px);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 1;
        }
    }
    @keyframes fadeUp {
        from {
            transform: translateY(100%);
            opacity: 1;
        }
        to {
            transform: translateY(0px);
            opacity: 1;
        }
    }
`

const LabelSocialConnect = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    grid-gap: 10px;
    &.inactive{
        // height: 50px;
        // overflow: hidden;
        div:nth-child(4),
        div:nth-child(5),
        div:nth-child(6),
        div:nth-child(7),
        div:nth-child(8),
        div:nth-child(9),
        div:nth-child(10),
        div:nth-child(11),
        div:nth-child(12){
            display:none;
        }
    }
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #003b5c;
        background: rgb(255, 255, 255);
        min-height: 48px;
        border-radius: 8px;
        @media screen and (max-width: 767px) {
            min-height: 42px;
        }
        :hover {
            background: rgba(255, 255, 255, 0.8);
        }

        img {
            width: 35px;
            height: 35px;
            @media screen and (max-width: 767px) {
                width: 30px;
                height: 30px;
            }
        }
    }
`

const StyledLoader = styled(Loader)`
    margin-right: 1rem;
`

const Header = styled.div`
    display: flex;
    justify-content: center;
    padding: 3rem 1.5rem 0;
   

    .label-btn {
        display: flex;
        background: rgba(0, 178, 255, 0.3);
        border-radius: 8px;
        width: 100%;
    }

    .active {
        background: #00b2ff;
    }
    span:nth-child(1){
        border-radius: 8px 0 0 8px;
    }
    span:nth-child(2){
        border-radius:  0 8px 8px 0;
    }

    span {
        cursor: pointer;
        color: ${({ theme }) => theme.text1};
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 30px;
        padding: 10px 10px;
        width: 50%;
        text-align: center;
    }
    ::before {
        content: '';
        position: absolute;
        right: -10px;
        width: 50%;
        height: 35px;
        top: -62px;
    }
    div {
        display: none;
    }
    @media screen and (max-width: 390px) {
        padding: 0.5rem 1rem;
    }
    @media screen and (max-width: 640px) {
        div {
            display: block;
        }
        span {
            margin: auto;
        }
    }
    @media screen and (max-width: 767px){
        span{
            font-size: 14px;
        }
    }
`
const WrapContent = styled.div`
    padding: 0.5rem 1.5rem 1.2rem;

    @media screen and (max-width: 390px) {
        padding: 0.5rem 1rem;
    }
`
const Title = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    color: ${({ theme }) => theme.text1};
    margin-bottom: 50px;
    div {
        font-size: 14px;
        margin-bottom: 15px;
        @media screen and (max-width: 767px) {
            font-size: 12px;
        }
    }

    div:first-child {
        letter-spacing: 0.5px;
        // display: flex;
        flex-wrap: wrap;
    }
    div:last-child {
        // display: flex;
        gap: 10px;
    }

    a {
        // color: rgba(0, 178, 255, 1);
        text-decoration: none;
        font-weight: 600;
        margin-left: -4px;
        margin-right: -4px;
    }
    @media screen and (max-width: 576px) {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 12px;
        div:first-child {
            display: block;
        }
    }
    @media screen and (max-width: 390px) {
        padding: 0.5rem 0.2rem 0.5rem 0;
        div:first-child {
            // display: inline-flex;
        }
    }
`

const WrapItem = styled.div`
    display: grid;
    padding: 1.2rem 0;
    cursor: pointer;
    opacity: 1;
    gap: 20px;
    .email{
        font-size: 18px;
        @media screen and (max-width: 767px) {
            font-size: 14px;
        }
    }
    .content-social{
         font-size: 14px;
        @media screen and (max-width: 767px) {
            font-size: 12px;
        }
    }
    .more-social{
        color: #00B2FF;
        font-size: 12px;
        text-align: right;
        padding: 0 10px;
    }
    input {
        outline: none;
        border: none;
        background: rgb(255, 255, 255);
        padding: 10px 16px;
        border-radius: 6px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.8);
        ::placeholder {
            color: #888888;
        }
    }
    .active.more-social{
        .p1{
            display: none;
        }
    }
    .inactive.more-social{
        .p2{
            display: none;
        }
    }
    .line{
        height: 1.5px;
        width: 100%;
        background: linear-gradient(90deg,rgba(0,59,92,0.140625) 0%,#004B76 51.56%,rgba(0,59,92,0) 100%);
    }
    &.active {
        opacity: 1;
    }
    @media screen and (max-width: 576px) {
        grid-template-columns: 1fr;
        ::-webkit-scrollbar {
            display: none;
        }
        // div:nth-child(4) {
        //     order: 1;
        // }
    }
    @media screen and (max-width: 375px) {
    }
`
const BtnClose = styled.img`
    height: 20px;
    cursor: pointer;

    :hover {
        background: #003b5c;
    }
`

const Item = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 8px;
    width: 100%;
    transition: all ease-in-out 0.1s;
    background: rgba(255, 255, 255, 0.1);
    padding: 10px;

    :hover {
        background: rgba(146, 129, 129, 0.13);
    }
    @media screen and (max-width: 576px) {
        /* width: 45%; */
    }
`
const ItemContent = styled.button`
    width: 100%;
    background: none;
    border: none;
    color: ${({ theme }) => theme.text1};
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-family: Inter;

    img {
        height: 42px;
        width: 42px;
        object-fit: contain;
        border-radius: 50%;
    }
    span {
        font-size: 16px;
        color: white;
    }
    @media screen and (max-width: 767px){
        img {
            height: 38px;
            width: 38px;
        }
        span {
            font-size: 14px;
        }
    }
`
export default OptionsWallet
