import {HistoryItem, PredictType} from './types'
import {getDiffItemsKoef, getSumNumbers} from './utils'
import {findIndex, head, last, map, max, sortBy} from 'lodash'
import {TOP} from './config'
import getHistoryAsync from './getHistoryAsync'
import positive_patterns from '../positive_patterns.json'
import negative_patterns from '../negative_patterns.json'
import moment from 'moment'

export let patternsAllTimeExists: { dates: string, isPositive: boolean, diffKoef: number, samePeriod: number }[] = []

export const historyPromise = getHistoryAsync()

const getPredicts = async (moveDays: number, samePeriod: number, isTest?: boolean): Promise<PredictType[]> => {
    const history = await historyPromise
    const TEST_MOVE = moveDays //of days
    const LAST_PERIOD = history.slice(-(samePeriod + TEST_MOVE), -TEST_MOVE || undefined)

    type CheckedPeriodType = { diffSumKoef: number, period: HistoryItem[], dates: string, index: number, nextDayChange: number, nextDayValues: number[], prevDayValues: number[], periodDayValues: number[] }

    const getPeriodsSumKoef = (period1: HistoryItem[], period2: HistoryItem[]): number => {
        const diffKoefsPeriod = period1.map((item, i, days) => {
            return getDiffItemsKoef(days[i], period2[i])
        })
        return getSumNumbers(diffKoefsPeriod)
    }

    const getCheckedPeriods = (lastPeriod: HistoryItem[]): CheckedPeriodType[] => {
        const CHECKED_PERIODS: CheckedPeriodType[] = []
        history.map((obj, i, arr) => {
            try {
                const period: HistoryItem[] = arr.slice(i, i + lastPeriod.length)
                if (period.length < samePeriod) return
                //check periods to different to last period and add to array
                const diffSumKoef = getPeriodsSumKoef(period, lastPeriod)
                const dates = `${head(period)?.DATE} ➡️ ${last(period)?.DATE}`
                const nextDayChange = arr[i + samePeriod] ? arr[i + samePeriod].CHANGE_PERCENT_REAL : 0
                const nextDayValues = new Array(samePeriod).fill(1).map((_, key) => arr[i + samePeriod + key] ? arr[i + samePeriod + key].CLOSE : 0)
                const periodDayValues = new Array(samePeriod).fill(1).map((_, key) => arr[i + key] ? arr[i + key].CLOSE : 0)
                const prevDayValues = new Array(samePeriod).fill(1).map((_, key) => arr[i + key - samePeriod] ? arr[i + key - samePeriod].CLOSE : 0)

                //end calc of patterns

                CHECKED_PERIODS.push({
                    period,
                    diffSumKoef,
                    dates,
                    index: i,
                    nextDayChange,
                    nextDayValues,
                    prevDayValues,
                    periodDayValues
                })
                // console.log(JSON.stringify(CHECKED_PERIODS, null, ' '))
            } catch (e) {
                console.log(e, 'errs with', obj)
            }
        })
        return CHECKED_PERIODS
    }

    const CHECKED_PERIODS = getCheckedPeriods(LAST_PERIOD)
    const SORTED_CHECKED_PERIODS: CheckedPeriodType[] = sortBy(CHECKED_PERIODS, 'diffSumKoef')
    const MAX_SAMES_PERIODS = SORTED_CHECKED_PERIODS.slice(0, TOP)

    const fillPattensCheck = () => {
        const maxPatternPeriod = 50
        //period for all finding patterns
        const findPeriod = history.slice(-(moveDays + maxPatternPeriod), (-moveDays) || undefined)
        const allPatterns = positive_patterns.map((p) => ({
            ...p,
            isPositive: true
        })).concat(negative_patterns.map((p) => ({...p, isPositive: false})))

        patternsAllTimeExists = []
        findPeriod.map((period, i, arr) => {
            const currentPeriod = arr.slice(-i)
            const sameLenPatternsPos = allPatterns.filter((p) => p.samePeriod === currentPeriod.length)
            const currentCheckedPeriods = getCheckedPeriods(currentPeriod)
            const currentTopSortedChecked: CheckedPeriodType[] = sortBy(currentCheckedPeriods, 'diffSumKoef').slice(0, TOP)
            const maxCurrentListPeriodsKoef = max(map(currentTopSortedChecked, 'diffSumKoef'))
            sameLenPatternsPos.forEach((pattern) => {
                const patternDayIndex = findIndex(history, (i) => moment(i.TIME).isSame(pattern.dateFrom, 'days'))+1
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

    }
    if (!isTest) {
        fillPattensCheck()
    }

    return MAX_SAMES_PERIODS.map(({
                                      diffSumKoef,
                                      dates,
                                      index
                                  }) => {
        const targetItem = CHECKED_PERIODS[index]
        if (!targetItem) return null
        const nextChangePercent = targetItem.nextDayChange
        const nextDayValues = targetItem.nextDayValues
        const prevDayValues = targetItem.prevDayValues
        const periodDayValues = targetItem.periodDayValues
        return {dates, diffSumKoef, nextChangePercent, nextDayValues, prevDayValues, periodDayValues}
    })
        .filter(Boolean)

}
export default getPredicts
