import React, { useState, useEffect, useMemo } from 'react'
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
import BgPool from 'assets/brand/bg-pool.png'

import PrimaryButton from 'components/Buttons/PrimaryButton'
import SearchIcon from 'assets/icons/search.svg'
import PairTokens from 'components/LogoToken/PairTokens'
import arrowDown from 'assets/icons/arrowDown.svg'
import { useNavigate } from 'react-router-dom'
import Positions from './Components/Positions'
import ToastMessage from 'components/ToastMessage'
import Pagination from 'components/Pagination'
import { useWindowDimensions } from 'hooks/useWindowSize'
import { useMyPosition } from 'hooks/useAllPairs'
import {
    Data,
    useGetPoolsTransactions,
    useGetTotalPools,
    useQueryPool,
} from 'hooks/useQueryPool'

import CustomLoader from 'components/CustomLoader'
import Overview from './Components/Overview'

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
            // className="black-bg"
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
    const numTotalPools = useGetTotalPools()
    const [totalPage, setTotalPage] = useState<number>(
        Math.ceil(numTotalPools / 10),
    )
    const [listHeader, setListHeader] = useState(headCells)
    const [searchName, setSearchName] = useState('')
    const [loadingChangePage, setLoadingChangePage] = useState(false)
    const { width } = useWindowDimensions()
    const { position, tokenList } = useMyPosition()
    const [currentPage, setCurrentPage] = useState<
        'Pools' | 'Details' | 'Position'
    >('Pools')

    const rows = useQueryPool((page - 1) * 10)
    const transactions = useGetPoolsTransactions()

    const [overviewPool, setOverviewPool] = useState<Data>()

    const [poolsAdminInCurrentPag, setPoolsAdminInCurrentPag] =
        useState<Data[]>()

    useEffect(() => {
        if (rows.length > 0) {
            setPoolsAdminInCurrentPag(rows)
        }
    }, [rows])

    useEffect(() => {
        isAsc ? setOrder('asc') : setOrder('desc')
    }, [isAsc])

    useEffect(() => {
        numTotalPools !== 0 &&
            page === 1 &&
            setTotalPage(Math.ceil(numTotalPools / 10))
    }, [numTotalPools])

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
            let newHeader = headCells.filter(
                (i) => i.id === 'name' || i.id === 'apr' || i.id === 'volume',
            )
            setListHeader(newHeader)
        } else {
            setListHeader(headCells)

            const currentRows = searchName
                ? rows.filter((i) =>
                      i.name
                          ?.toLowerCase()
                          ?.includes(searchName?.toLowerCase()),
                  )
                : rows
            let rowsOnMount = stableSort(
                currentRows,
                getComparator(order, 'tvlValue'),
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
            setPoolsAdminInCurrentPag(newRows)
            setTotalPage(
                newRows?.length > 0 ? Math.ceil(newRows.length / 10) : 1,
            )
            setPage(1)
        } else {
            setSearchName('')
            setPoolsAdminInCurrentPag(rows)

            let rowsOnMount = stableSort<any>(
                rows,
                getComparator<any>(DEFAULT_ORDER, DEFAULT_ORDER_BY),
            )
            rowsOnMount = rowsOnMount.slice(
                0 * DEFAULT_ROWS_PER_PAGE,
                0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
            )
            setTotalPage(Math.ceil(numTotalPools / 10))
        }
    }

    const isSelected = (name: string) => selected.indexOf(name) !== -1

    const handleOnClick = (row: Data) => {
        setOverviewPool(row)
        setCurrentPage('Details')
    }
    return (
        <>
            <Container>
                <CustomizeBox
                    sx={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        paddingTop: '15px',
                    }}
                >
                    <div className="black-bg">
                        <EnhancedTableToolbar />

                        <HeadLabel>
                            <HeadLabelLeft>
                                <div className="title-pool">
                                    <PrimaryButton
                                        name="Pools"
                                        height="35px"
                                        color={
                                            currentPage === 'Pools'
                                                ? 'rgba(0, 178, 255, 1)'
                                                : 'none'
                                        }
                                        onClick={() => setCurrentPage('Pools')}
                                    />
                                </div>
                                <div>
                                    <PrimaryButton
                                        name="My positions"
                                        height="35px"
                                        color={
                                            currentPage === 'Position'
                                                ? 'rgba(0, 178, 255, 1)'
                                                : 'none'
                                        }
                                        onClick={() =>
                                            setCurrentPage('Position')
                                        }
                                    />
                                </div>
                                <div className="circle">{position?.length}</div>
                            </HeadLabelLeft>
                            {currentPage === 'Pools' && (
                                <HeadLabelRight>
                                    <InputSearchModal>
                                        <img src={SearchIcon} alt="" />
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchName}
                                            onChange={(e) => handleOnSearch(e)}
                                        />
                                    </InputSearchModal>
                                </HeadLabelRight>
                            )}
                        </HeadLabel>
                    </div>

                    {currentPage === 'Pools' && (
                        <>
                            <CustomTableContainer>
                                <Table
                                    sx={{ minWidth: 400 }}
                                    aria-labelledby="tableTitle"
                                    size={dense ? 'small' : 'medium'}
                                >
                                    {!loadingChangePage &&
                                    poolsAdminInCurrentPag &&
                                    poolsAdminInCurrentPag?.length > 0 ? (
                                        <>
                                            <EnhancedTableHead
                                                numSelected={selected.length}
                                                order={order}
                                                orderBy={orderBy}
                                                rowCount={rows.length}
                                            />

                                            {poolsAdminInCurrentPag.map(
                                                (row: Data, index) => {
                                                    const isItemSelected =
                                                        isSelected(row.name)
                                                    const labelId = `enhanced-table-checkbox-${index}`
                                                    /**
                                                         * @dev !isMobile: 'network' in
                                                                    row &&
                                                                'fee' in row &&
                                                                'tvl' in row 
                                                         */
                                                    return (
                                                        <TableBody key={index}>
                                                            {width > 576 ? (
                                                                <RowTable
                                                                    role="checkbox"
                                                                    aria-checked={
                                                                        isItemSelected
                                                                    }
                                                                    tabIndex={
                                                                        -1
                                                                    }
                                                                    key={index}
                                                                    selected={
                                                                        isItemSelected
                                                                    }
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() =>
                                                                        handleOnClick(
                                                                            row,
                                                                        )
                                                                    }
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
                                                                        align="left"
                                                                        sx={{
                                                                            width: '500px',
                                                                        }}
                                                                    >
                                                                        <div className="label">
                                                                            <PairTokens
                                                                                tokenA={
                                                                                    row
                                                                                        .symbols[1]
                                                                                }
                                                                                tokenB={
                                                                                    row
                                                                                        .symbols[2]
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
                                                            ) : (
                                                                <RowTable
                                                                    role="checkbox"
                                                                    aria-checked={
                                                                        isItemSelected
                                                                    }
                                                                    tabIndex={
                                                                        -1
                                                                    }
                                                                    key={index}
                                                                    selected={
                                                                        isItemSelected
                                                                    }
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() =>
                                                                        handleOnClick(
                                                                            row,
                                                                        )
                                                                    }
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
                                                                                tokenA={
                                                                                    row
                                                                                        .symbols[1]
                                                                                }
                                                                                tokenB={
                                                                                    row
                                                                                        .symbols[2]
                                                                                }
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
                                                            )}
                                                            <TableRow
                                                                style={{
                                                                    height: 5,
                                                                }}
                                                                key={
                                                                    index * 10 +
                                                                    1
                                                                }
                                                            ></TableRow>
                                                        </TableBody>
                                                    )
                                                },
                                            )}
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
                            </CustomTableContainer>
                            {poolsAdminInCurrentPag &&
                                poolsAdminInCurrentPag.length > 0 && (
                                    <Pagination
                                        page={page}
                                        setPage={setPage}
                                        setLoadingChangePage={
                                            setLoadingChangePage
                                        }
                                        totalPage={totalPage}
                                    />
                                )}
                        </>
                    )}

                    {currentPage === 'Position' && (
                        <Positions position={position} tokenList={tokenList} />
                    )}
                    {currentPage === 'Details' && (
                        <Overview
                            pool={overviewPool}
                            transaction={transactions}
                            width={width}
                            tokenList={tokenList}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
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
    font-family: Inter !important;

    font-weight: 300;
    overflow: hidden;
    margin-bottom: 50px;

    .black-bg {
        background: url('${BgPool}');
        background-repeat: no-repeat;
        background-size: cover;
        min-width: 84px;
        border-radius:18px 18px 0px 0px;
        margin-left: -8px;
    }

    .black-bg2 {
        background: rgba(255, 255, 255, 0.3) !important;
        min-width: 84px;
    }

    @media screen and (max-width: 772px) {
        width: 94%;
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
    font-family: Inter;

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
        background: rgba(0, 124, 192, 0.3);
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
        display: block;
        div {
            width: 50%;
        }
        /* flex-direction: column;
        div {
            width: 100%;
        } */
    }
`

const HeadTable = styled(TableCell)`
    font-size: 16px !important;
    padding-left: 15px !important;
    display: flex;
    font-family: Inter !important;

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
    font-family: Inter !important;

    @media screen and (max-width: 576px) {
        /* font-size: 14px !important; */
    }

    .label {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;

        @media screen and (max-width: 1920px) {
            justify-content: flex-start;
            padding-left: 140px;
        }

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

    .action {
        width: 200px;
        margin: auto;
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
const CustomTableContainer = styled(TableContainer)`
    overflow: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
`

const ShowAction = styled.div`
    /* background: #fff; */
    display: block;
    /* gap: 500px; */
`
