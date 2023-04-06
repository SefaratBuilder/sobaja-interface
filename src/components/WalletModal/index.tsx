import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import imgClose from 'assets/icons/icon-close.svg'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { injected, binance } from 'components/Connectors/index'
import AccountDetails from 'components/AccountDetails'
import { AbstractConnector } from '@web3-react/abstract-connector'
import Loader from 'components/Loader'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
interface connectModalWallet {
    setToggleWalletModal: React.Dispatch<React.SetStateAction<boolean>>
}

const WALLET_VIEWS = {
    OPTIONS: 'options',
    ACCOUNT: 'account',
    PENDING: 'pending',
}

const WalletModal = ({ setToggleWalletModal }: connectModalWallet) => {
    const ref = useRef<any>(false)
    const [isAgreePolicy, setIsAgreePolicy] = useState<boolean>(false)
    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
    useOnClickOutside(ref, () => {
        setToggleWalletModal(false)
    })
    const { activate, deactivate, connector, error, account } = useWeb3React()
    const [pendingError, setPendingError] = useState<boolean>(false)
    const [pendingWallet, setPendingWallet] = useState<
        AbstractConnector | undefined
    >()
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

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        let name = ''
        Object.keys(SUPPORTED_WALLETS).map((key) => {
            if (connector === SUPPORTED_WALLETS[key].connector) {
                return (name = SUPPORTED_WALLETS[key].name)
            }
            return true
        })
        // log selected wallet
        // ReactGA.event({
        // 	category: "Wallet",
        // 	action: "Change Wallet",
        // 	label: name,
        // });
        setPendingWallet(connector) // set wallet for pending view
        setWalletView(WALLET_VIEWS.PENDING)

        // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
        // if (connector instanceof WalletConnectConnector) {
        //     connector.walletConnectProvider = undefined
        // }
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
            console.log('option.connector', option.connector)
            if (option.connector === injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                    if (option.name === 'MetaMask') {
                        return (
                            <Item
                                isChecked={true}
                                // id={`connect-${key}`}
                                key={key}
                                // color={'#E8831D'}

                                // header={<Trans>Install Metamask</Trans>}
                                // subheader={null}
                                // link={'https://metamask.io/'}
                                // icon={MetamaskIcon}
                            >
                                {' '}
                                Install Metamask
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
                                isChecked={true}
                                // id={`connect-${key}`}
                                key={key}
                                // color={'#E8831D'}

                                // header={<Trans>Install Metamask</Trans>}
                                // subheader={null}
                                // link={'https://metamask.io/'}
                                // icon={MetamaskIcon}
                            >
                                {' '}
                                Install Metamask
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
                    // pendingTransactions={pendingTransactions}
                    // confirmedTransactions={confirmedTransactions}
                    // ENSName={ENSName}
                    openOptions={() => {
                        // deactivate()
                        setWalletView(WALLET_VIEWS.OPTIONS)
                    }}
                />
            )
        }
        return (
            <Container isConnected={true} ref={ref}>
                <Header>
                    <span>Connect a wallet</span>
                    <div>
                        {' '}
                        <BtnClose
                            onClick={() => setToggleWalletModal(false)}
                            src={imgClose}
                            alt=""
                        />
                    </div>
                </Header>
                <WrapContent>
                    <Title>
                        <div>
                            By connecting a wallet, you agree to&nbsp;
                            <b>SobajaSwap</b>&nbsp;
                            <a
                                href="https://forbitswap.com/terms-of-service.pdf"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Terms of Service
                            </a>
                            &nbsp;and&nbsp;
                            <a
                                href="https://forbitswap.com/privacy-policy.pdf"
                                target="_blank"
                                rel="noreferrer"
                            >
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
                                <span>
                                    Connect a {pendingNameWallet} wallet
                                </span>
                                <div>
                                    {' '}
                                    <BtnClose
                                        onClick={() =>
                                            setToggleWalletModal(false)
                                        }
                                        src={imgClose}
                                        alt=""
                                    />
                                </div>
                            </Header>
                            <WrapContent>
                                <Title></Title>
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
    background: linear-gradient(180deg, #002033 0%, rgba(0, 38, 60, 0.8) 100%);
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

const WrapModalTransaction = styled.div<{ showTrans: boolean }>`
    overflow: hidden scroll;
    transition: all 0.3s linear;
    height: ${({ showTrans }) => (showTrans ? '115px' : '0')};
    p {
        text-align: center;
    }
`
const WrapItemFooter = styled.div`
    padding: 0.45rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    &.fade {
        cursor: no-drop;
        opacity: 0.7;
    }
    img {
        height: 12px;
        width: 12px;
    }
    :last-child {
        margin-bottom: 0.4rem;
    }
`
const WrapFooterImg = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
`
const NameBalance = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #d9d9d9;
    text-align: center;
`
const Name = styled.div`
    font-weight: 600;
    font-size: 36px;
    line-height: 44px;
    text-align: center;
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
    border-radius: 6px;
    background: rgba(157, 195, 230, 0.1);
    backdrop-filter: blur(3px);
`
const WrapBtnHeader = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    img {
        height: 17px;
        width: 17px;
    }
    button {
        background: none;
        border: none;
    }
`
const WrapFooterBtn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`
const Container = styled.div<{ isConnected: boolean }>`
    position: fixed;
    background: linear-gradient(180deg, #002033 0%, rgba(0, 38, 60, 0.8) 100%);
    opacity: 0.6;
    border-radius: 20px;
    border: 1px solid #003b5c;
    /* backdrop-filter: blur(40px); */
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    overflow: hidden;
    max-width: 500px;
    width: 100%;
    left: 0;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    margin: auto;
    transition: all 0.1s ease-in-out;
    z-index: ${({ isConnected }) => (isConnected ? 3 : -1)};
    opacity: ${({ isConnected }) => (isConnected ? 1 : 0)};
    scale: ${({ isConnected }) => (isConnected ? 1 : 0.95)};
    color: ${({ theme }) => theme.text1};

    @media screen and (max-width: 576px) {
        max-width: 410px;
    }
    @media screen and (max-width: 390px) {
        max-width: 365px;
    }
`
const WrapBlur = styled.div`
    div {
        opacity: 0;
        z-index: -1;
    }
    &.active {
        div {
            opacity: 1;
            z-index: 2;
        }
    }
`
const BtnClose = styled.img`
    height: 20px;
    cursor: pointer;
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
    flex-wrap: wrap-reverse;
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
        background: ${({ isChecked, theme }) => (isChecked ? theme.hv0 : '')};
    }
    @media screen and (max-width: 576px) {
        width: 45%;
    }
`
const ItemContent = styled.button`
    font-family: 'Montserrat', sans-serif !important;
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

const WrapButton = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    cursor: no-drop;

    a {
        pointer-events: none;
    }

    @media screen and (max-width: 390px) {
        gap: 0px;
        button:first-child {
            margin-right: 5px;
        }
    }
    a {
        text-decoration: none;
        button {
            gap: 5px;
            img {
                height: 25px;
                width: 25px;
            }
        }
    }
`
const WrapAccountInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`
const ImgAccount = styled.img`
    height: 20px;
    border-radius: 50%;
`
const IdAccount = styled.div``
const CopyAccountAddress = styled.img`
    height: 12px;
    cursor: pointer;
`

const RowTransaction = styled.div`
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1.5rem 0.2rem 1.5rem;

    &:hover {
        background-color: #9dc3e699;
        cursor: pointer;
        border-bottom: 1px solid rgba(157, 195, 230, 0.6);
    }

    div {
        text-align: end;
    }

    @media screen and (max-width: 576px) {
        width: 100%;
    }
`

const WrapConnectModal = styled(Container)`
    max-width: 350px;
    left: unset;
    right: 90px;
    top: unset;
    transform: unset;
    margin: unset;
    overflow: unset;
    @media screen and (max-width: 1200px) {
        right: 70px;
    }
    @media screen and (max-width: 576px) {
        left: 50%;
        right: unset;
        top: unset;
        bottom: unset;
        transform: translateX(-50%);
    }
`

export default WalletModal
