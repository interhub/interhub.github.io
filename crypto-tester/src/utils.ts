import {HistoryItem} from './types'
import {sum} from 'lodash'

export const getDiffPercent = (from: number, to: number) => {
    return toFixed(((to - from) / from) * 100)
}
export const toFixed = (num: number = 0, point = 2) => {
    return parseFloat(num.toFixed(point))
}
export const getDiffItemsKoef = (item1: HistoryItem, item2: HistoryItem) => {
    const BODY_DIFF = Math.abs((item1.CHANGE_PERCENT_REAL - item2.CHANGE_PERCENT_REAL) || 0)
    const TOP_SHADOW_DIFF = Math.abs((item1.TOP_SHADOW_PERCENT - item2.TOP_SHADOW_PERCENT) || 0)
    const LOW_SHADOW_DIFF = Math.abs((item1.LOW_SHADOW_PERCENT - item2.LOW_SHADOW_PERCENT) || 0)
    const diffKoef = Math.hypot(BODY_DIFF, TOP_SHADOW_DIFF, LOW_SHADOW_DIFF)//getSumNumbers([BODY_DIFF, TOP_SHADOW_DIFF, LOW_SHADOW_DIFF])
    return toFixed(diffKoef)
}
export const getPeriodsSumKoef = (period1: HistoryItem[], period2: HistoryItem[]): number => {
    const diffKoefsPeriod = period1.map((item, i, days) => {
        return getDiffItemsKoef(days[i], period2[i])
    })
    return getSumNumbers(diffKoefsPeriod)
}
export const stringToNumber = (str: string): number => Number(str.slice(0, -4).replace(/\./g, '')) / 1000

export const getSumNumbers = (numbers: number[]) => {
    return sum(numbers)
}
export const getSamePercentNumbersByDiffKoef = (diffKoefs: number[]) => {
    const sum = getSumNumbers(diffKoefs)
    const mulKoef = 100 / sum
    const diffPercents = diffKoefs.map((n) => n * mulKoef)
    const samePercentsEqual = diffPercents.reverse()
    return samePercentsEqual
}

