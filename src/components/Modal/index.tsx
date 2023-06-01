import React, {
    ReactNode,
    useState,
    ReactElement,
    JSXElementConstructor,
} from 'react'
import MuiModal from '@mui/material/Modal'
import styled from 'styled-components'
import BgWallet from 'assets/brand/bg-connect-wallet.png'

interface ModalProps {
    children: (
        onClose: () => void,
    ) => ReactElement<any, string | JSXElementConstructor<any>>
    button: (onOpen: () => void) => ReactNode
    isRight?: boolean
    setErr?: React.Dispatch<React.SetStateAction<string>>
}

const Modal = (props: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => {
        setIsOpen(true)
        props?.setErr && props?.setErr('')
    }
    const handleClose = () => setIsOpen(false)

    return (
        <>
            {props.button(handleOpen)}
            <ModalWrapper>
                <MuiModal
                    open={isOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    {!props?.isRight ? (
                        <MiddleBox>{props.children(handleClose)}</MiddleBox>
                    ) : (
                        <WrapBox>
                            <Box>{props.children(handleClose)}</Box>
                        </WrapBox>
                    )}
                </MuiModal>
            </ModalWrapper>
        </>
    )
}

const ModalWrapper = styled.div``

const WrapBox = styled.div`
    position: fixed;
    right: 0;

    /* top: 121.49px; */
    top: 90.49px;
    height: 100vh;
    width: 450px;
    background: url(${BgWallet});
    background-size: 450px;
    background-repeat: no-repeat;
    padding: 20px;
    border-top: 1px solid #003b5c;
    border-left: 1px solid #003b5c;
    /* animation: fadeIn 0.4s linear; */

    @media screen and (max-width: 1100px) {
        animation: fadeUp 0.3s linear;
        height: 600px;
        bottom: 0;
        top: unset;
    }

    @media screen and (max-width: 476px) {
        width: 90%;
        height: auto;
        top: 90px;
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

const Box = styled.div`
    background: var(--bg2);
    backdrop-filter: blur(4px);
    max-width: 450px;
    height: fit-content;
    border: 12px solid #99999978;

    border-radius: 8px;
    padding: 10px;

    @media (max-width: 576px) {
        /* width: 90%; */
    }
`

const MiddleBox = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: var(--bg2);
    backdrop-filter: blur(4px);
    max-width: 400px;
    height: fit-content;
    border: 1px solid #003b5c;
    border-radius: 8px;
    padding: 10px;

    @media (max-width: 476px) {
        width: 90%;
    }
`

export default Modal
