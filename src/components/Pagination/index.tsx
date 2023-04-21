// import { IPool, Pool } from 'constants/interface'
import { PoolData, PoolDataMobile } from 'pages/pool'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import ArrowLeft from 'assets/icons/pagination-arrow-left.svg'
import ArrowRight from 'assets/icons/pagination-arrow-right.svg'

export interface Paginations {
    data: PoolData[] | PoolDataMobile[]
    currentPage: number
    // setPoolsData: React.Dispatch<React.SetStateAction<PoolData[]>>
    setPoolsData: any
    limitNumber: number
}

const Pagination = ({
    data,
    currentPage,
    setPoolsData,
    limitNumber,
}: Paginations) => {
    const [page, setPage] = useState<number>(currentPage)

    const totalPage = data.length > 0 ? Math.ceil(data.length / limitNumber) : 1

    const handleDataInCurrentPage = () => {
        const filterData = data.filter(
            (d, index) =>
                index >= (page - 1) * limitNumber && index < page * limitNumber,
        )
        setPoolsData(filterData)
    }

    useEffect(() => {
        handleDataInCurrentPage()
        // }, [])
    }, [data, page])

    return (
        <Container>
            <div
                onClick={() => {
                    if (page > 1) {
                        setPage(page - 1)
                    }
                }}
            >
                <img src={ArrowLeft} alt="" />
            </div>
            <p>
                Page {page} of {totalPage}
            </p>
            <div
                onClick={() => {
                    if (page < totalPage) {
                        setPage(page + 1)
                    }
                }}
            >
                <img src={ArrowRight} alt="" />
            </div>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    padding-top: 16px;

    div {
        cursor: pointer;
    }
`

export default Pagination
