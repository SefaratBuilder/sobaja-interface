import PrimaryButton from 'components/Buttons/PrimaryButton'
import styled from 'styled-components'
import imgClose from 'assets/icons/x.svg'
import imgSuccess from 'assets/icons/success.svg'
import imgError from 'assets/icons/error.svg'

import { useAppState } from 'states/application/hooks'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useEffect, useRef } from 'react'

interface ResultModal {
    isSuccess: boolean
    setOpenModal: any
    txnHash: string | undefined
    error?: any
}
const ResultTransactionModal = ({
    isSuccess,
    setOpenModal,
    txnHash,
    error,
}: ResultModal) => {
    const { userDarkMode } = useAppState()
    const ref = useRef()

    useOnClickOutside(ref, () => {
        setOpenModal(false)
    })

    return (
        <Container
        // ref={ref}
        >
            <Header>
                <ImgClose
                    src={imgClose}
                    alt=""
                    onClick={() => setOpenModal(false)}
                />
            </Header>
            <WrapContent>
                <WrapImgResult>
                    <img src={`${isSuccess ? imgSuccess : imgError}`} alt="" />
                </WrapImgResult>
                <WrapInfoLoad>
                    <div>
                        {isSuccess
                            ? 'Transaction Submitted'
                            : error?.data
                            ? error?.data
                            : error}
                    </div>
                </WrapInfoLoad>
            </WrapContent>
            <PrimaryButton
                type="light-blue"
                name="Close"
                onClick={() => setOpenModal(false)}
            />
        </Container>
    )
}

export default ResultTransactionModal

const Container = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 20px 25px;
    background: linear-gradient(
        to top right,
        rgba(0, 28, 44, 0.3),
        rgba(0, 28, 44, 0.3)
    );
    background-color: #00000073;

    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    max-width: 500px;
    width: 100%;
    padding: 20px 30px;
    backdrop-filter: blur(40px);

    @media screen and (max-width: 576px) {
        width: 90%;
    }
`
const Header = styled.div`
    display: flex;
    justify-content: flex-end;
`
const WrapContent = styled.div`
    margin-bottom: 30px;
`
const WrapImgResult = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    img {
        height: 80px;
        width: 80px;
    }
`
const WrapInfoLoad = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    div:first-child {
        font-size: 20px;
    }
    div:last-child {
        color: #ffffffba;
        font-size: 14px;
    }
    a {
        text-decoration: none;
        color: rgb(1, 104, 255);
    }
`
const ImgClose = styled.img`
    width: 20px;
    height: 20px;
`
