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

const Faucet = () => {
    const [isDislayFaucet, setIsDisplayFaucet] = useState<boolean>(false)
    const ref = useRef<any>()
    const faucetContract = useFaucetContract()
    const { account, chainId, provider } = useActiveWeb3React()
    const initDataTransaction = InitCompTransaction()
    const { addTxn } = useTransactionHandler()

    const isDisable = useMemo(
        () => (chainId && chainId != 280) || false,
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
        return chainId === 280
            ? [
                  {
                      address: ZERO_ADDRESS,
                      symbol: 'ETH',
                      type: 'faucet',
                      logoURI: ETH,
                      chainId: 280,
                  },
                  ...tokenList.filter(
                      (token) =>
                          token.chainId === 280 && token?.type === 'faucet',
                  ),
              ]
                  .map((i) => i.symbol)
                  .reduce((a: any, b: any) => {
                      return a + ', ' + b
                  })
            : tokenList
                  .filter(
                      (token) =>
                          token.chainId === 280 && token?.type === 'faucet',
                  )
                  .map((i) => i.symbol)
                  .reduce((a: any, b: any) => {
                      return a + ', ' + b
                  })
    }, [tokenList, chainId])

    const handleFaucetETH = async () => {
        setIsDisplayFaucet(false)

        try {
            console.log('Faucet....')
            initDataTransaction.setIsOpenWaitingModal(true)
            const dataFaucet = await axios({
                method: 'GET',
                // url: 'http://localhost:3000/api/faucet',
                url: 'https://sobajaswap.com/api/faucet',
                params: {
                    to: account,
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
        if (tokenList && tokenList.length > 0) {
            const tokens =
                chainId === 280
                    ? [
                          {
                              address: ZERO_ADDRESS,
                              symbol: 'ETH',
                              type: 'faucet',
                              logoURI: ETH,
                              chainId: 280,
                          },
                          ...tokenList.sort((a, b) => {
                              const symbolA = a.symbol.toUpperCase() // ignore upper and lowercase
                              const symbolB = b.symbol.toUpperCase() // ignore upper and lowercase
                              if (symbolA < symbolB) {
                                  return -1
                              }
                              if (symbolA > symbolB) {
                                  return 1
                              }

                              return 0
                          }),
                      ]
                    : tokenList
            return tokens.map((item, index) => {
                if (item.type == 'faucet' && item.chainId == 280) {
                    return (
                        <PrimaryButton
                            key={index}
                            name={item.symbol}
                            onClick={() =>
                                item.address === ZERO_ADDRESS
                                    ? handleFaucetETH()
                                    : clickFaucetToken(item.address)
                            }
                            disabled={isDisable}
                            img={item.symbol == 'USDT' ? usdt : item.logoURI}
                            type={'faucet'}
                        />
                        // <MintCoinButton
                        //     key={item.address}
                        //     onClick={() => {
                        //         clickFaucetToken(item.address)
                        //     }}
                        //     isDisable={isDisable}
                        // >
                        //     <Icon
                        //         src={
                        //             item.symbol == 'USDT' ? usdt : item.logoURI
                        //         }
                        //     ></Icon>
                        //     <div>{item.symbol}</div>
                        // </MintCoinButton>
                    )
                }
            })
        }
    }

    return (
        <>
            <BtnFaucet onClick={() => setIsDisplayFaucet(!isDislayFaucet)}>
                Faucet
            </BtnFaucet>
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
                                {chainId !== 280 && (
                                    <Row>
                                        <Error fontSize="14px">
                                            Wrong network! Please switch to
                                            zkSync Goerli network to faucet
                                            tokens.
                                        </Error>
                                    </Row>
                                )}
                            </CoinButton>
                        </BodyModalFaucet>
                    </ContainerFaucetModal>
                </FaucetModalDiv>
            ) : (
                ''
            )}
            {isDislayFaucet ? <Blur /> : ''}
        </>
    )
}

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
