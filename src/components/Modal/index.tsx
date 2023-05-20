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
}

const Modal = (props: ModalProps) => {
    console.log('🤦‍♂️ ⟹ Modal ⟹ props:', props)
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
                {!props?.isRight ? (
                    <MiddleBox>{props.children(handleClose)}</MiddleBox>
                ) : (
                    <WrapBox>
                        <Box>{props.children(handleClose)}</Box>
                    </WrapBox>
                )}
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
    width: 400px;
    background: url(${BgWallet});
    background-size: cover;
    background-repeat: no-repeat;
    padding: 20px;
    @media screen and (max-width: 1100px) {
        top: unset;
        bottom: 0;
        /* min-height: 600px; */
        height: 600px;
    }
`

const Box = styled.div`
    background: var(--bg2);
    backdrop-filter: blur(4px);
    max-width: 400px;
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

    @media (max-width: 576px) {
        /* width: 90%; */
    }
`

export default Modal
