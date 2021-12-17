import moment from 'moment'
import {last, sortBy} from 'lodash'
import {historyPromise, patternsExists} from './getPredicts'
import {POSITIVES_PARAMS, start} from '../index'
import {TOP} from './config'

export const initDom = async ({samePeriod, moveDays, lastTargetPeriod}) => {
    const lastPrice = last(await historyPromise).CLOSE
    const lastTime = last(await historyPromise).TIME

    const title = document.querySelector('#title')
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
    const samePatterns = sortBy(patternsExists, 'diffKoef').map(({
                                                                     pattern: {dates},
                                                                     diffKoef,
                                                                     isIncludeToTop
                                                                 }, i) => `${i + 1}) ${dates}. С коеффициентом разницы = ${diffKoef}. ${isIncludeToTop ? `❤️ Входит в топ ${TOP}` : ''}`)
    const patternsLink = 'https://docs.google.com/spreadsheets/d/1fve-2mCMg6XHWNUyg0wIwBxywzm3-pAJ4XhhoBm0JA4/edit?usp=sharing'
    displayPeriod.innerHTML = `период = ${samePeriod} дней <br/>
${!!patternsExists.length ? `✅ ✅ ✅ Схожие положительные паттерны с текущим периодом -  <br/>${samePatterns.join('<br/> ')} <br/><a target="_blank" rel="noopener noreferrer" style="color: #454545; font-size: 12px" href="${patternsLink}">Список паттернов</a>` : ``}
`
}

const test = async () => {
    console.log('Loading ⏳')
    const MAX_PERIOD = 20
    const MAX_DAYS_MOVE = 730
    for (let mo = 0; mo < MAX_DAYS_MOVE; mo++) {
        for (let per = 2; per < MAX_PERIOD; per++) {
            await start(mo, per)
        }
    }
    console.log({POSITIVES_PARAMS}, POSITIVES_PARAMS.length, 'DONE ✅')
}
global.test = test

export const addHandlersDom = (samePeriod: number, move: number) => {


    const addPeriod = document.querySelector('#addPeriod')
    const subPeriod = document.querySelector('#subPeriod')

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
}
