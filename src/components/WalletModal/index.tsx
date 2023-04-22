import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import imgClose from 'assets/icons/icon-close.svg'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { injected, binance } from 'connectors/index'
import AccountDetails from 'components/AccountDetails'
import { AbstractConnector } from '@web3-react/abstract-connector'
import Loader from 'components/Loader'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { sendEvent } from 'utils/analytics'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
interface connectModalWallet {
    setToggleWalletModal: React.Dispatch<React.SetStateAction<boolean>>
}

const WALLET_VIEWS = {
    OPTIONS: 'options',
    ACCOUNT: 'account',
    PENDING: 'pending',
}

const WalletModal = ({ setToggleWalletModal }: connectModalWallet) => {
    const [isAgreePolicy, setIsAgreePolicy] = useState<boolean>(false)
    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
    const { activate, deactivate, connector, error, account } = useWeb3React()
    const [pendingError, setPendingError] = useState<boolean>(false)
    const [pendingWallet, setPendingWallet] = useState<
        AbstractConnector | undefined
    >()
    const [pendingNameWallet, setPendingNameWallet] = useState<
        string | undefined
    >()
    const modalRef = useRef()

    useOnClickOutside(modalRef, () => setToggleWalletModal(false))

    const toggleAgreement = () => {
        setIsAgreePolicy(!isAgreePolicy)
    }

    useEffect(() => {
        if (account && walletView == WALLET_VIEWS.PENDING) {
            setToggleWalletModal(false)
        }
    }, [account])

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        let name = ''
        Object.keys(SUPPORTED_WALLETS).map((key) => {
            if (connector === SUPPORTED_WALLETS[key].connector) {
                return (name = SUPPORTED_WALLETS[key].name)
            }
            return true
        })
        setPendingWallet(connector)
        setWalletView(WALLET_VIEWS.PENDING)
        connector &&
            activate(connector, undefined, true).catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                    activate(connector)
                } else {
                    setPendingError(true)
                }
            })
    }

    const getOptions = () => {
        const isMetamask = window.ethereum && window.ethereum.isMetaMask
        return Object.keys(SUPPORTED_WALLETS).map((key) => {
            const option = SUPPORTED_WALLETS[key]
            if (option.connector === injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                    if (option.name === 'MetaMask') {
                        return (
                            <Item
                                isChecked={isAgreePolicy}
                                key={key + option.name}
                            >
                                <ItemContent
                                    onClick={() =>
                                        option.href &&
                                        option.href !== null &&
                                        window.open(option.href)
                                    }
                                >
                                    <img src={option.iconURL}></img>
                                    <span>Install Metamask</span>
                                </ItemContent>
                            </Item>
                        )
                    } else {
                        return null //dont want to return install twice
                    }
                }
                // don't return metamask if injected provider isn't metamask
                else if (option.name === 'MetaMask' && !isMetamask) {
                    return null
                }
            }
            if (option.connector == binance) {
                //don't show injected if there's no injected provider
                if (!window.BinanceChain) {
                    if (option.name === 'Binance Chain Wallet') {
                        return (
                            <Item
                                isChecked={isAgreePolicy}
                                key={key + option.name}
                            >
                                <ItemContent
                                    onClick={() =>
                                        option.href &&
                                        option.href !== null &&
                                        window.open(option.href)
                                    }
                                >
                                    <img src={option.iconURL}></img>
                                    <span>Install Binance</span>
                                </ItemContent>
                            </Item>
                        )
                    } else {
                        return null //dont want to return install twice
                    }
                }
            }
            return (
                <Item isChecked={isAgreePolicy} key={key + option.name}>
                    <ItemContent
                        onClick={() => {
                            if (!isAgreePolicy) return
                            if (option.connector != connector) {
                                setPendingNameWallet(option.name)
                                tryActivation(option.connector)
                            } else {
                                setWalletView(WALLET_VIEWS.ACCOUNT)
                            }
                        }}
                    >
                        <img src={option.iconURL}></img>
                        <span>{option.name}</span>
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
            <Container isConnected={true} ref={modalRef}>
                <Header>
                    <span>Connect a wallet</span>
                    <div>
                        {' '}
                        <BtnClose
                            onClick={() => {
                                setToggleWalletModal(false)
                            }}
                            src={imgClose}
                            alt=""
                        />
                    </div>
                </Header>
                <WrapContent>
                    <Title>
                        <div>
                            By connecting a wallet, you agree to&nbsp;
                            <b>Sobajaswap</b>&nbsp;
                            <a href="#" target="_blank" rel="noreferrer">
                                Terms of Service
                            </a>
                            &nbsp;and&nbsp;
                            <a href="#" target="_blank" rel="noreferrer">
                                Privacy Policy.
                            </a>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                onChange={toggleAgreement}
                                checked={isAgreePolicy}
                            />
                            <span>
                                I agree to Terms of Service and Privacy Policy.
                            </span>
                        </div>
                    </Title>
                    <WrapItem className={`${isAgreePolicy ? 'active' : ''}`}>
                        {getOptions()}
                    </WrapItem>
                </WrapContent>
                <Footer>
                    <a href="#">Learn more about wallets</a>
                </Footer>

                {walletView == WALLET_VIEWS.PENDING ? (
                    <ContainerPending>
                        <WrapContentPending>
                            <Header>
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
                            </Header>
                            <WrapContent>
                                <WrapItem
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
                                </WrapItem>
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
    gap: 2px;
    align-items: center;
    justify-content: center;
    width: 90%;
    display: flex;
    /* border: ${({ borderError }) =>
        borderError ? '1px solid red' : '1px solid #ffffff'}; */

    border-radius: 8px;
    padding: 4px 0px;
    .configbtn {
        padding: 0px 5px;
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

const Container = styled.div<{ isConnected: boolean, ref: any }>`
    position: fixed;
    transition: all 10s ease-in-out 10s;
    background: var(--bg5);
    opacity: 0.6;
    border-radius: 12px;
    border: 1px solid #003b5c;
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    overflow: hidden;
    max-width: 500px;
    width: 100%;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
    height: 480px;
    margin: auto;
    transition: all 0.1s ease-in-out;
    z-index: 999999;
    opacity: ${({ isConnected }) => (isConnected ? 1 : 0)};
    scale: ${({ isConnected }) => (isConnected ? 1 : 0.95)};
    color: ${({ theme }) => theme.text1};
    @media screen and (max-width: 1100px) {
        width: 90%;
    }
`

const BtnClose = styled.img`
    height: 20px;
    cursor: pointer;

    :hover {
        background: #003b5c;
    }
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(157, 195, 230, 0.5);

    span {
        cursor: pointer;
        color: ${({ theme }) => theme.text1};
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
    padding: 0.5rem 1.5rem 1rem;

    @media screen and (max-width: 390px) {
        padding: 0.5rem 1rem;
    }
`
const Title = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    color: ${({ theme }) => theme.text1};

    div:first-child {
        font-style: italic;
        letter-spacing: 0.5px;
        display: flex;
        flex-wrap: wrap;
    }
    div:last-child {
        display: flex;
        gap: 10px;
    }

    a {
        color: #fff;
        text-decoration: none;
        font-weight: 600;
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
            display: inline-flex;
        }
    }
`
const WrapItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    padding: 2rem 0;
    cursor: pointer;
    opacity: 0.3;
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
const Item = styled.div<{ isChecked: boolean }>`
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    width: 100px;
    height: 100px;
    transition: all ease-in-out 0.1s;

    :hover {
        background: rgba(146, 129, 129, 0.13);
    }
    @media screen and (max-width: 576px) {
        width: 45%;
    }
`
const ItemContent = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.text1};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    img {
        height: 50px;
        width: 50px;
        object-fit: contain;
    }
    span {
        font-size: 11.5px;
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
