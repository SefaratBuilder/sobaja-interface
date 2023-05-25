import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import imgClose from 'assets/icons/icon-close.svg'
import BgWallet from 'assets/brand/bg-connect-wallet.png'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { useWeb3React } from '@web3-react/core'
import { injected, bitkeep, okex } from 'connectors/index'
import AccountDetails from 'components/AccountDetails'
import { AbstractConnector } from '@web3-react/abstract-connector'
import Loader from 'components/Loader'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { sendEvent } from 'utils/analytics'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import {
    bitkeepConnection,
    getConnections,
    injectedConnection,
    networkConnection,
    okexConnection,
} from 'components/connection'
import { Connector } from '@web3-react/types'
import { useAppDispatch } from 'states/hook'
import { updateSelectedWallet } from 'states/user/reducer'
import { Connection } from 'components/connection/types'

interface connectModalWallet {
    setToggleWalletModal: React.Dispatch<React.SetStateAction<boolean>>
}

const WALLET_VIEWS = {
    OPTIONS: 'options',
    ACCOUNT: 'account',
    PENDING: 'pending',
}

const WalletModal = ({ setToggleWalletModal }: connectModalWallet) => {
    const [isAgreePolicy, setIsAgreePolicy] = useState<boolean>(true)
    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
    const {
        // activate,
        // deactivate,
        connector,
        // error,
        account,
        chainId,
        // library,
    } = useWeb3React()
    const connections = getConnections()
    const [pendingError, setPendingError] = useState<boolean>(false)
    const [pendingWallet, setPendingWallet] = useState<Connection | undefined>()
    const dispatch = useAppDispatch()
    const [pendingNameWallet, setPendingNameWallet] = useState<
        string | undefined
    >()

    const toggleAgreement = () => {
        setIsAgreePolicy(!isAgreePolicy)
    }

    useEffect(() => {
        if (account && walletView == WALLET_VIEWS.PENDING) {
            setToggleWalletModal(false)
        }
    }, [account])

    const tryActivation = async (connector: Connection | undefined) => {
        // let name = ''
        // Object.keys(SUPPORTED_WALLETS).map((key) => {
        //     if (connector === SUPPORTED_WALLETS[key].connector) {
        //         return (name = SUPPORTED_WALLETS[key].name)
        //     }
        //     return true
        // })

        setPendingWallet(connector)
        setWalletView(WALLET_VIEWS.PENDING)
        if (connector?.type == 'ARGENT') {
            dispatch(updateSelectedWallet({ wallet: undefined }))
        } else {
            dispatch(updateSelectedWallet({ wallet: connector?.type }))
        }

        connector?.connector?.activate()

        // &&
        //     activate(connector, undefined, true).catch((error) => {
        //         if (error instanceof UnsupportedChainIdError) {
        //             activate(connector)
        //         } else {
        //             setPendingError(true)
        //         }
        //     })
    }

    const getOptions = () => {
        const isMetamask = window.ethereum && window.ethereum.isMetaMask
        return connections
            .filter((item) => item.shouldDisplay())
            .map((key) => {
                const option = key
                if (option.connector === injectedConnection.connector) {
                    // don't show injected if there's no injected provider
                    if (!(window.web3 || window.ethereum)) {
                        if (option.getName() === 'MetaMask') {
                            return (
                                <Item
                                    isChecked={isAgreePolicy}
                                    key={key + option.getName()}
                                >
                                    <ItemContent
                                        onClick={() => {
                                            isAgreePolicy &&
                                                option.href &&
                                                option.href !== null &&
                                                window.open(option.href)
                                        }}
                                    >
                                        <img src={option.getIcon?.(true)}></img>
                                        <span>Install MetaMask</span>
                                    </ItemContent>
                                </Item>
                            )
                        } else {
                            return null //dont want to return install twice
                        }
                    }
                    // don't return metamask if injected provider isn't metamask
                    else if (option.getName() === 'MetaMask' && !isMetamask) {
                        return null
                    }
                }
                if (option.connector == bitkeepConnection.connector) {
                    //don't show injected if there's no injected provider
                    if (!window.bitkeep) {
                        if (option.getName() === 'BitKeep Wallet') {
                            return (
                                <Item
                                    isChecked={isAgreePolicy}
                                    key={key + option.getName()}
                                >
                                    <ItemContent
                                        onClick={() =>
                                            isAgreePolicy &&
                                            option.href &&
                                            option.href !== null &&
                                            window.open(option.href)
                                        }
                                    >
                                        <img src={option.getIcon?.(true)}></img>
                                        <span>Install BitKeep</span>
                                    </ItemContent>
                                </Item>
                            )
                        } else {
                            return null //dont want to return install twice
                        }
                    }
                }
                if (option.connector == okexConnection.connector) {
                    //don't show injected if there's no injected provider
                    if (!window.okexchain) {
                        if (option.getName() === 'OKX Wallet') {
                            return (
                                <Item
                                    isChecked={isAgreePolicy}
                                    key={key + option.getName()}
                                >
                                    <ItemContent
                                        onClick={() =>
                                            isAgreePolicy &&
                                            option.href &&
                                            option.href !== null &&
                                            window.open(option.href)
                                        }
                                    >
                                        <img src={option.getIcon?.(true)}></img>
                                        <span>Install OKX</span>
                                    </ItemContent>
                                </Item>
                            )
                        } else {
                            return null //dont want to return install twice
                        }
                    }
                }

                return (
                    <Item
                        isChecked={isAgreePolicy}
                        key={key + option.getName()}
                    >
                        <ItemContent
                            onClick={() => {
                                // console.log('wallet =>>>>>>>>>>>>>')
                                // if (!isAgreePolicy) return
                                // if (option.connector != connector) {
                                //     console.log('wallet =>>>>>>>>>>>>>')
                                setPendingNameWallet(option.getName())
                                tryActivation(option)
                                // } else {
                                //     setWalletView(WALLET_VIEWS.ACCOUNT)
                                // }
                            }}
                        >
                            <img src={option.getIcon?.(true)}></img>
                            <span>{option.getName()}</span>
                        </ItemContent>
                    </Item>
                )
            })
    }

    const getModalContent = () => {
        if (account && walletView === WALLET_VIEWS.ACCOUNT) {
            return (
                <AccountDetails
                    setToggleWalletModal={setToggleWalletModal}
                    openOptions={() => {
                        setWalletView(WALLET_VIEWS.OPTIONS)
                    }}
                />
            )
        }
        return (
            <Container isConnected={true}>
                <Header>
                    <span>Connect a wallet</span>
                    {/* <div>
                        {' '}
                        <BtnClose
                            onClick={() => {
                                setToggleWalletModal(false)
                            }}
                            src={imgClose}
                            alt=""
                        />
                    </div> */}
                </Header>
                <WrapContent>
                    {/* <Title>
                        <div>
                            Connect wallet in one click to start using
                            Sobajaswap
                        </div>
                    </Title> */}

                    <WrapItem>{getOptions()}</WrapItem>
                    <Title>
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
                        {/* <div>
                            <input
                                type="checkbox"
                                onChange={toggleAgreement}
                                checked={isAgreePolicy}
                            />
                            <span>
                                I agree to Terms of Service and Privacy Policy.
                            </span>
                        </div> */}
                    </Title>
                </WrapContent>
                {/* <Footer>
                    <a href="#">Learn more about wallets</a>
                </Footer> */}

                {walletView == WALLET_VIEWS.PENDING ? (
                    <ContainerPending>
                        <WrapContentPending>
                            <HeaderPending>
                                <span>Connect a {pendingNameWallet}</span>
                                <div>
                                    {' '}
                                    <BtnClose
                                        onClick={() => {
                                            sendEvent({
                                                category: 'Wallet',
                                                action: 'Connect Wallet',
                                                label: pendingNameWallet,
                                            })
                                            setToggleWalletModal(false)
                                        }}
                                        src={imgClose}
                                        alt=""
                                    />
                                </div>
                            </HeaderPending>
                            <WrapContent>
                                <WrapItemPending
                                    className={`${
                                        isAgreePolicy ? 'active' : ''
                                    }`}
                                >
                                    {pendingError ? (
                                        <LoadingWrapper
                                            borderError={pendingError}
                                        >
                                            <span style={{ color: 'red' }}>
                                                Error connecting.
                                            </span>
                                            <span>
                                                <PrimaryButton
                                                    type="configbtn"
                                                    height="25px"
                                                    onClick={() =>
                                                        tryActivation(
                                                            pendingWallet,
                                                        )
                                                    }
                                                    name="Try again"
                                                />
                                            </span>
                                        </LoadingWrapper>
                                    ) : (
                                        <LoadingWrapper
                                            borderError={pendingError}
                                        >
                                            <StyledLoader />
                                            <p>Initializing...</p>
                                        </LoadingWrapper>
                                    )}
                                </WrapItemPending>
                            </WrapContent>
                        </WrapContentPending>
                    </ContainerPending>
                ) : (
                    ''
                )}
            </Container>
        )
    }

    return <>{getModalContent()}</>
}

