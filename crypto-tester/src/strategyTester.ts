import {historyPromise} from './getPredicts'
import {fillPattensCheck, patternsAllTimeExists} from './fillPattensCheck'
import moment from 'moment'
import fs from 'fs/promises'
import patterns_groups from '../patterns_groups.json'
import {TEST_PERIOD_MOVE} from './config'
import {first, last, mean, takeRight} from 'lodash'
import {addPercent, getDiffPercent, subPercent} from './utils'

/**
 * create test patterns_groups array file json for testing next
 */
const updateTesterPatternsPeriods = async (findPeriod: number) => {
    type PattenGroupType = { group: any[], toDate: number, isAllPositive: boolean }
    const findedPatternsGroups: PattenGroupType[] = []
    console.log('loading start ⏳')

    for (let i = 0; i < findPeriod; i++) {
        await fillPattensCheck(i, 7)
        const toDate = moment().subtract(i, 'days').valueOf()
        if (!patternsAllTimeExists.length) continue
        const isAllPositive = patternsAllTimeExists.every(({isPositive}) => isPositive)
        const newItem = {group: patternsAllTimeExists, toDate, isAllPositive}
        const file = await fs.readFile('../patterns_groups.json', 'utf8')
        const obj = JSON.parse(file)
        obj.push(newItem)
        findedPatternsGroups.push(newItem)
        await fs.writeFile('../patterns_groups.json', JSON.stringify(obj, null, ' '))
        console.log('write item', i)
    }

    console.log('finish loading ✅')
    console.log(findedPatternsGroups)
}


/**
 * @param startActiveMoveDays - move days ago to make first order
 * @param safePercent - min safe last order for every deal
 */
export const strategyTester = async (startActiveMoveDays: number, safePercent: number, deposit: number) => {
    const findPatternByDate = (dateTo: number): boolean => {
        const pattern = patterns_groups.find((item) => moment(item.toDate).isSame(dateTo, 'date'))
        return !!pattern && pattern?.isAllPositive
    }
    const isCanStartDeal = (dateTo: number): boolean => {
        return !!findPatternByDate(dateTo)
    }
    const history = await historyPromise
    if (history.length < startActiveMoveDays) return console.log('Error move days is grate than history max allow!')
    const historyIncludedPeriod = history.slice(-(startActiveMoveDays))
    const TP_PRECENT = 8
    //was start some deal or wait new next deal (isStartedDeal)

    //orders for buy (reacted and not)
    let FIRST_BUY_PRICE = 0
    let isBoyFirstOrder = false

    let SECOND_BUY_PRICE = 0
    let isBoySecondOrder = false

    let THIRD_BUY_PRICE = 0
    let isBoyThirdOrder = false

    let LAST_BUY_PRICE = 0
    let LAST_SEL_PRICE_ORDER = 0

    let TAKE_PROFIT_PERCENT_RESULT = 0
    const secondLowPercent = safePercent * 0.42
    const thirdLowPercent = safePercent

    for (let i = 0; i < historyIncludedPeriod.length; i++) {
        const dayItem = historyIncludedPeriod[i]
        const isShouldStartNewDeal = isCanStartDeal(dayItem.TIME) && !isBoyFirstOrder

        //orders values for current day if need
        const firstOrderPrice = mean([dayItem.OPEN, dayItem.CLOSE])
        const secondOrderPrice = subPercent(firstOrderPrice, secondLowPercent) //42 is 5% move to place of first order from the center between 1-t and 3-th orders (-15% and -20% = -35% total)
        const thirdOrderPrice = subPercent(firstOrderPrice, thirdLowPercent)

        //start new deal!
        if (isShouldStartNewDeal) {
            FIRST_BUY_PRICE = firstOrderPrice
            SECOND_BUY_PRICE = secondOrderPrice
            THIRD_BUY_PRICE = thirdOrderPrice
            //dynamic values
            LAST_BUY_PRICE = firstOrderPrice
            LAST_SEL_PRICE_ORDER = addPercent(firstOrderPrice, TP_PRECENT)
            isBoyFirstOrder = true //block new deals again
            console.log('start deal at day=', i)
            continue //past deal
        } else {
            //new next day prev day deal
            const maxCurrentDayPrice = dayItem.HIGH
            const minCurrentDayPrice = dayItem.LOW
            //if first order sell did work
            if (maxCurrentDayPrice > LAST_SEL_PRICE_ORDER) {
                TAKE_PROFIT_PERCENT_RESULT += TP_PRECENT
                isBoyFirstOrder = false
                continue
            }
            //if work second order buy did work
            if (minCurrentDayPrice < SECOND_BUY_PRICE) {
                TAKE_PROFIT_PERCENT_RESULT -= getDiffPercent(LAST_BUY_PRICE, SECOND_BUY_PRICE)
                LAST_BUY_PRICE = SECOND_BUY_PRICE
                LAST_SEL_PRICE_ORDER = addPercent(SECOND_BUY_PRICE, TP_PRECENT)
                isBoySecondOrder = true
            }
            //if work third order buy did work
            if (minCurrentDayPrice < THIRD_BUY_PRICE) {
                TAKE_PROFIT_PERCENT_RESULT -= getDiffPercent(LAST_BUY_PRICE, THIRD_BUY_PRICE)
                LAST_BUY_PRICE = THIRD_BUY_PRICE
                LAST_SEL_PRICE_ORDER = addPercent(THIRD_BUY_PRICE, TP_PRECENT)
                isBoyThirdOrder = true
            }
        }
        // console.log({TAKE_PROFIT_PERCENT_RESULT}, 'day', i)
    }
    const resultDeposit = addPercent(deposit, TAKE_PROFIT_PERCENT_RESULT)
    console.log({resultDeposit, deposit, tp_percent: TAKE_PROFIT_PERCENT_RESULT})

}

// updateTesterPatternsPeriods(TEST_PERIOD_MOVE)
strategyTester(365, 35, 3600)
