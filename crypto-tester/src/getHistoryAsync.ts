import axios from 'axios'
import moment from 'moment'
import {HistoryItem} from './types'
import {getDiffPercent} from './utils'
import {last} from 'lodash'

const getHistoryAsync = async (): Promise<HistoryItem[]> => {
    const urlDays = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2000&toTs=-1`
    const urlHour = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=1&aggregate=1`

    const {data: dataDaysServer} = await axios.get(urlDays)
    const {data: dataHoursServer} = await axios.get(urlHour)
    const arrDays: any[] = dataDaysServer?.Data?.Data || []
    const arrHours: any[] = dataHoursServer?.Data?.Data || []
    if (arrDays?.length && arrHours?.length) {
        let lastDay = last(arrDays)
        const lastHour = last(arrHours)
        lastDay.high = lastHour.high
        lastDay.close = lastHour.close
        lastDay.time = lastHour.time
        arrDays.splice(-1, 1, lastDay)
    }
    return arrDays.map(({time, high, low, open, close}): HistoryItem => {
        return {
            TICKER: 'BTC',
            DATE: moment(time * 1000).format('DD MMMM YYYY'),
            LOW: low,
            HIGH: high,
            OPEN: open,
            CLOSE: close,
            PER: '',
            VOL: 0,
            TIME: time * 1000,
            TOP_SHADOW_PERCENT: getDiffPercent(Math.max(open, close), high),
            LOW_SHADOW_PERCENT: getDiffPercent(low, Math.min(open, close)),
            CHANGE_PERCENT_REAL: getDiffPercent(open, close),
        }
    })

    // const data = JSON.parse(fs.readFileSync('./btc_history_2015_2021.json', 'utf8'))
    // const formatted = data.map((obj) => {
    //     const open = stringToNumber(obj.OPEN)
    //     const close = stringToNumber(obj.CLOSE)
    //     const low = stringToNumber(obj.LOW)
    //     const high = stringToNumber(obj.HIGH)
    //     return {
    //         ...obj,
    //         OPEN: open,
    //         CLOSE: close,
    //         HIGH: high,
    //         LOW: low,
    //         CHANGE_PERCENT_REAL: getDiffPercent(open, close),
    //         TOP_SHADOW_PERCENT: getDiffPercent(Math.max(open, close), high),
    //         LOW_SHADOW_PERCENT: getDiffPercent(low, Math.min(open, close)),
    //     }
    // })
    // return formatted
}
export default getHistoryAsync
