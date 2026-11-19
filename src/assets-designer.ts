/** `one-designer-assets`：设计师资产（3 个 UI Skill + persona），挂在 designer preset scope。 */
import { createAssetsPlugin } from './assets-common.js'
import { DESIGNER_DOMAIN } from './domain-designer.js'
import { DESIGNER_PERSONA } from './persona-designer.js'

export const name = 'one-designer-assets'
export const inject: string[] = []

const plugin = createAssetsPlugin(name, DESIGNER_DOMAIN.skills, DESIGNER_PERSONA)

export const apply = plugin.apply
