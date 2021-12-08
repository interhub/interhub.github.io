import moment from 'moment'
import {last} from 'lodash'
import {historyPromise} from './getPredicts'
import {POSITIVES_PARAMS} from '../index'

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
    displayPeriod.innerHTML = `период = ${samePeriod} дней`
}

export const addHandlersDom = (samePeriod: number, move: number, start: (move: number, samePeriod: number) => Promise<any>) => {
    const test = async () => {
        const MAX_PERIOD = 20
        const MAX_DAYS_MOVE = 365
        for (let mo = 0; mo < MAX_DAYS_MOVE; mo++) {
            for (let per = 2; per < MAX_PERIOD; per++) {
                await start(mo, per)
            }
        }
        console.log({POSITIVES_PARAMS}, POSITIVES_PARAMS.length)
    }

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
    periodInput.addEventListener('change', (e) => {
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
