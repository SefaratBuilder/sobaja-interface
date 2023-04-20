import React, {
    useState,
    useEffect,
    useCallback,
    MouseEvent,
    ChangeEvent,
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

import PrimaryButton from 'components/Buttons/PrimaryButton'
import SearchIcon from 'assets/icons/search.svg'
import PairTokens from 'components/LogoToken/PairTokens'
import imgDownArrowWhite from 'assets/icons/chevron-white.svg'
import arrowDown from 'assets/icons/arrowDown.svg'
import { useNavigate } from 'react-router-dom'
import MyPools from 'components/MyPools'
import ToastMessage from 'components/ToastMessage'

interface Data {
    name: string
    volume: string
    tvl: string
    network: string
    fee: string
    apr: string
}

function createData(
    network: string,
    name: string,
    tvl: string,
    volume: string,
    fee: string,
    apr: string,
): Data {
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
    USDC,
    DAI,
    SUSHI,
    BTC,
    BNB,
    MATIC,
    UNI,
    USDT,
    AVA,
}

const rows = [
    createData('Ethereum', 'USDC/ETH', '$66.66m', '$100.99k', '$66.66k', '10%'),
    createData('Ethereum', 'ETH/USDT', '$66.66m', '$100.99k', '$66.66k', '10%'),
    createData('Ethereum', 'BTC/ETH', '$66.66m', '$100.99k', '$66.66k', '10%'),
    createData(
        'Ethereum',
        'SUSHI/ETH',
        '$66.66m',
        '$100.99k',
        '$66.66k',
        '10%',
    ),
    createData('Ethereum', 'BNB/ETH', '$66.66m', '$100.99k', '$66.66k', '10%'),
    createData('Ethereum', 'AVA/USDT', '$66.66m', '$100.99k', '$66.66k', '10%'),
    createData('Ethereum', 'DAI/UNI', '$66.66m', '$100.99k', '$66.66k', '10%'),
    createData(
        'Ethereum',
        'USDT/SUSHI',
        '$66.66m',
        '$100.99k',
        '$66.66k',
        '10%',
    ),
    createData('Ethereum', 'USDC/UNI', '$66.66m', '$100.99k', '$66.66k', '10%'),
]

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
    id: keyof Data
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

const DEFAULT_ORDER = 'asc'
const DEFAULT_ORDER_BY = 'name'
const DEFAULT_ROWS_PER_PAGE = 10

interface EnhancedTableProps {
    numSelected: number
    onRequestSort: (event: MouseEvent<unknown>, newOrderBy: keyof Data) => void
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void
    order: Order
    orderBy: string
    rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy } = props
    return (
        <TableHead
        // className="black-bg"
        >
            <TableRow style={{ height: 5 }}></TableRow>

            <TableRow>
                {headCells.map((headCell, index) => (
                    <HeadTable
                        key={headCell.id}
                        align={
                            index === 1
                                ? 'center'
                                : headCell.numeric
                                ? 'right'
                                : 'left'
                        }
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{
                            color: 'white',
                            borderBottom: 'none',
                            // borderTop: 1,
                            borderColor: '#ffffff4c',
                        }}
                        className="black-bg"
                    >
                        {headCell.label}{' '}
                        {index === 2 && (
                            <img src={arrowDown} alt="arrow-down" />
                        )}
                    </HeadTable>
                ))}
            </TableRow>
            <TableRow style={{ height: 5 }}></TableRow>
        </TableHead>
    )
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
    const [page, setPage] = useState(0)
    const [dense, setDense] = useState(false)
    const [visibleRows, setVisibleRows] = useState<Data[] | null>(null)
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)
    const [paddingHeight, setPaddingHeight] = useState(0)
    const [searchName, setSearchName] = useState('')
    const [isMyPositionPage, setIsMyPositionPage] = useState(false)

    useEffect(() => {
        let rowsOnMount = stableSort(
            rows,
            getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
        )
        rowsOnMount = rowsOnMount.slice(
            0 * DEFAULT_ROWS_PER_PAGE,
            0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
        )

        setVisibleRows(rowsOnMount)
    }, [])

    const handleOnSearch = (e: any) => {
        if (e.target.value) {
            let newRows = rows.filter((i) =>
                i.name.includes(e?.target?.value?.toUpperCase()),
            )
            setSearchName(e.target.value)
            setVisibleRows(newRows)
        } else {
            setSearchName('')
            let rowsOnMount = stableSort(
                rows,
                getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
            )
            rowsOnMount = rowsOnMount.slice(
                0 * DEFAULT_ROWS_PER_PAGE,
                0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
            )

            setVisibleRows(rowsOnMount)
        }
    }

    const handleRequestSort = useCallback(
        (event: MouseEvent<unknown>, newOrderBy: keyof Data) => {
            const isAsc = orderBy === newOrderBy && order === 'asc'
            const toggledOrder = isAsc ? 'desc' : 'asc'
            setOrder(toggledOrder)
            setOrderBy(newOrderBy)

            const sortedRows = stableSort(
                rows,
                getComparator(toggledOrder, newOrderBy),
            )
            const updatedRows = sortedRows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            )
            setVisibleRows(updatedRows)
        },
        [order, orderBy, page, rowsPerPage],
    )

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

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
                            <div className="circle">0</div>
                        </HeadLabelLeft>
                    {
                        !isMyPositionPage && (
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
                        )
                    }   
                    </HeadLabel>
                    {!isMyPositionPage && (
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                />
                                <TableBody>
                                    {visibleRows
                                        ? visibleRows.map((row, index) => {
                                              const isItemSelected = isSelected(
                                                  row.name,
                                              )
                                              const labelId = `enhanced-table-checkbox-${index}`

                                              return (
                                                  <>
                                                      <RowTable
                                                          role="checkbox"
                                                          aria-checked={
                                                              isItemSelected
                                                          }
                                                          tabIndex={-1}
                                                          key={index}
                                                          selected={
                                                              isItemSelected
                                                          }
                                                          sx={{
                                                              cursor: 'pointer',
                                                          }}
                                                      >
                                                          <CellTable
                                                              component="th"
                                                              id={labelId}
                                                              scope="row"
                                                              padding="normal"
                                                              sx={{
                                                                  width: '100px',
                                                              }}
                                                              align="center"
                                                          >
                                                              <img
                                                                  className="network"
                                                                  src={LogoETH}
                                                                  alt=""
                                                              />
                                                          </CellTable>
                                                          <CellTable align="center">
                                                              <div className="label">
                                                                  <PairTokens
                                                                      tokenA={
                                                                          Logos?.[
                                                                              row.name.split(
                                                                                  '/',
                                                                              )?.[0]
                                                                          ]
                                                                      }
                                                                      tokenB={
                                                                          Logos?.[
                                                                              row.name.split(
                                                                                  '/',
                                                                              )?.[1]
                                                                          ]
                                                                      }
                                                                  />
                                                                  <div className="name">
                                                                      {row.name}
                                                                  </div>
                                                                  <Badge>
                                                                      0.30%
                                                                  </Badge>
                                                              </div>
                                                          </CellTable>
                                                          <CellTable align="right">
                                                              {row.tvl}
                                                          </CellTable>
                                                          <CellTable align="right">
                                                              {row.volume}
                                                          </CellTable>
                                                          <CellTable align="right">
                                                              {row.fee}
                                                          </CellTable>
                                                          <CellTable align="right">
                                                              {row.apr}
                                                          </CellTable>
                                                      </RowTable>
                                                      <TableRow
                                                          style={{ height: 5 }}
                                                      ></TableRow>
                                                  </>
                                              )
                                          })
                                        : null}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
    font-style: italic;
    font-weight: 300;
    overflow: hidden;
    margin-bottom: 50px;

    .black-bg {
        background: rgba(0, 0, 0, 0.3) !important;
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

    @media screen and (max-width: 576px) {
        flex-direction: column;
        gap: 10px;
    }

    .title {
        font-style: italic;
        font-weight: 600;
        font-size: 50px;
        line-height: 61px;
        @media screen and (max-width: 576px) {
            font-size: 30px;
        }
    }

    .details {
        font-style: italic;
        font-weight: 500;
        font-size: 20px;
        line-height: 24px;

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

    @media screen and (max-width: 992px) {
        flex-direction: column;
        gap: 10px;
        div:nth-child(2) {
            justify-content: space-between;
        }
    }
`

const RowTable = styled(TableRow)`
    /* background: rgba(0, 0, 0, 0.3) !important; */

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
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgba(0, 178, 255, 0.3);
        text-align: center;
        font-style: normal;
        color: rgba(0, 178, 255, 1);
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
    /* font-family: 'Roboto', sans-serif !important; */
    display: flex;

    justify-content: center;
    align-items: center;

    img {
        width: 12px;
    }

    @media screen and (max-width: 576px) {
        font-size: 12px !important;
    }
`

const CellTable = styled(TableCell)`
    display: flex;
    color: white !important;
    border: none !important;
    font-size: 16px !important;
    color: white;
    /* padding: 15px 15px 0 0 !important; */
    font-family: 'Roboto', sans-serif !important;
    background: rgba(0, 0, 0, 0.3) !important;

    @media screen and (max-width: 576px) {
        font-size: 12px !important;
    }

    .label {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }

    .name {
        min-width: 100px;
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
        font-style: italic;
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
        /* font-size: 18px !important; */
        /* font-family: 'Montserrat'; */
        font-style: italic;
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
