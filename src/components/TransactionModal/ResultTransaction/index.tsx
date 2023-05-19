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
            {/* <Header>
                <ImgClose
                    src={imgClose}
                    alt=""
                    onClick={() => setOpenModal(false)}
                />
            </Header> */}
            <WrapContent>
                <WrapInfoLoad>
                    <div className={isSuccess ? '' : 'error'}>
                        {isSuccess
                            ? 'Transaction Submitted'
                            : error?.data
                            ? error?.data
                            : error}
                    </div>
                </WrapInfoLoad>
                <WrapImgResult>
                    <img src={`${isSuccess ? imgSuccess : imgError}`} alt="" />
                </WrapImgResult>
            </WrapContent>
            <PrimaryButton
                type="modal"
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
    z-index: 999;

    @media screen and (max-width: 576px) {
        width: 90%;
    }
`
const Header = styled.div`
    display: flex;
    justify-content: flex-end;
`
const WrapContent = styled.div`
    /* margin-bottom: 30px; */
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
    font-style: normal;
    /* div:first-child {
        font-size: 20px;
    } */
    div {
        color: #34dc81;
        font-size: 18px;
    }

    .error {
        color: #cd3535;
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
