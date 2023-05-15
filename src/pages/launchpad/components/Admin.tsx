import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Columns } from 'components/Layouts'
import { useAccessManagerContract } from 'hooks/useContract'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import Blur from 'components/Blur'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { InitCompTransaction } from 'components/TransactionModal'
import { useTransactionHandler } from 'states/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { URLSCAN_BY_CHAINID } from 'constants/index'

const Admin = ({ setClose, initDataTransaction }: any) => {
    const [operator, setOperator] = useState('')
    const accessManagerContract = useAccessManagerContract()
    const { addTxn } = useTransactionHandler()
    const { chainId } = useActiveWeb3React()

    const ref = useRef<any>()

    useOnClickOutside(ref, () => {
        setClose(false)
    })

    const handleOnGrantOperator = async () => {
        try {
            initDataTransaction.setError('')
            initDataTransaction.setIsOpenWaitingModal(true)

            const callResult = await accessManagerContract?.addOperatorRole(
                operator,
            )
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)

            const txn = await callResult.wait()
            initDataTransaction.setIsOpenResultModal(false)

            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx/${
                    callResult.hash || ''
                }`,
                msg: 'Grant operator',
                status: txn.status === 1 ? true : false,
            })
            setClose(false)
        } catch (err) {
            console.log('Failed to grant: ', err)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
            setClose(false)
        }
    }

    // const handleOnGrantOperator = async () => {
    //     try {
    //         if (!operator) return setClose(false)
    //         console.log('adding role...')

    //         const result = await accessManagerContract?.addOperatorRole(
    //             operator,
    //         )
    //         await result.wait()
    //         console.log('added operator role :))')
    //     } catch (err) {
    //         console.log('failed to grant access manager to this address: ', err)
    //     }
    // }

    return (
        <>
            <Container ref={ref}>
                <div>Grant operator</div>

                <Input
                    placeholder="Type address you want grant to operator"
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                />
                <LabelButton>
                    <PrimaryButton
                        name="Confirm"
                        height="32px"
                        onClick={handleOnGrantOperator}
                    />
                </LabelButton>
                {/* <button onClick={handleOnGrantOperator}>Grant operator</button> */}
            </Container>
        </>
    )
}

const Container = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg5) !important;
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 20px 25px;
    background-color: #00000073;
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    max-width: 500px;
    width: 100%;
    padding: 20px 30px;
    backdrop-filter: blur(40px);
    z-index: 998;

    font-size: 20px;

    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
    gap: 10px;
    @media screen and (max-width: 576px) {
        max-width: 400px;
        width: 90%;
        padding: 20px 20px;
    }
    @media screen and (max-width: 390px) {
        max-width: 370px;
        padding: 20px 15px;
    }
`

const Input = styled.input`
    width: 85%;
    padding: 0px 10px;
    border: 1px solid var(--border2);
    height: 30px;
    border-radius: 6px;
    background: none;
    text-align: end;
    :focus {
        outline: none;
    }
    ::placeholder {
        color: #7b7777;
    }
    font-size: 14px;
    color: white;
    @media screen and (max-width: 576px) {
        input {
            padding: 2px 5px;
        }
    }
`

const LabelButton = styled.div`
    width: 60%;
    margin: auto;
`
export default Admin
