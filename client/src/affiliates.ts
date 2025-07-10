import { Component, div, h3, humanizeIdentifier, type Route } from 'domeleon'
import { Router, type IRouted } from 'domeleon'
import { TabControl, type TabDef } from './uiUtil/tabControl.js'
import { ImpressionsTable } from './tables/impressions.js'
import { SalesTable } from './tables/sales.js'
import { PayoutsTable } from './tables/payouts.js'
import { RevenueCard } from './summaryCards/revenueCard.js'
import { TrafficCard } from './summaryCards/trafficCard.js'
import { CountryCard } from './summaryCards/countryCard.js'
import { SalesCard } from './summaryCards/salesCard.js'
import { themeMgr, appStyles } from './theme.js'
import { fmt } from './util.js'
import { fetchData } from './fetchData.js'
import { config } from './config.js'

export class Affiliates extends Component implements IRouted {
  readonly routeSegment = ''
  router: Router = new Router(this)
  userId: string
  loaded = false
  affiliateMessage?: string
  tabControl = new TabControl()

  // Tables
  impressions = new ImpressionsTable()
  sales = new SalesTable()
  payouts = new PayoutsTable()

  // Summary cards
  revenueCard = new RevenueCard(this.sales)
  trafficCard = new TrafficCard(this.impressions, this.sales)
  countryCard = new CountryCard(this.sales)
  salesCard = new SalesCard(this.sales)

  constructor(userId: string) {
    super()
    this.userId = userId
    this.tabControl.selected = 'impressions'
  }

  onAttached() {    
    this.loadData().catch(console.error)
  }

  override async onNavigate(relative: Route) {
    this.tabControl.selected = (relative.firstSegment as TabId) ?? 'impressions'  
  }

  view() {
    return div({ class: styles.page },
      this.#summary(),
      div({ class: styles.tabsWrapper },
        this.tabControl.view({ tabs: this.#tabs() })
      )
    )
  }

  message() {
    return this.affiliateMessage || config.text.defaultMessage
  }

  #summary() {
    if (!this.loaded) return div({ class: styles.loading }, config.text.noDataMessage)

    return div({ class: styles.section },
      h3({ class: styles.header }, config.text.title),
      div({ class: styles.messageBox }, this.message()),
      div({ class: styles.cardGrid },
        this.trafficCard.render(),
        this.salesCard.render(), 
        this.revenueCard.render(),
        this.countryCard.render()
      )
    )
  }

  #tabs(): TabDef[] {    
    const tabIds: TabId[] = ['impressions', 'sales', 'payouts']
    return tabIds.map(id => ({
      id,
      label: this[id].router.link("", this.tabSummaryLabel(id)),
      content: () => this[id].view()
    }))
  }

  async loadData() {        
    const data = await fetchData(this.userId)
    if (data) {
      this.affiliateMessage = data.AffiliateMessage
      this.impressions.load(data.Impressions)
      this.sales.load(data.Sales)
      this.payouts.load(data.Payouts)
    }
    else {
      this.affiliateMessage = config.text.dataLoadErrorMessage
    }
    this.loaded = true
    this.update()
  }

  tabSummaryLabel(tabId: TabId): string {
    const table = this[tabId]
    const label = humanizeIdentifier(tabId)
    if (!table.loaded) return label
    return `${label} (${fmt.format(table.items.length)})`
  }
}

const styles = themeMgr.styles('affiliates', theme => {
  const { accentBase, textMessage, bgSecondary } = theme.colors
  return {
    page: 'max-w-6xl mx-auto px-4 md:px-8 py-6',
    tabsWrapper: 'mt-6',
    section: 'space-y-6',
    header: 'text-2xl font-semibold',
    messageBox: `text-${textMessage} p-4 rounded border border-${accentBase}/20 bg-${bgSecondary} ${appStyles.cardShadow}`,
    cardGrid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
    loading: 'p-4 text-center'
  }
})

type TabId = 'impressions' | 'sales' | 'payouts'