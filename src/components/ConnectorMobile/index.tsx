import React, { useState, Fragment } from 'react'
import NetworkSelectorMobile from 'components/NetworkSelectorMobile'
import WalletModal from 'components/WalletModal'
import Web3StatusMobile from 'components/Web3StatusMobile'
import styled from 'styled-components'
import Web3Status from 'components/Web3Status'
const ConnectorMobile = () => {
    const [toggleWalletModal, setToggleWalletModal] = useState<boolean>(false)
    return (
        <Fragment>
            <WrapConnectorMobile>
                <NetworkSelectorMobile />
                <Web3StatusMobile
                    toggleWalletModal={toggleWalletModal}
                    setToggleWalletModal={setToggleWalletModal}
                />
            </WrapConnectorMobile>

            {toggleWalletModal ? (
                <WalletModal setToggleWalletModal={setToggleWalletModal} />
            ) : (
                ''
            )}

            {toggleWalletModal ? (
                <OpacityModal
                    onClick={() => setToggleWalletModal(!toggleWalletModal)}
                ></OpacityModal>
            ) : (
                ''
            )}
        </Fragment>
    )
}

const OpacityModal = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: #00000073;
    right: 0;
    top: 0;

    @media screen and (max-width: 1100px) {
        top: unset;
        height: 3000px;
        bottom: 0px;
    }
`
const WrapConnectorMobile = styled.div`
    display: none;
    @media screen and (max-width: 1100px) {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: flex-end;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: var(--bg3);
        backdrop-filter: blur(3px);
        padding: 8px;
        z-index: 1;
    }
`

export default ConnectorMobile
