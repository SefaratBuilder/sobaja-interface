import { shortenAddress } from 'utils'
import { describe, it, expect } from 'vitest'
import { calcSlippageAmount } from 'utils'

describe('shorten address', () => {
    const testAddress = '0x53Dc36E8E23c1C726c7b4f50CF95034D9b9932Dc'
    it('address should be shorter than before', () => {
        expect(shortenAddress(testAddress).length).toBeLessThan(
            testAddress.length,
        )
    })
})

describe('calculateSlippageAmount', () => {
    it('price is correct', () => {
        const amountOutMin = calcSlippageAmount('10000', '50')[0]
        const amountInMax = calcSlippageAmount('10000', '50')[1]

        expect(amountOutMin).toEqual('5000')
        expect(amountInMax).toEqual('20000')
    })
})
