import { shortenAddress } from 'utils'
import { describe, it, expect } from 'vitest'

describe('shorten address', () => {
    const testAddress = '0x53Dc36E8E23c1C726c7b4f50CF95034D9b9932Dc'
    it('address must be shorter', () => {
        const sA = shortenAddress(testAddress)
        expect(shortenAddress(testAddress).length).toBeLessThan(
            testAddress.length,
        )
    })
})
