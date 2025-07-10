import { Table, ColumnDef } from './table.js'
import type { Payout } from '../types.js'
import { type ChartResult } from '../chart/chartTypes.js'
import { money } from '../util.js'

export class PayoutsTable extends Table<Payout> {
  readonly routeSegment = 'payouts'

  protected columns(): ColumnDef<Payout>[] {
    return [
      { header: 'Date', cell: r => r.Date },
      { header: 'Payment #', cell: r => r.PaymentNumber },
      { header: 'Amount', cell: r => money.format(r.Amount) },
      { header: 'Status', cell: r => r.SuccessfullyProcessed ? 'Success' : 'Failed' },
      { header: 'Message', cell: r => r.PaymentMessage }
    ]
  }

  getSummaryValue(): string {
    const total = this.items.reduce((sum, item) => sum + item.Amount, 0)
    return money.format(total)
  }

  getSummaryLabel(): string {
    return 'Total Payouts'
  }

  generateChartData(): ChartResult {
    return this.generateTimeSeriesChartData(
      (payout) => ({
        date: payout.Date,
        value: payout.Amount
      }),
      (amounts) => amounts.reduce((sum, amount) => sum + amount, 0)
    )
  }
} 