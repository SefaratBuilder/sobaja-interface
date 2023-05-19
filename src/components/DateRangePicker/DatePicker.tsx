import styled from 'styled-components'
import { DateRangePicker } from 'react-date-range'

const DatePicker = ({ dateRange, setDateRange }: any) => {
    const handleSelect = (ranges: any) => {
        setDateRange(ranges.selection)
    }
    return (
        <Container>
            <Title>Calendar</Title>
            <DateRangePicker
                minDate={new Date()}
                ranges={[dateRange]}
                onChange={handleSelect}
            />
        </Container>
    )
}

export default DatePicker

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    .rdrCalendarWrapper {
        box-sizing: border-box;
        background: rgb(183 184 187 / 29%);
        display: inline-flex;
        flex-direction: column;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .rdrDateDisplay {
        display: flex;
        justify-content: space-between;
    }

    .rdrDateDisplayItem {
        flex: 1 1;
        width: 0;
        text-align: center;
        color: inherit;
        display: none;
    }

    .rdrDateDisplayItem + .rdrDateDisplayItem {
        margin-left: 0.833em;
    }

    .rdrDateDisplayItem input {
        text-align: inherit;
    }

    .rdrDateDisplayItem input:disabled {
        cursor: default;
    }

    .rdrDateDisplayItemActive {
    }

    .rdrMonthAndYearWrapper {
        box-sizing: inherit;
        display: flex;
        justify-content: space-between;
    }

    .rdrMonthAndYearPickers {
        flex: 1 1 auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .rdrMonthPicker {
    }

    .rdrYearPicker {
    }

    .rdrNextPrevButton {
        box-sizing: inherit;
        cursor: pointer;
        outline: none;
        display: none;
    }

    .rdrPprevButton {
        display: none;
    }

    .rdrNextButton {
    }

    .rdrMonths {
        display: flex;
    }

    .rdrMonthsVertical {
        flex-direction: column;
    }

    .rdrMonthsHorizontal > div > div > div {
        display: flex;
        flex-direction: row;
    }

    .rdrMonth {
        /* width: 27.667em; */
    }

    .rdrWeekDays {
        display: flex;
    }

    .rdrWeekDay {
        flex-basis: calc(100% / 7);
        box-sizing: inherit;
        text-align: center;
    }

    .rdrDays {
        display: flex;
        flex-wrap: wrap;
    }

    .rdrDateDisplayWrapper {
    }

    .rdrMonthName {
    }

    .rdrInfiniteMonths {
        overflow: auto;
    }

    .rdrDateRangeWrapper {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .rdrDateInput {
        position: relative;
    }

    .rdrDateInput input {
        outline: none;
    }

    .rdrDateInput .rdrWarning {
        position: absolute;
        font-size: 1.6em;
        line-height: 1.6em;
        top: 0;
        right: 0.25em;
        color: #ff0000;
    }

    .rdrDay {
        box-sizing: inherit;
        width: calc(100% / 7);
        position: relative;
        font: inherit;
        cursor: pointer;
        color: #ff0000 !important;
    }

    .rdrDayNumber {
        display: block;
        position: relative;
    }

    .rdrDayNumber span {
        color: #1d2429;
    }

    .rdrDayDisabled {
        cursor: not-allowed;
        opacity: 0.5;
        /* background: #8f8d8d; */
    }

    @supports (-ms-ime-align: auto) {
        .rdrDay {
            flex-basis: 14.285% !important;
        }
    }

    .rdrSelected,
    .rdrInRange,
    .rdrStartEdge,
    .rdrEndEdge {
        pointer-events: none;
    }

    .rdrInRange {
    }

    .rdrDayStartPreview,
    .rdrDayInPreview,
    .rdrDayEndPreview {
        pointer-events: none;
    }

    .rdrDayHovered {
    }

    .rdrDayActive {
        /* opacity: 0.5; */
    }

    .rdrDateRangePickerWrapper {
        display: inline-flex;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .rdrDefinedRangesWrapper {
        display: none;
    }

    .rdrStaticRanges {
        display: flex;
        flex-direction: column;
    }

    .rdrStaticRange {
        font-size: inherit;
    }

    .rdrStaticRangeLabel {
    }

    .rdrInputRanges {
    }

    .rdrInputRange {
        display: flex;
    }

    .rdrInputRangeInput {
    }
`
const Title = styled.div`
    display: flex;
    justify-content: center;
`
