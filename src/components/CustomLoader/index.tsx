import React from 'react'
import styled from 'styled-components'

interface Loader {
    size?: string
}

const CustomLoader = ({ size }: Loader) => {
    return (
        <Container size={size}>
            <div className="sk-circle-bounce">
                <div className="sk-child sk-circle-1"></div>
                <div className="sk-child sk-circle-2"></div>
                <div className="sk-child sk-circle-3"></div>
                <div className="sk-child sk-circle-4"></div>
                <div className="sk-child sk-circle-5"></div>
                <div className="sk-child sk-circle-6"></div>
                <div className="sk-child sk-circle-7"></div>
                <div className="sk-child sk-circle-8"></div>
                <div className="sk-child sk-circle-9"></div>
                <div className="sk-child sk-circle-10"></div>
                <div className="sk-child sk-circle-11"></div>
                <div className="sk-child sk-circle-12"></div>
            </div>
        </Container>
    )
}

const Container = styled.div<{ size: string | undefined }>`
    flex: 1 1 25%;
    .sk-circle-bounce {
        width: ${({ size }) => (size ? size : `3em`)};
        height: ${({ size }) => (size ? size : `3em`)};
        position: relative;
        margin: auto;
    }
    .sk-circle-bounce .sk-child {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .sk-circle-bounce .sk-child:before {
        content: '';
        display: block;
        margin: 0 auto;
        width: 15%;
        height: 15%;
        background-color: #fff;
        border-radius: 100%;
        animation: sk-circle-bounce-delay 1.4s infinite ease-in-out both;
    }
    .sk-circle-bounce .sk-circle-2 {
        transform: rotate(30deg);
    }
    .sk-circle-bounce .sk-circle-3 {
        transform: rotate(60deg);
    }
    .sk-circle-bounce .sk-circle-4 {
        transform: rotate(90deg);
    }
    .sk-circle-bounce .sk-circle-5 {
        transform: rotate(120deg);
    }
    .sk-circle-bounce .sk-circle-6 {
        transform: rotate(150deg);
    }
    .sk-circle-bounce .sk-circle-7 {
        transform: rotate(180deg);
    }
    .sk-circle-bounce .sk-circle-8 {
        transform: rotate(210deg);
    }
    .sk-circle-bounce .sk-circle-9 {
        transform: rotate(240deg);
    }
    .sk-circle-bounce .sk-circle-10 {
        transform: rotate(270deg);
    }
    .sk-circle-bounce .sk-circle-11 {
        transform: rotate(300deg);
    }
    .sk-circle-bounce .sk-circle-12 {
        transform: rotate(330deg);
    }
    .sk-circle-bounce .sk-circle-2:before {
        animation-delay: -1.2833333333s;
    }
    .sk-circle-bounce .sk-circle-3:before {
        animation-delay: -1.1666666667s;
    }
    .sk-circle-bounce .sk-circle-4:before {
        animation-delay: -1.05s;
    }
    .sk-circle-bounce .sk-circle-5:before {
        animation-delay: -0.9333333333s;
    }
    .sk-circle-bounce .sk-circle-6:before {
        animation-delay: -0.8166666667s;
    }
    .sk-circle-bounce .sk-circle-7:before {
        animation-delay: -0.7s;
    }
    .sk-circle-bounce .sk-circle-8:before {
        animation-delay: -0.5833333333s;
    }
    .sk-circle-bounce .sk-circle-9:before {
        animation-delay: -0.4666666667s;
    }
    .sk-circle-bounce .sk-circle-10:before {
        animation-delay: -0.35s;
    }
    .sk-circle-bounce .sk-circle-11:before {
        animation-delay: -0.2333333333s;
    }
    .sk-circle-bounce .sk-circle-12:before {
        animation-delay: -0.1166666667s;
    }
    @keyframes sk-circle-bounce-delay {
        0%,
        80%,
        100% {
            transform: scale(0.4);
        }
        40% {
            transform: scale(1);
        }
    }
`

export default CustomLoader
