import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { ONE_DOMAIN } from '../src/domain.js'
import { ONE_PERSONA } from '../src/persona.js'
import { PM_DOMAIN } from '../src/domain-pm.js'
import { CTO_DOMAIN } from '../src/domain-cto.js'
import { DEV_DOMAIN } from '../src/domain-dev.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

describe('dsh-agent-one', () => {
  it('one persona 不超过 80 行', () => {
    expect(ONE_PERSONA.split('\n').length).toBeLessThanOrEqual(80)
  })

  it('one 声明 2 个 Skill，且目录存在', () => {
    expect(ONE_DOMAIN.skills).toHaveLength(3)
    for (const skill of ONE_DOMAIN.skills) {
      expect(existsSync(path.join(skill.dir, 'SKILL.md'))).toBe(true)
    }
  })

  it('内置 pm/cto/dev 角色资产且 Skill 目录都存在', () => {
    expect(PM_DOMAIN.skills).toHaveLength(10)
    expect(CTO_DOMAIN.skills).toHaveLength(13)
    expect(DEV_DOMAIN.skills).toHaveLength(13)
    for (const skill of [...PM_DOMAIN.skills, ...CTO_DOMAIN.skills, ...DEV_DOMAIN.skills]) {
      expect(existsSync(path.join(skill.dir, 'SKILL.md'))).toBe(true)
    }
  })

  it('patch 自包含：registry + one/pm/cto/dev/designer 七个 preset', () => {
    const doc = parse(readFileSync(path.join(root, 'cordis.patch.yml'), 'utf8'))
    const inserts = doc[0].insert as Array<{ id: string; config?: any }>
    expect(inserts.map(item => item.id)).toEqual([
      'agent-preset-registry',
      'preset-one',
      'preset-pm',
      'preset-cto',
      'preset-dev-leader',
      'preset-dev-developer',
      'preset-dev-tester',
      'preset-designer',
    ])

    const registry = inserts[0]!.config
    expect(registry.default).toBe('one')

    const presetIds = inserts.slice(1).map(item => item.config.id)
    expect(presetIds).toEqual(['one', 'pm', 'cto', 'dev-leader', 'dev-developer', 'dev-tester', 'designer'])
  })

  it('one 的 delegate 允许五个内置角色，maxDepth 2（覆盖 Leader 再派一层）', () => {
    const doc = parse(readFileSync(path.join(root, 'cordis.patch.yml'), 'utf8'))
    const inserts = doc[0].insert as Array<{ id: string; config?: any }>
    const one = inserts.find(item => item.id === 'preset-one')!.config
    const sub = one.plugins.find((item: any) => item.id === 'tool-subagent')
    expect(sub.config.allowedAgentPresets).toEqual(['pm', 'cto', 'dev-leader', 'dev-developer', 'dev-tester'])
    expect(sub.config.maxDepth).toBe(2)
    expect(sub.config.agentPreset).toBe('pm')
  })

  it('dev-leader 能派 developer / tester：maxDepth 2，默认 dev-developer', () => {
    const doc = parse(readFileSync(path.join(root, 'cordis.patch.yml'), 'utf8'))
    const inserts = doc[0].insert as Array<{ id: string; config?: any }>
    const leader = inserts.find(item => item.id === 'preset-dev-leader')!.config
    const sub = leader.plugins.find((item: any) => item.id === 'tool-subagent')
    expect(sub.config.allowedAgentPresets).toEqual(['dev-developer', 'dev-tester'])
    expect(sub.config.maxDepth).toBe(2)
    expect(sub.config.agentPreset).toBe('dev-developer')
  })

  it('不依赖 dsh-agent-pm / cto / dev 包', () => {
    const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
    const deps = { ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.devDependencies }
    expect(deps['dsh-agent-pm']).toBeUndefined()
    expect(deps['dsh-agent-cto']).toBeUndefined()
    expect(deps['dsh-agent-dev']).toBeUndefined()
  })
})
