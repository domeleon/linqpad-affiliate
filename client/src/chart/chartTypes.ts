export type TimeScale = 'day' | 'week' | 'month' | 'quarter' | 'year'

export interface ChartResult {
  data: any
  timeScale: TimeScale | 'all-time'
  chartType?: string
}

export function determineTimeScale(startDate: Date, endDate: Date): TimeScale {
  const msPerDay = 24 * 60 * 60 * 1000
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay) + 1
  
  const THRESHOLD = 10
  
  if (daysDiff <= THRESHOLD) return 'day'
  
  const weeksDiff = Math.ceil(daysDiff / 7)
  if (weeksDiff <= THRESHOLD) return 'week'
  
  const monthsDiff = Math.ceil(daysDiff / 30)
  if (monthsDiff <= THRESHOLD) return 'month'
  
  const quartersDiff = Math.ceil(daysDiff / 90)
  if (quartersDiff <= THRESHOLD) return 'quarter'
  
  return 'year'
}

export function getTimeScaleKey(date: Date, timeScale: TimeScale): string {
  switch (timeScale) {
    case 'day':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    case 'week':
      const weekStart = getWeekStart(date)
      return weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    case 'month':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    case 'quarter':
      const quarter = Math.floor(date.getMonth() / 3) + 1
      return `Q${quarter} ${date.getFullYear()}`
    case 'year':
      return date.getFullYear().toString()
  }
}

export function parseTimeKey(key: string, timeScale: TimeScale): Date {
  switch (timeScale) {
    case 'day':
    case 'week':
      return new Date(key + ', 2025')
    case 'month':
      return new Date(key)
    case 'quarter':
      const [q, year] = key.split(' ')
      const quarter = parseInt(q.replace('Q', ''))
      return new Date(parseInt(year), (quarter - 1) * 3, 1)
    case 'year':
      return new Date(parseInt(key), 0, 1)
  }
}

function getWeekStart(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day
  result.setDate(diff)
  return result
} 