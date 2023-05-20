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
}

const Modal = (props: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)

    return (
        <ModalWrapper>
            {props.button(handleOpen)}
            <MuiModal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <WrapBox>
                    <Box>{props.children(handleClose)}</Box>
                </WrapBox>
            </MuiModal>
        </ModalWrapper>
    )
}

const ModalWrapper = styled.div``

const WrapBox = styled.div`
    position: fixed;
    right: 0;

    top: 9%;
    height: 100vh;
    width: 450px;
    background: url(${BgWallet});
    background-size: cover;
    background-repeat: no-repeat;
`

const Box = styled.div`
    position: absolute;
    right: 0;
    top: 2%;

    left: 0;
    margin: auto;
    background: var(--bg2);
    backdrop-filter: blur(4px);
    max-width: 400px;
    height: fit-content;
    border: 12px solid #99999978;

    border-radius: 8px;
    padding: 10px;

    @media (max-width: 576px) {
        width: 90%;
    }
`

export default Modal
