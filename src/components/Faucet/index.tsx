import React, { useMemo, useRef, useState } from 'react'
import PrimaryButton, { Button } from 'components/Buttons/PrimaryButton'
import styled from 'styled-components'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import imgClose from 'assets/icons/icon-close.svg'
import tokenList from 'constants/jsons/tokenList.json'
import { useFaucetContract } from 'hooks/useContract'
import usdt from 'assets/icons/usdt.jpeg'
import { OpacityModal } from 'components/Web3Status'
import { useActiveWeb3React } from 'hooks'
import { Error } from 'components/Text'
import { Row } from 'components/Layouts'
import { sendEvent } from 'utils/analytics'
import Blur from 'components/Blur'

const Faucet = () => {
    const [isDislayFaucet, setIsDisplayFaucet] = useState<boolean>(false)
    const ref = useRef<any>()
    const faucetContract = useFaucetContract()
    const { chainId } = useActiveWeb3React()
    const isDisable = useMemo(
        () => (chainId && chainId != 280) || false,
        [chainId],
    )

    useOnClickOutside(ref, () => {
        setIsDisplayFaucet(false)
    })

    const clickFaucetToken = async (erc20: string) => {
        if (faucetContract == null) return
        const fc = await faucetContract?.requestTokens(erc20)
        console.log('🤦‍♂️ ⟹ clickFaucetToken ⟹ fc:', fc)

        sendEvent({
            category: 'Defi',
            action: 'Faucet',
            label: erc20,
        })
    }

    const showMintCoins = () => {
        console.log({ isDisable })

        if (tokenList && tokenList.length > 0) {
            return tokenList.map((item) => {
                if (item.type == 'faucet' && item.chainId == 280) {
                    return (
                        <MintCoinButton
                            key={item.address}
                            onClick={() => {
                                chainId == 280 && clickFaucetToken(item.address)
                            }}
                            isDisable={isDisable}
                        >
                            <Icon
                                src={
                                    item.symbol == 'USDT' ? usdt : item.logoURI
                                }
                            ></Icon>
                            <div>{item.symbol}</div>
                        </MintCoinButton>
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
                                    Get BTC, USDT, USDC, DAI for testing ZkSync
                                    Testnet on Sobajaswap, test token can
                                    nullify the reality of Mainnet.
                                </TextCoin>
                            </ContentFaucet>
                            <CoinButton>
                                {showMintCoins()}
                                {chainId !== 280 && (
                                    <Row>
                                        <Error fontSize="14px">
                                            Wrong network! Please switch to
                                            ZkSync Goerli network to faucet
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
    font-style: italic;
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
    z-index: 9999;
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
