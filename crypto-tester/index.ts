import 'regenerator-runtime/runtime'
import {head, map} from 'lodash'
import {isBrowser} from 'browser-or-node'
import {PredictType} from './src/types'
import {getDiffPercent} from './src/utils'
import getPredicts from './src/getPredicts'
import printChart from './src/printChart'
import 'moment/locale/ru'
import {addHandlersDom, initDom} from './src/initDom'

export const POSITIVES_PARAMS = []

const start = async (moveDays: number = 0, samePeriod = 7) => {
    const pogrs: number[] = []

    const PREDICTES = await getPredicts(moveDays, samePeriod)
    printChart(PREDICTES)

    //tests
    const isPositiveAll = PREDICTES.slice(0, 7).every(({nextChangePercent}) => nextChangePercent >= 0)
    if (isPositiveAll) {
        POSITIVES_PARAMS.push({samePeriod, moveDays, dates: head(PREDICTES).dates})
    }

    const testPeriods = (predicts: PredictType[]) => {

        const isExistRealData = head(predicts)?.diffSumKoef === 0
        const isExistFuture = head(predicts)?.nextChangePercent !== 0
        console.log({isExistRealData})
        const otherPredicts = isExistRealData ? predicts.slice(1) : predicts
        if (!isExistRealData) {
            console.log('test impossible so have no data for future')
        }
        const realItem = predicts[0]
        const otherChangesPercents = map(otherPredicts, 'nextChangePercent')
        const realChange = isExistRealData && isExistFuture ? realItem.nextChangePercent : 'not exist'
        const mainChange = head(otherChangesPercents)
        console.log({mainChange, realChange})
        if (isExistRealData && typeof realChange === 'number') {
            const pogrPercent = getDiffPercent(realChange, mainChange) / 100
            pogrs.push(pogrPercent)
            console.log({pogrPercent})
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
    addHandlersDom(samePeriod, move, start)
}

start(move, samePeriod)
