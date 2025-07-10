import * as echarts from 'echarts/core'
import { LineChart, BarChart, PieChart, TreemapChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { themeMgr } from '../theme.js'

echarts.use([LineChart, BarChart, PieChart, TreemapChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer])

export interface ChartData {
  xAxis: string[]
  series: number[]
  seriesStacked?: number[]
  pieData?: { name: string; value: number }[]
}

export interface SeriesConfig {
  name: string
  color: string
  data: number[]
}

export interface ChartConfig {
  yAxisFormatter: (value: number) => string
  tooltipFormatter?: (params: any) => string
  series?: SeriesConfig[]
}

export function createChart(element: HTMLElement, data: ChartData, config: ChartConfig, chartType?: string) {
  const chart = echarts.init(element)
  
  // Safety check for empty data (but not for pie charts)
  if (chartType !== 'pie' && chartType !== 'treemap' && (!data.xAxis || data.xAxis.length === 0 || !data.series || data.series.length === 0)) {
    data = { xAxis: ['No Data'], series: [0] }
  }
  
  let option: any
  
  if (chartType === 'pie') {
    option = {
      series: [{
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: data.pieData || [],
        label: {
          show: true,
          position: 'outside',
          formatter: (params: any) => {
            const formattedValue = config.yAxisFormatter ? config.yAxisFormatter(params.value) : params.value
            
            // Truncate long country names to prevent label overflow
            let countryName = params.name
            if (countryName.length > 12) {
              countryName = countryName.substring(0, 10) + '...'
            }
            
            return `${countryName}: ${formattedValue}`
          },
          color: themeMgr.theme.colors.textPrimary.rawValue,
          fontSize: 9
        },
        labelLine: {
          show: true,
          length: 8,
          length2: 12
        }
      }],
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: config.tooltipFormatter || ((params: any) => {
          return `${params.name}: ${params.value}`
        })
      }
    }
  } else if (chartType === 'treemap') {
    const treemapData = (data.pieData || []).map(item => ({
      name: item.name,
      value: item.value
    }))
    
    option = {
      backgroundColor: themeMgr.theme.colors.bgSecondary.rawValue,
      series: [{
        type: 'treemap',
        data: treemapData,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        colorSaturation: [0, 0],
        itemStyle: {
          borderColor: themeMgr.theme.colors.borderNeutral.rawValue,
          borderWidth: 1,
          gapWidth: 1,
          color: themeMgr.theme.colors.bgSecondary.rawValue
        },
        emphasis: {
          disabled: true
        },
        label: {
          show: true,
          formatter: (params: any) => {
            // Hide labels on very small rectangles to avoid truncation
            const totalValue = treemapData.reduce((sum, item) => sum + item.value, 0)
            const percentage = (params.value / totalValue) * 100
            
            if (percentage < 8) { // Hide labels if less than 8% of total
              return ''
            }
            
            const formattedValue = config.yAxisFormatter ? config.yAxisFormatter(params.value) : params.value
            
            // For smaller rectangles (8-15%), show only country code
            if (percentage < 15) {
              return params.name
            }
            
            // For larger rectangles, show both country and value
            return `${params.name}\n${formattedValue}`
          },
          color: themeMgr.theme.colors.textPrimary.rawValue,
          fontSize: 11,
          fontWeight: 'bold'
        },
        levels: [{
          itemStyle: {
            borderWidth: 0,
            gapWidth: 5
          }
        }]
      }],
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: config.tooltipFormatter || ((params: any) => {
          return `${params.name}: ${params.value}`
        })
      }
    }
  } else if (chartType === 'stacked') {
    // Use provided series configuration or fall back to default
    const seriesConfig = config.series || [
      { name: 'Primary', color: themeMgr.theme.colors.accentBase.rawValue, data: data.series },
      { name: 'Secondary', color: themeMgr.theme.colors.highlight.rawValue, data: data.seriesStacked || [] }
    ]
    
    option = {
      grid: { top: 15, right: 8, bottom: 40, left: 32, containLabel: false },
      xAxis: { 
        type: 'category', 
        show: true,
        data: data.xAxis,
        axisLabel: { 
          fontSize: 9,
          rotate: 45,
          margin: 6,
          interval: 0,
          verticalAlign: 'top'
        },
        axisLine: { show: true, lineStyle: { opacity: 0.3 } },
        axisTick: { show: false }
      },
      yAxis: { 
        type: 'value', 
        show: true,
        axisLabel: { 
          fontSize: 9,
          formatter: (value: number) => value.toString(),
          margin: 8
        },
        splitLine: { show: true, lineStyle: { opacity: 0.15 } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: seriesConfig.map(s => ({
        name: s.name,
        type: 'bar',
        stack: 'main',
        data: s.data,
        barWidth: '60%',
        itemStyle: { color: s.color, opacity: 0.8 }
      })),
      tooltip: { 
        show: true,
        trigger: 'axis',
        formatter: config.tooltipFormatter || ((params: any) => {
          return params.map((p: any) => `${p.seriesName}: ${p.value}`).join('<br/>')
        })
      },
      animation: false
    }
  } else {
    option = {
      grid: { top: 15, right: 8, bottom: 40, left: 32, containLabel: false },
      xAxis: { 
        type: 'category', 
        show: true,
        data: data.xAxis,
        axisLabel: { 
          fontSize: 9,
          rotate: 45,
          margin: 6,
          interval: 0,
          verticalAlign: 'top'
        },
        axisLine: { show: true, lineStyle: { opacity: 0.3 } },
        axisTick: { show: false }
      },
      yAxis: { 
        type: 'value', 
        show: true,
        axisLabel: { 
          fontSize: 9,
          formatter: config.yAxisFormatter,
          margin: 8
        },
        splitLine: { show: true, lineStyle: { opacity: 0.15 } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: data.series,
        barWidth: '60%',
        itemStyle: {
          borderRadius: [2, 2, 0, 0],
          opacity: 0.8,
          color: themeMgr.theme.colors.accentBase.rawValue
        },
        emphasis: {
          itemStyle: {
            opacity: 1
          }
        }
      }],
      tooltip: { 
        show: true,
        trigger: 'axis',
        formatter: config.tooltipFormatter || ((params: any) => {
          const point = params[0]
          return `${point.axisValue}: ${config.yAxisFormatter(point.value)}`
        })
      },
      animation: false
    }
  }
  
  chart.setOption(option)
  
  const resizeObserver = new ResizeObserver(() => chart.resize())
  resizeObserver.observe(element)
  
  return () => {
    resizeObserver.disconnect()
    chart.dispose()
  }
}

// Simple formatter factory functions - no domain knowledge
export const formatters = {
  currency: (value: number) => `$${value.toLocaleString()}`,
  number: (value: number) => value.toLocaleString(),
  percentage: (value: number) => `${value}%`,
  plain: (value: number) => value.toString()
}

// Shared tooltip formatter utilities
export const tooltipFormatters = {
  singleValue: (formatter: (value: number) => string) => (params: any) => {
    return `${params.name}: ${formatter(params.value)}`
  },
  axisValue: (formatter: (value: number) => string, suffix?: string) => (params: any) => {
    const point = params[0]
    const formattedValue = formatter(point.value)
    return `${point.axisValue}: ${formattedValue}${suffix ? ` ${suffix}` : ''}`
  }
} 