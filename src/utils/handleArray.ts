export const uniqByKeepFirst = (a: any, key: any) => {
    const seen = new Set()
    return a.filter((item: any) => {
        const k = key(item)
        return seen.has(k) ? false : seen.add(k)
    })
}