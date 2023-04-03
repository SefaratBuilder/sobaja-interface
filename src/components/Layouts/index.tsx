import styled from 'styled-components'

export const Row = styled.div<{ gap?: string; jus?: string; al?: string }>`
    display: flex;
    gap: ${({ gap }) => gap};
    justify-content: ${({ jus }) => jus};
    align-items: ${({ al }) => al};
`

export const Columns = styled.div<{ gap?: string; jus?: string; al?: string }>`
    display: flex;
    gap: ${({ gap }) => gap};
    justify-content: ${({ jus }) => jus};
    align-items: ${({ al }) => al};
    flex-direction: column;
`
