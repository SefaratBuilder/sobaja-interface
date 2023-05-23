import React, { useEffect, useMemo, useRef, useState } from 'react'
import PrimaryButton, { Button } from 'components/Buttons/PrimaryButton'
import styled from 'styled-components'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import imgClose from 'assets/icons/icon-close.svg'
import tokenList from 'constants/jsons/tokenList.json'
import { useFaucetContract } from 'hooks/useContract'
import usdt from 'assets/icons/usdt.jpeg'
import ETH from 'assets/token-logos/eth.svg'
import { OpacityModal } from 'components/Web3Status'
import { useActiveWeb3React } from 'hooks'
import { Error } from 'components/Text'
import { Row } from 'components/Layouts'
import { sendEvent } from 'utils/analytics'
import Blur from 'components/Blur'
import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import { URLSCAN_BY_CHAINID, ZERO_ADDRESS } from 'constants/index'
import { useTransactionHandler } from 'states/transactions/hooks'
import axios from 'axios'
import { FaucetTokens } from 'constants/addresses'
import { ChainId } from 'interfaces'
import BGSoba from 'assets/icons/soba2.jpg'
import Twitter from 'assets/icons/twitter.svg'
import Discord from 'assets/icons/discord.svg'
import CloseButton from 'assets/icons/icon-close.svg'

