import * as dat from 'dat.gui'
import moment from 'moment'

const gui = new dat.GUI({width: innerWidth / 2})
//params
const storageData = JSON.parse(localStorage.getItem('data'))
const params = storageData || {
    month: {month: 6},
    startSum: {startSum: 1000},
    weekPercent: {weekPercent: 3},
}

//tools
const getDiffPercent = (from: number, to: number) => {
    return ((to - from) / from) * 100
}
const mainDiv = document.querySelector('div')
const updateDisplay = () => {
    localStorage.setItem('data', JSON.stringify(params))
    //calc values show
    const daysCount: number = moment().add(params.month.month, 'month').diff(moment(), 'days')
    const yearCount: number = daysCount / 365
    const weeksCount: number = Math.abs(daysCount / 7)
    let resultSum: number = params.startSum.startSum
    for (let i = 0; i < weeksCount; i++) {
        resultSum = resultSum * (1 + (params.weekPercent.weekPercent / 100))
    }
    const growTotalPercent = getDiffPercent(params.startSum.startSum, resultSum)
    const displayTitles = `
        Число месяцев: ${params.month.month}<br/>
        Сумма входа: ${params.startSum.startSum}$<br/>
        Процент роста в неделю: ${params.weekPercent.weekPercent}%<br/>
        <hr/>
        Число лет: ${yearCount}<br/>
        Число недель: ${weeksCount}<br/>
        Число дней: ${daysCount}<br/>
        Процент роста за все время: ${growTotalPercent}%<br/>
        Итог сумма: ${resultSum}$<br/>

    `
    mainDiv.innerHTML = displayTitles
}
updateDisplay()
const addObjectToGui = (obj: any, min: number = 0, max: number = 100, step: number = 1) => {
    const keyName = Object.keys(obj)[0]
    gui.add(obj, keyName, min, max, step).onChange(() => updateDisplay())
}
//add handlers gui
addObjectToGui(params.month, 0, 60, 1) //10 years
addObjectToGui(params.startSum, 500, 500000, 500) //half of million dollars
addObjectToGui(params.weekPercent, 0.1, 10, 0.1) //half of million dollars

