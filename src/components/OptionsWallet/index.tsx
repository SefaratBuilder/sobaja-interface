import React from 'react'
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

    const handleConnect = () => {
        web3AuthConnect(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: 'sms_passwordless',
            extraLoginOptions: {
                login_hint: '+84-377704631'
            }
        })
    }

    return (
        <Container>
            <Header>
                <span>Connect a wallet</span>
                <div>
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
                <WrapItem>{getOptions()}</WrapItem>
                <WrapItem>
                    <PrimaryButton name='Social Login' onClick={handleConnect} />
                </WrapItem>
                <Title>
                    <div>
                        By connecting a wallet, you agree to Sobajaswap &nbsp;
                        <a href="#" target="_blank" rel="noreferrer">
                            Terms of Service &nbsp;
                        </a>
                        and
                        <a href="#" target="_blank" rel="noreferrer">
                            &nbsp; Privacy Policy.
                        </a>
                    </div>
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
const StyledLoader = styled(Loader)`
    margin-right: 1rem;
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

const WrapItem = styled.div`
    display: grid;
    padding: 1.2rem 0;
    cursor: pointer;
    opacity: 1;
    gap: 20px;
    &.active {
        opacity: 1;
    }
    @media screen and (max-width: 576px) {
        grid-template-columns: 1fr;
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
export default OptionsWallet
