import React, { useEffect, useState } from 'react'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { Columns, Row } from 'components/Layouts';
import { useSmartAccountContext } from 'contexts/SmartAccountContext';
import { useWeb3AuthContext } from 'contexts/SocialLoginContext';
import styled from 'styled-components'
import { shortenAddress } from 'utils';
import { useAAEntryPointContract, useNftSmartAccountContract, useTokenContract } from 'hooks/useContract';
import { useCurrencyBalance, useCurrencyBalances, useETHBalances } from 'hooks/useCurrencyBalance';
import { NATIVE_COIN } from 'constants/index';
import { useTransactionHandler } from 'states/transactions/hooks';
import { useSmartAccount } from 'hooks/useSmartAccount';
import { useActiveWeb3React } from 'hooks';
import { add, divNumberWithDecimal, mulNumberWithDecimal } from 'utils/math';
import { useAAFactory } from 'hooks/useAAFactory';
import { AAEntryPoints, AAFactory } from 'constants/addresses';
import { useToken } from 'hooks/useToken';

const AA = () => {
    const { contract: factoryContract, smartAccountAddress } = useAAFactory()
    const { account, provider, chainId } = useActiveWeb3React()
    const {addTxn} = useTransactionHandler()
    const [signedUserOp, setSignedUserOp] = useState<any>()
    const smartAccount = useSmartAccount()
    const { depositedFund, nonce, contract: smartAccountContract, sendTransactions, isDeployed } = smartAccount
    const entryPointContract = useAAEntryPointContract()
    const token = '0xDf9acc0a00Ae6Ec5eBc8D219d12A0157e7F18A68'
    const tokenContract = useTokenContract(token)
    const tokenType = useToken(token)
    const balanceToken = useCurrencyBalance(smartAccountAddress, tokenType)
    const balances = useCurrencyBalances(smartAccountAddress, [NATIVE_COIN[80001]])

    const onDeployAccount = async () => {
        try {
            if (!factoryContract || !account) return
            const deployResult = await factoryContract.deployCounterFactualAccount(
                account,
                '0',
            )
            await deployResult.wait()
            console.log('txn hash', deployResult)
        } catch (err) {
            console.log('failed to deploy: ', err)
        }
    }

    const onDeposit = async () => {
        try {
            if (!entryPointContract || !smartAccountAddress) return
            const deployResult = await entryPointContract.depositTo(
                smartAccountAddress,
                {
                    value: mulNumberWithDecimal('0.05', 18)
                }
            )
            await deployResult.wait()
            console.log('txn hash', deployResult)
        } catch (err) {
            console.log('failed to deploy: ', err)
        }
    }

    const onDepositOneUsdt = () => {
        tokenContract?.transfer(smartAccountAddress, mulNumberWithDecimal('1', 18))
    }

    const sendByOwner = async () => {
        try {
            if(!smartAccountContract || !tokenContract) return 
            const transferData = tokenContract.interface.encodeFunctionData('transfer', [account, mulNumberWithDecimal('0', 18)])
            const txn = [
                tokenContract.address,
                0,
                transferData
            ]
            const callResult = await smartAccountContract.executeCall(...txn)
            await callResult.wait()
            
            addTxn({
                hash: callResult.hash,
                msg: 'Send ok',
                status: true
            })
        }
        catch(err) {
            
            console.log('failed', err)
        }
    
    }

    const onWithdraw = async () => {
        try {
            if (!smartAccountContract || !smartAccountAddress) return console.log('asdasd', !smartAccountContract, !smartAccountAddress)
            const deployResult = await smartAccountContract.withdrawDepositTo(
                account,
                depositedFund
            )
            await deployResult.wait()
            console.log('txn hash', deployResult)
        } catch (err) {
            console.log('failed to deploy: ', err)
        }
    }

    const sendSignedUserOp = async () => {
        if(!entryPointContract || !signedUserOp) return 
        const callResult = await entryPointContract.handleOps([signedUserOp], account)
        await callResult.wait()
        addTxn({
            hash: callResult.hash,
            msg: "Sent successfully",
            status: true
        })
        
        setSignedUserOp(undefined)
    }

    const withdrawOneUsdt  = async () => {
        try {
            if(!tokenContract || !account) return
            const transferData = tokenContract.interface.encodeFunctionData('transfer', [account, mulNumberWithDecimal('1', 18)])
            const txn = {
                target: tokenContract.address,
                data: transferData,
                value: 0
            }
            const callResult = await sendTransactions([txn])
            if(!callResult) return
            await callResult.wait()
            console.log('ok', callResult)
        }
        catch(err) {
            console.log('failed', err)
        }
    }

    return(
        <AAWrapper gap="10px">
            <Row gap="10px">
                <div>address: </div>
                <div>{account}</div>
            </Row>
            <Row gap="10px">
                <div>smart account: </div>
                <div>{smartAccountAddress}</div>
            </Row>
            <Row gap="10px">
                <div>is deployed: </div>
                <div>{isDeployed ? 'true' : 'false'}</div>
            </Row>
            <Row gap="10px">
                <div>nonce: </div>
                <div>{nonce}</div>
            </Row>
            <Row gap="10px">
                <div>balance eth: </div>
                <div>{balances?.[0]} eth</div>
            </Row>
            <Row gap="10px">
                <div>balance usdt: </div>
                <div>{balanceToken || '0'} usdt</div>
            </Row>
            <Row gap="10px">
                <div>deposited gas fund: </div>
                <div>{divNumberWithDecimal(depositedFund, 18) || '0'} eth</div>
            </Row>
            <Row gap="10px">
                <PrimaryButton
                    onClick={onDepositOneUsdt}
                    name={'Deposit 1 USDT'}
                    
                />
                <PrimaryButton onClick={withdrawOneUsdt} name={'Withdraw 1 USDT'}  />
            </Row>
            <Row gap="10px">
                <PrimaryButton
                    onClick={onDeposit}
                    name={'Deposit gas fund'}
                    
                />
                <PrimaryButton
                    onClick={onWithdraw}
                    name={'Withdraw gas fund'}
                    
                />
            </Row>
            {/* <PrimaryButton
                    onClick={onDeployAccount}
                    name={'Deploy new account'}
                /> */}
        </AAWrapper>
    )
}

const AAWrapper = styled(Columns)`
    max-width: 800px;
    padding: 20px;
    border: 1px solid white;
    overflow: hidden;
    margin: 0 auto;
`

export default AA