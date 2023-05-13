import { Row, Columns } from 'components/Layouts'
import { LAUNCHPADS } from 'constants/addresses'
import { useActiveWeb3React } from 'hooks'
import { useTokenApproval, useToken } from 'hooks/useToken'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { add, div, mulNumberWithDecimal } from 'utils/math'
import {
    useAAEntryPointContract,
    useLaunchpadContract,
} from 'hooks/useContract'
import FAIRLAUNCH_INTERFACE from 'constants/jsons/fairlaunch'
import { useQueryLaunchpad } from 'hooks/useQueryLaunchpad'
import LaunchpadItem from './components/LaunchpadItem'
import Admin from './components/Admin'
import { LaunchpadInfo, LaunchpadInfoX, Token } from 'interfaces'
import CreateLaunchpad from './components/CreateLaunchpad'
import ListLaunchpad from './components/List'
import LaunchpadDetails from './components/LaunchpadDetails'
import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'
import Blur from 'components/Blur'

export const adminAddress = '0x22579D1B78F9D7ECb6A7038b26E15dBEdd0492E3'
export interface ILaunchpadDetails extends LaunchpadInfoX {
    img: string
    lPadToken: Token | undefined
    paymentToken: Token | undefined
}

const Launchpad = () => {
    const [currentPage, setCurrentPage] = useState<
        'Admin' | 'Create' | 'Details' | 'Infomation'
    >('Infomation')
    const [lpDetails, setLpDetails] = useState<ILaunchpadDetails>()
    const [isOpenAdmin, setIsOpenAdmin] = useState(false)
    const initDataTransaction = InitCompTransaction()

    const [launchpadState, setLaunchpadState] = useState({
        token: '0xdEfd221072dD078d11590D58128399C2fe8cCa7e',
        paymentCurrency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        startTime: (new Date().getTime() / 1000).toFixed(),
        endTime: (new Date().getTime() / 1000).toFixed(),
        softCap: '1',
        hardCap: '3',
        price: '0.1',
        individualCap: '1',
        overflow: '10',
        totalToken: '40',
    })
    const { error, loading, data, refetch } = useQueryLaunchpad()
    const { account, chainId, library } = useActiveWeb3React()
    const token = useToken(
        launchpadState.token ? launchpadState.token : undefined,
    )
    const paymentToken = useToken(
        launchpadState.paymentCurrency
            ? launchpadState.paymentCurrency
            : undefined,
    )
    const tokenApproval = useTokenApproval(
        account,
        chainId ? LAUNCHPADS[chainId] : null,
        token,
    )
    // const entryContract = useAAEntryPointContract()

    /**
     * @dev
     * refresh data launchpad
     */
    useEffect(() => {
        if (!data) return
        const refeshLaunchpad = data?.launchpads?.find(
            (d) => d.id === lpDetails?.id,
        )
        if (refeshLaunchpad && lpDetails) {
            const newData = { ...lpDetails, ...refeshLaunchpad }
            console.log('is updated', newData)
            setLpDetails(newData)
        }
    }, [data])

    return (
        <>
            <>
                <ComponentsTransaction
                    data={initDataTransaction}
                    onConfirm={() => {}}
                />
            </>
            {(initDataTransaction.isOpenResultModal ||
                initDataTransaction.isOpenWaitingModal) && <Blur />}
            <Container>
                {currentPage === 'Infomation' && (
                    <ListLaunchpad
                        setCurrentPage={setCurrentPage}
                        setLpDetails={setLpDetails}
                        setIsOpenAdmin={setIsOpenAdmin}
                        initDataTransaction={initDataTransaction}
                    />
                )}
                {currentPage === 'Create' && (
                    <CreateLaunchpad setCurrentPage={setCurrentPage} />
                )}
                {currentPage === 'Details' && (
                    <LaunchpadDetails
                        details={lpDetails}
                        setCurrentPage={setCurrentPage}
                    />
                )}
                {isOpenAdmin && (
                    <Admin
                        setClose={setIsOpenAdmin}
                        initDataTransaction={initDataTransaction}
                    />
                )}
            </Container>
        </>
    )
}

const LaunchpadList = styled(Row)`
    flex-wrap: wrap;
    max-width: 900px;
`

const Container = styled.div`
    margin-bottom: 50px;
    padding: 2rem;
    form {
        display: flex;
        flex-direction: column;
        input {
            font-size: 16px;
            padding: 2px;
            margin-bottom: 10px;
        }
    }
    button {
        cursor: pointer;
    }
`

export default Launchpad
