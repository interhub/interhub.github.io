import * as dat from 'dat.gui'

const gui = new dat.GUI()
const month = {month: 6}

export const getDiffPercent = (from: number, to: number) => {
    return ((to - from) / from) * 100
}
const addObjectToGui = (obj: any, min: number = 0, max: number = 100) => {
    gui.add(obj, Object.keys(obj)[0], min, max, 1).onFinishChange((value) => {
        console.log(value)
    })
}

addObjectToGui(month, 0, 60) //10 years
