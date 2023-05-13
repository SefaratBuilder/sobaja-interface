import { add } from "./math"

export const badgeColors: any = {
    OnSale: 'aquamarine',
    OnProgess: 'yellow',
    Closed: 'red',
}

export const getCurrentTimeLine = (startTime?: string, endTime?: string, isFinalized?: boolean) => {
    const timeLine = [
        {
            time: startTime,
            title: 'Soba Holding Calculation Period',
        },
        {
            time: endTime,
            title: 'Subscription Period',
        },
        {
            time: add(endTime, 3600),
            title: 'Calculation Period',
        },
        {
            time: add(endTime, 3600 * 2),
            title: 'Final Token Distribution',
            isFinalized: isFinalized || false,
        },
    ]

    const currentTs = new Date().getTime() / 1000

    let i = 0
    let result = timeLine[0]
    let badge: 'On Sale' | 'On Progess' | 'Closed' = 'On Sale'
    timeLine.map((tl, index) => {
        if (Number(tl.time) < currentTs) {
            i = index
            result = tl
        }
    })


    if (currentTs > Number(endTime)) badge = 'On Progess'
    if (!isFinalized && i === 3) {
        i -= 1
        return { ...result, index: i, badge, timeLine }
    }

    if (isFinalized) badge = 'Closed'
    return { ...result, index: i, badge, timeLine }
}

export const getCurrentTimeLines = (
    obj: Array<{ startTime: string, endTime: string, isFinalized: boolean }>
) => {
    return obj.map(({ startTime, endTime, isFinalized }) => {
        return getCurrentTimeLine(startTime, endTime, isFinalized)
    })
}