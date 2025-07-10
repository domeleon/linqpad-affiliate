import { Route } from "domeleon"

export const config = {
  appId: "app",
  api: {
    url: "https://www.linqpad.net/affiliatesdata/api/report"
  },
  text: {
    defaultMessage: "Welcome to the LINQPad affiliate dashboard.",
    title: "LINQPad Affiliate Dashboard",
    noDataMessage: "Data not loaded.",
    dataLoadErrorMessage: "Problems fetching data."
  }
}

// used in conjuction with 404.html, standard github page routing hack
export function initGithubRouting() {
  const redirect = sessionStorage.redirect
  delete sessionStorage.redirect
  if (redirect && redirect !== location.href) {
    history.replaceState(null, '', redirect)
  }
}

// can work with both custom domains and github pages that prefixes app with path 'linqpad-affiliate'
export function getPaths () {
  const path = new Route (location.pathname)
  const prefix = path.firstSegment == "linqpad-affiliate" ? "linqpad-affiliate" : ""  
  const userId = prefix ? path.remainder.firstSegment : path.firstSegment

  return { basePath: prefix+"/"+userId, userId }
}