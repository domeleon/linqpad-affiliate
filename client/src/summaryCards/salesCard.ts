import { SummaryCard } from './summaryCard.js'
import { Table } from '../tables/table.js'
import { formatters, tooltipFormatters, type ChartConfig } from '../chart/chart.js'
import type { ChartResult } from '../chart/chartTypes.js'

export class SalesCard extends SummaryCard {
  constructor(private table: Table<any>) {
    super()
  }

  render() {
    return this.createCardStructure(
      this.table.getSummaryLabel(),
      this.table.getSummaryValue()
    )
  }

  getChartData(): ChartResult {
    return this.table.generateChartData()
  }

  getChartConfig(): ChartConfig {
    return {
      yAxisFormatter: formatters.number,
      tooltipFormatter: tooltipFormatters.axisValue(formatters.number, 'sales')
    }
  }
} 