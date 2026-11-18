/** `one-cto-assets`：CTO 角色资产（10 个 Skill + persona），挂在 cto preset scope。 */
import { createAssetsPlugin } from './assets-common.js'
import { CTO_DOMAIN } from './domain-cto.js'
import { CTO_PERSONA } from './persona-cto.js'

export const name = 'one-cto-assets'
export const inject: string[] = []

const plugin = createAssetsPlugin(name, CTO_DOMAIN.skills, CTO_PERSONA)

export const apply = plugin.apply
