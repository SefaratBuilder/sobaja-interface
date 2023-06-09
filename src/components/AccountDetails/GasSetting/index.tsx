import { useEffect, useState } from 'react'
import Modal from 'components/Modal'
import styled from 'styled-components'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { Columns, Row } from 'components/Layouts'
import GAS_ICON from 'assets/icons/gas-station-dark.svg'
import { Token } from 'interfaces'
import { GAS_TOKEN } from 'constants/index'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import { useAppState, useUpdateGasToken } from 'states/application/hooks'
import LogoToken from 'components/LogoToken'
import { useActiveWeb3React } from 'hooks'
import { useSmartAccountContext } from 'contexts/SmartAccountContext'
import checkLogo from 'assets/icons/check-mate.svg'
const TokenSelection = ({
    token,
    gasToken,
    onSetGasToken,
}: {
    token: Token
    gasToken: Token | undefined
    onSetGasToken: (token: Token) => void
}) => {
    const { smartAccountAddress } = useSmartAccountContext()
    const balance = useCurrencyBalance(smartAccountAddress, token)

    return (
        <TokenWrapper
            gap="10px"
            jus="space-between"
            onClick={() => onSetGasToken(token)}
            isActived={gasToken?.address === token.address}
        >
            <Row gap="5px" al="center">
                <LogoToken token={token} size="20px" />
                <div>
                    {token.name}({token.symbol})
                </div>
            </Row>
            <Row al="center" className="to" gap="5px">
                {(balance && Number(balance).toFixed(6)) || '0.00'}
                <LogoCheck>
                    {gasToken?.address === token.address && (
                        <img src={checkLogo} alt="check-mate" />
                    )}
                </LogoCheck>
            </Row>
        </TokenWrapper>
    )
}

const GasSetting = () => {
    const { gasToken: gasTokenDefault } = useAppState()
    const [gasToken, setGasToken] = useState<Token>(gasTokenDefault)
    const updateGasToken = useUpdateGasToken()
    const { chainId } = useActiveWeb3React()

    const Button = (onOpen: () => void) => {
        return (
            <GasIconButton onClick={onOpen}>
                <img src={GAS_ICON} alt="gas icon" />
            </GasIconButton>
        )
    }

    const ModalContent = (onClose: () => void) => {
        return (
            <ModalWrapper>
                <ModalHeader>
                    <div>Gas setting</div>
                    {/* <div className="close-btn" onClick={onClose}>
                        X
                    </div> */}
                </ModalHeader>
                <ModalBody>
                    <div className="subtitle">
                        Choose one of tokens bellow to pay gas fee for you smart
                        account transaction using Paymaster.
                    </div>
                    <div>Select a token: </div>
                    {chainId &&
                        GAS_TOKEN[chainId].map((token, index) => {
                            return (
                                <TokenSelection
                                    key={index}
                                    token={token}
                                    gasToken={gasToken}
                                    onSetGasToken={setGasToken}
                                />
                            )
                        })}
                    <Row gap="10px">
                        <PrimaryButton
                            name={'Cancel'}
                            onClick={() => {
                                setGasToken(gasTokenDefault)
                                onClose()
                            }}
                            height="38px"
                        />
                        <PrimaryButton
                            name={'Confirm'}
                            onClick={() => {
                                updateGasToken(gasToken)
                                onClose()
                            }}
                            disabled={!gasToken}
                            height="38px"
                        />
                    </Row>
                </ModalBody>
            </ModalWrapper>
        )
    }

    return <Modal button={Button} children={ModalContent} isRight={true} />
}

const TokenWrapper = styled(Row)<{ isActived: boolean }>`
    border: 2px solid
        ${({ isActived }) => (isActived ? '#1469c3' : '#ffffff5c')};
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    background: ${({ isActived }) => isActived && '#1469c3'};

    :hover {
        border-color: #1469c3;
    }
`

const GasIconButton = styled.div`
    cursor: pointer;
    img {
        width: 20px;
        height: auto;
    }
`

const ModalWrapper = styled.div``

const ModalHeader = styled(Row)`
    justify-content: space-between;
    font-size: 20px;
    font-weight: 600;
    .close-btn {
        cursor: pointer;
    }
`

const ModalBody = styled(Columns)`
    gap: 10px;
    font-size: 14px;
    font-weight: 400;
    padding: 10px;

    .subtitle {
        font-style: italic;
        font-weight: 300;
    }
`

const Input = styled.input`
    outline: none;
    border: 2px solid var(--border2);
    background: none;
    padding: 5px 10px;
    border-radius: 4px;
    color: white;

    ::placeholder {
        color: #ffffff81;
    }
`

const LogoCheck = styled.div`
    border: 1px solid #e9ddea5e;
    padding: 4px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
`

export default GasSetting
