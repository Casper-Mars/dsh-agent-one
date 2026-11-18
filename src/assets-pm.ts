/** `one-pm-assets`：PM 角色资产（10 个 Skill + persona），挂在 pm preset scope。 */
import { createAssetsPlugin } from './assets-common.js'
import { PM_DOMAIN } from './domain-pm.js'
import { PM_PERSONA } from './persona-pm.js'

export const name = 'one-pm-assets'
export const inject: string[] = []

const plugin = createAssetsPlugin(name, PM_DOMAIN.skills, PM_PERSONA)

export const apply = plugin.apply
