
import { Row, Columns } from 'components/Layouts'
import { LAUNCHPADS } from 'constants/addresses'
import { useActiveWeb3React } from 'hooks'
import { useTokenApproval, useToken } from 'hooks/useToken'
import { useState } from 'react'
import styled from 'styled-components'
import { add, div, mulNumberWithDecimal } from 'utils/math'
import { useLaunchpadContract } from 'hooks/useContract'
import FAIRLAUNCH_INTERFACE from 'constants/jsons/fairlaunch'
import { useQueryLaunchpad } from 'hooks/useQueryLaunchpad'
import { shortenAddress } from 'utils'
import LaunchpadItem from './components/LaunchpadItem'
import Admin from './components/Admin'

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
    const { account, chainId } = useActiveWeb3React()
    const token = useToken(launchpadState.token ? launchpadState.token : undefined)
    const paymentToken = useToken(launchpadState.paymentCurrency ? launchpadState.paymentCurrency : undefined)
    const tokenApproval = useTokenApproval(account, chainId ? LAUNCHPADS[chainId] : null, token)
    const launchpadContract = useLaunchpadContract()
    console.log({data, loading, error})
    
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
                        {data?.launchpadCreateds?.map((item: { address: string, owner: string }) => {
                            return (
                                <LaunchpadItem key={item.address} {...item} />
                            )
                        })}
                    </LaunchpadList>
                    <button style={{width: 100}} onClick={() => refetch()}>Refetch</button>
                </Columns>
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