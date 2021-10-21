//MARKET VALUES
let MAX_DELTA_MARKET_PERCENT = 3
const IS_NODE = typeof window === 'undefined'

const fixNumber = (num = 0, point = 6) => parseFloat(num.toFixed(point))


const getPercentDiff = (from = 0, to = 0) => {
    return fixNumber((((Math.abs(from - to) / from)) * 100))
}

const addPercent = (value = 0, percent = 0) => {
    return Math.abs(fixNumber(value * (100 + percent) / 100))
}

const subPercent = (value = 0, percent = 0) => {
    return Math.abs(fixNumber(value * (100 - percent) / 100,))
}


/**
 * INPUT PARAMS
 */

class SettingItem {
    static items: any = []

    name: string
    placeholder: string
    value: number

    constructor(name, value, placeholder) {
        this.name = name
        const ramValue = parseFloat(localStorage.getItem(name)) || value
        this._value = ramValue
        this.placeholder = placeholder
        SettingItem.items.push(this)
    }

    set _value(val: number) {
        if (!IS_NODE)
            localStorage.setItem(this.name, String(val))
        this.value = val
    }

}

enum COLORS {
    ORANGE = '#cc8f2e',
    RED = '#fc5252',
    GREEN = '#2ecc40',
    GREEN_DARK = '#70af11',
    LIGHT = '#e3e3e3'
}


const START_MARKET_VALUE = new SettingItem('START_MARKET_VALUE', 185, 'цена валюты входа')
const ORDER_LEN = new SettingItem('ORDER_LEN', 10, 'макс число ордеров')
const STEP_DEFAULT_PERCENT = new SettingItem('STEP_DEFAULT_PERCENT', 1, 'шаг цены дефолтный')
const STEP_DIN = new SettingItem('STEP_DIN', 1.1, 'динамический шаг цены')
const START_MART = new SettingItem('START_MART', 1.2, 'мартенгейл')
const TAKE_PROFIT_PERCENT = new SettingItem('TAKE_PROFIT_PERCENT', 0.5, 'тейк профит процент')
const START_BUY = new SettingItem('START_BUY', 18, 'первый закуп')

const MAX_LOSE_PERCENT = new SettingItem('MAX_LOSE_PERCENT', 15, 'макс падение цены в процентах')
const MAX_BUY = new SettingItem('MAX_BUY', 606, 'максимум вложений')

let orderPoints: { marketValue: number, orderPrice: number, lastStep: number, sumStep: number, upToTp: number }[] = []

//минимальная цена валюты допустимая
let MIN_END_MARKET_VALUE = subPercent(START_MARKET_VALUE.value, MAX_LOSE_PERCENT.value)

const checkMarketValid = (price = 0) => {
    const min = subPercent(MIN_END_MARKET_VALUE, MAX_DELTA_MARKET_PERCENT)
    const max = addPercent(MIN_END_MARKET_VALUE, MAX_DELTA_MARKET_PERCENT)
    return price > min && price < max
}

const generateChart = () => {
    if (IS_NODE) return //IF not DOM then break
    const chartBox = document.querySelector('#chart')
    chartBox.innerHTML = ''
    const sumBuy = START_BUY.value + orderPoints.map(({orderPrice}) => {
        return orderPrice
    }).reduce((a, b) => a + b, 0)
    //create first lines info
    chartBox.innerHTML += `
<p style="margin: 0; color: ${COLORS.GREEN_DARK}">
Начало сделки покупка ${START_BUY.value} USDT<br> рынок ${START_MARKET_VALUE.value} USDT
<br> мин цена рынка ${MIN_END_MARKET_VALUE} USDT = падение на ${MAX_LOSE_PERCENT.value} % </p>
`
    chartBox.innerHTML += `<p style="margin: 0; color: ${sumBuy > MAX_BUY.value ? COLORS.RED : COLORS.GREEN_DARK}">Сум вложения ${sumBuy} USDT</p>`
    orderPoints.forEach((point, index) => {
        const MIN_H = 40
        const SIZE_KOEF = 30
        const H_PIXELS = MIN_H + point.lastStep * SIZE_KOEF
        const MAX_SAME_KOEF = H_PIXELS / Math.max(point.upToTp, point.sumStep)
        //create line item
        chartBox.innerHTML += `
<div style="height: ${H_PIXELS}px; width: 100%; background-color: #313131; margin-top: 2px; display: flex; overflow: scroll; flex-direction: row;" >
<p style="padding-right: 5px; color: #929292; flex: 0.3">№${index + 1}. </p>
<p style="color: ${COLORS.LIGHT}; flex: 1">${point.marketValue} цена рынка (USDT)</p> 
<p style="color: ${COLORS.LIGHT}; flex: 1">${point.orderPrice} цена ордера (USDT)</p>
<p style="color: ${COLORS.ORANGE}; flex: 1">${point.lastStep} (%) шаг цены</p> 
<p style="color: ${COLORS.RED}; flex: 1">${point.sumStep} (%) сум падение цены</p> 
<p style="color: ${COLORS.GREEN}; flex: 1" >${point.upToTp} (%) процент треб. роста до TP</p> 
<p style="color: ${COLORS.GREEN_DARK}; flex: 1" >Цена рынка TP ${addPercent(point.marketValue, point.upToTp)} USDT</p> 
<div style="flex: 1; flex-direction: row; display:flex; align-items: flex-end; justify-content: center">
    <div style="width: 20px; height: ${point.lastStep * MAX_SAME_KOEF}px; background-color: ${COLORS.ORANGE}"></div>
    <div style="width: 20px; height: ${point.upToTp * MAX_SAME_KOEF}px; background-color: ${COLORS.GREEN}"></div>
    <div style="width: 20px; height: ${point.sumStep * MAX_SAME_KOEF}px; background-color: ${COLORS.RED}"></div>
</div>
</div>`
    })
}

