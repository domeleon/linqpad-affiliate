import { Component, div, li, ul, VElement } from 'domeleon'
import { themeMgr, appStyles } from '../theme'
import { commandLink } from './commandLink'

export interface TabDef {
  id: string
  label: VElement
  content: () => VElement
}

export class TabControl extends Component {
  _selected = ""
  get selected() { return this._selected }
  set selected(id: string) {
    this._selected = id
    this.update()    
  }

  view(props: { tabs: TabDef[]}): VElement {
    const { tabs } = props    
    const sel = this._selected

    return div({ class: styles.tabbox },
      div({ class: styles.container },
        ul({ class: styles.header },
          tabs.map(tab =>
            li({ class: sel === tab.id ? styles.active : styles.inactive },
              commandLink({
                class: sel === tab.id ? styles.linkActive : styles.linkInactive,
                onClick: () => { this.selected = tab.id }
              },
                tab.label
              )
            ) 
          )
        )
      ),
      div({ class: styles.content },
        tabs.find(t => t.id === sel)?.content()
      )
    )
  }
} 

const styles = themeMgr.styles("tab", theme => {
  const { textSecondary, bgTertiary, bgSecondary, borderNeutral, accentBase} = theme.colors
  
  const tab = `mr-2 border-t border-l border-r rounded-t-md border-${borderNeutral}`
  const link = `block py-2 px-4 focus:outline-none ${appStyles.hoverTransition}`

  return {
    tabbox: `relative ${appStyles.cardShadow} rounded-md overflow-visible`,
    container: `flex border-b border-${borderNeutral} bg-${bgTertiary} rounded-t-md`,
    header: 'flex list-none p-0 m-0',  
    active: `${tab} border-b-0 -mb-px -mt-1.5 pt-1.5 relative z-10 bg-${bgSecondary}`,
    inactive: `${tab} border-b hover:bg-${bgSecondary} hover:-mt-1.5 hover:pt-1.5 hover:border-b-0 hover:-mb-px hover:relative hover:z-10 ${appStyles.hoverTransition}`,  
    linkActive: `${link} text-${accentBase} text-shadow-[0.5px_0_0_currentColor] hover:text-${accentBase}`,
    linkInactive: `${link} text-${textSecondary} hover:text-${accentBase} hover:text-shadow-[0.5px_0_0_currentColor] rounded-t-md ${appStyles.focusRing} ${appStyles.hoverTransition}`,
    content: `p-4 border-l border-r border-b border-${borderNeutral} rounded-b-md bg-${bgSecondary}`
  }
})