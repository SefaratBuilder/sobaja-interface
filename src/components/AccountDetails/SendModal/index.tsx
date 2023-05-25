import { ReactNode, useEffect, useState } from 'react'
import Modal from 'components/Modal'
import styled from 'styled-components'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { Columns, Row } from 'components/Layouts'
import { useActiveWeb3React } from 'hooks'
import { useSmartAccountContext } from 'contexts/SmartAccountContext'
import { computeGasLimit, shortenAddress } from 'utils'
import { divNumberWithDecimal, mulNumberWithDecimal } from 'utils/math'
import { NATIVE_COIN, ZERO_ADDRESS } from 'constants/index'
import {
    useCurrencyBalance,
    useETHBalances,
    useTokenBalance,
} from 'hooks/useCurrencyBalance'
import { Error } from 'components/Text'
import { useTokenContract, useTokenSmartAccountContract } from 'hooks/useContract'
import { useToken } from 'hooks/useToken'
import TokenListModal from 'components/TokenListModal'
import { Field, Token } from 'interfaces'
import { useTransactionHandler } from 'states/transactions/hooks'
import { useSmartAccount } from 'hooks/useSmartAccount'

const SendModal = () => {
    const { account, chainId } = useActiveWeb3React()
    const { smartAccountAddress, sendTransactions } = useSmartAccount()
    const [value, setValue] = useState('')
    const [toAddress, setToAddress] = useState('')
    const [token, setToken] = useState<Token>(NATIVE_COIN[280])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const tokenContract = useTokenContract(token.address)
    const tokenStruct = useToken(token.address)
    const balanceToken = useCurrencyBalance(smartAccountAddress, tokenStruct)
    const { addTxn } = useTransactionHandler()
    console.log({token, tokenContract})
    const onChangeValue = (val: string) => {
        const validValue = val
            .replace(/[^0-9.,]/g, '')
            .replace(' ', '')
            .replace(',', '.')
            .replace(/(\..*?)\..*/g, '$1')
        setValue(validValue)
    }

    const Button = (onOpen: () => void) => {
        return <PrimaryButton name="Withdraw" onClick={onOpen} />
    }

    const ModalContent = (onClose: () => void) => {
        const onWithdraw = async () => {
            try {
                if (!account || !smartAccountAddress || !chainId) return

                if (Number(balanceToken) < Number(value)) {
                    setError('You have no enough balance.')
                    return
                }
                if (!toAddress || !value) {
                    setError('Invalid input.')
                    return
                }
                setError('')
                let tx = {
                    target: toAddress,
                    value: mulNumberWithDecimal(value, token.decimals),
                    data: '0x',
                }
                if (token.address !== ZERO_ADDRESS && tokenContract) {
                    const transferData =
                        await tokenContract.populateTransaction.transfer(
                            toAddress,
                            mulNumberWithDecimal(value, token.decimals),
                        )
                    if (!transferData?.data) return
                    tx = {
                        target: tokenContract.address,
                        data: transferData.data,
                        value: '0x00',
                    }
                }
                setIsLoading(true)
                const txn = await sendTransactions([tx])
                const hash = await txn.wait()
                setIsLoading(false)
                addTxn({
                    hash: hash.transactionHash,
                    msg: `Withdrawed ${value} ${
                        token.symbol
                    } to ${shortenAddress(toAddress)}`,
                    status: true,
                })
                onClose()
            } catch (err) {
                onClose()
                setError('Transaction failed')
                setIsLoading(false)
                console.log('failed to send:', err)
            }
        }

        const onSelectToken = (f: Field, t: Token) => {
            if (t) setToken(t)
        }

        return (
            <ModalWrapper>
                <ModalHeader>
                    <div>Withdraw</div>
                    {/* <div className="close-btn" onClick={onClose}>
                        X
                    </div> */}
                </ModalHeader>
                <ModalBody>
                    <div className="subtitle">
                        Withdraw token in this smart account to an address
                    </div>
                    <Row gap="10px" al="center">
                        <div className="to">Balance: {balanceToken || '0'}</div>
                        <TokenListModal
                            token={token}
                            field={Field.INPUT}
                            onUserSelect={onSelectToken}
                        />
                    </Row>
                    <Row gap="10px">
                        <div>From: </div>
                        <div>
                            {smartAccountAddress && shortenAddress(smartAccountAddress)}
                        </div>
                    </Row>
                    <div>To: </div>
                    <Input
                        type="text"
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                        placeholder="to address"
                    />
                    <div>With amount:</div>
                    <Input
                        type="text"
                        value={value}
                        onChange={(e) => onChangeValue(e.target.value)}
                        placeholder={token.symbol || 'ETH'}
                    />
                    <PrimaryButton
                        name={'Send'}
                        onClick={onWithdraw}
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

export default SendModal
