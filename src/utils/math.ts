import JSBI from 'jsbi-calculator'

const { calculator } = JSBI

export const fixNum = (number: number | string): string => {
    const checkStr: any = number.toString()

    if (checkStr.includes('-') && !checkStr.includes('e')) {
        const a = checkStr
            .toLocaleString('fullwide', { useGrouping: false })
            .replace('-', '')
        return `(0 - ${a})`
    } else if (
        checkStr.includes('e') &&
        !checkStr.includes('+') &&
        !checkStr.includes('-')
    )
        return checkStr.toLocaleString('fullwide', { useGrouping: false })
    else if (checkStr.includes('e-')) {
        const splitNum = checkStr.split('e-')
        let fixLtZeroNum = '0.'
        for (let i = 0; i < Number(splitNum[1]) - 1; i++) {
            fixLtZeroNum += '0'
        }
        fixLtZeroNum += splitNum[0].replace('.', '')
        return fixLtZeroNum
    } else if (checkStr.includes('e+')) {
        const splited = checkStr.split('e+')
        const length = splited[0].includes('.')
            ? splited[0].split('.')[1].length
            : 0
        let data = splited[0].replace('.', '')
        for (let i = 0; i <= Number(splited[1]) - length - 1; i++) {
            data += '0'
        }
        return data
    } else {
        return checkStr
    }
}

export const mul = (numberA: any, numberB: any) => {
    const data = fixNum(numberA) + '*' + fixNum(numberB)
    return calculator(data)
}

export const div = (numberA: any, numberB: any) => {
    if (numberB == 0 || !numberB) return 0
    const data = fixNum(numberA) + '/' + fixNum(numberB)
    return calculator(data)
}

export const add = (numberA: any, numberB: any) => {
    const data = fixNum(numberA) + '+' + fixNum(numberB)
    return calculator(data)
}

export const sub = (numberA: any, numberB: any) => {
    const data = fixNum(numberA) + '-' + fixNum(numberB)
    return calculator(data)
}

export const divNumberWithDecimal = (
    n: number | string,
    decimals: number,
): string => {
    return fixNum(div(n, 10 ** decimals))
}

export const mulNumberWithDecimal = (
    n: number | string,
    decimals: number,
): string => {
    if (!n) return '0'
    if (n?.toString().includes('.')) {
        if (n.toString().split('.')[1].length >= decimals) {
            const a = n.toString().split('.')
            return fixNum(a[0] + a[1].slice(0, decimals))
        } else {
            const diff = decimals - n.toString().split('.')[1].length
            let zero = ''
            for (let i = 0; i < diff; i++) zero += '0'
            return fixNum(n.toString().replaceAll('.', '') + zero)
        }
    } else {
        return fixNum(mul(n, 10 ** decimals))
    }
}
