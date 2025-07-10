import { SummaryCard } from './summaryCard.js'
import { SalesTable } from '../tables/sales.js'
import { ImpressionsTable } from '../tables/impressions.js'
import { formatters, type ChartConfig } from '../chart/chart.js'
import { themeMgr } from '../theme.js'
import type { ChartResult } from '../chart/chartTypes.js'

export class TrafficCard extends SummaryCard {
  constructor(
    private impressionsTable: ImpressionsTable,
    private salesTable: SalesTable
  ) {
    super()
  }

  render() {
    return this.createCardStructure(
      this.impressionsTable.getSummaryLabel(),
      this.impressionsTable.getSummaryValue()
    )
  }

  getChartData(): ChartResult {
    // Generate stacked chart data combining impressions and conversions
    const impressionsData = this.impressionsTable.generateChartData()
    const salesData = this.salesTable.generateSalesCountData() // Use count data, not revenue
    
    return {
      data: {
        xAxis: impressionsData.data.xAxis,
        series: impressionsData.data.series,
        seriesStacked: salesData.data.series
      },
      timeScale: impressionsData.timeScale,
      chartType: 'stacked'
    }
  }

  getChartConfig(): ChartConfig {
    const impressionsData = this.impressionsTable.generateChartData()
    const salesData = this.salesTable.generateSalesCountData()
    
    return {
      yAxisFormatter: formatters.number,
      series: [
        { 
          name: 'Impressions', 
          color: themeMgr.theme.colors.accentBase.rawValue, 
          data: impressionsData.data.series
        },
        { 
          name: 'Conversions', 
          color: themeMgr.theme.colors.highlight.rawValue, 
          data: salesData.data.series
        }
      ],
      tooltipFormatter: (params: any) => {
        const impressions = params.find((p: any) => p.seriesName === 'Impressions')?.value || 0
        const conversions = params.find((p: any) => p.seriesName === 'Conversions')?.value || 0
        const rate = impressions > 0 ? ((conversions / impressions) * 100).toFixed(1) : '0'
        return `${params[0].axisValue}<br/>Impressions: ${impressions}<br/>Conversions: ${conversions}<br/>Rate: ${rate}%`
      }
    }
  }
} 