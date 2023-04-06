import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import PrimaryButton, { Button } from 'components/Buttons/PrimaryButton'
import WalletModal from 'components/WalletModal'
import { shortenAddress } from 'utils'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { injected } from 'components/Connectors'
import arrowDown from 'assets/icons/arrow-down.svg'
const Web3Status = () => {
    const { account, connector, error } = useWeb3React()
    const [toggleWalletModal, setToggleWalletModal] = useState<boolean>(false)

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
                    // pending={hasPendingTransactions}
                >
                    {formatConnectorName(account)}
                </Web3StatusConnect>
            )
        } else if (error) {
            return (
                <Web3StatusConnect height={undefined}>
                    <span>Icon</span>
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
                    // faded={!account}
                >
                    <div>
                        <p>Connect wallet</p>
                    </div>
                </Web3StatusConnect>
            )
        }
    }

    return (
        <Web3StatusWrapper>
            {Web3StatusInner(account, error)}
            {toggleWalletModal ? (
                <WalletModal setToggleWalletModal={setToggleWalletModal} />
            ) : (
                ''
            )}
        </Web3StatusWrapper>
    )
}

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

const Web3StatusConnect = styled(Button)``

export const Web3StatusWrapper = styled.div`
    width: 160px;
`

export default Web3Status
