import { Table, ColumnDef } from './table.js'
import type { Impression } from '../types.js'
import { type ChartResult } from '../chart/chartTypes.js'

export class ImpressionsTable extends Table<Impression> {
  readonly routeSegment = 'impressions'

  protected columns(): ColumnDef<Impression>[] {
    return [
      { header: 'Date', cell: r => r.Date },
      { header: 'Country', cell: r => r.Country },
      { header: 'Impressions', cell: r => r.Impressions }
    ]
  }

  getSummaryValue(): string {
    const total = this.items.reduce((sum, item) => sum + item.Impressions, 0)
    return total.toLocaleString()
  }

  getSummaryLabel(): string {
    return 'Total Impressions'
  }

  generateChartData(): ChartResult {
    return this.generateTimeSeriesChartData(
      (impression) => ({
        date: impression.Date,
        value: impression.Impressions
      }),
      (impressions) => impressions.reduce((sum, imp) => sum + imp, 0)
    )
  }
} 