import styled from 'styled-components'
import { Columns, Row } from 'components/Layouts'
import { shortenAddress } from 'utils'
import { useState } from 'react'
import { useFairLaunchContract } from 'hooks/useContract'
import { mulNumberWithDecimal } from 'utils/math'
import { useLaunchpadInfo } from 'hooks/useLaunchpads'

const LaunchpadItem = ({ address, owner } : { address: string, owner: string }) => {
    const [commit, setCommit] = useState('')
    const fairlaunchContract = useFairLaunchContract(address)
    const launchpadInfo = useLaunchpadInfo(address)
    console.log({launchpadInfo})

    const onCommit = async () => {
        try {
            if(isNaN(Number(commit))) return
            console.log('committing...')
            const amount = mulNumberWithDecimal(commit, 18)
            const txn = await fairlaunchContract?.commit(amount, {value: amount})
            await txn.wait()
            console.log('commit success')
        } 
        catch(err) {
            console.log('failed to commit', err)
        }
    }

    const onClaim = async () => {
        try {
            console.log('claiming...')
            const txn = await fairlaunchContract?.claim()
            await txn.wait()
            console.log('claim success')
        } 
        catch(err) {
            console.log('failed to claim', err)
        }
    }

    const onFinalize = async () => {
        try {
            console.log('finalizing...')
            const txn = await fairlaunchContract?.finalize()
            await txn.wait()
            console.log('finalize success')
        } 
        catch(err) {
            console.log('failed to claim', err)
        }
    }

    const setNewLaunchTime = async () => {
        try {
            const startTime = new Date().getTime() / 1000 + 300//start after 5min 
            const endTime = startTime + 86400 //end after start 1day
            console.log('setting...')
            console.log()
            const txn = await fairlaunchContract?.setTimestamp(startTime.toFixed(), endTime.toFixed())
            await txn.wait()
            console.log('set new time success')
        } 
        catch(err) {
            console.log('failed to set new launchpad duration', err)
        }
    }

    return(
        <Wrapper gap="5px">
            <Row gap="10px">
                <div>
                    <div>Address: {shortenAddress(address)}</div>
                    <div>Owner: {shortenAddress(owner)}</div>
                    <div>Start time: {launchpadInfo?.startTime}</div>
                    <div>End time: {launchpadInfo?.endTime}</div>
                    <div>Hard cap: {launchpadInfo?.hardcap}</div>
                    <div>Soft cap: {launchpadInfo?.softcap}</div>
                </div>
                <div>
                    <div>Total token sale: {launchpadInfo?.totalTokenSale}</div>
                    <div>Total commitment: {launchpadInfo?.totalCommitment}</div>
                    <div>Result: {launchpadInfo?.launchpadResult}</div>
                    <div>Finalized: {launchpadInfo?.finalized ? 'true' : 'false'}</div>
                    <div>Individual cap: {launchpadInfo?.individualCap}</div>
                </div>
            </Row>
            <Row gap="10px">
                <input type="text" placeholder={"commit amount"} value={commit} onChange={(e) => setCommit(e.target.value)} />
                <button onClick={() => onCommit()}>commit</button>
            </Row>
            <Row gap="10px">
                <button onClick={() => onClaim()}>claim</button>
                <button onClick={() => setNewLaunchTime()}>set time</button>
                <button onClick={() => onFinalize()}>finalize</button>
            </Row>
        </Wrapper>
    )
}

const Wrapper = styled(Columns)`
    padding: 10px;
    border: 1px solid white;
    font-size: 14px;
    button {
        cursor: pointer;
    }
`

export default LaunchpadItem