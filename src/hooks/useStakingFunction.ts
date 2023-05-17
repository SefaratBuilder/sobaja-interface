import { addTxn } from './../states/transactions/actions'
import { useActiveWeb3React } from 'hooks'
import { useStakingContract } from './useContract'
import { sendEvent } from 'utils/analytics'
import { useTransactionHandler } from 'states/transactions/hooks'
import { URLSCAN_BY_CHAINID } from 'constants/index'

export function useHarvest(positionIndex: Number | null | undefined) {
    const { account, chainId } = useActiveWeb3React()
    const stakingContract = useStakingContract()
    const { addTxn } = useTransactionHandler()

    const handleOnHarvest = async () => {
        console.log('Testing harvest ....')
        try {
            console.log('Harvesting ....')

            const args = [positionIndex]
            const method = 'harvest'
            const gasLimit = await stakingContract?.estimateGas?.[method]?.(
                ...args,
            )

            const callResult = await stakingContract?.[method]?.(...args, {
                gasLimit: gasLimit && gasLimit.add(1000),
            })
            console.log('🤦‍♂️ ⟹ handleOnHarvest ⟹ callResult:', { callResult })

            sendEvent({
                category: 'Defi',
                action: 'Harvesting',
                label: [positionIndex].join('/'),
            })
            const txn = await callResult.wait()
            console.log('TXN', txn)

            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx${
                    callResult.hash || ''
                }`,
                msg: `Harvesting at index ${positionIndex}`,
                status: txn.status === 1 ? true : false,
            })
        } catch (error) {
            console.log(error)
        }
    }
    return handleOnHarvest
}

// memorize the function that execute
export function useWithDraw(positionIndex: Number | null | undefined) {
    const { account, chainId } = useActiveWeb3React()
    const stakingContract = useStakingContract()

    const handleOnWithDraw = async () => {
        console.log('Testing withdraw .....')
        try {
            console.log('Withdrawing ....')
            const args = [positionIndex]
            const method = 'withdraw'
            const gasLimit = await stakingContract?.estimateGas?.[method]?.(
                ...args,
            )
            const callResult = await stakingContract?.[method]?.(...args, {
                gasLimit: gasLimit && gasLimit.add(1000),
            })
            console.log('🤦‍♂️ ⟹ handleOnWithdraw ⟹ callResult:', { callResult })

            sendEvent({
                category: 'Defi',
                action: 'Withdrawing',
                label: [positionIndex].join('/'),
            })
            const txn = await callResult.wait()
            addTxn({
                hash: `${chainId && URLSCAN_BY_CHAINID[chainId].url}/tx${
                    callResult.hash || ''
                }`,
                msg: `Withdrawing at index ${positionIndex}`,
                status: txn.status === 1 ? true : false,
            })
        } catch (error) {
            console.log(error)
        }
    }
    return handleOnWithDraw
}
