import axios from 'axios'
import moment from 'moment'
import {HistoryItem} from './types'
import {getDiffPercent} from './utils'

const getHistoryAsync = async (): Promise<HistoryItem[]> => {
    const url = 'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2000&toTs=-1&api_key=YOURKEYHERE'
    const {data: dataServer} = await axios.get(url)
    const arr = dataServer?.Data?.Data || []
    return arr.map(({time, high, low, open, close}): HistoryItem => {
        return {
            TICKER: '',
            DATE: moment(time * 1000).format('DD/MM/YY'),
            LOW: low,
            HIGH: high,
            OPEN: open,
            CLOSE: close,
            PER: '',
            VOL: 0,
            TIME: time,
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
