import { ReactNode, useEffect, useState } from 'react'
import Modal from 'components/Modal'
import styled from 'styled-components'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { Columns, Row } from 'components/Layouts'
import { useActiveWeb3React } from 'hooks'
import { computeGasLimit, shortenAddress } from 'utils'
import { mulNumberWithDecimal } from 'utils/math'
import { NATIVE_COIN, URLSCAN_BY_CHAINID } from 'constants/index'
import { useETHBalances } from 'hooks/useCurrencyBalance'
import { Error } from 'components/Text'
import { useTransactionHandler } from 'states/transactions/hooks'
import QRCode from 'react-qr-code'
import imgCheckMark from 'assets/icons/check-mark.svg'
import imgCopy from 'assets/icons/copy.svg'
import { useSmartAccountContext } from 'contexts/SmartAccountContext'
import CloseIcon from 'assets/icons/x.svg'

const DepositModal = () => {
    const { account, provider, chainId } = useActiveWeb3React()
    const { smartAccountAddress } = useSmartAccountContext()
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const balance = useETHBalances([smartAccountAddress || account])?.[
        smartAccountAddress || account || ''
    ]

    const [error, setError] = useState('')
    const { addTxn } = useTransactionHandler()

    const onChangeValue = (val: string) => {
        const validValue = val
            .replace(/[^0-9.,]/g, '')
            .replace(' ', '')
            .replace(',', '.')
            .replace(/(\..*?)\..*/g, '$1')
        setValue(validValue)
    }

    const handleCopyAddress = () => {
        if (smartAccountAddress) {
            navigator.clipboard.writeText(smartAccountAddress).then(() => {
                setIsCopied(true)
                setTimeout(() => {
                    setIsCopied(false)
                }, 1000)
            })
        }
    }

    const Button = (onOpen: () => void) => {
        return <PrimaryButton name="Deposit" onClick={onOpen} />
    }

    const ModalContent = (onClose: () => void) => {
        const handleUrl = (linkUrl?: string) => {
            return linkUrl && linkUrl?.slice(8, linkUrl.length - 1)
        }
        const handleOnView = (linkUrl?: string) => {
            return (
                linkUrl &&
                window.open(`${linkUrl}/address/${smartAccountAddress}`)
            )
        }
        const onDeposit = async () => {
            try {
                if (!account || !smartAccountAddress) return
                if (Number(balance) < Number(value)) {
                    setError('You have no enough balance.')
                    return
                }
                setError('')
                const tx = {
                    from: account,
                    to: smartAccountAddress,
                    value: mulNumberWithDecimal(value, 18),
                    data: '0x',
                }
                setIsLoading(true)
                const gasLimit = await provider?.estimateGas(tx)
                const signer = await provider?.getSigner()
                const txn = await signer?.sendTransaction({
                    ...tx,
                    gasLimit: computeGasLimit(gasLimit),
                })
                const txnHash = await txn?.wait()
                if (!txnHash || !chainId) return
                addTxn({
                    hash: txnHash.transactionHash,
                    msg: `Deposited ${value} ${NATIVE_COIN[chainId].symbol} into Smart account`,
                    status: true,
                })
                setIsLoading(false)
                onClose()
            } catch (err) {
                onClose()
                setError('Transaction failed')
                setIsLoading(false)
                console.log('failed to deposit fund into smart account:', err)
            }
        }

        return (
            <ModalWrapper>
                <ModalHeader>
                    <div>Deposit</div>
                    <div className="close-btn" onClick={onClose}>
                        <img src={CloseIcon} alt="close icon" />
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="subtitle">
                        Deposit fund into this smart account to pay gas fee or
                        make transaction
                    </div>
                    <div className="cen">
                        <QRCode
                            value={smartAccountAddress?.toString() || '0x'}
                            size={160}
                            viewBox="0 0 160 160"
                        />
                    </div>
                    <PrimaryButton
                        name={`View account at ${handleUrl(
                            (chainId && URLSCAN_BY_CHAINID?.[chainId].url) ||
                                undefined,
                        )}`}
                        onClick={() =>
                            handleOnView(
                                (chainId &&
                                    URLSCAN_BY_CHAINID?.[chainId].url) ||
                                    undefined,
                            )
                        }
                        isLoading={isLoading}
                        size="12px"
                        type="white-black"
                    />
                    <Row gap="10px" className="label-address">
                        <div>Smart account: </div>
                        <Row gap="10px">
                            <div>
                                {smartAccountAddress &&
                                    shortenAddress(smartAccountAddress, 6)}
                            </div>
                            {isCopied ? (
                                <CopyBtn>
                                    <CopyAccountAddress src={imgCheckMark} />
                                    <Tooltip className="tooltip">
                                        Copied
                                    </Tooltip>
                                </CopyBtn>
                            ) : (
                                <CopyBtn>
                                    <CopyAccountAddress
                                        onClick={() => handleCopyAddress()}
                                        src={imgCopy}
                                    />
                                    <Tooltip className="tooltip">
                                        Click to copy address
                                    </Tooltip>
                                </CopyBtn>
                            )}
                        </Row>
                    </Row>

                    <div>Input amount to deposit</div>
                    <Input
                        type="text"
                        value={value}
                        onChange={(e) => onChangeValue(e.target.value)}
                        placeholder={
                            (chainId && NATIVE_COIN[chainId].symbol) || 'ETH'
                        }
                    />

                    <PrimaryButton
                        name={'Deposit'}
                        onClick={onDeposit}
                        isLoading={isLoading}
                    />
                    {error && <Error>{error}</Error>}
                </ModalBody>
            </ModalWrapper>
        )
    }

    return (
        <Modal
            button={Button}
            children={ModalContent}
            isRight={true}
            setErr={setError}
        />
    )
}

const ModalWrapper = styled.div``

const ModalHeader = styled(Row)`
    justify-content: space-between;
    font-size: 20px;
    font-weight: 600;
    .close-btn {
        cursor: pointer;
    }
`

const ModalBody = styled(Columns)`
    gap: 10px;
    font-size: 14px;
    font-weight: 400;
    padding: 10px;

    .subtitle {
        font-style: italic;
        font-weight: 300;
    }
    .cen {
        margin: 0 auto;
        /* padding: 8px; */
        border: 3px solid white;
    }

    .label-address {
        @media screen and (max-width: 432px) {
            flex-direction: column;
            /*  */
            div {
                /* display: flex; */
                /* flex-direction: column; */
            }
        }
    }

    @media screen and (max-width: 375px) {
        font-size: 11px;
    }
`

const Input = styled.input`
    outline: none;
    border: 2px solid var(--border2);
    background: none;
    padding: 5px 10px;
    border-radius: 4px;
    color: white;

    ::placeholder {
        color: #ffffff81;
    }
`
const CopyBtn = styled.div`
    position: relative;
    :hover .tooltip {
        transition: all 0.1s ease-in-out;
        opacity: 1;
        visibility: visible;
    }
`
const Tooltip = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    width: 100px;
    height: 30px;
    font-size: 12px;
    right: -45px;
    text-align: center;
    border: 1px solid;
    border-radius: 6px;
    background: rgba(157, 195, 230, 0.1);
    backdrop-filter: blur(3px);
`
const CopyAccountAddress = styled.img`
    height: 12px;
    cursor: pointer;
`

export default DepositModal