const LoadingWrapper = styled.div<{ borderError: boolean }>`
    gap: 13px;
    align-items: center;
    justify-content: center;
    /* width: 90%; */
    display: flex;
    flex-direction: column;
    /* border: ${({ borderError }) =>
        borderError ? '1px solid red' : '1px solid #ffffff'}; */

    border-radius: 8px;
    padding: 4px 0px;
    .configbtn {
        padding: 15px;
    }
`
const StyledLoader = styled(Loader)`
    margin-right: 1rem;
`
const WrapContentPending = styled.div`
    width: 70%;
    border-radius: 20px;
    background: var(--bg5);
    border: 1px solid #003b5c;
    opacity: 1;
`
const ContainerPending = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Container = styled.div<{ isConnected: boolean }>`
    position: fixed;
    background: url(${BgWallet});
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 1;
    // border-radius: 12px;
    border: 1px solid #003b5c;
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    overflow: auto;
    max-width: 420px;
    width: 100%;
    // left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
    height: 100vh;
    margin: auto;
    animation: fadeIn 0.3s linear;
    z-index: 999999;
    opacity: ${({ isConnected }) => (isConnected ? 1 : 0)};
    scale: ${({ isConnected }) => (isConnected ? 1 : 0.95)};
    color: ${({ theme }) => theme.text1};
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

const BtnClose = styled.img`
    height: 20px;
    cursor: pointer;

    :hover {
        background: #003b5c;
    }
