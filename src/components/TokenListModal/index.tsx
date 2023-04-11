import React, { ChangeEvent, useState, useEffect } from 'react'
import styled from 'styled-components'
import Modal from 'components/Modal'
import { Columns, Row } from 'components/Layouts'
import SearchInput from 'components/Input/SearchInput'
import { CommonBaseTokens, NATIVE_COIN } from 'constants/index'
import { Field, Token, TokenList } from 'interfaces'
import CommonBase from './CommonBase'
import { useTokenList, useAddTokenToCurrentList } from 'states/lists/hooks'
import TokenSelection from './TokenSelection'
import SelectTokenButton from 'components/Buttons/SelectButton'
import CloseIcon from 'assets/icons/x.svg'
import { useAllTokenBalances } from 'hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'hooks'
import { useToken } from 'hooks/useToken'

interface TokenListModalProps {
    token: Token | undefined
    field: Field
    onUserSelect: (field: Field, token: Token) => void
}

const TokenListModal = ({
    token,
    field,
    onUserSelect,
}: TokenListModalProps) => {
    const [searchQuery, setSearchQuery] = useState<string | undefined>('')
    const { currentList: tokens } = useTokenList()
    const addTokenToCurrentList = useAddTokenToCurrentList()
    const [searchedToken, setSearchedToken] = useState<Token | undefined>()
    const [renderedTokenList, setRenderTokenList] = useState<Token[] | []>([])
    const allTokenBalances = useAllTokenBalances()
    const { chainId } = useActiveWeb3React()
    const queriedToken = useToken(searchQuery)
    useEffect(() => {
        if(queriedToken) setRenderTokenList(tokens => [...tokens, queriedToken])
    }, [searchQuery])

    const handleSearchToken = async (
        e: ChangeEvent<HTMLInputElement>,
    ): Promise<void> => {
        const searchQuery = e.target.value
        setSearchQuery(searchQuery)
        searchedToken && setSearchedToken(undefined)
        const tokenHasAlreadyInList =
            searchQuery && tokens.length > 0
                ? tokens.filter(
                      (token: Token) =>
                          token.name.includes(searchQuery) ||
                          token.address.includes(searchQuery) ||
                          token.symbol.includes(searchQuery),
                  )
                : []
        if (tokenHasAlreadyInList.length > 0) {
            setRenderTokenList(tokenHasAlreadyInList)
            return
        }
        if (searchQuery && tokenHasAlreadyInList.length === 0) {
            setRenderTokenList([])
            return
        }
        setRenderTokenList(tokens)
    }

    const handleAddToken = (token: Token) => {
        addTokenToCurrentList(token)
        setSearchedToken(undefined)
    }

    const sortTokenList = () => {
        let sortedTokenList: TokenList = []
        Object.entries(allTokenBalances)
            .map(([k]) => {
                const token = tokens.find((t) => t.address === k)
                return token && sortedTokenList.push(token)
            })
        const newTokens = tokens.filter((t) => !sortedTokenList.includes(t))
        const filteredByChainIdTokens = [
            ...sortedTokenList,
            ...newTokens,
        ].filter((item) => item.chainId === chainId || item.address === NATIVE_COIN.address)
        setRenderTokenList(filteredByChainIdTokens)
    }

    useEffect(() => {
        sortTokenList()
    }, [tokens, chainId])

    const ModalButton = (onOpen: () => void) => {
        return (
            <SelectTokenButton
                token={token}
                name={token?.symbol || 'Select a token'}
                onClick={onOpen}
            />
        )
    }

    const ModalContent = (onClose: () => void) => {
        return (
            <ModalContentWrapper gap={'16px'}>
                <Row jus="space-between">
                    <div className="title">Select a token</div>
                    <div className="close-btn" onClick={onClose}>
                        <img src={CloseIcon} alt="close icon" />
                    </div>
                </Row>
                <SearchInput
                    value={searchQuery}
                    onChange={handleSearchToken}
                    placeholder="Search name or paste address"
                />
                <Row gap="10px" wrap="wrap">
                    {CommonBaseTokens.map((token: Token, index: number) => {
                        return (
                            <CommonBase
                                key={index + 1}
                                token={token}
                                onUserSelect={(e) => {
                                    onUserSelect(field, token)
                                    onClose()
                                }}
                            />
                        )
                    })}
                </Row>
                <Hr />
                <WrapList>
                    {!searchedToken ? (
                        renderedTokenList.length > 0 &&
                        renderedTokenList.map((token: Token, index: number) => {
                            return (
                                <TokenSelection
                                    key={index + 1}
                                    token={token}
                                    balance={
                                        (allTokenBalances[token.address] &&
                                            Number(
                                                allTokenBalances[token.address],
                                            ).toFixed(4)) ||
                                        0
                                    }
                                    onUserSelect={() => {
                                        onUserSelect(field, token)
                                        onClose()
                                    }}
                                />
                            )
                        })
                    ) : (
                        <TokenSelection
                            token={searchedToken}
                            balance={
                                allTokenBalances?.[
                                    searchedToken.address
                                ]?.toString() || 0
                            }
                            onUserSelect={(e) => {
                                onUserSelect(field, searchedToken)
                                onClose()
                            }}
                            hideAddButton={false}
                            onAdd={() => handleAddToken(searchedToken)}
                        />
                    )}
                </WrapList>
            </ModalContentWrapper>
        )
    }

    return (
        <Wrapper>
            <Modal
                children={(onClose) => ModalContent(onClose)}
                button={(onOpen) => ModalButton(onOpen)}
            />
        </Wrapper>
    )
}

const Wrapper = styled.div``
const Hr = styled.div`
    width: 100%;
    border-top: 1px solid var(--border1);
`

const ModalContentWrapper = styled(Columns)`
    .title {
        font-size: 18px;
        font-weight: 500;
    }

    .close-btn {
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        font-style: normal;
    }
`

const WrapList = styled.div`
    max-height: 305px;
    height: 100%;
    overflow: hidden auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    ::-webkit-scrollbar {
        border-radius: 20px;
        width: 4px;
        background: #ffffff81;
        display: none;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 20px;
        width: 8px;
    }
    @media screen and (max-width: 375px) {
        max-height: 225px;
    }
`

export default TokenListModal
