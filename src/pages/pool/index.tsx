import React, {
    useState,
    useEffect,
    useCallback,
    MouseEvent,
    ChangeEvent,
    useMemo,
} from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import styled from 'styled-components'
import LogoETH from 'assets/token-logos/eth-transparent.png'
import ETH from 'assets/token-logos/eth.svg'
import USDC from 'assets/token-logos/usdc.svg'
import USDT from 'assets/token-logos/usdt.svg'
import MATIC from 'assets/token-logos/matic.svg'
import BTC from 'assets/token-logos/btc.svg'
import UNI from 'assets/token-logos/uni.svg'
import BNB from 'assets/token-logos/bnb.svg'
import AVA from 'assets/token-logos/ava.svg'
import SUSHI from 'assets/token-logos/sushi.svg'
import DAI from 'assets/token-logos/dai.svg'
import UNKNOWN from 'assets/icons/question-mark-button-dark.svg'

import PrimaryButton from 'components/Buttons/PrimaryButton'
import SearchIcon from 'assets/icons/search.svg'
import PairTokens from 'components/LogoToken/PairTokens'
import imgDownArrowWhite from 'assets/icons/chevron-white.svg'
import arrowDown from 'assets/icons/arrowDown.svg'
import { useNavigate } from 'react-router-dom'
import MyPools from 'components/MyPools'
import ToastMessage from 'components/ToastMessage'
import Pagination from 'components/Pagination'
import { useWindowDimensions } from 'hooks/useWindowSize'
import { useMyPosition } from 'hooks/useAllPairs'
import { Data, useQueryPool } from 'hooks/useQueryPool'
import Loader from 'components/Loader'
import CustomLoader from 'components/CustomLoader'

export interface PoolData {
    name: string
    volume: string
    tvl: string
    network: string
    fee: string
    apr: string
}
export interface PoolDataMobile {
    name: string
    volume: string
    apr: string
    tvlValue: string | number
    addresses: string[]
    symbols: string[]
}

function createData(
    network: string,
    name: string,
    tvl: string,
    volume: string,
    fee: string,
    apr: string,
): PoolData {
    return {
        network,
        name,
        tvl,
        volume,
        fee,
        apr,
    }
}

const Logos: any = {
    ETH,
    WETH: ETH,
    USDC,
    DAI,
    SUSHI,
    BTC,
    BNB,
    MATIC,
    UNI,
    USDT,
    AVA,
    UNKNOWN,
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}
function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number,
) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) {
            return order
        }
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
    disablePadding: boolean
    id: keyof PoolData
    label: string
    numeric: boolean
}

const headCells: readonly HeadCell[] = [
    {
        id: 'network',
        numeric: false,
        disablePadding: true,
        label: 'Network',
    },
    {
        id: 'name',
        numeric: true,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'tvl',
        numeric: true,
        disablePadding: false,
        label: 'TVL',
    },
    {
        id: 'volume',
        numeric: true,
        disablePadding: false,
        label: 'Volume(24h)',
    },
    {
        id: 'fee',
        numeric: true,
        disablePadding: false,
        label: 'Fees(24h)',
    },
    {
        id: 'apr',
        numeric: true,
        disablePadding: false,
        label: 'APR',
    },
]

const DEFAULT_ORDER = 'desc'
const DEFAULT_ORDER_BY = 'tvl'
const DEFAULT_ROWS_PER_PAGE = 10

interface EnhancedTableProps {
    numSelected: number
    order: Order
    orderBy: string
    rowCount: number
}

function EnhancedTableToolbar() {
    const navigate = useNavigate()
    return (
        <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
            className="black-bg"
        >
            <HeadTitle>
                <div>
                    <div className="title">Pool</div>
                    <div className="details">
                        Provide liquidity and earn fees
                    </div>
                </div>
                <div className="new-position">
                    <PrimaryButton
                        name="+ New Position"
                        onClick={() => {
                            navigate('/add')
                        }}
                    />
                </div>
            </HeadTitle>
        </Typography>
    )
}

