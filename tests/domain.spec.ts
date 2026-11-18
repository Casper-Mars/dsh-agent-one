import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { ONE_DOMAIN } from '../src/domain.js'
import { ONE_PERSONA } from '../src/persona.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

describe('dsh-agent-one', () => {
  it('persona 不超过 80 行', () => {
    expect(ONE_PERSONA.split('\n').length).toBeLessThanOrEqual(80)
  })

  it('声明 2 个 Skill，且目录存在', () => {
    expect(ONE_DOMAIN.skills).toHaveLength(2)
    for (const skill of ONE_DOMAIN.skills) {
      expect(existsSync(path.join(skill.dir, 'SKILL.md'))).toBe(true)
    }
  })

  it('patch 只插入 one preset，允许 5 个角色 preset，且不重复插 registry', () => {
    const doc = parse(readFileSync(path.join(root, 'cordis.patch.yml'), 'utf8'))
    const inserts = doc[0].insert as Array<{ id: string; config?: any }>
    expect(inserts.map(item => item.id)).toEqual(['preset-one'])
    const preset = inserts[0]!.config
    expect(preset.id).toBe('one')
    const sub = preset.plugins.find((item: any) => item.id === 'tool-subagent')
    expect(sub.config.allowedAgentPresets).toEqual(['pm', 'cto', 'dev-leader', 'dev-developer', 'dev-tester'])
    expect(sub.config.maxDepth).toBe(1)
  })
})
