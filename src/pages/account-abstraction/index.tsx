import React, { useEffect, useState } from 'react'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { Columns, Row } from 'components/Layouts';
import { useSmartAccountContext } from 'contexts/SmartAccountContext';
import { useWeb3AuthContext } from 'contexts/SocialLoginContext';
import styled from 'styled-components'
import { shortenAddress } from 'utils';
import { useNftSmartAccountContract } from 'hooks/useContract';
import { useCurrencyBalance, useCurrencyBalances, useETHBalances } from 'hooks/useCurrencyBalance';
import { NATIVE_COIN } from 'constants/index';
import { useTransactionHandler } from 'states/transactions/hooks';

const AA = () => {
    const { connect, address, loading: eoaWalletLding, disconnect, web3Provider } = useWeb3AuthContext()
    const { loading, wallet, state: walletState } = useSmartAccountContext()
    const [txnLoading, setTxnLoading] = useState(false)
    const nftContract = useNftSmartAccountContract()
    const balances = useCurrencyBalances(wallet?.address?.toLowerCase(), [NATIVE_COIN[80001]])
    const [nftBalance, setNftBalance] = useState('')
    const {addTxn} = useTransactionHandler()

    const onMint = async () => {
        if (!wallet || !walletState || !web3Provider || !nftContract) return;
        try {
            console.log('populating...')
            setTxnLoading(true)
            const safeMintTx = await nftContract.populateTransaction.safeMint(
              wallet.address
            );
            console.log('data', safeMintTx.data);
            const tx1 = {
              to: nftContract.address,
              data: safeMintTx.data,
            };
            const txResponse = await wallet.sendTransaction({
                transaction: tx1,
            });
            const txHash = await txResponse.wait()
            setTxnLoading(false)
            addTxn({
                hash: txHash.transactionHash,
                msg: 'Mint nft success',
                status: true
            })
            console.log('mint success with hash: ', txHash.transactionHash)
        }
        catch(err) {
            setTxnLoading(false)
            console.log('failed to mint nft', err)
        }
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