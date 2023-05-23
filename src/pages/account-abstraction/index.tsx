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
import { mulNumberWithDecimal } from 'utils/math';
import { useAAFactory } from 'hooks/useAAFactory';
import { AAEntryPoints, AAFactory } from 'constants/addresses';
import { useToken } from 'hooks/useToken';

const smartAccountAddress = '0x330c7Cbb3b029C58E06E004c22cDef0E13ee97Db'

const AA = () => {
    const { account, provider, chainId } = useActiveWeb3React()
    const { connect, address, loading: eoaWalletLding, disconnect, web3Provider } = useWeb3AuthContext()
    const { loading, wallet, state: walletState } = useSmartAccountContext()
    const [txnLoading, setTxnLoading] = useState(false)
    const nftContract = useNftSmartAccountContract()
    const [nftBalance, setNftBalance] = useState('')
    const {addTxn} = useTransactionHandler()
    const [paidTxn, setPaidTxn] = useState<any>()
    const [signedUserOp, setSignedUserOp] = useState<any>()
    const { data } = useSmartAccount(smartAccountAddress || wallet?.address)
    const entryPointContract = useAAEntryPointContract()
    const token = '0xDf9acc0a00Ae6Ec5eBc8D219d12A0157e7F18A68'
    const tokenContract = useTokenContract(token)
    const tokenType = useToken(token)
    const { contract, smartAccountAtZero } = useAAFactory()
    const balanceToken = useCurrencyBalance(smartAccountAddress || wallet?.address?.toLowerCase(), tokenType)
    const balances = useCurrencyBalances(smartAccountAddress || wallet?.address?.toLowerCase(), [NATIVE_COIN[80001]])

    const onDeployAccount = async () => {
        try {
            if (!contract || !account) return
            const deployResult = await contract.deployCounterFactualAccount(
                account,
                '0',
            )
            await deployResult.wait()
            console.log('txn hash', deployResult)
        } catch (err) {
            console.log('failed to deploy: ', err)
        }
    }


    const onMint = async () => {
        if (!wallet || !walletState || !web3Provider || !nftContract) return;
        try {

            setTxnLoading(true)
            const safeMintTx = await nftContract.populateTransaction.safeMint(
              wallet.address
            );

            const tx1 = {
              to: nftContract.address,
              data: safeMintTx.data,
            };

            const feeQuotes = await wallet.getFeeQuotesForBatch({
                transactions: [tx1]
            })
            console.log({feeQuotes})
            const paidTransaction = await wallet.createUserPaidTransaction({
                transaction: tx1,
                feeQuote: feeQuotes[0]
            })
            setPaidTxn(paidTransaction)
            console.log('signing...', {paidTransaction})
            const txn = await wallet.sendUserPaidTransaction({
                tx: paidTransaction
            })
            setTxnLoading(false)
        }
        catch(err) {
            setTxnLoading(false)
            console.log('failed to mint nft', err)
        }
    }

    const signUserOp = async () => {
        if(!account || !tokenContract || !provider || !chainId) return 
        const transferData = await tokenContract.interface.encodeFunctionData('transfer', [account, mulNumberWithDecimal('1', 18)])
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
            nonce: data.nonce,
            owner: account,
            value: 0
        }

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
        setTxnLoading(true)
        const callResult = await entryPointContract.handleOps([signedUserOp], account, { value: 11 })
        await callResult.wait()
        addTxn({
            hash: callResult.hash,
            msg: "Sent successfully",
            status: true
        })
        setTxnLoading(false)
        setSignedUserOp(undefined)

        
    }

    const onBatchMint = async () => {
        if (!wallet || !walletState || !web3Provider || !nftContract) return;
        try {
            console.log('populating...')
            setTxnLoading(true)
            const safeMintTx = await nftContract.populateTransaction.safeMint(
              wallet.address
            );
            const tx1 = {
                to: nftContract.address,
                data: safeMintTx.data,
              };
              const tx2 = {
                to: nftContract.address,
                data: safeMintTx.data,
              };
            const txResponse = await wallet.sendTransactionBatch({
                transactions: [tx1, tx2],
            });
            const txHash = await txResponse.wait()
            setTxnLoading(false)
            addTxn({
                hash: txHash.transactionHash,
                msg: 'Mint batch nfts success',
                status: true
            })
            console.log('mint success with hash: ', txHash.transactionHash)
        }
        catch(err) {
            setTxnLoading(false)
            console.log('failed to mint nft', err)
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
                <div>balance matic: </div>
                <div>{balances?.[0]}</div>
            </Row>
            <Row gap="10px">
                <div>balance nft: </div>
                <div>{nftBalance || '0'}</div>
            </Row>
            <Row gap="10px">
                <div>balance nft: </div>
                <div>{balanceToken || '0'}</div>
            </Row>
            <Row gap="10px">
                <PrimaryButton onClick={onMint} name={'Mint nft'} isLoading={txnLoading} />
                <PrimaryButton onClick={onBatchMint} name ={'Batch mint nfts'} isLoading={txnLoading} />
            </Row>
            <Row gap="10px">
                <PrimaryButton onClick={signUserOp} name={'Sign userOp'} isLoading={txnLoading} />
                <PrimaryButton onClick={sendSignedUserOp} name={'Send signed userOp'} isLoading={txnLoading} />
            </Row>
            <Row gap="10px">
                <PrimaryButton
                    onClick={onDeployAccount}
                    name={'Deploy new account'}
                    isLoading={txnLoading}
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