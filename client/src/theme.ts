import presetWind3 from '@unocss/preset-wind3'
import { UnoThemeManager, type ThemeProxy } from 'domeleon/unocss'
import { config } from './config.js'

export const lightTheme = {
  colors: {
    textPrimary: 'rgb(17, 24, 39)',
    textSecondary: 'rgb(91, 91, 91)',
    textMessage: 'rgb(127, 100, 22)',
    bgPrimary: 'rgb(255, 255, 255)',
    bgSecondary: 'rgb(242, 239, 239)',
    bgTertiary: 'rgb(222, 219, 219)',
    borderNeutral: 'rgb(242, 239, 239)',
    primaryHover: 'rgb(135, 247, 60)',
    accentBase: 'rgb(53, 86, 137)',
    highlight: 'rgb(255, 68, 0)'
  }
}

export const darkTheme = {
  colors: {
    textPrimary: 'rgb(245, 245, 245)',
    textSecondary: 'rgb(163, 163, 163)',
    textMessage: 'rgb(255, 184, 7)',
    bgPrimary: 'rgb(38, 38, 38)',
    bgSecondary: 'rgb(50, 50, 50)',
    bgTertiary: 'rgb(70, 70, 70)',
    borderNeutral: 'rgb(50, 50, 50)',
    primaryHover: 'rgb(96, 165, 250)',
    accentBase: 'rgb(112, 187, 249)',
    highlight: 'rgb(255, 234, 0)'
  }
}

const globalUnoCss = (theme: ThemeProxy<typeof lightTheme>) => {
  const { textPrimary, primaryHover, bgPrimary: backgroundPrimary, textSecondary, borderNeutral } = theme.colors
  return {
    'a': `text-${textPrimary} no-underline`,
    'a:hover': `text-${primaryHover}`,
    'h1': `m-0 text-${textPrimary}`,
    'body': `m-0 p-0 bg-${backgroundPrimary} text-${textSecondary} font-sans`,
    'fieldset': `border-1 p-5 m-0 border-${borderNeutral}`,
    'html': 'overflow-auto',
    'ul': 'list-none p-0 m-0',
    'li': 'p-0 m-0'
  }
}

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches  

export const themeMgr = new UnoThemeManager({
  id: config.appId,
  themes: {
    light: lightTheme,
    dark: darkTheme    
  },
  initialTheme: isDark ? 'dark' : 'light',
  globalUnoCss: globalUnoCss,
  unoCssConfig: { presets: [presetWind3()] }
})

export const appStyles = themeMgr.styles('app', theme => {
  const { accentBase } = theme.colors
  return {
    cardShadow: 'shadow-[0_3px_12px_0_rgb(0,0,0,0.2),0_2px_6px_0_rgb(0,0,0,0.15)]',
    cardShadowHover: 'shadow-[0_12px_32px_-8px_rgb(0,0,0,0.2),0_6px_16px_-4px_rgb(0,0,0,0.15)]',
    cardTransition: 'transition-shadow duration-200',
    hoverTransition: 'transition-colors duration-150',
    focusRing: `focus-visible:ring-1 focus-visible:ring-${accentBase}/50`    
  }
})