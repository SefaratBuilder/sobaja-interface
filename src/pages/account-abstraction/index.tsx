import React, { useEffect, useState } from 'react'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { Columns, Row } from 'components/Layouts';
import { useSmartAccountContext } from 'contexts/SmartAccountContext';
import { useWeb3AuthContext } from 'contexts/SocialLoginContext';
import styled from 'styled-components'
import { shortenAddress } from 'utils';
import { useAAEntryPointContract, useNftSmartAccountContract } from 'hooks/useContract';
import { useCurrencyBalance, useCurrencyBalances, useETHBalances } from 'hooks/useCurrencyBalance';
import { NATIVE_COIN } from 'constants/index';
import { useTransactionHandler } from 'states/transactions/hooks';
import { SimpleAccountAPI } from 'pantinho-aa'
import { useSmartAccount } from 'hooks/useSmartAccount';
import { useActiveWeb3React } from 'hooks';
import { useAAFactory } from 'hooks/useAAFactory';
import { AAEntryPoints, AAFactory } from 'constants/addresses';
import { mulNumberWithDecimal } from 'utils/math';
import { ethers } from 'ethers';

const newSmartAccount = '0xCB7c527e22307529F803A5A3CB73BFe5E60b39d9';

const AA = () => {
    const { account, library, chainId } = useActiveWeb3React()
    const { connect, address, loading: eoaWalletLding, disconnect, web3Provider } = useWeb3AuthContext()
    const { loading, wallet, state: walletState } = useSmartAccountContext()
    const [txnLoading, setTxnLoading] = useState(false)
    const nftContract = useNftSmartAccountContract()
    const balances = useCurrencyBalances(wallet?.address?.toLowerCase(), [NATIVE_COIN[80001]])
    const [nftBalance, setNftBalance] = useState('')
    const {addTxn} = useTransactionHandler()
    const [paidTxn, setPaidTxn] = useState<any>()
    const [signedUserOp, setSignedUserOp] = useState<any>()
    const { data } = useSmartAccount(newSmartAccount)
    const entryPointContract = useAAEntryPointContract()
    const { contract, smartAccountAtZero } = useAAFactory()
    console.log('smartAccount at zero index', smartAccountAtZero)
    console.log('addresssssss', contract?.address)
    const onDeployAccount = async () => {
        try {
            if(!contract || !account) return
            const deployResult = await contract.deployCounterFactualAccount(account, '0')
            await deployResult.wait()
            console.log('txn hash', deployResult)
        }
        catch(err) {
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
        if(!chainId || !library || !account || !web3Provider) return 
        const owner = library.getSigner(account)
        const provider = new ethers.providers.JsonRpcProvider('https://testnet.era.zksync.dev', {name: 'eratest', chainId: 280})
        console.log('provider', provider)
        const walletAPI = new SimpleAccountAPI({
            provider: provider,
            entryPointAddress: AAEntryPoints[chainId],
            owner,
            factoryAddress: AAFactory[chainId],
            index: 0,
            accountAddress: newSmartAccount
        })

        //transfer 0.001ETH from smart account to this eoa account
        const txn = {
            target: account,
            data: '0x',
            nonce: data.nonce,
            value: mulNumberWithDecimal('0.001', 18)
        }

        const op = await walletAPI.createSignedUserOp(txn)
        op.signature = await op.signature
        op.nonce = await op.nonce
        op.sender = await op.sender
        op.preVerificationGas = await op.preVerificationGas
        op.initCode = '0x'
        setSignedUserOp(op)
    }

    const sendSignedUserOp = async () => {
        if(!entryPointContract || !signedUserOp) return 
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
    console.log({signedUserOp})
    return(
        <AAWrapper gap="10px">
            <Row gap="10px">
                <div>address: </div>
                <div>{address}</div>
            </Row>
            <Row gap="10px">
                <div>smart account: </div>
                <div>{wallet?.address}</div>
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
                <PrimaryButton onClick={onMint} name={'Mint nft'} isLoading={txnLoading} />
                <PrimaryButton onClick={onBatchMint} name ={'Batch mint nfts'} isLoading={txnLoading} />
            </Row>
            <Row gap="10px">
                <PrimaryButton onClick={signUserOp} name={'Sign userOp'} isLoading={txnLoading} />
                <PrimaryButton onClick={sendSignedUserOp} name={'Send signed userOp'} isLoading={txnLoading} />
            </Row>
            <Row gap="10px">
                <PrimaryButton onClick={onDeployAccount} name={'Deploy new account'} isLoading={txnLoading} />
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