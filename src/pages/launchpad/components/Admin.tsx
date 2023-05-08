import { useState } from 'react'
import styled from 'styled-components'
import { Columns } from 'components/Layouts'
import { useAccessManagerContract } from 'hooks/useContract'

const Admin = () => {
    const [operator, setOperator] = useState('')
    const accessManagerContract = useAccessManagerContract()

    const handleOnGrantOperator = async () => {
        try {
            console.log('adding role...')
            const result = await accessManagerContract?.addOperatorRole(operator)
            await result.wait()
            console.log('added operator role :))')
        }
        catch(err) {
            console.log('failed to grant access manager to this address: ', err)
        }
    }

    return(
        <AdminWrapper gap="10px">
            <div>Admin</div>
            <input type="text" value={operator} onChange={(e) => setOperator(e.target.value)} />
            <button onClick={handleOnGrantOperator}>Grant operator</button>
        </AdminWrapper>
    )
}

const AdminWrapper = styled(Columns)`

`

export default Admin 