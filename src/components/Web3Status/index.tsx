import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import PrimaryButton, { Button } from 'components/Buttons/PrimaryButton'
import WalletModal from 'components/WalletModal'
import { Activity } from 'react-feather'
import { shortenAddress } from 'utils'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { injected } from 'connectors'
import arrowDown from 'assets/icons/arrow-down.svg'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'

const Web3Status = () => {
    const { account, connector, error } = useWeb3React()
    const [toggleWalletModal, setToggleWalletModal] = useState<boolean>(false)
    const ref = useRef<any>()

    useOnClickOutside(ref, () => {
        setToggleWalletModal(false)
    })

    function formatConnectorName(account: any) {
        const { ethereum } = window
        const isMetaMask = !!(ethereum && ethereum.isMetaMask)
        const logo = Object.keys(SUPPORTED_WALLETS)
            .filter(
                (k) =>
                    SUPPORTED_WALLETS[k].connector === connector &&
                    (connector !== injected ||
                        isMetaMask === (k === 'METAMASK')),
            )
            .map((k) => SUPPORTED_WALLETS[k].iconURL)[0]
        return (
            <WalletName>
                <Icon src={logo}></Icon>
                <span>{account && shortenAddress(account)}</span>
                <IconArrow src={arrowDown}></IconArrow>
            </WalletName>
        )
    }
    const Web3StatusInner = (account: any, error: any) => {
        if (account) {
            return (
                <Web3StatusConnect
                    height={undefined}
                    id="web3-status-connected"
                    onClick={() => setToggleWalletModal(!toggleWalletModal)}
                >
                    {formatConnectorName(account)}
                </Web3StatusConnect>
            )
        } else if (error) {
            return (
                <Web3StatusConnect height={undefined}>
                    <NetworkIcon></NetworkIcon>
                    <span>
                        {error instanceof UnsupportedChainIdError ? (
                            <p>Wrong Network</p>
                        ) : (
                            <p>Error</p>
                        )}
                    </span>
                </Web3StatusConnect>
            )
        } else {
            return (
                <Web3StatusConnect
                    height={undefined}
                    id="connect-wallet"
                    onClick={() => setToggleWalletModal(!toggleWalletModal)}
                >
                    <div>
                        <p>Connect wallet</p>
                    </div>
                </Web3StatusConnect>
            )
        }
    }

    return (
        <>
            <Web3StatusWrapper>
                {Web3StatusInner(account, error)}
                {toggleWalletModal ? (
                    <div ref={ref}>
                        <WalletModal
                            setToggleWalletModal={setToggleWalletModal}
                        />
                    </div>
                ) : (
                    ''
                )}
            </Web3StatusWrapper>
            {toggleWalletModal ? <OpacityModal></OpacityModal> : ''}
        </>
    )
}

export const OpacityModal = styled.div`
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

const NetworkIcon = styled(Activity)`
    margin-left: 0.25rem;
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
`

const IconArrow = styled.img`
    height: 12px;
    width: 12px;
`

const WalletName = styled.div`
    align-items: center;
    display: flex;
    gap: 5px;
`
const Icon = styled.img`
    height: 20px;
    width: 20px;
`

const Web3StatusConnect = styled(Button)`
    padding: 0px 8px;
`

export const Web3StatusWrapper = styled.div`
    width: 160px;
`

export default Web3Status
