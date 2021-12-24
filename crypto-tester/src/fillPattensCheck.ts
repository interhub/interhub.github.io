import positive_patterns from '../positive_patterns.json'
import negative_patterns from '../negative_patterns.json'
import {findIndex, map, max, sortBy} from 'lodash'
import {TOP} from './config'
import moment from 'moment'
import {HistoryItem} from './types'
import {getPeriodsSumKoef} from './utils'
import {CheckedPeriodType, getCheckedPeriods, historyPromise} from './getPredicts'

export let patternsAllTimeExists: { dates: string, isPositive: boolean, diffKoef: number, samePeriod: number }[] = []

export const fillPattensCheck = async (moveDays: number, samePeriod: number,) => {
    const history = await historyPromise

    const maxPatternPeriod = 50
    //period for all finding patterns
    const findPeriod = history.slice(-(moveDays + maxPatternPeriod), (-moveDays) || undefined)
    const allPatterns = positive_patterns.map((p) => ({
        ...p,
        isPositive: true
    })).concat(negative_patterns.map((p) => ({...p, isPositive: false})))

    patternsAllTimeExists = []
    const p = findPeriod.map(async (period, i, arr) => {
        const currentPeriod = arr.slice(-i)
        const sameLenPatternsPos = allPatterns.filter((p) => p.samePeriod === currentPeriod.length)
        const currentCheckedPeriods = await getCheckedPeriods(currentPeriod, samePeriod)
        const currentTopSortedChecked: CheckedPeriodType[] = sortBy(currentCheckedPeriods, 'diffSumKoef').slice(0, TOP)
        const maxCurrentListPeriodsKoef = max(map(currentTopSortedChecked, 'diffSumKoef'))
        sameLenPatternsPos.forEach((pattern) => {
            const patternDayIndex = findIndex(history, (i) => moment(i.TIME).isSame(pattern.dateFrom, 'days')) + 1
            const patternPeriod: HistoryItem[] = history.slice(patternDayIndex, patternDayIndex + pattern.samePeriod)
            if (patternPeriod.length !== currentPeriod.length) return
            const sumDiffPattern = getPeriodsSumKoef(patternPeriod, currentPeriod)
            const isExistAlready = map(patternsAllTimeExists, 'dates').includes(pattern.dates)
            const isIncludedToTopSameList = sumDiffPattern <= maxCurrentListPeriodsKoef
            if (!isExistAlready && isIncludedToTopSameList) {
                patternsAllTimeExists.push({
                    dates: pattern.dates,
                    isPositive: pattern.isPositive,
                    diffKoef: sumDiffPattern,
                    samePeriod: pattern.samePeriod
                })
            }
        })
    })
    await Promise.all(p)
}
