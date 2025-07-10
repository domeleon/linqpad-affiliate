import { SummaryCard } from './summaryCard.js'
import { SalesTable } from '../tables/sales.js'
import { formatters, tooltipFormatters, type ChartConfig } from '../chart/chart.js'
import type { ChartResult } from '../chart/chartTypes.js'

export class CountryCard extends SummaryCard {
  constructor(private salesTable: SalesTable) {
    super()
  }

  render() {
    return this.createCardStructure(
      'Revenue by Country',
      `${this.salesTable.getTotalCountries()} Total`
    )
  }

  getChartData(): ChartResult {
    return this.salesTable.generateRevenueByCountryData()
  }

  getChartConfig(): ChartConfig {
    return {
      yAxisFormatter: formatters.currency,
      tooltipFormatter: tooltipFormatters.singleValue(formatters.currency)
    }
  }
} 