import { App, RouteService } from 'domeleon'
import { Affiliates } from './affiliates.js'
import { themeMgr } from './theme.js'
import { config, initGithubRouting, getPaths } from './config.js'

const { basePath, userId } = getPaths()
initGithubRouting()

new App({
  routeService:  new RouteService ({ basePath }),
  rootComponent: new Affiliates (userId),
  containerId: config.appId,
  cssAdapter: themeMgr.unoCssAdapter
})