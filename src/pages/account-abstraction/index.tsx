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
import { SimpleAccountAPI } from 'pantinho-aa'
import { useSmartAccount } from 'hooks/useSmartAccount';
import { useActiveWeb3React } from 'hooks';
import { add, divNumberWithDecimal, mulNumberWithDecimal } from 'utils/math';
import { useAAFactory } from 'hooks/useAAFactory';
import { AAEntryPoints, AAFactory } from 'constants/addresses';
import { useToken } from 'hooks/useToken';

const AA = () => {
    const { contract: factoryContract, smartAccountAddress } = useAAFactory()
    const { account, provider, chainId } = useActiveWeb3React()
    const { connect, address, loading: eoaWalletLding, disconnect, web3Provider } = useWeb3AuthContext()
    const { loading, wallet, state: walletState } = useSmartAccountContext()
    const [txnLoading, setTxnLoading] = useState(false)
    const nftContract = useNftSmartAccountContract()
    const [nftBalance, setNftBalance] = useState('')
    const {addTxn} = useTransactionHandler()
    const [paidTxn, setPaidTxn] = useState<any>()
    const [signedUserOp, setSignedUserOp] = useState<any>()
    const smartAccount = useSmartAccount()
    const { depositedFund, nonce, contract: smartAccountContract, signAndSendUserOps } = smartAccount
    const entryPointContract = useAAEntryPointContract()
    const token = '0xDf9acc0a00Ae6Ec5eBc8D219d12A0157e7F18A68'
    const tokenContract = useTokenContract(token)
    const tokenType = useToken(token)
    const balanceToken = useCurrencyBalance(smartAccountAddress, tokenType)
    const balances = useCurrencyBalances(smartAccountAddress, [NATIVE_COIN[80001]])
    console.log("data smart account", smartAccount)

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
            setTxnLoading(true)
            const callResult = await smartAccountContract.executeCall(...txn)
            await callResult.wait()
            setTxnLoading(false)
            addTxn({
                hash: callResult.hash,
                msg: 'Send ok',
                status: true
            })
        }
        catch(err) {
            setTxnLoading(false)
            console.log('failed', err)
        }
    
    }

    const onWithdraw = async () => {
        try {
            if (!smartAccountContract || !smartAccountAddress) return
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

    const signUserOp = async () => {
        if(!account || !tokenContract || !provider || !chainId) return 
        const transferData = tokenContract.interface.encodeFunctionData('transfer', [account, mulNumberWithDecimal('1', 18)])
        const owner = provider.getSigner(account)

        const walletAPI = new SimpleAccountAPI({
            provider: provider, 
            entryPointAddress: AAEntryPoints[chainId],
            owner,
            factoryAddress: AAFactory[chainId],
            index: 0,
            accountAddress: smartAccountAddress
        })
        const txn = {
            target: tokenContract.address,
            data: transferData,
            nonce: nonce,
            owner: account,
            value: 0
        }
        console.log({txn})
        const op = await walletAPI.createSignedUserOp(txn)
        op.signature = await op.signature
        op.nonce = await op.nonce
        op.sender = await op.sender
        op.preVerificationGas = await op.preVerificationGas
        console.log('userop =========>', op)
        setSignedUserOp(op)
    }

    const sendSignedUserOp = async () => {
        if(!entryPointContract || !signedUserOp) return 
        console.log('asdsad')
        setTxnLoading(true)
        const callResult = await entryPointContract.handleOps([signedUserOp], account)
        await callResult.wait()
        addTxn({
            hash: callResult.hash,
            msg: "Sent successfully",
            status: true
        })
        setTxnLoading(false)
        setSignedUserOp(undefined)
    }

    const signAndSendUserOp  = async () => {
        try {
            if(!tokenContract || !account) return
            const transferData = tokenContract.interface.encodeFunctionData('transfer', [account, mulNumberWithDecimal('1', 18)])
            const txn = {
                to: tokenContract.address,
                data: transferData,
                value: 0
            }
            const callResult = await signAndSendUserOps(txn)
            if(!callResult) return
            await callResult.wait()
            console.log('ok', callResult)
        }
        catch(err) {
            console.log('failed', err)
        }
    }

    useEffect(() => {
        if(wallet?.address)
            nftContract?.balanceOf(wallet.address)
            .then((res: any) => setNftBalance(res.toString()))
    }, [wallet])

    return(
        <AAWrapper gap="10px">
            <Row gap="10px">
                <div>address: </div>
                <div>{account}</div>
            </Row>
            <Row gap="10px">
                <div>smart account: </div>
                <div>{smartAccountAddress || wallet?.address}</div>
            </Row>
            <Row gap="10px">
                <div>balance eth: </div>
                <div>{balances?.[0]} eth</div>
            </Row>
            {/* <Row gap="10px">
                <div>balance nft: </div>
                <div>{nftBalance || '0'}</div>
            </Row> */}
            <Row gap="10px">
                <div>balance usdt: </div>
                <div>{balanceToken || '0'} usdt</div>
            </Row>
            <Row gap="10px">
                <div>deposited gas fund: </div>
                <div>{divNumberWithDecimal(depositedFund, 18) || '0'} eth</div>
            </Row>
            {/* <Row gap="10px">
                <PrimaryButton onClick={onMint} name={'Mint nft'}  />
                <PrimaryButton onClick={onBatchMint} name ={'Batch mint nfts'}  />
            </Row> */}
            <Row gap="10px">
                <PrimaryButton onClick={signUserOp} name={'Sign userOp'}  />
                <PrimaryButton onClick={sendByOwner} name={'Send by owner'}  />
                <PrimaryButton onClick={sendSignedUserOp} name={'Send signed userOp'}  />
                <PrimaryButton onClick={signAndSendUserOp} name={'Sign and send'}  />
            </Row>
            <Row gap="10px">
                <PrimaryButton
                    onClick={onDepositOneUsdt}
                    name={'Deposit 1 USDT'}
                    
                />
                <PrimaryButton
                    onClick={onDeposit}
                    name={'Deposit gas fund'}
                    
                />
                <PrimaryButton
                    onClick={onWithdraw}
                    name={'Withdraw gas fund'}
                    
                />
                <PrimaryButton
                    onClick={onDeployAccount}
                    name={'Deploy new account'}
                    
                />
            </Row>
            <Row gap="10px">
                <PrimaryButton onClick={connect} name={'Connect AA'} />
                <PrimaryButton onClick={disconnect} name ={'Disconnect AA'} />
            </Row>
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