import moment from 'moment'
import {filter, inRange, last, sortBy, sum, sumBy} from 'lodash'
import {historyPromise, patternsAllTimeExists} from './getPredicts'
import {NEGATIVE_PARAMS, POSITIVES_PARAMS, start} from '../index'
import fs from 'fs'
import {isBrowser} from 'browser-or-node'
import {PredictType} from './types'
import {toFixed} from './utils'

export const initDom = async ({samePeriod, moveDays, lastTargetPeriod, predicts}) => {
    const lastPrice = last(await historyPromise).CLOSE
    const lastTime = last(await historyPromise).TIME

    const title = document.querySelector('#title')
    const koefs = document.querySelector('#koefs')
    const patterns = document.querySelector('#patterns')
    const info = document.querySelector('#info')
    const displayPeriod = document.querySelector('#displayPeriod')

    title.innerHTML = `Прогнозы для изменения цены на ${moment().add(1, 'day').subtract(moveDays, 'day').format('DD MMMM YYYY')}
<br/><br/>
Последняя известная цена BTC = ${lastPrice}. Обновлено ${moment(lastTime).format('DD MMMM YYYY HH:mm:ss')}, обновляется раз в час.
`
    info.innerHTML = `* Изменение цены историческое (%) - изменение цены на ${samePeriod + 1}-й день периода
<br/>
* Коэффициент разницы периодов - показатель различия периода (${lastTargetPeriod}) от периода из правого столбика. Чем меньше - тем больше совпадение. ( ноль - значит это и есть последний искомый период )
<br/>
* Схожий период изменения цены - период который имеет схожее колебание цены с периодом (${lastTargetPeriod})
        `
    const samePatternsList = sortBy(patternsAllTimeExists, ['isPositive', 'samePeriod', 'diffKoef',],).map(({
                                                                                                                dates,
                                                                                                                diffKoef,
                                                                                                                isPositive,
                                                                                                                samePeriod
                                                                                                            }, i) => `${i + 1}) ${dates}. С коеффициентом разницы = ${diffKoef}. ${isPositive ? `❤️❤️❤️ Положительный` : '⚠️⚠️⚠️ Отрицательный'}. Период ${samePeriod} дней`).reverse()
    const patternsLink = 'https://docs.google.com/spreadsheets/d/1fve-2mCMg6XHWNUyg0wIwBxywzm3-pAJ4XhhoBm0JA4/edit?usp=sharing'
    displayPeriod.innerHTML = `период = ${samePeriod} дней <br/>`
    patterns.innerHTML = `
${!!samePatternsList.length ? `🍀 Схожие по времени паттерны -  <br/>${samePatternsList.join('<br/> ')} <br/>` : `🍀 Паттернов не найдено<br/>`}
<a target="_blank" rel="noopener noreferrer" style="color: #454545; font-size: 12px" href="${patternsLink}">Список паттернов</a>
`
    const positiveSumKoef = toFixed(sumBy(filter(predicts as PredictType[], (p) => p.nextChangePercent > 0), 'diffSumKoef'))
    const negativeSumKoef = toFixed(sumBy(filter(predicts as PredictType[], (p) => p.nextChangePercent < 0), 'diffSumKoef'))
    const resultSumKoef = toFixed(positiveSumKoef / negativeSumKoef)
    const resultColorKoef = inRange(resultSumKoef, 0.95, 1.05) ? 'yellow' : resultSumKoef > 1 ? 'green' : 'red'
    koefs.innerHTML = `
<br/>
Соотношение вероятности рост/падение = (<span style="color: green">${positiveSumKoef}</span>/<span style="color: red">${negativeSumKoef}</span>) = <span style="color: ${resultColorKoef}; font-size: 22px">${resultSumKoef}</span>
    `
}

export const test = async () => {
    console.log('Loading ⏳')
    const MAX_PERIOD = 20
    const MAX_DAYS_MOVE = 730
    for (let mo = 0; mo < MAX_DAYS_MOVE; mo++) {
        for (let per = 2; per < MAX_PERIOD; per++) {
            await start(mo, per)
        }
    }
    console.log({POSITIVES_PARAMS}, {NEGATIVE_PARAMS}, 'DONE ✅')
    if (!isBrowser) {
        fs.writeFileSync('positive_patterns.json', JSON.stringify(POSITIVES_PARAMS, null, ' '))
        fs.writeFileSync('negative_patterns.json', JSON.stringify(NEGATIVE_PARAMS, null, ' '))
    }
}
global.test = test

export const addHandlersDom = (samePeriod: number, move: number) => {


    const addPeriod = document.querySelector('#addPeriod')
    const subPeriod = document.querySelector('#subPeriod')
    const datePeriod = document.querySelector('#date-input')

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
        setMoveToCalendar(move)
    })
    //@ts-ignore
    backBtn.addEventListener('click', () => {
        move++
        start(move, samePeriod)
        setMoveToCalendar(move)
    })
    //@ts-ignore
    periodInput.value = samePeriod
    periodInput.addEventListener('input', (e) => {
        //@ts-ignore
        const value = parseInt(e?.target?.value) || 0
        const newSamePeriod = (value < 2) ? 2 : value
        samePeriod = newSamePeriod
        start(move, newSamePeriod)
    })

    addPeriod.addEventListener('click', () => {
        samePeriod++
        //@ts-ignore
        periodInput.value = samePeriod
        start(move, samePeriod)
    })
    subPeriod.addEventListener('click', () => {
        if ((samePeriod - 1) < 2) return
        samePeriod--
        //@ts-ignore
        periodInput.value = samePeriod
        start(move, samePeriod)
    })
    const setMoveToCalendar = (newMove: number) => {
        //@ts-ignore
        datePeriod.value = moment().subtract(newMove, 'days').add(1, 'days').format('YYYY-MM-DD')
    }
    setMoveToCalendar(move)
    datePeriod.addEventListener('blur', (e) => {
        //@ts-ignore
        const value = e.target?.valueAsNumber
        const newMove = moment().diff(moment(value), 'days') + 1
        if (newMove >= 0) {
            move = newMove
            start(move, samePeriod)
        }
    })
}
