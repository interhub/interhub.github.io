import {PredictType} from './types'
import {sortBy} from 'lodash'
import {isBrowser} from 'browser-or-node'
import {Grid, h} from 'gridjs'
import {TColumn} from 'gridjs/dist/src/types'

const changeCol: TColumn = {
    name: 'Изменение цены историческое (%)',
    formatter: (cell) => {
        return h('b', {
            style: {
                'color': cell > 0 ? 'green' : 'red'
            }
        }, cell)
    }
}

const printChart = (predicts: PredictType[]) => {
    const sortedPredicts = sortBy([...predicts], (p) => p.diffSumKoef)
    const percents = sortedPredicts.map(({
                                             nextChangePercent,
                                             diffSumKoef,
                                             dates
                                         }, index) => ([index + 1, nextChangePercent, diffSumKoef, dates]))
    if (isBrowser) {
        const mainDiv = document.querySelector('div')
        mainDiv.innerHTML = ''
        mainDiv.innerText = ''
        const grid = new Grid({
            columns: ['№', changeCol, 'Коэффициент разницы периодов', 'Схожий период изменения цены (даты)'],
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


