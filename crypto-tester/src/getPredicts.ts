import {HistoryItem, PredictType} from './types'
import {getPeriodsSumKoef} from './utils'
import {head, last, sortBy} from 'lodash'
import {TOP} from './config'
import getHistoryAsync from './getHistoryAsync'
import {fillPattensCheck} from './fillPattensCheck'


export const historyPromise = getHistoryAsync()

let lastMovePeriod = undefined

export type CheckedPeriodType = { diffSumKoef: number, period: HistoryItem[], dates: string, index: number, nextDayChange: number, nextDayValues: number[], prevDayValues: number[], periodDayValues: number[] }

export const getCheckedPeriods = async (lastPeriod: HistoryItem[], samePeriod: number): Promise<CheckedPeriodType[]> => {
    const history = await historyPromise
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


const getPredicts = async (moveDays: number, samePeriod: number, isTest?: boolean): Promise<PredictType[]> => {
    const history = await historyPromise
    const TEST_MOVE = moveDays //of days
    const LAST_PERIOD = history.slice(-(samePeriod + TEST_MOVE), -TEST_MOVE || undefined)


    const CHECKED_PERIODS = await getCheckedPeriods(LAST_PERIOD, samePeriod)
    const SORTED_CHECKED_PERIODS: CheckedPeriodType[] = sortBy(CHECKED_PERIODS, 'diffSumKoef')
    const MAX_SAMES_PERIODS = SORTED_CHECKED_PERIODS.slice(0, TOP)


    const isChangeMovePeriod = lastMovePeriod !== moveDays
    if (!isTest && isChangeMovePeriod) {
        await fillPattensCheck(moveDays, samePeriod)
        lastMovePeriod = moveDays
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
