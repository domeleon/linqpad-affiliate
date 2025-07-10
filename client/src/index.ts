import { App, RouteService, Route } from 'domeleon'
import { Affiliates } from './affiliates.js'
import { themeMgr } from './theme.js'
import { config } from './config.js'

const userId = new Route (location.pathname).firstSegment

new App({
  routeService:  new RouteService({ basePath: userId }),
  rootComponent: new Affiliates(userId),
  containerId: config.appId,
  cssAdapter: themeMgr.unoCssAdapter
})