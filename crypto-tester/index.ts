import 'regenerator-runtime/runtime'
import {head, map} from 'lodash'
import {isBrowser} from 'browser-or-node'
import {PredictType} from './src/types'
import {getDiffPercent} from './src/utils'
import getPredicts from './src/getPredicts'
import printChart from './src/printChart'


const start = async (moveDays: number = 0, enableLogs = true) => {
    const pogrs: number[] = []

    const PREDICTES = await getPredicts(moveDays)
    printChart(PREDICTES)

    const testPeriods = (predicts: PredictType[]) => {

        const isExistRealData = head(predicts)?.diffSumKoef === 0
        const isExistFuture = head(predicts)?.nextChangePercent !== 0
        if (enableLogs)
            console.log({isExistRealData})
        const otherPredicts = isExistRealData ? predicts.slice(1) : predicts
        if (!isExistRealData && enableLogs) {
            console.log('test impossible so have no data for future')
        }
        const realItem = predicts[0]
        const otherChangesPercents = map(otherPredicts, 'nextChangePercent')
        const realChange = isExistRealData && isExistFuture ? realItem.nextChangePercent : 'not exist'
        const mainChange = head(otherChangesPercents)
        if (enableLogs)
            console.log({mainChange, realChange})
        if (isExistRealData && typeof realChange === 'number') {
            const pogrPercent = getDiffPercent(realChange, mainChange) / 100
            pogrs.push(pogrPercent)
            if (enableLogs)
                console.log({pogrPercent})
        }
    }

    testPeriods(PREDICTES)

}

let move = 0

start(move)

if (isBrowser) {
    const backBtn = document.querySelector('#back_btn')
    const frontBrn = document.querySelector('#front_btn')
    console.log(backBtn, frontBrn)
    //@ts-ignore
    frontBrn.addEventListener('click', () => {
        (move <= 0) ? (move = 0) : (move--)
        if (!!move)
            start(move)
    })
    //@ts-ignore
    backBtn.addEventListener('click', () => {
        move++
        console.log(move, 'click')
        start(move)
    })
}
