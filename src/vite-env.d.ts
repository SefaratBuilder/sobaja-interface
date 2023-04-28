/// <reference types="vite/client" />

declare module '@metamask/jazzicon' {
    export default function (diameter: number, seed: number): HTMLElement
}

interface Window {
    web3?: any
    ethereum?: any
    BinanceChain?: any
    bitkeep?: any
    okexchain?: any
}

declare module 'jsbi-calculator'
