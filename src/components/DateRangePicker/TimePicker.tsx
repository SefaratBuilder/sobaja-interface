// import HiddenGlobalScroll from 'components/HiddenGlobalScroll'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

interface TimePickerProps {
    onChange: (number) => void
    idx: number
}

function TimePicker({ onChange, idx }: TimePickerProps) {
    const [selectedHour, setSelectedHour] = useState(0)
    const [selectedMinute, setSelectedMinute] = useState(idx === 1 ? 2 : 0)
    const [hourList, setHourList] = useState(false)
    const [minutesList, setMinutesList] = useState(false)

    const hours = Array.from(Array(24).keys()).map((hour) => hour)
    const minutes = Array.from(Array(60).keys()).map((minute) => minute)

    const hourRef = useRef(null)
    const minuteRef = useRef(null)
    useOnClickOutside(hourRef, () => setHourList(false))
    useOnClickOutside(minuteRef, () => setMinutesList(false))

    const handleHourClick = (hour) => {
        setSelectedHour(hour)
    }

    const handleMinuteClick = (minute) => {
        setSelectedMinute(minute)
    }

    useEffect(() => {
        const timeUnix = selectedHour * 60 * 60 + selectedMinute * 60
        onChange(timeUnix)
    }, [selectedHour, selectedMinute])

    return (
        <Wrap>
            <Hours ref={hourRef} onClick={() => setHourList(!hourList)}>
                <p>{selectedHour < 10 ? `0${selectedHour}` : selectedHour}</p>
                <HoursSelect onChange={handleHourClick} hourList={hourList}>
                    {hours.map((hour) => (
                        <Option
                            key={hour}
                            type="button"
                            className={selectedHour === hour ? 'selected' : ''}
                            onClick={() => handleHourClick(hour)}
                        >
                            {hour < 10 ? `0${hour}` : hour}
                        </Option>
                    ))}
                </HoursSelect>
            </Hours>
            <p>:</p>
            <Minutes
                ref={minuteRef}
                onClick={() => setMinutesList(!minutesList)}
            >
                <p>
                    {selectedMinute < 10
                        ? `0${selectedMinute}`
                        : selectedMinute}
                </p>
                <MinutesSelect
                    onChange={handleMinuteClick}
                    minutesList={minutesList}
                >
                    {minutes.map((minute) => (
                        <Option
                            key={minute}
                            type="button"
                            className={
                                selectedMinute === minute ? 'selected' : ''
                            }
                            onClick={() => handleMinuteClick(minute)}
                        >
                            {minute < 10 ? `0${minute}` : minute}
                        </Option>
                    ))}
                </MinutesSelect>
            </Minutes>
        </Wrap>
    )
}

export default TimePicker
const Hours = styled.div`
    width: 100%;
    p {
        font-size: 16px;
    }
`
const Minutes = styled(Hours)``
const HoursSelect = styled.div<{ hourList?: boolean }>`
    display: flex;
    flex-basis: 45%;
    flex-direction: column;
    display: ${({ hourList }) => (hourList ? 'block' : 'none')};
    position: absolute;
    border: 0.75px solid rgba(255, 255, 255, 0.3);
    background: rgba(125, 125, 125, 0.1);
    border-radius: 4px;
    overflow: hidden scroll;
    height: 200px;

    left: 0;
    right: 0;
    top: 3rem;

    position: absolute;
    left: 50%;
    text-align: center;
    border-radius: 8px;
    background: rgba(92, 92, 92, 0.3);

    ::-webkit-scrollbar {
        display: none;
    }
`
const MinutesSelect = styled(HoursSelect)<{ minutesList: boolean }>`
    display: ${({ minutesList }) => (minutesList ? 'block' : 'none')};
`
const Option = styled.button`
    font-style: italic;
    color: #fff;
    border: none;
    padding: 0 1.5rem;
    height: 2rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.3);

    position: relative;
    z-index: 2;

    :hover {
        background: rgba(255, 255, 255, 0.5);
    }
`
const Wrap = styled.div`
    display: flex;
    font-style: initial;
    gap: 3px;
    align-items: center;
    justify-content: center;
`
