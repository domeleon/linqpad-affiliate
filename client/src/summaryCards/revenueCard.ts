import { SummaryCard } from './summaryCard.js'
import { SalesTable } from '../tables/sales.js'
import { formatters, tooltipFormatters, type ChartConfig } from '../chart/chart.js'
import type { ChartResult } from '../chart/chartTypes.js'

export class RevenueCard extends SummaryCard {
  constructor(private salesTable: SalesTable) {
    super()
  }

  render() {
    return this.createCardStructure(
      'Total Revenue',
      this.salesTable.getTotalRevenue()
    )
  }

  getChartData(): ChartResult {
    return this.salesTable.generateChartData()
  }

  getChartConfig(): ChartConfig {
    return {
      yAxisFormatter: formatters.currency,
      tooltipFormatter: tooltipFormatters.axisValue(formatters.currency)
    }
  }
} 