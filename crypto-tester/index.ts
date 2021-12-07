import 'regenerator-runtime/runtime'
import {head, last, map} from 'lodash'
import {isBrowser} from 'browser-or-node'
import {PredictType} from './src/types'
import {getDiffPercent} from './src/utils'
import getPredicts, {historyPromise} from './src/getPredicts'
import printChart from './src/printChart'
import moment from 'moment'
import 'moment/locale/ru'

const POSITIVES_PARAMS = []

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
    const lastPrice = last(await historyPromise).CLOSE
    const lastTime = last(await historyPromise).TIME
    if (isBrowser) {
        const title = document.querySelector('#title')
        const info = document.querySelector('#info')
        title.innerHTML = `Прогнозы для изменения цены на ${moment().add(1, 'day').subtract(moveDays, 'day').format('DD MMMM YYYY')}
<br/><br/>
Последняя известная цена BTC = ${lastPrice}. Обновлено ${moment(lastTime).format('DD MMMM YYYY HH:mm:ss')}, обновляется каждые 4ч
`
        info.innerHTML = `* Изменение цены историческое (%) - изменение цены на ${samePeriod + 1}-й день периода
<br/>
* Коэффициент разницы периодов - показатель различия периода (${PREDICTES[0].dates}) от периода из правого столбика. Чем меньше - тем больше совпадение. ( ноль - значит это и есть последний искомый период )
<br/>
* Схожий период изменения цены - период который имеет схожее колебание цены с периодом (${PREDICTES[0].dates})
        `
    }

}

let move = 0
let samePeriod = 7

// start(move, samePeriod)

const test = async () => {
    const MAX_PERIOD = 20
    const MAX_DAYS_MOVE = 300
    for (let mo = 0; mo < MAX_DAYS_MOVE; mo++) {
        for (let per = 2; per < MAX_PERIOD; per++) {
            await start(mo, per)
        }
    }
    console.log({POSITIVES_PARAMS}, POSITIVES_PARAMS.length)
}

if (isBrowser) {
    //@ts-ignore
    window.test = test
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
        start(move, samePeriod)
    })
    periodInput.addEventListener('input', (e) => {
        //@ts-ignore
        const value = parseInt(e?.target?.value) || 0
        const newSamePeriod = (value < 2) ? 2 : value
        samePeriod = newSamePeriod
        start(move, newSamePeriod)
    })
}



