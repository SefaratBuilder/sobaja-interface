export const handleTime = (time: string, visibleHour?: boolean) => {
    const t = new Date(Number(time) * 1000)
    const date =
        t.getFullYear() +
        '-' +
        ((t.getMonth() + 1).toString().length > 1
            ? t.getMonth() + 1
            : `0${t.getMonth() + 1}`) +
        '-' +
        (t.getDate().toString().length > 1
            ? t.getDate()
            : `0${t.getDate()}`)
    if (!visibleHour) return date
    const hour = t.getHours() < 10 ? '0' + t.getHours() : t.getHours()
    const minutes =
        t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()
    return date + " " + hour + ":" + minutes
}