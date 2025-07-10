import { Component, Router, type IRouted, div, table, thead, tbody, tr, th, td } from 'domeleon'
import { themeMgr, appStyles } from '../theme.js'
import { getTimeScaleKey, parseTimeKey, determineTimeScale, type TimeScale, type ChartResult } from '../chart/chartTypes.js'
import { config } from '../config.js'

export type ColumnDef<T> = { header: string; cell: (row: T) => any }

export abstract class Table<T extends { Date: string }> extends Component implements IRouted {
  abstract readonly routeSegment: string
  router: Router = new Router(this)
  items: T[] = []
  loaded = false

  protected abstract columns(): ColumnDef<T>[]

  load(items: T[]) {
    // Sort items by date in descending order (most recent first)
    this.items = items.slice().sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
    this.loaded = true
  }

  view() {
    if (!this.loaded) return div({ class: styles.loading }, config.text.noDataMessage)

    return div({ class: styles.tableContainer },
      table({ class: styles.table },
        thead(
          tr(this.columns().map(c => th({ class: styles.tableHeaderCell }, c.header)))
        ),
        tbody(
          this.items.map(r =>
            tr({ class: styles.tableRow }, this.columns().map(c => td({ class: styles.tableCell }, c.cell(r))))
          )
        )
      )
    )
  }

  // Chart-related methods (moved from ChartableTable)
  abstract getSummaryValue(): string
  abstract getSummaryLabel(): string
  abstract generateChartData(): ChartResult
  
  // Shared chart data generation helper
  protected generateTimeSeriesChartData(
    dataExtractor: (item: T) => { date: string; value: any },
    aggregator: (values: any[]) => number
  ): ChartResult {
    if (this.items.length === 0) {
      return { data: { xAxis: [], series: [] }, timeScale: 'day' }
    }

    // Group data by date
    const dataByDate = new Map<string, any[]>()
    for (const item of this.items) {
      const { date, value } = dataExtractor(item)
      if (!dataByDate.has(date)) {
        dataByDate.set(date, [])
      }
      dataByDate.get(date)!.push(value)
    }

    const sortedDates = Array.from(dataByDate.keys()).sort()
    const startDate = new Date(sortedDates[0])
    const endDate = new Date(sortedDates[sortedDates.length - 1])
    const timeScale = determineTimeScale(startDate, endDate)

    // Group data by time scale
    const grouped = this.groupDataByTimeScale(
      timeScale,
      new Map(Array.from(dataByDate.entries()).map(([date, values]) => 
        [date, aggregator(values)]
      )),
      (items: number[]) => items.reduce((sum, item) => sum + item, 0)
    )

    const periods = this.sortTimeKeys(Array.from(grouped.keys()), timeScale)
    const series = periods.map(period => grouped.get(period) || 0)

    return {
      data: { xAxis: periods, series },
      timeScale
    }
  }
  
  protected groupDataByTimeScale<K>(
    timeScale: TimeScale,
    dataMap: Map<string, K>,
    aggregator: (items: K[]) => any
  ): Map<string, any> {
    const grouped = new Map<string, K[]>()
    
    // Group items by time scale key
    for (const [dateStr, item] of dataMap.entries()) {
      const key = getTimeScaleKey(new Date(dateStr), timeScale)
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)!.push(item)
    }
    
    // Aggregate each group
    const result = new Map<string, any>()
    for (const [key, items] of grouped.entries()) {
      result.set(key, aggregator(items))
    }
    
    return result
  }
  
  protected sortTimeKeys(keys: string[], timeScale: TimeScale): string[] {
    return keys.sort((a, b) => {
      return parseTimeKey(a, timeScale).getTime() - parseTimeKey(b, timeScale).getTime()
    })
  }
}

const styles = themeMgr.styles('table', theme => {
  const { borderNeutral, bgSecondary, textPrimary, accentBase } = theme.colors
  return {
    tableContainer: `overflow-x-auto rounded bg-${bgSecondary}`,
    table: `w-full border-collapse border border-${borderNeutral} bg-${bgSecondary}`,
    tableHeader: `bg-${bgSecondary} font-semibold text-${textPrimary}`,
    tableHeaderCell: `p-3 text-left border-0 border-b-2 border-solid border-${accentBase}/30 text-sm font-bold`,
    tableRow: `bg-${bgSecondary} hover:bg-${bgSecondary}/80 ${appStyles.hoverTransition}`,    
    tableCell: `p-2 border border-${borderNeutral} text-${textPrimary}`,
    loading: 'p-4 text-center'    
  }
}) 