`

const HeaderPending = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.5rem 0;
    align-items: center;
    span {
        cursor: pointer;
        color: ${({ theme }) => theme.text1};
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 39px;
    }
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.5rem 0;
    /* border-bottom: 1px solid rgba(157, 195, 230, 0.5); */

    span {
        cursor: pointer;
        color: ${({ theme }) => theme.text1};
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 39px;
    }
    ::before {
        content: '';
        position: absolute;
        right: -10px;
        width: 50%;
        height: 35px;
        top: -62px;
    }
    @media screen and (max-width: 390px) {
        padding: 0.5rem 1rem;
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
const WrapItemPending = styled.div`
    /* display: grid;
    grid-template-columns: 1fr 1fr; */
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    padding: 1.2rem 0;
    cursor: pointer;
    opacity: 1;
    gap: 20px;
    &.active {
        opacity: 1;
    }
    @media screen and (max-width: 576px) {
        padding: 1rem;

        div:nth-child(4) {
            order: 1;
        }
    }
    @media screen and (max-width: 375px) {
    }
`
const WrapItem = styled.div`
    display: grid;
    // grid-template-columns: 1fr 1fr;
    /* align-items: center; */
    /* justify-content: space-evenly; */
    /* flex-wrap: wrap; */
    padding: 1.2rem 0;
    cursor: pointer;
    opacity: 1;
    gap: 20px;
    &.active {
        opacity: 1;
    }
    @media screen and (max-width: 576px) {
        padding: 1rem;
        grid-template-columns: 1fr;
        // max-height: 300px;
        // overflow: auto;

        ::-webkit-scrollbar {
            display: none;
        }
        div:nth-child(4) {
            order: 1;
        }
    }
    @media screen and (max-width: 375px) {
    }
`
const Item = styled.div<{ isChecked: boolean }>`
    /* width: 30%; */
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 8px;
    width: 100%;
    /* height: 100px; */
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
        height: 50px;
        width: 50px;
        object-fit: contain;
        border-radius: 50%;
    }
    span {
        font-size: 18px;
        color: white;
    }
`
const Footer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 355px;
    padding: 1rem 1.5rem;
    gap: 10px;
    border-top: 1px solid ${({ theme }) => theme.bd2};

    &.isLogged {
        padding: 0;
        gap: 0;
    }

    a {
        text-align: center;
        text-decoration: none;
        color: ${({ theme }) => theme.text1};
        /* cursor: pointer; */
        pointer-events: none;
    }
    @media screen and (max-width: 576px) {
        flex-direction: column;
        align-items: center;
        font-size: var(--font-size-sub);
    }
    @media screen and (max-width: 390px) {
        padding: 0.7rem 1.5rem;
    }
`

export default WalletModal
