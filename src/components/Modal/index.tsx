import React, {
    ReactNode,
    useState,
    ReactElement,
    JSXElementConstructor,
} from 'react'
import MuiModal from '@mui/material/Modal'
import styled from 'styled-components'

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
                <Box>{props.children(handleClose)}</Box>
            </MuiModal>
        </ModalWrapper>
    )
}

const ModalWrapper = styled.div``

const Box = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: var(--bg2);
    max-width: 400px;
    height: fit-content;
    border: 1px solid #003b5c;
    border-radius: 8px;
    padding: 10px;

    @media (max-width: 576px) {
        width: 90%;
    }
`

export default Modal
