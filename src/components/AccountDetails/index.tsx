import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { computeGasLimit, shortenAddress } from 'utils'
import { NavLink } from 'react-router-dom'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import imgCheckMark from 'assets/icons/check-mark.svg'
import imgPower from 'assets/icons/power.svg'
import imgCopy from 'assets/icons/copy.svg'
import imgDownArrow from 'assets/icons/arrow-down.svg'
import imgPlusWallet from 'assets/icons/plus-wallet.svg'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useETHBalances } from 'hooks/useCurrencyBalance'
import iconSetting from 'assets/icons/setting.svg'
import { NATIVE_COIN } from 'constants/index'
import { useWeb3AuthContext } from 'contexts/SocialLoginContext'
import { useSmartAccountContext } from 'contexts/SmartAccountContext'
import { Row } from 'components/Layouts'
import { mulNumberWithDecimal } from 'utils/math'
import DepositModal from './DepositModal'
import SendModal from './SendModal'

interface connectModalWallet {
    setToggleWalletModal: React.Dispatch<React.SetStateAction<boolean>>
    openOptions: React.Dispatch<React.SetStateAction<void>>
}
const AccountDetails = ({
    setToggleWalletModal,
    openOptions,
}: connectModalWallet) => {
    const { account, chainId, library } = useActiveWeb3React()
    const [isCopied, setIsCopied] = useState<boolean>(false)
    const { connect, disconnect, web3Provider } = useWeb3AuthContext()
    const { wallet, state, loading } = useSmartAccountContext()
    const balance = useETHBalances([wallet?.address || account])?.[wallet?.address || account || '']

    const handleCopyAddress = () => {
        if (wallet?.address) {
            navigator.clipboard.writeText(wallet.address).then(() => {
                setIsCopied(true)
                setTimeout(() => {
                    setIsCopied(false)
                }, 1000)
            })
            return
        }
        if (account) {
            navigator.clipboard.writeText(account.toString()).then(() => {
                setIsCopied(true)
                setTimeout(() => {
                    setIsCopied(false)
                }, 1000)
            })
        }
    }

    const handleOnConnectSmartAccount = async () => {
        try {
            connect()
        }
        catch(err) {
            console.log('failed to connect to smart account: ', err)
        }
    }

    return (
        <WrapConnectModal isConnected={true}>
            <Header>
                <Row jus="space-between">
                    <Row al="center" gap="10px">
                        <WrapAccountInfo>
                            <ImgAccount src="https://picsum.photos/50/50" />
                            <IdAccount>{wallet?.address && shortenAddress(wallet.address) || account && shortenAddress(account)}</IdAccount>
                        </WrapAccountInfo>
                        {
                            wallet && <AAMarker>Smart account</AAMarker>
                        }
                    </Row>
                    <WrapBtnHeader>
                        {isCopied ? (
                            <CopyBtn>
                                <CopyAccountAddress src={imgCheckMark} />
                                <Tooltip className="tooltip">Copied</Tooltip>
                            </CopyBtn>
                        ) : (
                            <CopyBtn>
                                <CopyAccountAddress
                                    onClick={handleCopyAddress}
                                    src={imgCopy}
                                />
                                <Tooltip className="tooltip">
                                    Click to copy address
                                </Tooltip>
                            </CopyBtn>
                        )}

                        {/* <button onClick={() => openOptions()}>
                            <img src={iconSetting} alt="#" />
                        </button> */}
                        <button
                            onClick={() => {
                                if(wallet?.address) {
                                    disconnect()
                                } else {
                                    openOptions()
                                }
                            }}
                        >
                            <img src={imgPower} alt="#" />
                        </button>
                    </WrapBtnHeader>
                </Row>
            </Header>
            <WrapContent>
                <NameBalance>
                    {(chainId && NATIVE_COIN[chainId].symbol) || 'ETH'} Balance
                </NameBalance>
                <Balance className={'to'}>
                    {balance ? balance.toString() : 0}
                </Balance>
                <Balance>
                    {(chainId && NATIVE_COIN[chainId].symbol) || 'ETH'}
                </Balance>
                <WrapButton>
                    {
                        !wallet && 
                        <>
                            <PrimaryButton
                                name={loading ? "Connecting" : "Use smart account"}
                                onClick={handleOnConnectSmartAccount}
                                isLoading={loading}
                            />
                        </>
                    }
                    {
                        wallet &&
                        <>
                            <DepositModal />
                            <SendModal />
                        </>
                    }
                </WrapButton>
            </WrapContent>
            <Footer className="isLogged">
                <WrapFooterBtn>
                    <WrapItemFooter
                    //  onClick={() => setShowTrans(!showTrans)}
                    >
                        <p>Transactions</p>
                        <WrapFooterImg>
                            <p></p>
                            <img src={imgDownArrow} alt="" />
                        </WrapFooterImg>
                    </WrapItemFooter>
                    <WrapModalTransaction
                        showTrans={false}
                        // showTrans={showTrans}
                    >
                        {/* <p>
                            {transactions && transactions.length > 0
                                ? 'Your recent transactions:'
                                : 'You have no transactions'}
                        </p> */}
                        {/* {transactions?.map((i) => {
                            return (
                                <RowTransaction
                                    onClick={() =>
                                        openExplorerByHash(
                                            i.hash,
                                            network?.name,
                                        )
                                    }
                                >
                                    <p>{i.method}</p>
                                    <div>
                                        <p>{i.date}</p>
                                        <p>{i.time}</p>
                                    </div>
                                </RowTransaction>
                            )
                        })} */}
                    </WrapModalTransaction>
                    <WrapItemFooter className="fade">
                        <p>Language</p>
                        <WrapFooterImg>
                            <p>EN</p>
                            <img src={imgDownArrow} alt="" />
                        </WrapFooterImg>
                    </WrapItemFooter>
                </WrapFooterBtn>
            </Footer>
        </WrapConnectModal>
    )
}

