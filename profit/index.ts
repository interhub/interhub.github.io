import * as dat from 'dat.gui'
import moment from 'moment'
import Chartist from 'chartist'
import 'moment/locale/ru'

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
const mainDiv = document.querySelector('#info')

const updateDisplay = () => {
    localStorage.setItem('data', JSON.stringify(params))
    //calc values show
    const daysCount: number = moment().add(params.month.month, 'month').diff(moment(), 'days')
    const yearCount: number = daysCount / 365
    const weeksCount: number = Math.abs(daysCount / 7)
    let resultSum: number = params.startSum.startSum
    let points: string = ''
    const chartInfo: { week: number, value: number }[] = []
    for (let i = 0; i < weeksCount; i++) {
        resultSum = resultSum * (1 + (params.weekPercent.weekPercent / 100))
        points += `Неделя: ${i + 1}<br/>День: ${(i + 1) * 7}<br/>Сумма: ${resultSum.toFixed(2)}$<br/>Процент роста: ${getDiffPercent(params.startSum.startSum, resultSum).toFixed(2)}%<hr/>`
        chartInfo.push({value: resultSum, week: i})
    }
    const growTotalPercent = getDiffPercent(params.startSum.startSum, resultSum)
    const ordersPercents = [11.1, 22.2, 66.6]
    const ordersPrices = ordersPercents.map((p,i) => `${i+1}) ${(params.startSum.startSum * p / 100).toFixed(2)}$ ~ ${p}%`)
    const displayTitles = `
        Число месяцев: ${params.month.month}<br/>
        Сумма входа: ${params.startSum.startSum}$<br/>
        Процент роста в неделю: ${params.weekPercent.weekPercent}%<br/>
        <hr/>
        <br/><br/><br/><br/>
        Число лет: ${yearCount}<br/>
        Число недель: ${weeksCount}<br/>
        Число дней: ${daysCount}<br/>
        Стоимоти оредеров усреднения: <br/><br/>${ordersPrices.join('<br/>')}<br/><br/>
        Процент роста за все время: ${growTotalPercent}%<br/> 
        Итог сумма: ${resultSum.toFixed(2)}$<br/>
        <hr/>
        <br/><br/><br/><br/><br/>
        ${points}
        <hr/>
        
    `
    mainDiv.innerHTML = displayTitles
    new Chartist.Line('#chart', {
        // labels: map(chartInfo, 'week'),
        series: [
            // map(chartInfo, 'value'),
            {
                name: 'series-1',
                data: chartInfo.map(({value, week}) => ({
                    x: moment().add(week, 'week').toDate(),
                    y: value
                }))
            },
        ],
    }, {
        lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0.2
        }),
        height: innerHeight / 3,
        axisY: {
            onlyInteger: true,
            labelInterpolationFnc: (value) => {
                return value + '$'
            }
        },
        axisX: {
            type: Chartist.FixedScaleAxis,
            divisor: 10,
            labelInterpolationFnc: function (value) {
                return moment(value).format('MMM D')
            }
        },
        chartPadding: {
            left: resultSum.toFixed().length * 4
        },
    })
}
updateDisplay()
const addObjectToGui = (obj: any, min: number = 0, max: number = 100, step: number = 1, name: string) => {
    const keyName = Object.keys(obj)[0]
    const folder = gui.addFolder(name)
    folder.open()
    folder.add(obj, keyName, min, max, step).onChange(() => updateDisplay())
}
//add handlers gui
addObjectToGui(params.month, 0, 60, 1, 'Число месяцев') //10 years
addObjectToGui(params.startSum, 500, 200000, 1, 'Стартовая сумма') //half of million dollars
addObjectToGui(params.weekPercent, 0.1, 20, 0.1, 'Процент роста в неделю') //half of million dollars

