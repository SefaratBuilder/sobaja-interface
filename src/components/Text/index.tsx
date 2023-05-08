import styled from 'styled-components'

export const Error = styled.div<{ fontSize?: string }>`
    color: #ff1616;
    font-weight: 500;
    font-size: ${({ fontSize }) => fontSize};
    width: 100%;
    white-space: wrap;
    word-wrap: break-word;
`
