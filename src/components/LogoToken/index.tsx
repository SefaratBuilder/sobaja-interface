import { Token } from 'interfaces'
import styled from 'styled-components'
import imgQuestionDark from 'assets/icons/question-mark-button-dark.svg'

const LogoToken = ({ token, size }: { token: Token; size?: string }) => {
    return (
        <WrapperLogo size={size}>
            <img
                src={token.logoURI || imgQuestionDark}
                alt={`${token.name} logo`}
                onError={(e: any) => {
                    e.target.onerror = null
                    e.target.src = `${imgQuestionDark}`
                }}
            />
        </WrapperLogo>
    )
}

const WrapperLogo = styled.div<{ size?: string }>`
    width: ${({ size }) => (size ? size : '20px')};
    height: ${({ size }) => (size ? size : '20px')};
    border-radius: 50%;
    border: 0.3px solid var(--border1);
    overflow: hidden;

    @media screen and (max-width: 576px) {
        width: 25px;
        height: 25px;
    }
    @media screen and (max-width: 375px) {
        width: 20px;
        height: 20px;
    }
    img {
        width: 100%;
        height: 100%;
    }
`

export default LogoToken
