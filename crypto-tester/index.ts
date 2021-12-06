import 'regenerator-runtime/runtime'
import {head, map} from 'lodash'
import {isBrowser} from 'browser-or-node'
import {PredictType} from './src/types'
import {getDiffPercent} from './src/utils'
import getPredicts from './src/getPredicts'
import printChart from './src/printChart'
import moment from 'moment'


const start = async (moveDays: number = 0, samePeriod = 7) => {
    const pogrs: number[] = []

    const PREDICTES = await getPredicts(moveDays, samePeriod)
    printChart(PREDICTES)

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
    if (isBrowser) {
        const title = document.querySelector('#title')
        title.innerHTML = `Прогнозы для изменения цены на ${moment().add(1, 'day').subtract(moveDays, 'day').format('DD MMMM YYYY')}`
    }

}

let move = 0
let samePeriod = 7

start(move, samePeriod)

if (isBrowser) {
    const backBtn = document.querySelector('#back_btn')
    const frontBrn = document.querySelector('#front_btn')
    const periodInput = document.querySelector('#period')
    //@ts-ignore
    frontBrn.addEventListener('click', () => {
        if ((move - 1) < 0) return
        move--
        start(move, samePeriod)
    })
    //@ts-ignore
    backBtn.addEventListener('click', () => {
        move++
        console.log(move, 'click')
        start(move, samePeriod)
    })
    periodInput.addEventListener('input', (e) => {
        //@ts-ignore
        const value = parseInt(e?.target?.value) || 0
        const newSamePeriod = (value < 7) ? 7 : value
        start(move, newSamePeriod)
    })
}
