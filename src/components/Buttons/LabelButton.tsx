import styled from 'styled-components'

const LabelButton = ({ height, name, type = '' }: any) => {
    return (
        <Button height={height} className={type}>
            {name}
        </Button>
    )
}

export default LabelButton

const Button = styled.button<{ height?: any }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${({ height }) => (height ? height : '45px')};
    border-radius: 8px;
    outline: none;
    background: var(--btn2);
    border: var(--border2);
    color: white;
    font-size: 1rem;
    font-style: italic;
    font-family: Verdana, sans-serif;
    font-weight: 300;

    &.loading:after {
        content: '';
        animation: linear loading 1.5s infinite;
    }

    @keyframes loading {
        0% {
            content: '';
        }
        25% {
            content: '.';
        }
        50% {
            content: '..';
        }
        100% {
            content: '...';
        }
    }
`
