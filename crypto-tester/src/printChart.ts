import {PredictType} from './types'
import {filter, head, map, sortBy, sum} from 'lodash'
import {isBrowser} from 'browser-or-node'
import {createRef as gCreateRef, Grid, h} from 'gridjs'
import {TColumn} from 'gridjs/dist/src/types'
import Chartist from 'chartist'
import moment from 'moment'

const getChangeCol = (index: number = 0): TColumn => ({
    name: `Изменение цены +${index + 1} день (%)`,
    formatter: (cell) => {
        const isUp = cell > 0
        const isStop = cell == 0
        return h('b', {
            style: {
                'color': isStop ? 'yellow' : (isUp ? 'green' : 'red')
            }
        }, (isUp ? '+' : '') + cell + ' %')
    }
})

const getChartChangeCol = (title: string = ''): TColumn => {
    const MIN_HEIGHT = 60
    const MIN_WIDTH = 100
    return ({
        name: title,
        width: MIN_WIDTH + 'px',
        formatter: (cell) => {
            const opts: Chartist.ILineChartOptions = {
                height: MIN_HEIGHT + 'px',
                chartPadding: {right: 10, bottom: -28, left: 10, top: 10},
                showPoint: true,
                // lineSmooth: Chartist.Interpolation.cardinal({
                //     tension: 0.2,
                // }),
                axisY: {
                    onlyInteger: true,
                    divisor: 5,
                    labelInterpolationFnc: (value) => {
                        return value + '$'
                    }
                },
                axisX: {
                    // type: Chartist.FixedScaleAxis,
                    divisor: 5,
                    showGrid: true,
                    // labelInterpolationFnc: function (value) {
                    //     return moment(value).format('D/MMM/YYYY').replace(/\//g, '\n')
                    // }
                },
            }
            const ref = gCreateRef()
            const chart = h('div', {
                ref,
                style: {minWidth: 200, minHeight: MIN_HEIGHT + 10}
            })
            setTimeout(() => {
                ref.current && new Chartist.Line(ref.current, {
                    //@ts-ignore
                    series: [cell],
                    // series: [
                    //     {
                    //         name: 'series-1',
                    //         //@ts-ignore
                    //         data: cell?.map(({x = 0, y = 0}) => ({
                    //             x: moment().add(x, 'week').toDate(),
                    //             y: y
                    //         }))
                    //     },
                    // ],
                }, opts,)
            }, 0)
            return chart
        }
    })
}

const printChart = (predicts: PredictType[]) => {
    const sortedPredicts = sortBy([...predicts], (p) => p.diffSumKoef)
    const percents = sortedPredicts.map(({
                                             nextChangePercent,
                                             nextDayValues,
                                             prevDayValues,
                                             periodDayValues,
                                             diffSumKoef,
                                             dates
                                         }, index) => ([index + 1, diffSumKoef, dates, nextChangePercent, prevDayValues, periodDayValues, nextDayValues]))
    if (isBrowser) {
        const mainDiv = document.querySelector('div')
        mainDiv.innerHTML = ''
        mainDiv.innerText = ''
        const samePeriod = head(predicts)?.periodDayValues?.length
        const grid = new Grid({
            columns: ['№', 'Коэффициент разницы периодов', 'Схожий период изменения цены (даты)', getChangeCol(0), getChartChangeCol(`⬅️ Пред. ${samePeriod} дней тренд`), getChartChangeCol(`✅ Изменение ${samePeriod} дней за период`), getChartChangeCol(`➡️ Сдед. ${samePeriod} дней тренд`)],
            data: percents,
            style: {
                td: {
                    'border': '1px solid #ccc',
                    'background-color': '#1d1d1d',
                    'color': '#cccccc'
                },
                th: {
                    'border': '1px solid #ccc',
                    'background-color': '#1d1d1d',
                },
                table: {
                    'font-size': '15px',
                },
            },
            sort: true
        }).render(mainDiv)
        grid.updateConfig({data: percents}).forceRender()
    }
}

export default printChart
