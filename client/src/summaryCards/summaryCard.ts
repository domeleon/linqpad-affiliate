import { div } from 'domeleon'
import { themeMgr, appStyles } from '../theme.js'
import { createChart, type ChartConfig } from '../chart/chart.js'
import type { ChartResult } from '../chart/chartTypes.js'

export abstract class SummaryCard {
  private cleanupChart?: () => void

  abstract render(): any
  abstract getChartData(): ChartResult
  abstract getChartConfig(): ChartConfig
  
  protected createCardStructure(title: string, value: string) {
    return div({ class: styles.card },
      div({ class: styles.cardTopRow },
        div({ class: styles.cardLabel }, title),
        div({ class: styles.cardValue }, value)
      ),
      div({ 
        class: styles.chartContainer,
        onMounted: (elm) => this.attachChart(elm as HTMLElement)
      })
    )
  }

  private attachChart(element: HTMLElement) {
    if (this.cleanupChart) {
      this.cleanupChart()
    }
    
    const result = this.getChartData()
    const config = this.getChartConfig()
    this.cleanupChart = createChart(element, result.data, config, result.chartType)
  }

  destroy() {
    if (this.cleanupChart) {
      this.cleanupChart()
      this.cleanupChart = undefined
    }
  }
}

const styles = themeMgr.styles('summaryCard', theme => {
  const { borderNeutral, textSecondary, accentBase, bgSecondary } = theme.colors
  return {
    card: `p-4 rounded border border-${borderNeutral} bg-${bgSecondary} ${appStyles.cardShadow} hover:${appStyles.cardShadowHover} ${appStyles.cardTransition}`,
    cardTopRow: 'flex items-center justify-between',
    cardLabel: `block text-sm text-${textSecondary}`,
    cardValue: `block text-xl font-bold text-${accentBase}`,
    chartContainer: 'h-[200px] w-full mt-2'
  }
}) 