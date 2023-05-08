// import { IPool, Pool } from 'constants/interface'
import { PoolData, PoolDataMobile } from 'pages/pool'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import ArrowLeft from 'assets/icons/pagination-arrow-left.svg'
import ArrowRight from 'assets/icons/pagination-arrow-right.svg'
import { Data } from 'hooks/useQueryPool'

export interface Paginations {
    page: number
    setPage: any
    isSorted: boolean
    totalPage: number
}

const Pagination = ({ page, setPage, isSorted, totalPage }: Paginations) => {
    useEffect(() => {
        setPage(1)
    }, [isSorted])

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
