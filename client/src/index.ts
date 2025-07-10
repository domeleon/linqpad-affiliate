import { App, RouteService } from 'domeleon'
import { Affiliates } from './affiliates.js'
import { themeMgr } from './theme.js'
import { config, initGithubRouting, getPaths } from './config.js'

initGithubRouting()
const { basePath, userId } = getPaths()

new App({
  routeService:  new RouteService ({ basePath }),
  rootComponent: new Affiliates (userId),
  containerId: config.appId,
  cssAdapter: themeMgr.unoCssAdapter
})