export default function Pools() {
    const [order, setOrder] = useState<Order>(DEFAULT_ORDER)
    const [orderBy, setOrderBy] = useState<keyof Data>(DEFAULT_ORDER_BY)
    const [selected, setSelected] = useState<readonly string[]>([])
    const [dense, setDense] = useState(false)
    const [isAsc, setIsAsc] = useState(false)
    const [page, setPage] = useState<number>(1)
    const [totalPage, setTotalPage] = useState<number>(1)
    const [listHeader, setListHeader] = useState(headCells)
    const [searchName, setSearchName] = useState('')
    const [isMyPositionPage, setIsMyPositionPage] = useState(false)
    const { width } = useWindowDimensions()
    const { position } = useMyPosition()

    const rows = useQueryPool()

    const [totalPool, setTotalPool] = useState<Data[] | PoolDataMobile[]>()
    const [poolsAdminInCurrentPag, setPoolsAdminInCurrentPag] = useState<
        Data[] | PoolDataMobile[]
    >()

    const handleDataInCurrentPage = () => {
        if (!totalPool) return

        if (width <= 576) {
            const filterData = totalPool.filter(
                (d, index) => index >= (page - 1) * 10 && index < page * 10,
            )

            const newFilterData = filterData.map((i) => {
                return {
                    name: i.name,
                    volume: i.volume,
                    apr: i.apr,
                    tvlValue: i.tvlValue,
                }
            })
            setPoolsAdminInCurrentPag(newFilterData)
            return
        }
        setTotalPage(
            totalPool?.length > 0 ? Math.ceil(totalPool.length / 10) : 1,
        )

        const filterData = totalPool.filter(
            (d, index) => index >= (page - 1) * 10 && index < page * 10,
        )
        setPoolsAdminInCurrentPag(filterData)
    }

    useEffect(() => {
        if (rows.length > 0) {
            setTotalPool(rows)
        }
    }, [rows])
    
    useEffect(() => {
        if (totalPool) handleDataInCurrentPage()
    }, [totalPool, page])

    useEffect(() => {
        isAsc ? setOrder('asc') : setOrder('desc')
    }, [isAsc])

    const handleOnSort = () => {
        setIsAsc((i) => !i)
    }

    function EnhancedTableHead(props: EnhancedTableProps) {
        const { order, orderBy } = props
        return (
            <TableHead>
                <TableRow style={{ height: 5 }}></TableRow>

                <TableRow>
                    {listHeader.map((headCell, index) => (
                        <HeadTable
                            key={index}
                            align={
                                width > 576
                                    ? index === 1
                                        ? 'center'
                                        : headCell.numeric
                                        ? 'right'
                                        : 'left'
                                    : index === 0
                                    ? 'left'
                                    : 'center'
                            }
                            padding={
                                headCell.disablePadding ? 'none' : 'normal'
                            }
                            sortDirection={
                                orderBy === headCell.id ? order : false
                            }
                            sx={{
                                color: 'white',
                                borderBottom: 'none',
                                borderColor: '#ffffff4c',
                            }}
                            className="black-bg2"
                        >
                            {headCell.label}{' '}
                            {width > 576 && index === 2 && (
                                <BtnSort onClick={() => handleOnSort()}>
                                    <div className={isAsc ? 'isSorted' : ''}>
                                        <img src={arrowDown} alt="arrow-down" />
                                    </div>
                                </BtnSort>
                            )}
                        </HeadTable>
                    ))}
                </TableRow>
                <TableRow style={{ height: 5 }}></TableRow>
            </TableHead>
        )
    }

    useEffect(() => {
        if (width <= 576) {
            let newRow = stableSort<PoolDataMobile>(
                rows.map((i) => {
                    return {
                        name: i.name,
                        volume: i.volume,
                        apr: i.apr,
                        tvlValue: i.tvlValue,
                        addresses: i.addresses,
                        symbols: i.symbols
                    }
                }),
                getComparator(order, 'tvlValue'),
            )
            let newHeader = headCells.filter(
                (i) => i.id === 'name' || i.id === 'apr' || i.id === 'volume',
            )
            setListHeader(newHeader)

            newRow = newRow.slice(
                0 * DEFAULT_ROWS_PER_PAGE,
                0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
            )
            setPoolsAdminInCurrentPag(newRow)
        } else {
            setListHeader(headCells)
            let rowsOnMount = stableSort(rows, getComparator(order, 'tvlValue'))
            rowsOnMount = rowsOnMount.slice(
                0 * DEFAULT_ROWS_PER_PAGE,
                0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
            )
            setPoolsAdminInCurrentPag(rowsOnMount)
        }
    }, [width, order])

    const handleOnSearch = (e: any) => {
        if (e.target.value) {
            let newRows = rows.filter((i) =>
                i.name
                    ?.toLowerCase()
                    ?.includes(e?.target?.value?.toLowerCase()),
            )
            setSearchName(e.target.value)
            setTotalPool(newRows)
            setTotalPage(
                newRows?.length > 0 ? Math.ceil(newRows.length / 10) : 1,
            )
        } else {
            setSearchName('')
            setTotalPool(rows)

            let rowsOnMount = stableSort<any>(
                rows,
                getComparator<any>(DEFAULT_ORDER, DEFAULT_ORDER_BY),
            )
            rowsOnMount = rowsOnMount.slice(
                0 * DEFAULT_ROWS_PER_PAGE,
                0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
            )
            setPoolsAdminInCurrentPag(rowsOnMount)
            setTotalPage(rows?.length > 0 ? Math.ceil(rows.length / 10) : 1)
        }
    }
    console.log({poolsAdminInCurrentPag})
    const isSelected = (name: string) => selected.indexOf(name) !== -1

    return (
        <>
            <ToastMessage />
            <Container>
                <CustomizeBox
                    sx={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        paddingTop: '15px',
                    }}
                >
                    <EnhancedTableToolbar />

                    <HeadLabel className="black-bg">
                        <HeadLabelLeft>
                            <div className="title-pool">
                                <PrimaryButton
                                    name="Pools"
                                    height="35px"
                                    color={
                                        !isMyPositionPage
                                            ? 'rgba(0, 178, 255, 1)'
                                            : 'none'
                                    }
                                    onClick={() => setIsMyPositionPage(false)}
                                />
                            </div>
                            <div>
                                <PrimaryButton
                                    name="My positions"
                                    height="35px"
                                    color={
                                        isMyPositionPage
                                            ? 'rgba(0, 178, 255, 1)'
                                            : 'none'
                                    }
                                    onClick={() => setIsMyPositionPage(true)}
                                />
                            </div>
                            <div className="circle">{position?.length}</div>
                        </HeadLabelLeft>
                        {!isMyPositionPage && (
                            <HeadLabelRight>
                                <InputSearchModal>
                                    <img src={SearchIcon} alt="" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        onChange={(e) => handleOnSearch(e)}
                                    />
                                </InputSearchModal>
                            </HeadLabelRight>
                        )}
                    </HeadLabel>
                    {!isMyPositionPage && (
                        <>
                            <TableContainer>
                                <Table
                                    sx={{ minWidth: 400 }}
                                    aria-labelledby="tableTitle"
                                    size={dense ? 'small' : 'medium'}
                                >
                                    {poolsAdminInCurrentPag &&
                                    poolsAdminInCurrentPag?.length > 0 ? (
                                        <>
                                            <EnhancedTableHead
                                                numSelected={selected.length}
                                                order={order}
                                                orderBy={orderBy}
                                                rowCount={rows.length}
                                            />
                                            <TableBody>
                                                {poolsAdminInCurrentPag.map(
                                                    (
                                                        row:
                                                            | Data
                                                            | PoolDataMobile,
                                                        index,
                                                    ) => {
                                                        const isItemSelected =
                                                            isSelected(row.name)
                                                        const labelId = `enhanced-table-checkbox-${index}`
                                                        return (
                                                            <>
                                                                {'network' in
                                                                    row &&
                                                                'fee' in row &&
                                                                'tvl' in row ? (
                                                                    <>
                                                                        <RowTable
                                                                            role="checkbox"
                                                                            aria-checked={
                                                                                isItemSelected
                                                                            }
                                                                            tabIndex={
                                                                                -1
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                            selected={
                                                                                isItemSelected
                                                                            }
                                                                            sx={{
                                                                                cursor: 'pointer',
                                                                            }}
                                                                        >
                                                                            <CellTable
                                                                                component="th"
                                                                                id={
                                                                                    labelId
                                                                                }
                                                                                scope="row"
                                                                                padding="normal"
                                                                                sx={{
                                                                                    width: '20px',
                                                                                }}
                                                                                align="center"
                                                                                //   visible-mobile
                                                                            >
                                                                                <img
                                                                                    className="network"
                                                                                    src={
                                                                                        LogoETH
                                                                                    }
                                                                                    alt=""
                                                                                />
                                                                            </CellTable>
                                                                            <CellTable
                                                                                align="center"
                                                                                sx={{
                                                                                    width: '500px',
                                                                                }}
                                                                            >
                                                                                <div className="label">
                                                                                    <PairTokens
                                                                                        tokenA={
                                                                                            row.symbols[1]
                                                                                        }
                                                                                        tokenB={
                                                                                            row.symbols[2]
                                                                                        }
                                                                                    />
                                                                                    <div className="name">
                                                                                        {
                                                                                            row.name
                                                                                        }
                                                                                    </div>
                                                                                    <Badge>
                                                                                        0.30%
                                                                                    </Badge>
                                                                                </div>
                                                                            </CellTable>
                                                                            <CellTable align="right">
                                                                                {
                                                                                    row?.tvl
                                                                                }
                                                                            </CellTable>
                                                                            <CellTable align="right">
                                                                                {
                                                                                    row.volume
                                                                                }
                                                                            </CellTable>
                                                                            <CellTable align="right">
                                                                                {
                                                                                    row?.fee
                                                                                }
                                                                            </CellTable>
                                                                            <CellTable align="right">
                                                                                {
                                                                                    row.apr
                                                                                }
                                                                            </CellTable>
                                                                        </RowTable>
                                                                        <TableRow
                                                                            style={{
                                                                                height: 5,
                                                                            }}
                                                                        ></TableRow>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <RowTable
                                                                            role="checkbox"
                                                                            aria-checked={
                                                                                isItemSelected
                                                                            }
                                                                            tabIndex={
                                                                                -1
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                            selected={
                                                                                isItemSelected
                                                                            }
                                                                            sx={{
                                                                                cursor: 'pointer',
                                                                            }}
                                                                        >
                                                                            <CellTable
                                                                                align="left"
                                                                                className="visible-mobile"
                                                                            >
                                                                                <div
                                                                                    className={
                                                                                        width >
                                                                                        576
                                                                                            ? 'label'
                                                                                            : 'label-mobile'
                                                                                    }
                                                                                >
                                                                                    <PairTokens
                                                                                        tokenA={row.symbols[1]}
                                                                                        tokenB={row.symbols[2]}
                                                                                    />
                                                                                    <div className="name">
                                                                                        {
                                                                                            row.name
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </CellTable>

                                                                            <CellTable
                                                                                align="right"
                                                                                className="visible-mobile"
                                                                            >
                                                                                {
                                                                                    row.volume
                                                                                }
                                                                            </CellTable>

                                                                            <CellTable
                                                                                align="right"
                                                                                className="visible-mobile"
                                                                            >
                                                                                {
                                                                                    row.apr
                                                                                }
                                                                            </CellTable>
                                                                        </RowTable>
                                                                        <TableRow
                                                                            style={{
                                                                                height: 5,
                                                                            }}
                                                                        ></TableRow>
                                                                    </>
                                                                )}
                                                            </>
                                                        )
                                                    },
                                                )}
                                            </TableBody>
                                        </>
                                    ) : !searchName ? (
                                        <LoaderLabel>
                                            {/* <Loader size="30px" /> */}
                                            <CustomLoader />
                                            <div>Loading</div>
                                        </LoaderLabel>
                                    ) : (
                                        <LabelNotFound>Not Found</LabelNotFound>
                                    )}
                                </Table>
                            </TableContainer>
                            {poolsAdminInCurrentPag &&
                                poolsAdminInCurrentPag.length > 0 && (
                                    <Pagination
                                        page={page}
                                        setPage={setPage}
                                        isSorted={isAsc}
                                        totalPage={totalPage}
                                    />
                                )}
                        </>
                    )}

                    {isMyPositionPage && <MyPools />}
                </CustomizeBox>
            </Container>
        </>
    )
}

const Container = styled.div`
    position: sticky;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 80%;
    height: fit-content;
    font-size: 16px !important;
    color: white;
    font-family: Verdana !important;

    font-weight: 300;
    overflow: hidden;
    margin-bottom: 50px;

    .black-bg {
        background: rgba(0, 0, 0, 0.3) !important;
        min-width: 84px;
    }

    .black-bg2 {
        background: rgba(255,255,255,0.3) !important;
        min-width: 84px;
    }

    @media screen and (max-width: 772px) {
        width: 90%;
    }
`

const CustomizeBox = styled(Box)`
    @media screen and (max-width: 576px) {
        padding: 0 !important;
    }
`

const HeadTitle = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 20px;
    font-family: Verdana;

    @media screen and (max-width: 576px) {
        flex-direction: column;
        gap: 10px;
    }

    .title {
        font-weight: 600;
        font-size: 50px;
        line-height: 61px;
        @media screen and (max-width: 576px) {
            font-size: 30px;
        }
    }

    .details {
        font-weight: 500;
        font-size: 20px;
        line-height: 24px;
        color: rgba(136, 136, 136, 1);
        @media screen and (max-width: 576px) {
            font-size: 16px;
        }
    }

    .new-position {
        min-width: 160px;
        padding-top: 25px;
    }
`

const HeadLabel = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 35px 20px 21px;
    gap: 25px;
    /* padding: 20px; */

    @media screen and (max-width: 600px) {
        flex-direction: column;
        /* font-size: 14px; */
        gap: 10px;
        div:nth-child(2) {
            justify-content: space-between;
        }
    }
`

const RowTable = styled(TableRow)`
    /* background: rgba(0, 0, 0, 0.3) !important; */
    .visible-mobile {
        text-align: center;
    }

    :hover {
        background: rgb(255 255 255 / 39%);
    }
`

const HeadLabelLeft = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;

    div:nth-child(2) {
        min-width: 120px;
    }

    .title-pool {
        width: 100px;
    }

    .circle {
        width: auto;
        min-width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgba(0, 178, 255, 0.3);
        text-align: center;
        font-style: normal;
        color: rgba(0, 178, 255, 1);
        padding: 5px;
    }
`

const HeadLabelRight = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;

    @media screen and (max-width: 576px) {
        flex-direction: column;
        div {
            width: 100%;
        }
    }
`

const HeadTable = styled(TableCell)`
    font-size: 16px !important;
    padding-left: 15px !important;
    display: flex;
    font-family: Verdana !important;

    justify-content: center;
    align-items: center;
    div {
        display: inline;
    }

    img {
        width: 12px;
    }

    @media screen and (max-width: 576px) {
        /* font-size: 14px !important; */
    }
`

const CellTable = styled(TableCell)`
    display: flex;
    color: white !important;
    border: none !important;
    font-size: 16px !important;
    color: white;
    /* padding: 15px 15px 0 0 !important; */
    background: rgba(255, 255, 255, 0.1) !important;
    /* display: none; */
    font-family: Verdana !important;

    @media screen and (max-width: 576px) {
        /* font-size: 14px !important; */
    }

    .label {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;

        /* @media screen and (max-width: 1920px) {
            justify-content: flex-start;
            padding-left: 160px;
        } */

        @media screen and (max-width: 1540px) {
            justify-content: flex-start;
            padding-left: 150px;
        }
        @media screen and (max-width: 1330px) {
            justify-content: flex-start;
            padding-left: 100px;
        }
    }

    .label-mobile {
        display: flex;
        gap: 5px;
        justify-content: left;
        align-items: center;
    }

    .name {
        /* min-width: 100px; */
    }

    .network {
        width: 14px;
    }
`
const InputSearchModal = styled.div`
    min-width: 150px;
    display: flex;
    justify-content: flex-start;
    gap: 5px;
    align-items: center;
    position: sticky;
    top: 0;
    left: 0;
    background: rgba(217, 217, 217, 0.1);
    z-index: 1;
    padding: 5px 10px;
    border: 0.45px solid rgba(201, 201, 201, 0.6);
    border-radius: 6px;

    input {
        max-width: 100% !important;
        width: 100%;
        background: rgba(0, 0, 0, 0);
        border: none;
        outline: none;
        color: #c9c9c9;

        font-weight: 500;
        font-size: 18px;
        line-height: 100%;
    }

    img {
        width: 14px;
        height: 14px;
        opacity: 0.4;
    }

    @media screen and (max-width: 576px) {
        /* padding: 2px 10px; */

        input {
            font-size: 12px;
        }
    }
`

const LoaderLabel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
    gap: 10px;
    justify-content: center;

    ::-webkit-scrollbar {
        display: none;
    }
`

const NetworkButton = styled.div`
    width: 22%;
    min-width: 150px;
    /* heigth: auto; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    top: 0;
    left: 0;
    background: rgba(217, 217, 217, 0.1);
    z-index: 1;
    padding: 3px 20px;
    border: 0.45px solid rgba(201, 201, 201, 0.6);
    border-radius: 6px;
    cursor: pointer;

    img {
        width: 12px;
    }

    p {
        font-weight: 500;
        color: #c9c9c9;
    }

    @media screen and (max-width: 576px) {
        font-size: 12px;
        padding: 0 15px;
    }
`

const Badge = styled.div`
    background: #e2ebf0;
    border-radius: 5px;
    padding: 3px 5px;
    font-size: 12px;
    color: rgba(136, 136, 136, 1);
`

const BtnSort = styled.div`
    cursor: pointer;

    .isSorted {
        img {
            transform: rotate(180deg);
        }
    }
`

const LabelNotFound = styled.div`
    text-align: center;
    padding: 20px 0;
`
