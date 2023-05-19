import React, { useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import styled from 'styled-components'

function DateRangePickerWithButton(props: any) {
    const { type, closeModal } = props
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })

    const handleSelect = (ranges: any) => {
        setDateRange(ranges.selection)
    }

    const handleSetDates = () => {
        console.log('Start Date:', dateRange.startDate.toLocaleDateString())
        console.log('End Date:', dateRange.endDate.toLocaleDateString())
        // You can pass the date range state to a parent component or perform other actions here.
    }

    return (
        <Container className={type}>
            <DateRangePicker
                ranges={[dateRange]}
                onChange={handleSelect}
                {...props}
            />
            <WrapButton>
                <Button
                    onClick={() => {
                        closeModal(false)
                    }}
                    className="close"
                >
                    Close
                </Button>

                <Button onClick={handleSetDates}>Set Dates</Button>
            </WrapButton>
        </Container>
    )
}

export default DateRangePickerWithButton

const Container = styled.div`
    width: fit-content;
    position: absolute;
    top: 50px;
    box-shadow: rgba(255, 255, 255, 0.15) 1.95px 1.95px 2.6px;
    border-radius: 10px;
    border: 0.75px solid #fff;
    .rdrDateRangePickerWrapper {
        height: 320px;
        backdrop-filter: blur(5px);
        border-radius: 10px;
    }
    .rdrDateDisplayWrapper,
    .rdrInputRanges {
        display: none;
    }
    .rdrDefinedRangesWrapper,
    .rdrCalendarWrapper {
        background: rgba(255, 255, 255, 0.1);
        height: 271px;
        border-radius: 0 10px 0 0;
        backdrop-filter: blur(5px);
    }

    .rdrStartEdge,
    .rdrEndEdge,
    .rdrInRange,
    .rdrDayStartPreview,
    .rdrDayEndPreview,
    .rdrDayInPreview {
        color: rgb(0, 117, 255) !important;
    }
    .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span,
    .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
    .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span,
    .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span {
        color: #fff;
    }
    .rdrStaticRange {
        border-bottom: none;
        background: transparent;
        color: #fff !important;
    }
    .rdrStaticRangeSelected {
    }
    .rdrDayNumber {
        span {
            color: #fff;
        }
    }
    .rdrDayPassive {
        span {
            color: rgba(255, 255, 255, 0.3);
        }
    }
    .rdrDayToday .rdrDayNumber span:after {
        background: rgb(0, 117, 255);
    }
    .rdrNextPrevButton,
    .rdrPprevButton {
        :hover {
            background: rgb(255, 255, 255, 0.1);
        }
    }
    .rdrPprevButton {
        background: transparent;
        i {
            border-color: transparent #fff transparent transparent;
        }
    }
    .rdrNextButton {
        background: transparent;
        i {
            border-color: transparent transparent transparent #fff;
        }
    }
    .rdrMonthAndYearPickers {
        padding: 0.5rem;
        width: 120px;
    }

    .rdrMonthPicker,
    .rdrYearPicker {
        select {
            padding: 0.5rem;
            width: 80px;
            color: #fff;
            background: none;
        }
        select:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }
    .rdrDefinedRangesWrapper {
        border-right: 0.75px solid rgba(255, 255, 255, 1);
        height: 271px;
        border-radius: 10px 0px 0px 0px;
        padding-top: 1rem;
    }
    .rdrStaticRange:hover .rdrStaticRangeLabel,
    .rdrStaticRange:focus .rdrStaticRangeLabel {
        background: rgb(0, 117, 255);
    }

    @media screen and (max-width: 576px) {
        .rdrDateRangePickerWrapper {
            flex-direction: column;
            .rdrDefinedRangesWrapper {
                width: 100%;
                border: none;
                border-bottom: 0.75px solid;
                max-width: unset;
                align-items: center;
            }
        }
    }
`

const WrapButton = styled.div`
    position: absolute;
    bottom: 0px;
    border-top: 0.75px solid rgb(255, 255, 255);
    padding: 0 0.833em 0em 0.833em;
    right: 0;
    left: 0;
    height: 50px;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: end;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0 0 10px 10px;
    backdrop-filter: blur(5px);
`

const Button = styled.button`
    border: none;
    cursor: pointer;
    background: rgb(0, 117, 255);
    outline: none;
    color: #fff;
    border-radius: 8px;
    height: 30px;
    padding: 0.4rem 1rem;
    min-width: 100px;
    :hover {
        opacity: 0.7;
    }
`
