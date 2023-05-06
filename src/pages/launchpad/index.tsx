
import { Row, Columns } from 'components/Layouts'
import { LAUNCHPADS } from 'constants/addresses'
import { useActiveWeb3React } from 'hooks'
import { useTokenApproval, useToken } from 'hooks/useToken'
import { useState } from 'react'
import styled from 'styled-components'
import { add, div, mulNumberWithDecimal } from 'utils/math'
import { useAAEntryPointContract, useLaunchpadContract } from 'hooks/useContract'
import FAIRLAUNCH_INTERFACE from 'constants/jsons/fairlaunch'
import { useQueryLaunchpad } from 'hooks/useQueryLaunchpad'
import { shortenAddress } from 'utils'
import LaunchpadItem from './components/LaunchpadItem'
import Admin from './components/Admin'
import { LaunchpadInfo } from 'interfaces'

const Launchpad = () => {
    const [launchpadState, setLaunchpadState] = useState({
        token: '0xdEfd221072dD078d11590D58128399C2fe8cCa7e',
        paymentCurrency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        startTime: ((new Date()).getTime() / 1000).toFixed(),
        endTime: ((new Date()).getTime() / 1000).toFixed(),
        softCap: '1',
        hardCap: '3',
        price: '0.1',
        individualCap: '1',
        overflow: '10',
        totalToken: '40'
    })
    const { error, loading, data, refetch } = useQueryLaunchpad()
    const { account, chainId, library } = useActiveWeb3React()
    const token = useToken(launchpadState.token ? launchpadState.token : undefined)
    const paymentToken = useToken(launchpadState.paymentCurrency ? launchpadState.paymentCurrency : undefined)
    const tokenApproval = useTokenApproval(account, chainId ? LAUNCHPADS[chainId] : null, token)
    const launchpadContract = useLaunchpadContract()
    const entryContract = useAAEntryPointContract()

    const handleOnCreateLaunchpad = async (e: any) => {
        try {
            e.preventDefault()
            if(!token || !chainId) return
            const args = [
                LAUNCHPADS[chainId], 
                launchpadState.token,
                account,
                launchpadState.paymentCurrency,
                add(launchpadState.startTime, 300), // start after 5m
                add(launchpadState.endTime, 310), // end after 5m + 10s
                mulNumberWithDecimal(launchpadState.softCap, 18),
                mulNumberWithDecimal(launchpadState.hardCap, 18),
                mulNumberWithDecimal(launchpadState.price, 18),
                mulNumberWithDecimal(launchpadState.individualCap, 18),
                mulNumberWithDecimal(launchpadState.overflow, token.decimals)
            ]
           const data = FAIRLAUNCH_INTERFACE._abiCoder.encode(
                [
                    'address',
                    'address',
                    'address',
                    'address',
                    'uint256',
                    'uint256',
                    'uint256',
                    'uint256',
                    'uint256',
                    'uint256',
                    'uint256',
                ],
                args
           )
            const amountToken = launchpadState.totalToken
            console.log('Creating...')
            const txn = await launchpadContract?.createLaunchpad(1, token.address, mulNumberWithDecimal(amountToken, token.decimals), data)
            await txn.wait()
            console.log('Create successful...', txn.hash)

        } catch(err) {
            console.log('failed to create', err)
        }
    }

    const handleOnApprove = () => {
        if(!chainId) return
        tokenApproval.approve(LAUNCHPADS[chainId], '11')
    }

    const handleOnSendTransaction = async () => {
        try {
            if(!library || !account) return
            const args = [
                [{
                    sender: account,
                    nonce: await library.getTransactionCount(account),
                    initCode: '0x9406cc6185a346906296840746125a0e449764545fbfb9cf000000000000000000000000116a9704b565bbe2ec70d95075404da3950871760000000000000000000000000000000000000000000000000000000000000000',
                    callData: '0xb61d27f60000000000000000000000004cfb958a43323bc0068472fb1ebb4799124bc8450000000000000000000000000000000000000000000000000011c37937e0800000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000',
                    callGasLimit: '33100',
                    verificationGasLimit: '361460',
                    preVerificationGas: '44992',
                    maxFeePerGas: '1695000032',
                    maxPriorityFeePerGas: '1695000000',
                    paymasterAndData: '0x',
                    signature: '0x706a1ea7f721803e915300063cbfe291912ddeeb39a383033b54844ace43c90c2db8356bf7f69276ddaf8a9236bd6de0ed11230ff3a3243fc73908a000151a181c'
                }],
                account
            ]
            const result = await entryContract?.handleOps(...args, { gasLimit: '1000000'})
            await result.wait()
            console.log("okkkkkkkk", result)
        }
        catch(err) {
            console.log('failed :', err)
        }
    }

    return(
        <Container>
            <Row gap="5px" jus="space-between">
                <form onSubmit={handleOnCreateLaunchpad}>
                    <label>Launchpad Token</label>
                    {
                        token ? (
                            <div>{token.name}({token.symbol})</div>
                        ) : <></>
                    }
                    <input type="text" placeholder="launchpad token" value={launchpadState.token} onChange={(e) => setLaunchpadState({...launchpadState, token: e.target.value})} required />
                    <label>Payment currency</label>
                    {
                        paymentToken ? (
                            <div>{paymentToken.name}({paymentToken.symbol})</div>
                        ) : <></>
                    } 
                    <input type="text" placeholder="payment currency" value={launchpadState.paymentCurrency} onChange={(e) => setLaunchpadState({...launchpadState, paymentCurrency: e.target.value})} required />
                        
                    <label>Soft cap</label>
                    <input type="text" placeholder="soft cap" value={launchpadState.softCap} onChange={(e) => setLaunchpadState({...launchpadState, softCap: e.target.value})} required />
                    <label>Hard cap</label>
                    <input type="text" placeholder="hard cap" value={launchpadState.hardCap} onChange={(e) => setLaunchpadState({...launchpadState, hardCap: e.target.value})} required />
                    <label>Price</label>
                    <input type="text" placeholder="price" value={launchpadState.price} onChange={(e) => setLaunchpadState({...launchpadState, price: e.target.value})} required />
                    <label>Individual cap</label>
                    <input type="text" placeholder="individual cap" value={launchpadState.individualCap} onChange={(e) => setLaunchpadState({...launchpadState, individualCap: e.target.value})} required />
                    <label>Overflow token reward</label>
                    <input type="text" placeholder="overflow token reward" value={launchpadState.overflow} onChange={(e) => setLaunchpadState({...launchpadState, overflow: e.target.value})} required />
                    <label>Total tokens</label>
                    <input type="text" placeholder="total tokens" value={launchpadState.totalToken} onChange={(e) => setLaunchpadState({...launchpadState, totalToken: e.target.value})} required />
                    {
                        Number(tokenApproval.allowance?._value) < Number(launchpadState.totalToken) 
                            ? <button onClick={handleOnApprove}>{`Approve ${token?.symbol}`}</button>
                            : <input type="submit" value="Create Fairlaunch" />
                    }
                </form>
                <Admin />
                <Columns gap="10px" al="flex-end">
                    <LaunchpadList gap="10px" jus="flex-end">
                        {data?.launchpads?.map((item: LaunchpadInfo) => {
                            return (
                                <LaunchpadItem key={item.id} {...item} />
                            )
                        })}
                    </LaunchpadList>
                    <button style={{width: 100}} onClick={() => refetch()}>Refetch</button>
                </Columns>
            </Row>
            <Row>
                Account abstraction testing
                <button onClick={handleOnSendTransaction}>Send transaction</button>
            </Row>
        </Container>
    )
}

const LaunchpadList = styled(Row)`
    flex-wrap: wrap;
    max-width: 900px;
`

const Container = styled.div`
    margin-bottom: 50px;
    padding: 2rem;
    form {
        display: flex;
        flex-direction: column;
        input {
            font-size: 16px;
            padding: 2px;
            margin-bottom: 10px;
        }
    }
    button {
        cursor: pointer;
    }
`

export default Launchpad