const generateDom = () => {
    if (IS_NODE) return //IF not DOM then break
    const container = document.querySelector('#inputs')

    SettingItem.items.forEach(({name, placeholder, value}) => {
        container.innerHTML += `
<p>
<input type="number" placeholder="${placeholder}" value="${value}" id="${name}" />
<label> ${placeholder}</label></p>
`
        let onChange = (val) => {
            SettingItem.items.find(({name: n}) => n === name).value = val
            logCalc()
            generateChart()
        }
        document.addEventListener('input', function (e) {

            //@ts-ignore
            if (e.target && e.target.id == name && e.target.value) {
                //@ts-ignore
                const value = Number.parseFloat(e.target.value) || 0
                localStorage.setItem(name, String(value))
                onChange(value)
            }
        })
        container.innerHTML += `<hr/>`
    })
}

const logCalc = () => {
    orderPoints = []
    console.log('START OF', new Date().toLocaleString())
    let TP_KOEF = addPercent(1, TAKE_PROFIT_PERCENT.value)
    //цена предыдущего ордера
    let LAST_ORDER_VALUE = START_BUY.value
    //сумма вложений текущая
    let SUM_OF_BUY = START_BUY.value
    //стоимотсть денег после предыдущего падения
    let LAST_MONEY_AFTER_DOWN_SUM = START_BUY.value
    //текущая цена рынка
    let MARKET_VALUE = START_MARKET_VALUE.value

    let LAST_STEP_PERCENT = STEP_DEFAULT_PERCENT.value
    let STEP_DELTA_SUM = STEP_DEFAULT_PERCENT.value


    //first buy
    console.log('start buy = ', LAST_ORDER_VALUE, 'MARKET PRICE', MARKET_VALUE)
    console.log('MARKET 1st sell price', addPercent(MARKET_VALUE, TAKE_PROFIT_PERCENT.value))
    console.log('START TP = ', LAST_ORDER_VALUE * TP_KOEF + '\n___')

    console.log('\nПараметры для бота')
    console.table({
        ['Мартенгейл']: START_MART.value,
        ['Динамический шаг СО']: STEP_DIN.value,
        ['Шаг СО(%)']: STEP_DEFAULT_PERCENT.value,
        ['Take profit (%)']: TAKE_PROFIT_PERCENT.value,
        ['Макс. Число ордеров']: ORDER_LEN.value,
        ['Макс сумм депозит($)']: MAX_BUY.value,
        ['Нач цена рынка (вход)']: START_MARKET_VALUE.value,
        ['Мин цена рынка (ласт ордер)']: MIN_END_MARKET_VALUE,
    })


    for (let i = 0; i < ORDER_LEN.value; i++) {
        //текущ цена рынка валюты
        MARKET_VALUE = subPercent(MARKET_VALUE, LAST_STEP_PERCENT)

        //реальная стоимость денег после падения на этом уровне
        const MONEY_AFTER_DOWN = subPercent(LAST_MONEY_AFTER_DOWN_SUM, LAST_STEP_PERCENT)

        //покупка нового ордера
        const ORDER_VALUE = fixNumber(LAST_ORDER_VALUE * START_MART.value)
        SUM_OF_BUY += ORDER_VALUE
        LAST_ORDER_VALUE = ORDER_VALUE

        //Реальная сум стоимость денег после падения в сумме с новым ордером
        const SUM_REAL_CURRENT_MONEY = MONEY_AFTER_DOWN + ORDER_VALUE
        //сохраняем значение стоимости денег. чтобы использовать его в слд цикле
        LAST_MONEY_AFTER_DOWN_SUM = SUM_REAL_CURRENT_MONEY

        //(потеря денег при продаже на текущ. уровне) расчитаем разницу в стоимости денег суммарной и вложенных деньгах
        const DELTA_RESET_MONEY = SUM_OF_BUY - SUM_REAL_CURRENT_MONEY
        //(процент роста треб-ый для откупа) разница в процентах от стоимости денег и вложенными деньгами
        const DELTA_RESET_PERCENT = getPercentDiff(SUM_REAL_CURRENT_MONEY, SUM_OF_BUY)
        //процент треб-го роста от цены ордера до тейка
        const FULL_TP_PERCENT_FROM_ORDER = getPercentDiff(SUM_REAL_CURRENT_MONEY, addPercent(SUM_OF_BUY, TAKE_PROFIT_PERCENT.value))
        //цена раныка валюты для откупа
        const RESET_MONEY_VALUE = addPercent(MARKET_VALUE, DELTA_RESET_PERCENT)
        //цена рынка валюты для получения тейк профита
        const TP_MARKET_PRICE = addPercent(MARKET_VALUE, FULL_TP_PERCENT_FROM_ORDER)
        //реальная цена денег при возрастании от уровня ордера до тейк профита
        const TP_SELL_SUM_VALUE = addPercent(SUM_OF_BUY, TAKE_PROFIT_PERCENT.value)
        //доход от продажи тейк профита
        const SALARY_FROM_SELL_TP = TP_SELL_SUM_VALUE - SUM_OF_BUY

        //buy order (price down)
        const IS_VALID_SUM = SUM_OF_BUY <= MAX_BUY.value
        const IS_VALID_MARKET_PRICE = checkMarketValid(MARKET_VALUE)
        const MARKET_DELTA_RESULT = getPercentDiff(MIN_END_MARKET_VALUE, MARKET_VALUE)


        console.table({
            ['🌧 куплен СО (USD)']: ORDER_VALUE,
            ['🚷 Потери при продаже на этом уровне (usd)']: DELTA_RESET_MONEY,
            ['🚶 последний шаг падения цены СО (%)']: LAST_STEP_PERCENT,
            ['📉 сумарное падение цены (%)']: getPercentDiff(START_MARKET_VALUE.value, MARKET_VALUE),
            ['🌧 следующий ордер СО может быть на уровне']: subPercent(MARKET_VALUE, LAST_STEP_PERCENT * STEP_DIN.value),
            [(IS_VALID_MARKET_PRICE ? '✅' : '⛔️') + ' текушая цена валюты (крипты)']: MARKET_VALUE,
            ['📈 ✅ цена валюты Take Profit (крипты)']: TP_MARKET_PRICE,
            ['отклонение цены от мин допустимой']: `${MARKET_DELTA_RESULT}% from max ${MAX_DELTA_MARKET_PERCENT}%`,
            ['👇 стоимость денег после падения']: SUM_REAL_CURRENT_MONEY,
            [(IS_VALID_SUM ? '👍' : '⛔️') + ' суммарные текущие вложения']: SUM_OF_BUY,
            ['💸 сумма денег для продажи Take Profit']: TP_SELL_SUM_VALUE,
            ['Цена валюты для откупа всех вложенных денег (крипты)']: RESET_MONEY_VALUE,
            ['⬆️ Процент треб. роста для продажи TP']: `${FULL_TP_PERCENT_FROM_ORDER} %`,
            ['🦺 Процент падения от уровня закупа до продажи TP (страховка)']: getPercentDiff(START_MARKET_VALUE.value, TP_MARKET_PRICE),
            ['✅ Доход от продажи Take Profit (USD)']: SALARY_FROM_SELL_TP,
        })

        orderPoints.push({
            orderPrice: ORDER_VALUE,
            marketValue: MARKET_VALUE,
            lastStep: LAST_STEP_PERCENT,
            sumStep: STEP_DELTA_SUM,
            upToTp: FULL_TP_PERCENT_FROM_ORDER
        })

        console.log(` Страховочный ордер ${i + 1} \n`)

        //перед началом след цикла (в конце предыдущего)
        STEP_DELTA_SUM = fixNumber(STEP_DELTA_SUM + LAST_STEP_PERCENT)
        LAST_STEP_PERCENT = fixNumber(LAST_STEP_PERCENT * STEP_DIN.value)
    }

}

generateDom()

logCalc()

generateChart()