const Faucet = () => {
    const [isDislayFaucet, setIsDisplayFaucet] = useState<boolean>(false)
    const [isFaucetETH, setIsFaucetETH] = useState<boolean>(false)
    // const [indexFaucetETH, setIndexFaucetETH] = useState(0)
    const ref = useRef<any>()
    const faucetContract = useFaucetContract()
    const { account, chainId, provider } = useActiveWeb3React()
    const initDataTransaction = InitCompTransaction()
    const { addTxn } = useTransactionHandler()

    const [currentStep, setCurrentStep] = useState(2)
    const listFaucetETH = [
        { name: 'Goerli', chainId: ChainId.GOERLI },
        { name: 'zkSync Era', chainId: ChainId.ZKTESTNET },
    ]
    const listSocials = [
        { name: 'Twitter', details: 'Follow & Tweet', img: Twitter },
        { name: 'Discord', details: 'Join Discord', img: Discord },
    ]

    const isDisable = useMemo(
        () =>
            (chainId &&
                chainId !== ChainId.ZKTESTNET &&
                chainId !== ChainId.GOERLI) ||
            false,
        [chainId],
    )

    useOnClickOutside(ref, () => {
        setIsDisplayFaucet(false)
    })

    useEffect(() => {
        initDataTransaction.setError('')
        initDataTransaction.setIsOpenResultModal(false)
    }, [isDislayFaucet])

    const listFaucet = useMemo(() => {
        return chainId &&
            FaucetTokens?.[chainId] &&
            FaucetTokens?.[chainId].length > 0
            ? FaucetTokens?.[chainId].map((i) => i.symbol)
            : []
    }, [tokenList, chainId])

    const handleFaucetETH = async () => {
        setIsDisplayFaucet(false)

        try {
            if (!chainId) return
            console.log('Faucet....')
            initDataTransaction.setIsOpenWaitingModal(true)
            const dataFaucet = await axios({
                method: 'GET',
                // url: 'http://localhost:3000/api/faucet',
                url: 'https://sobajaswap.com/api/faucet',
                params: {
                    to: account,
                    chainId,
                },
            })
            if (dataFaucet.status === 200) {
                const { hash } = dataFaucet.data
                console.log(dataFaucet.data)
                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)
                const wait = await provider?.waitForTransaction(hash)
                console.log({ wait })
                initDataTransaction.setIsOpenResultModal(false)

                addTxn({
                    hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                        hash || ''
                    }`,
                    msg: 'Faucet',
                    status: wait?.status === 1 ? true : false,
                })
            } else {
                initDataTransaction.setError(dataFaucet.data?.error || 'Failed')
                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)
            }
        } catch (error: any) {
            console.log({ error })
            initDataTransaction.setError(error?.response?.data || 'Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
        }
    }

    const clickFaucetToken = async (erc20: string) => {
        try {
            if (faucetContract == null) return
            setIsDisplayFaucet(false)
            initDataTransaction.setIsOpenWaitingModal(true)

            const tx = await faucetContract?.requestTokens(erc20)

            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
            const result = await tx.wait()

            initDataTransaction.setIsOpenResultModal(false)

            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                    result.hash || ''
                }`,
                msg: 'Faucet',
                status: result.status === 1 ? true : false,
            })
            sendEvent({
                category: 'Defi',
                action: 'Faucet',
                label: erc20,
            })
            setIsDisplayFaucet(false)
        } catch (err) {
            console.log('Failed to approve token: ', err)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
        }
    }

    const showMintCoins = () => {
        if (chainId && FaucetTokens?.[chainId].length > 0) {
            return FaucetTokens?.[chainId].map((item, index) => {
                return (
                    <PrimaryButton
                        key={index}
                        name={item.symbol}
                        onClick={() =>
                            item.address === ZERO_ADDRESS
                                ? setIsFaucetETH(true)
                                : clickFaucetToken(item.address)
                        }
                        disabled={isDisable}
                        img={item.symbol == 'USDT' ? usdt : item.logoURI}
                        type={'faucet'}
                    />
                )
            })
        }
    }

    return (
        <>
            {(chainId === ChainId.GOERLI || chainId === ChainId.ZKTESTNET) && (
                <BtnFaucet onClick={() => setIsDisplayFaucet(!isDislayFaucet)}>
                    Faucet
                </BtnFaucet>
            )}
            <ComponentsTransaction
                data={initDataTransaction}
                onConfirm={() => {}}
            />
            {isDislayFaucet ? (
                <FaucetModalDiv>
                    <ContainerFaucetModal
                        isDislayFaucet={isDislayFaucet}
                        ref={ref}
                    >
                        <TitleModalFaucet>
                            <div>Faucet token</div>
                            <BtnClose
                                onClick={() => setIsDisplayFaucet(false)}
                                src={imgClose}
                            />
                        </TitleModalFaucet>
                        <BodyModalFaucet>
                            <ContentFaucet>
                                <TextCoin>
                                    Get {listFaucet} for testing zkSync Testnet
                                    on Sobajaswap, test token can nullify the
                                    reality of Mainnet.
                                </TextCoin>
                            </ContentFaucet>
                            <CoinButton>
                                {showMintCoins()}
                                {/* {chainId !== 280 && (
                                    <Row>
                                        <Error fontSize="14px">
                                            Wrong network! Please switch to
                                            zkSync Goerli network to faucet
                                            tokens.
                                        </Error>
                                    </Row>
                                )} */}
                            </CoinButton>
                        </BodyModalFaucet>
                    </ContainerFaucetModal>
                </FaucetModalDiv>
            ) : (
                ''
            )}
            {isDislayFaucet || isFaucetETH ? <Blur /> : ''}

            {isFaucetETH && (
                <DetailFaucetETH image={BGSoba}>
                    <div
                        className="close-button"
                        onClick={() => setIsFaucetETH(false)}
                    >
                        <img src={CloseButton} alt="close-x" />
                    </div>
                    <SelectNetwork>
                        {listFaucetETH.map((list, index) => {
                            return (
                                <div
                                    className={`${
                                        chainId === list.chainId
                                            ? 'active cursor'
                                            : 'cursor'
                                    }`}
                                    // onClick={() => setIndexFaucetETH(index)}
                                >
                                    <p>{list.name}</p>
                                </div>
                            )
                        })}
                    </SelectNetwork>
                    <p className="details">
                        Fast and reliable. 0.05 Goerli ETH/day.
                    </p>
                    <SelectSocials>
                        {listSocials.map((social, index) => {
                            return (
                                <span
                                    className={
                                        index === currentStep
                                            ? 'active-step'
                                            : ''
                                    }
                                >
                                    <div className="cursor">
                                        <img src={social.img} alt="" />
                                    </div>
                                    <p className="cursor">{social.details}</p>
                                </span>
                            )
                        })}
                    </SelectSocials>
                    <LabelAddress>
                        <span>
                            <p>Get ETH</p>
                        </span>
                        <span>{account}</span>
                    </LabelAddress>
                    <LabelButton>
                        <PrimaryButton
                            name="Faucet"
                            onClick={() => handleFaucetETH()}
                        />
                    </LabelButton>
                </DetailFaucetETH>
            )}
        </>
    )
}

const LabelButton = styled.div`
    width: 35%;
    margin: 0 auto;
`

const LabelAddress = styled.div`
    width: 90%;
    display: flex;
    background: rgba(0, 178, 255, 0.3);
    border-radius: 6px;
    margin: 35px auto;

    span {
        padding: 11px;
        overflow: hidden;
    }
    span:nth-child(1) {
        background: #00b2ff;
        border-radius: 6px 0px 0px 6px;
        padding: 11px 16px;
        min-width: 96px;
    }
`

