import { useActiveWeb3React } from 'hooks'
import React from 'react'

const SwitchNetwork = () => {
    const { chainId } = useActiveWeb3React()

    return <div>SwitchNetwork</div>
}

export default SwitchNetwork
