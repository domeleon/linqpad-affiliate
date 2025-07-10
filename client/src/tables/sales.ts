import { Table, ColumnDef } from './table.js'
import type { Sale } from '../types.js'
import { type ChartResult } from '../chart/chartTypes.js'
import { money } from '../util.js'

export class SalesTable extends Table<Sale> {
  readonly routeSegment = 'sales'

  protected columns(): ColumnDef<Sale>[] {
    return [
      { header: 'Date', cell: r => r.Date },
      { header: 'Country', cell: r => r.Country },
      { header: 'Product', cell: r => r.Product },
      { header: 'Sale Value', cell: r => money.format(r.SaleValue) },
      { header: 'Commission', cell: r => money.format(r.Commission) },
      { header: 'Payment #', cell: r => r.PaymentNumber ?? '-' }
    ]
  }

  getSummaryValue(): string {
    return this.items.length.toString()
  }

  getSummaryLabel(): string {
    return 'Total Sales'
  }

  getTotalRevenue(): string {
    const total = this.items.reduce((sum, item) => sum + item.Commission, 0)
    return money.format(total)
  }

  getTotalCountries(): number {
    const countries = new Set(this.items.map(s => s.Country))
    return countries.size
  }

  generateChartData(): ChartResult {
    return this.generateTimeSeriesChartData(
      (sale) => ({
        date: sale.Date,
        value: sale.Commission
      }),
      (commissions) => commissions.reduce((sum, commission) => sum + commission, 0)
    )
  }

  generateSalesCountData(): ChartResult {
    return this.generateTimeSeriesChartData(
      (sale) => ({
        date: sale.Date,
        value: 1 // Count each sale as 1
      }),
      (counts) => counts.reduce((sum, count) => sum + count, 0)
    )
  }

  generateRevenueByCountryData(): ChartResult {
    const revenueByCountry = new Map<string, number>()
    for (const sale of this.items) {
      const country = sale.Country
      revenueByCountry.set(country, (revenueByCountry.get(country) || 0) + sale.Commission)
    }
    
    // Sort countries by revenue and take top 9 if >10 countries, otherwise all
    const sortedCountries = Array.from(revenueByCountry.entries())
      .sort(([,a], [,b]) => b - a)
    
    const topCountries = sortedCountries.slice(0, sortedCountries.length > 10 ? 9 : 10)
    const otherCountries = sortedCountries.slice(sortedCountries.length > 10 ? 9 : 10)
    
    const pieData = topCountries.map(([country, revenue]) => ({
      name: country,
      value: revenue
    }))
    
    // Add "Other" category if there are more than 10 countries
    if (otherCountries.length > 0) {
      const otherTotal = otherCountries.reduce((sum, [, revenue]) => sum + revenue, 0)
      pieData.push({
        name: 'Other',
        value: otherTotal
      })
    }
    
    return {
      data: { xAxis: [], series: [], pieData },
      timeScale: 'all-time',
      chartType: 'pie'
    }
  }
} 