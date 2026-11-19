/** `one` 领域：3 个 Skill（路由 / 项目记忆 / 维护分诊）+ 主智能体人设。 */
import { fileURLToPath } from 'node:url'
import { ONE_PERSONA } from './persona.js'

export interface OneSkill {
  readonly name: string
  readonly description: string
  readonly dir: string
}

export interface OneDomain {
  readonly id: 'one'
  readonly version: string
  readonly displayName: string
  readonly personaMarkdown: string
  readonly skills: readonly OneSkill[]
}

function skillDir(name: string): string {
  return fileURLToPath(new URL(`../skills/${name}`, import.meta.url))
}

function skill(name: string, description: string): OneSkill {
  return { name, description, dir: skillDir(name) }
}

export const ONE_DOMAIN: OneDomain = {
  id: 'one',
  version: '0.1.0',
  displayName: 'One Domain',
  personaMarkdown: ONE_PERSONA,
  skills: [
    skill(
      'one-routing',
      '一个项目一个会话时，判断任务该自己答、交 PM、交 CTO、交 Dev，以及如何复用/新建子智能体并收报告。',
    ),
    skill(
      'one-project-memory',
      '维护项目级会话记忆：项目结论、子智能体 id、未决项与压缩时机，避免上下文丢失。',
    ),
    skill(
      'maintainer',
      '仓库维护分诊：issue / 缺陷 / 小改动的四类判断、证据门槛、轻修复与需求出口、对外动作分级。',
    ),
  ],
}
