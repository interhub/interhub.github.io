import {HistoryItem} from './types'
import {sum} from 'lodash'

export const getDiffPercent = (from: number, to: number) => {
    return toFixed(((to - from) / from) * 100)
}
export const toFixed = (num: number = 0, point = 2) => {
    return parseFloat(num.toFixed(2))
}
export const getDiffItemsKoef = (item1: HistoryItem, item2: HistoryItem) => {
    const BODY_DIFF = Math.abs((item1.CHANGE_PERCENT_REAL - item2.CHANGE_PERCENT_REAL) || 0)
    const TOP_SHADOW_DIFF = Math.abs((item1.TOP_SHADOW_PERCENT - item2.TOP_SHADOW_PERCENT) || 0)
    const LOW_SHADOW_DIFF = Math.abs((item1.LOW_SHADOW_PERCENT - item2.LOW_SHADOW_PERCENT) || 0)
    const diffKoef = getSumNumbers([BODY_DIFF, TOP_SHADOW_DIFF, LOW_SHADOW_DIFF])
    return toFixed(diffKoef)
}
export const stringToNumber = (str: string): number => Number(str.slice(0, -4).replace(/\./g, '')) / 1000

export const getSumNumbers = (numbers: number[]) => {
    return sum(numbers)
}
