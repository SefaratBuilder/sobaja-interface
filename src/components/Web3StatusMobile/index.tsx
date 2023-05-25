import { Fragment } from 'react'
import styled from 'styled-components'
import { Button } from 'components/Buttons/PrimaryButton'
import { Activity } from 'react-feather'
import { shortenAddress } from 'utils'
import arrowDown from 'assets/icons/arrow-down.svg'
import { useActiveWeb3React } from 'hooks'
import { useSmartAccount } from 'hooks/useSmartAccount'

const Web3StatusMobile = ({ toggleWalletModal, setToggleWalletModal }: any) => {
    const { account } = useActiveWeb3React()
    const error = undefined
    const { smartAccountAddress } = useSmartAccount()

    function formatConnectorName(account: any) {
        return (
            <Fragment>
                <WalletName>
                    <Icon src="https://picsum.photos/50/50"></Icon>
                    <span>{account && shortenAddress(account)}</span>
                </WalletName>
                <IconArrow src={arrowDown}></IconArrow>
            </Fragment>
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
                    <span>{error ? <p>Wrong Network</p> : <p>Error</p>}</span>
                </Web3StatusConnect>
            )
        } else {
            return (
                <Web3StatusConnect
                    height={undefined}
                    id="connect-wallet"
                    onClick={() => setToggleWalletModal(!toggleWalletModal)}
                >
                    Connect wallet
                </Web3StatusConnect>
            )
        }
    }

    return (
        <Fragment>
            <Web3StatusWrapper>
                {Web3StatusInner(smartAccountAddress || account, error)}
            </Web3StatusWrapper>
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
    margin-right: 20px;
`
const Icon = styled.img`
    height: 20px;
    width: 20px;
`

const Web3StatusConnect = styled(Button)`
    padding: 0 8px;
    width: unset;
`

export const Web3StatusWrapper = styled.div``

export default Web3StatusMobile
