import { ReactNode, useEffect, useState } from "react"
import Modal from "components/Modal"
import styled from 'styled-components'
import PrimaryButton from "components/Buttons/PrimaryButton"
import { Columns, Row } from "components/Layouts"
import { useActiveWeb3React } from "hooks"
import { useSmartAccountContext } from "contexts/SmartAccountContext"
import { computeGasLimit, shortenAddress } from "utils"
import { divNumberWithDecimal, mulNumberWithDecimal } from "utils/math"
import { NATIVE_COIN, ZERO_ADDRESS } from "constants/index"
import { useCurrencyBalance, useETHBalances, useTokenBalance } from "hooks/useCurrencyBalance"
import { Error } from "components/Text"
import { useTokenSmartAccountContract } from "hooks/useContract"
import { useToken } from "hooks/useToken"

const SendModal = () => {    
    const { account, library, chainId } = useActiveWeb3React()
    const { wallet, balance } = useSmartAccountContext()
    const [value, setValue] = useState('')
    const [toAddress, setToAddress] = useState('')
    const [token, setToken] = useState({
        symbol: 'MATIC',
        address: ZERO_ADDRESS,
        decimals: 18
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const tokenContract = useTokenSmartAccountContract(token.address)
    const tokenStruct = useToken(token.address)
    const balanceToken = useCurrencyBalance(wallet?.address, tokenStruct)

    const onChangeValue = (val: string) => {
        const validValue = val
        .replace(/[^0-9.,]/g, '')
        .replace(' ', '')
        .replace(',', '.')
        .replace(/(\..*?)\..*/g, '$1')
        setValue(validValue)
    }

    const handleChangeToken = (symbol: string) => {
        setToken({
            ...token,
            symbol: symbol
        })
    }

    const Button = (onOpen: () => void) => {
        return (
            <PrimaryButton
                name="Withdraw"
                onClick={onOpen}
            />
        )
    }

    const ModalContent = (onClose: () => void) => {
        const onWithdraw = async () => {
            try {
                if(!account || !wallet || !chainId || !tokenContract) return
                if(Number(balanceToken) < Number(value)) {
                    setError('You have no enough balance.')
                    return
                }
                if(!toAddress || !value) {
                    setError('Invalid input.')
                    return
                }
                setError('')
                let tx = {
                    to: toAddress,
                    value: mulNumberWithDecimal(value, token.decimals),
                    data: '0x'
                }
                if(token.address !== ZERO_ADDRESS) {
                    const transferData = await tokenContract.populateTransaction.transfer(toAddress, mulNumberWithDecimal(value, token.decimals))
                    if(!transferData?.data) return
                    tx = {
                        to: tokenContract.address,
                        data: transferData.data,
                        value: '0x00'
                    }
                }
                setIsLoading(true)
                const txn = await wallet.sendTransaction({
                    transaction: tx
                })
                const hash = await txn.wait()
                setIsLoading(false)
                console.log('send success', hash.transactionHash)
            }
            catch(err) {
                onClose()
                setError('Transaction failed')
                setIsLoading(false)
                console.log('failed to send:', err)
            }
        }

        useEffect(() => {
            if(token && balance) {
                const t = balance.alltokenBalances.find(t => t.contract_ticker_symbol === token.symbol)
                if(!t?.balance || !t?.contract_decimals || !t?.contract_address || !t?.contract_decimals || !chainId) return
                const address = token.symbol === NATIVE_COIN[chainId].symbol ? ZERO_ADDRESS : t.contract_address 
                const decimals = t.contract_decimals
                setToken({
                    ...token,
                    address,
                    decimals
                })
            }
        }, [token.symbol, balance, chainId])
    
        return (
            <ModalWrapper>
                <ModalHeader>
                    <div>Withdraw</div>
                    <div className="close-btn" onClick={onClose}>X</div>
                </ModalHeader>
                <ModalBody>
                    <div className="subtitle">
                        Withdraw token in this smart account to an address
                    </div>
                    <Row gap="10px">
                        <div>from: </div>
                        <div>{wallet?.address && shortenAddress(wallet?.address)}</div>
                    </Row>
                    <div>
                        Select a token already in your account
                    </div>
                    <Row gap="10px">
                        <select value={token.symbol} onChange={(e) => handleChangeToken(e.target.value)}>
                            {
                                balance?.alltokenBalances?.map((token: any) => {
                                    return(
                                        <>
                                            <option value={token.contract_ticker_symbol}>{token.contract_ticker_symbol}</option>
                                        </>
                                    )
                                })
                            }
                        </select>
                        <div>
                            balance: {balanceToken || '0'}
                        </div>
                    </Row>
                    <div>To: </div>
                    <Input type='text' value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="to address" />
                    <div>
                        Input amount to send
                    </div>
                    <Input type='text' value={value} onChange={(e) => onChangeValue(e.target.value)} placeholder={chainId && NATIVE_COIN[chainId].symbol || 'ETH'} />
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

    return(
        <Modal 
            button={Button} 
            children={ModalContent}
        />   
    )
}

const ModalWrapper = styled.div`

`

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