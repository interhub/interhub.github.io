export type HistoryItem = {
    TICKER: string
    PER: string
    DATE: string //DD.MM.YY
    TIME: number //HH.MM.SS
    OPEN: number
    HIGH: number
    LOW: number
    CLOSE: number
    VOL: number
    CHANGE_PERCENT_REAL: number
    TOP_SHADOW_PERCENT: number
    LOW_SHADOW_PERCENT: number
}

export type PredictType = { diffSumKoef: number, dates: string, nextChangePercent: number, nextDayChanges: number[] }

