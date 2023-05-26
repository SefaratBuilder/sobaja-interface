import React from 'react'
import styled from 'styled-components'
import UnknowToken from 'assets/icons/question-mark-button-dark.svg'
import ETH from 'assets/token-logos/eth.svg'
import SOBA from 'assets/token-logos/sbj.svg'
import BGSoba from 'assets/icons/soba2.svg'
import { useNavigate } from 'react-router-dom'

const StakePools = () => {
    const testData = [{ name: 'asd' }, { name: 'asd' }, { name: 'asd' }]

    const navigate = useNavigate()

    return (
        <Container>
            <Title>Stake</Title>
            <RowMyPools>
                {testData &&
                    testData?.length > 0 &&
                    testData.map((item, index) => {
                        return (
                            <ColMyPools key={index}>
                                <WrapTitle>
                                    <WrapText>
                                        <WrapLogo>
                                            <Logo
                                                src={
                                                    // urlTokens?.[
                                                    //     item?.token0?.address
                                                    // ] ||
                                                    ETH
                                                }
                                            ></Logo>
                                            <LogoTwo
                                                src={
                                                    // urlTokens?.[
                                                    //     item?.token1?.address
                                                    // ] ||
                                                    SOBA
                                                }
                                            ></LogoTwo>
                                        </WrapLogo>
                                        <div>
                                            {' '}
                                            ETH/SOBA
                                            {/* {item?.token0?.symbol}/ */}
                                            {/* {item?.token1?.symbol} */}
                                        </div>
                                    </WrapText>
                                    {/* <Value>
                                        '0'
                                    </Value> */}
                                </WrapTitle>
                                <WrapAPR>
                                    <p>19.89% APR</p>
                                    <span>SOBA</span>
                                </WrapAPR>
                                <WrapContent>
                                    <WrapText>Reward Token</WrapText>
                                    <Value>
                                        <LogoToken
                                            src={SOBA}
                                            alt="logo-token"
                                        ></LogoToken>
                                        SOBA
                                        {/* {Number(item?.percent).toFixed(4)} % */}
                                    </Value>
                                </WrapContent>
                                <HrTag></HrTag>
                                <WrapContent>
                                    <WrapText>
                                        <div>
                                            Value Locked
                                            {
                                                // item?.token1?.symbol
                                            }
                                        </div>
                                    </WrapText>
                                    <Value>$666,333.99</Value>
                                </WrapContent>
                                <WrapContent>
                                    <WrapText>
                                        <div>
                                            {/* {item?.token0?.symbol} */}
                                            My share
                                        </div>
                                    </WrapText>
                                    <Value>$0 (0%)</Value>
                                </WrapContent>
                                <WrapContent>
                                    <WrapText>
                                        <div>
                                            {/* {item?.token0?.symbol} */}
                                            Available balance
                                        </div>
                                    </WrapText>
                                    <Value>$0</Value>
                                </WrapContent>
                                <WrapContent>
                                    <WrapText>
                                        <div>
                                            {/* {item?.token0?.symbol} */}
                                            My reward
                                        </div>
                                    </WrapText>
                                    <Value>$0</Value>
                                </WrapContent>

                                <WrapAddAndRemove>
                                    <BtnAdd
                                        onClick={() => {
                                            navigate('/staking')
                                        }}
                                    >
                                        Stake
                                    </BtnAdd>
                                    <BtnRemove
                                        onClick={() => {
                                            navigate('/staking?claim')
                                        }}
                                    >
                                        Claim
                                    </BtnRemove>
                                </WrapAddAndRemove>
                            </ColMyPools>
                        )
                    })}
            </RowMyPools>
        </Container>
    )
}

export default StakePools

const Container = styled.div`
    position: sticky;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 80%;
`

const Title = styled.div`
    font-size: 36px;
    font-weight: 600;
    padding: 0 0 2rem;
`

const BtnRemove = styled.div`
    border: 0.475851px solid #00b2ff;
    border-radius: 6px;
    text-align: center;
    padding: 5px 0px;
    cursor: pointer;
    transition: all ease-in-out 0.3s;

    &:hover {
        background: var(--bg6);
    }
`
const WrapTitle = styled.div`
    margin: 20px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 15px;
`
const WrapAPR = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    p {
        font-size: 24px;
        font-weight: 600;
    }
`
const WrapContent = styled.div`
    margin: 20px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;
`
const BtnAdd = styled(BtnRemove)``
const WrapAddAndRemove = styled.div`
    display: flex;
    gap: 20px;
    padding: 0px 15px;
    margin-bottom: 20px;
    cursor: pointer;

    > div {
        width: 50%;
    }
`
const RowMyPools = styled.div`
    display: grid;
    grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr) minmax(
            300px,
            1fr
        );

    grid-gap: 10px;
    @media screen and (max-width: 1160px) {
        grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr);
    }
    @media screen and (max-width: 770px) {
        /* flex-direction: column; */
        grid-template-columns: minmax(100px, 1fr);
    }
`
const ColMyPools = styled.div`
    border: 1px solid rgba(0, 59, 92, 1);
    background: url(${BGSoba});
    background-size: 700px;
    background-repeat: no-repeat;
    background-position: top;
    border-radius: 12px;
    width: 100%;
    /* flex: 48%;
    max-width: 48%; */

    @media screen and (max-width: 1440px) {
    }
    @media screen and (max-width: 1250px) {
    }
    @media screen and (max-width: 840px) {
        max-width: 100%;
        /* font-size: 12px; */
    }
    @media screen and (max-width: 390px) {
        font-size: 12px;
    }
`
const Value = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`
const WrapText = styled.div`
    gap: 5px;
    display: flex;
    align-items: center;
`
const Logo = styled.img`
    width: 42px;
    height: 42px;
    border-radius: 50%;
`
const LogoToken = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
`
const HrTag = styled.div`
    height: 1px;
    background-color: #003655;
`
const WrapLogo = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: 80px;
`
const LogoTwo = styled(Logo)`
    position: absolute;
    left: 25px;
    top: 0px;
    border-radius: 50%;
`
