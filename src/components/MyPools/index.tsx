import React, { useState, Fragment } from 'react'
import styled from 'styled-components'
import ETH from 'assets/token-logos/eth.svg'
import USDC from 'assets/token-logos/usdc.svg'
import imgClose from 'assets/icons/icon-close.svg'
const MyPools = () => {
    let arrMyPools = [1, 2, 3, 4]
    const [modalRemovePool, setModalRemovePool] = useState<boolean>(false)
    const [percentValue, setPercentValue] = useState(1)
    const arrPrecent = [0, 25, 50, 75, 100]
    const handleChangeInput = (value: any) => {
        setPercentValue(value)
    }
    return (
        <WrapMyPools>
            <RowMyPools>
                {arrMyPools.map((item) => {
                    return (
                        <ColMyPools key={item}>
                            <WrapContent>
                                <WrapText>
                                    <WrapLogo>
                                        <Logo src={ETH}></Logo>
                                        <LogoTwo src={USDC}></LogoTwo>
                                    </WrapLogo>
                                    <div> USDC/ETH</div>
                                </WrapText>
                                <Value>1.23456789</Value>
                            </WrapContent>

                            <WrapContent>
                                <WrapText>Your pool share:</WrapText>
                                <Value>0.97654321 %</Value>
                            </WrapContent>
                            <HrTag></HrTag>
                            <WrapContent>
                                <WrapText>
                                    <Logo src={ETH}></Logo>
                                    <div>ETH</div>
                                </WrapText>
                                <Value>0.12345</Value>
                            </WrapContent>
                            <WrapContent>
                                <WrapText>
                                    <Logo src={USDC}></Logo>
                                    <div>USDC</div>
                                </WrapText>
                                <Value>9.76543</Value>
                            </WrapContent>
                            <WrapAddAndRemove>
                                <BtnAdd>Add</BtnAdd>
                                <BtnRemove
                                    onClick={() =>
                                        setModalRemovePool(!modalRemovePool)
                                    }
                                >
                                    Remove
                                </BtnRemove>
                            </WrapAddAndRemove>
                        </ColMyPools>
                    )
                })}
            </RowMyPools>

            {modalRemovePool ? (
                <ModalRemovePool onClick={() => setModalRemovePool(false)}>
                    <WrapRemovePool>
                        <WrapTitle>
                            <Title>Remove</Title>
                            <BtnClose src={imgClose}></BtnClose>
                        </WrapTitle>
                        <WrapTip>
                            <span>
                                Tip:Tip: Lorem ipsum dolor sit amet,
                                consectetuer adipiscing elit, sed diam nonummy
                                nibh euismod tincidunt ut laoreet dolore magna
                                aliquam erat volutpat. Ut wisi enim ad minim
                                veniam.
                            </span>
                        </WrapTip>
                        <WrapRemoveAmount>
                            <WrapAmount>
                                <TitleRemove>Remove Amount</TitleRemove>
                                <WrapPercent>
                                    <Percent>
                                        {arrPrecent[percentValue - 1]}%
                                    </Percent>
                                </WrapPercent>
                            </WrapAmount>
                            <WrapInputRange>
                                <Input
                                    onChange={(e) =>
                                        handleChangeInput(e.target.value)
                                    }
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={percentValue}
                                    disabled={false}
                                />
                                <DotPercent>
                                    {arrPrecent.map((item) => {
                                        return (
                                            <div key={item}>
                                                <span>
                                                    {item == 100 ? 'Max' : item}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </DotPercent>
                            </WrapInputRange>
                        </WrapRemoveAmount>
                        <WrapContentRemove>
                            <RowContentRemove>
                                <WrapText>
                                    <Logo src={ETH}></Logo>
                                    <div>ETH</div>
                                </WrapText>
                                <Value>9.76543</Value>
                            </RowContentRemove>
                            <RowContentRemove>
                                <WrapText>
                                    <Logo src={USDC}></Logo>
                                    <div>USDC</div>
                                </WrapText>
                                <Value>9.76543</Value>
                            </RowContentRemove>
                        </WrapContentRemove>
                        <WrapPrice>
                            <TextPrice>Price:</TextPrice>
                            <ValuePrice>1 ETH = 1,981.58 USDC </ValuePrice>
                        </WrapPrice>
                        <WrapPrice>
                            <TextPrice></TextPrice>
                            <ValuePrice>1 USDT = 0.00050 </ValuePrice>
                        </WrapPrice>
                        <BtnConfirm onClick={() => setPercentValue(25)}>
                            Confirm
                        </BtnConfirm>
                    </WrapRemovePool>
                </ModalRemovePool>
            ) : (
                ''
            )}
        </WrapMyPools>
    )
}

const BtnClose = styled.img`
    width: unset;
    height: 20px;
    cursor: pointer;
    :hover {
        background: #003b5c;
    }
`
const WrapTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const WrapPrice = styled.div`
    padding: 0px 15px;
    margin-top: 20px;
    display: flex;
`
const TextPrice = styled.div`
    width: 15%;
`
const ValuePrice = styled.div``
const WrapInputRange = styled.div`
    position: relative;
    height: 5px;
    width: 92%;
    margin: auto;
`

const DotPercent = styled.div`
    position: absolute;
    top: 0px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 3px;
    > div {
        height: 10px;
        width: 10px;
        background: #ffffff;
        border-radius: 50%;
        z-index: -1;
        > span {
            position: relative;
            left: -7px;
            top: 15px;
        }
    }
`
const WrapPercent = styled.div`
    width: 60%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    text-align: right;
    padding: 0px 10px;
`
const WrapAmount = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`

const Input = styled.input`
    position: absolute;
    /* width: 100%; */
    top: 3px;
    height: 3px;
    -webkit-appearance: none;
    background: #ffffff;
    width: 100%;
    /* z-index: -1; */
    ::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #00b2ff;
        cursor: pointer;
        z-index: 999999;
    }
`

const Percent = styled.div`
    font-size: 50px;
    font-weight: 400;
`
const TitleRemove = styled.div`
    font-weight: 500;
    font-size: 18px;
    color: #ffffff;
    width: 40%;
`
const GroupButton = styled.div`
    display: flex;
    gap: 25px;
`
const WrapRemoveAmount = styled.div`
    padding: 15px 15px;
    height: 155px;
    margin-top: 20px;
    background: rgba(0, 178, 255, 0.1);
    border-radius: 6px;
`

const RowContentRemove = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0px;
`
const WrapContentRemove = styled.div`
    margin-top: 20px;
    border-radius: 6px;
    padding: 15px;
    background: rgba(0, 178, 255, 0.1);
`

const WrapTip = styled.div`
    margin-top: 20px;
    padding: 15px;
    background: rgba(0, 178, 255, 0.1);
    border-radius: 6px;
    > span {
        font-size: 13px;
    }
`

const BtnConfirm = styled.div`
    margin-top: 20px;
    background: #00b2ff;
    border-radius: 12px;
    padding: 10px;
    width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    color: #ffffff;
`
const Title = styled.div`
    font-weight: 700;
    font-size: 20px;
    display: flex;
    justify-content: center;
    color: #ffffff;
`

const WrapRemovePool = styled.div`
    background: rgba(0, 28, 44, 0.3);
    border: 2px solid #003b5c;
    backdrop-filter: blur(25px);
    border-radius: 12px;
    padding: 20px;
`
const ModalRemovePool = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: fit-content;
    z-index: 1;
    max-width: 500px;
    width: 100%;
    margin: auto;

    @media screen and (max-width: 1100px) {
        width: 90%;
    }
`
const WrapLogo = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: 40px;
`
const Logo = styled.img`
    width: 25px;
    height: 25px;
`
const LogoTwo = styled(Logo)`
    position: absolute;
    left: 15px;
    top: 0px;
`
const HrTag = styled.div`
    height: 1px;
    background-color: #888888;
`
const BtnRemove = styled.div`
    border: 0.475851px solid #00b2ff;
    border-radius: 6px;
    text-align: center;
    padding: 5px 0px;
`
const BtnAdd = styled(BtnRemove)``
const WrapAddAndRemove = styled.div`
    display: flex;
    gap: 20px;
    padding: 0px 15px;
    margin-bottom: 20px;
    > div {
        width: 50%;
    }
`
const Value = styled.div``
const WrapText = styled.div`
    gap: 5px;
    display: flex;
    align-items: center;
`
const WrapContent = styled.div`
    margin: 20px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;
`
const ColMyPools = styled.div`
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #888888;
    backdrop-filter: blur(15px);
    border-radius: 12px;
    flex: 1;
    @media screen and (max-width: 1440px) {
        width: 32%;
        flex: unset;
    }
    @media screen and (max-width: 1250px) {
        flex: unset;
        width: 48.5%;
    }
    @media screen and (max-width: 840px) {
        flex: unset;
        width: 100%;
    }
`
const RowMyPools = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
`
const WrapMyPools = styled.div``

export default MyPools