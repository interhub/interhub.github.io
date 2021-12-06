import {HistoryItem, PredictType} from './types'
import {getDiffItemsKoef, getSumNumbers} from './utils'
import {head, last, sortBy} from 'lodash'
import {TOP} from './config'
import getHistoryAsync from './getHistoryAsync'

export const historyPromise = getHistoryAsync()

const getPredicts = async (moveDays: number, samePeriod: number): Promise<PredictType[]> => {
    const history = await historyPromise
    const TEST_MOVE = moveDays //of days
    const LAST_PERIOD = history.slice(-(samePeriod + TEST_MOVE), -TEST_MOVE || undefined)

    type CheckedPeriodType = { diffSumKoef: number, period: HistoryItem[], dates: string, index: number, nextDayChange: number }

    const getCheckedPeriods = (): CheckedPeriodType[] => {
        const CHECKED_PERIODS: CheckedPeriodType[] = []
        history.map((obj, i, arr) => {
            try {
                const period: HistoryItem[] = arr.slice(i, i + samePeriod)
                if (period.length < samePeriod) return
                //check periods to different to last period and add to array
                const diffKoefsPeriod = period.map((item, i, day) => {
                    return getDiffItemsKoef(day[i], LAST_PERIOD[i])
                })
                const diffSumKoef = getSumNumbers(diffKoefsPeriod)
                const dates = `${head(period)?.DATE} ➡️ ${last(period)?.DATE}`//period.map(({DATE}) => DATE).join(' ')
                const nextDayChange = arr[i + samePeriod] ? arr[i + samePeriod].CHANGE_PERCENT_REAL : 0
                CHECKED_PERIODS.push({period, diffSumKoef, dates, index: i, nextDayChange})
            } catch (e) {
                console.log(e, 'errs with', obj)
            }
        })
        return CHECKED_PERIODS
    }

    const CHECKED_PERIODS = getCheckedPeriods()

    const SORTED_CHECKED_PERIODS: CheckedPeriodType[] = sortBy(CHECKED_PERIODS, 'diffSumKoef')

    const MAX_SAMES_PERIODS = SORTED_CHECKED_PERIODS.slice(0, TOP)

    return MAX_SAMES_PERIODS.map(({
                                      diffSumKoef,
                                      dates,
                                      index
                                  }) => {
        const targetItem = CHECKED_PERIODS[index]
        if (!targetItem) return null
        const nextChangePercent = targetItem.nextDayChange

        return {dates, diffSumKoef, nextChangePercent}
    })
        .filter(Boolean)

}
export default getPredicts