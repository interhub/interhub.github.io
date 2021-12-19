import 'regenerator-runtime/runtime'
import {head, map} from 'lodash'
import {isBrowser} from 'browser-or-node'
import {PredictType} from './src/types'
import {getDiffPercent} from './src/utils'
import getPredicts from './src/getPredicts'
import printChart from './src/printChart'
import 'moment/locale/ru'
import {addHandlersDom, initDom} from './src/initDom'
import moment from 'moment'

declare let isAccess: boolean

export const POSITIVES_PARAMS = []
export const NEGATIVE_PARAMS = []

export const start = async (moveDays: number = 0, samePeriod = 7, isTest?: boolean) => {
    if (!isAccess) return
    const pogrs: number[] = []

    const PREDICTES = await getPredicts(moveDays, samePeriod, isTest)
    printChart(PREDICTES)

    //tests
    const testPatternCount = 7
    const isPositiveAll = PREDICTES.slice(0, testPatternCount).every(({nextChangePercent}) => nextChangePercent >= 0)
    const isNegativeAll = PREDICTES.slice(0, testPatternCount).every(({nextChangePercent}) => nextChangePercent <= 0)
    const dateFrom = moment().subtract(moveDays + samePeriod, 'days').valueOf()
    const dateTo = moment().subtract(moveDays, 'days').add(1, 'day').valueOf()
    if (isPositiveAll) {
        POSITIVES_PARAMS.push({samePeriod, dateFrom, dateTo, dates: head(PREDICTES).dates})
    }
    if (isNegativeAll) {
        NEGATIVE_PARAMS.push({samePeriod, dateFrom, dateTo, dates: head(PREDICTES).dates})
    }

    const testPeriods = (predicts: PredictType[]) => {

        const isExistRealData = head(predicts)?.diffSumKoef === 0
        const isExistFuture = head(predicts)?.nextChangePercent !== 0
        const otherPredicts = isExistRealData ? predicts.slice(1) : predicts
        if (!isExistRealData) {
            console.log('test impossible so have no data for future')
        }
        const realItem = predicts[0]
        const otherChangesPercents = map(otherPredicts, 'nextChangePercent')
        const realChange = isExistRealData && isExistFuture ? realItem.nextChangePercent : 'not exist'
        const mainChange = head(otherChangesPercents)
        if (isExistRealData && typeof realChange === 'number') {
            const pogrPercent = getDiffPercent(realChange, mainChange) / 100
            pogrs.push(pogrPercent)
        }
    }

    testPeriods(PREDICTES)
    const lastTargetPeriod = PREDICTES[0].dates

    if (isBrowser) {
        await initDom({samePeriod, moveDays, lastTargetPeriod})
    }

}

let move = 0
let samePeriod = 7

if (isBrowser) {
    addHandlersDom(samePeriod, move)
}

start(move, samePeriod)
//@ts-ignore
// test()