const SelectSocials = styled.div`
    display: flex;
    width: 70%;
    margin: 0 auto;
    gap: 10px;
    text-align: center;

    span {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    div {
        width: 50px;
        height: 50px;
    }
    img {
        width: 100%;
        height: 100%;
    }
    .active-step {
        border: 1px solid #22c2a4;
        padding: 5px;
    }
`

const SelectNetwork = styled.div`
    display: flex;
    background: rgba(0, 178, 255, 0.3);
    border-radius: 12px;
    width: 50%;
    margin: 0 auto;
    /* justify-content: space-between; */
    /* gap: 10px; */
    p {
        font-size: 20px;
        font-weight: 600;
        /* margin: auto; */
        text-align: center;
    }
    div {
        min-width: 50%;
        padding: 10px 0;
        /* padding: 10px 20px; */
    }

    .active {
        background: #00b2ff;
        border-radius: 12px;
    }

    @media screen and (max-width: 572px) {
        p {
            font-size: 16px;
        }
    }
`

const DetailFaucetETH = styled.div<{ image: string }>`
    position: fixed;
    /* padding: 38px 0; */

    /* height: 100%; */
    /* width: 100%; */
    width: 100%;
    max-width: 600px;
    height: 100%;
    max-height: 420px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 999;

    border: 1px solid rgba(0, 59, 92, 1);
    background: url(${({ image }) => image});
    background-size: 750px;
    background-repeat: no-repeat;
    background-position: top;
    border-radius: 12px;

    .close-button {
        text-align: end;
        padding: 10px 20px 0;

        img {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
    }
    .details {
        padding: 20px 0 45px;
        text-align: center;
    }

    .cursor {
        cursor: pointer;
    }

    @media screen and (max-width: 660px) {
        width: 90% !important;
    }
    @media screen and (max-width: 572px) {
        font-size: 14px;
    }
`

const Icon = styled.img`
    height: 25px;
    width: 25px;
    border-radius: 50%;
`

const MintCoinButton = styled.button<{ isDisable: boolean }>`
    gap: 5px;
    align-items: center;
    display: flex;
    font-size: 1rem;
    font-family: Inter;
    font-weight: 300;
    color: var(--text1);
    width: 100%;
    padding: 16px;
    border: 1px solid var(--border2);
    outline: none;
    background: linear-gradient(87.2deg, #00b2ff 2.69%, #003655 98.02%);
    color: ${({ theme }) => theme.text1};
    border: none;
    border-radius: 12px;
    cursor: ${({ isDisable }) => (isDisable ? 'not-allowed' : 'pointer')};
    :hover {
        opacity: 0.7;
    }
`
const ContentFaucet = styled.div`
    padding: 0px 1rem;
    display: grid;
    grid-auto-rows: auto;
    row-gap: 12px;
    justify-items: start;
    color: ${({ theme }) => theme.text1};
`
const CoinButton = styled(ContentFaucet)`
    padding: 11px 1rem;
`
const BtnClose = styled.img`
    width: unset;
    height: 20px;
    cursor: pointer;
    :hover {
        background: #003b5c;
    }
`

const BodyModalFaucet = styled.div`
    padding: 12px 0px;
`

const TextCoin = styled.div`
    font-weight: 500;
    font-size: 14px;
`

const TitleModalFaucet = styled.div`
    border-radius: 19px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${({ theme }) => theme.text1};
    padding: 11px;
    font-weight: 600;
`
const BtnFaucet = styled(Button)`
    width: unset;
    padding: 0px 12px;
`
const FaucetModalDiv = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 999;
    display: flex;
    @media (max-width: 576px) {
        width: 90%;
    }
`
const ContainerFaucetModal = styled.div<{ isDislayFaucet: boolean }>`
    border: 1px solid #003b5c;
    background: var(--bg5);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    max-width: 400px;
    width: 100%;
    margin: auto;
    transition: all 0.1s ease-in-out;
    z-index: ${({ isDislayFaucet }) => (isDislayFaucet ? 999 : -1)};
    scale: ${({ isDislayFaucet }) => (isDislayFaucet ? 1 : 0.95)};
    opacity: ${({ isDislayFaucet }) => (isDislayFaucet ? 1 : 0)};
    padding: 10px;
    border-radius: 12px;

    @media screen and (max-width: 576px) {
        max-width: 410px;
    }
    @media screen and (max-width: 390px) {
        max-width: 365px;
    }
`
export default Faucet