const AAMarker = styled.div`
    padding: 4px;
    border: 1px solid #14e986;
    color: #14e986;
    border-radius: 4px;
    font-size: 10px;
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

    > img {
        transform: rotate(270deg);
    }
`
const NameBalance = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #d9d9d9;
    text-align: center;
`
const Balance = styled.div`
    font-weight: 600;
    font-size: 32px;
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
        cursor: pointer;
    }
`
const WrapFooterBtn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 5px 0px;
`
const Container = styled.div<{ isConnected: boolean }>`
    position: fixed;
    background: linear-gradient(180deg, #002033 0%, rgba(0, 38, 60, 0.8) 100%);
    border-radius: 10px;
    border: 1px solid #003b5c;
    backdrop-filter: blur(40px);
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
    z-index: 10;
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
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #918f8f;

    span {
        cursor: pointer;
        color: ${({ theme }) => theme.text1};
    }
    /* ::before {
        content: '';
        position: absolute;
        right: -10px;
        width: 50%;
        height: 35px;
        top: -62px;
    } */
    @media screen and (max-width: 390px) {
        padding: 0.5rem 1rem;
    }
`
const WrapContent = styled.div`
    padding: 0.5rem 1.5rem 1rem;

    > div {
        margin: 10px 0px;
    }
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

const Footer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 355px;
    padding: 1rem 1.5rem;
    gap: 10px;
    border-top: 1px solid #918f8f;

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
    width: 20px;
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
    right: 20px;
    top: 90px;
    transform: unset;
    margin: unset;
    overflow: unset;

    @media screen and (max-width: 1100px) {
        right: 10px;
        top: unset;
        bottom: 60px;
    }
    @media screen and (max-width: 391px) {
        width: 90%;
        margin: auto;
        right: 10px;
        max-width: 300px;
    }
`

export default AccountDetails
