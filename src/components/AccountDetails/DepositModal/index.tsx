import { ReactNode, useState } from 'react'
import Modal from 'components/Modal'
import styled from 'styled-components'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { Columns, Row } from 'components/Layouts'
import { useActiveWeb3React } from 'hooks'
import { useSmartAccountContext } from 'contexts/SmartAccountContext'
import { computeGasLimit, shortenAddress } from 'utils'
import { mulNumberWithDecimal } from 'utils/math'
import { NATIVE_COIN, WRAPPED_NATIVE_COIN } from 'constants/index'
import { useETHBalances } from 'hooks/useCurrencyBalance'
import { Error } from 'components/Text'
import { useTransactionHandler } from 'states/transactions/hooks'

const DepositModal = () => {
    const { account, provider, chainId } = useActiveWeb3React()
    const { wallet } = useSmartAccountContext()
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const balance = useETHBalances([account])?.[account || '']
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

    const Button = (onOpen: () => void) => {
        return <PrimaryButton name="Deposit" onClick={onOpen} />
    }

    const ModalContent = (onClose: () => void) => {
        const onDeposit = async () => {
            try {
                if (!account || !wallet) return
                if (Number(balance) < Number(value)) {
                    setError('You have no enough balance.')
                    return
                }
                setError('')
                const tx = {
                    from: account,
                    to: wallet.address,
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
                    {/* <div className="close-btn" onClick={onClose}>
                        X
                    </div> */}
                </ModalHeader>
                <ModalBody>
                    <div className="subtitle">
                        Deposit fund into this smart account to pay gas fee or
                        make transaction
                    </div>
                    <Row gap="10px">
                        <div>Smart account: </div>
                        <div>
                            {wallet?.address && shortenAddress(wallet?.address)}
                        </div>
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

    return <Modal button={Button} children={ModalContent} isRight={true} />
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

export default DepositModal
