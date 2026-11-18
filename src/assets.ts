/** `one-assets`：把 ONE persona 与 2 个 Skill 注册到 preset scope。 */
import type { Context } from '@deepseek-ai/cordis'
import { ONE_DOMAIN } from './domain.js'
import { ONE_PERSONA } from './persona.js'
import { createDomainLogger, readService, registerDomainFirmwareSkills } from './plugin.js'

export const name = 'one-assets'
export const inject: string[] = []

const PERSONA_SECTION = 'deployment:persona-prefix'

interface SystemPromptLike {
  section(section: { name: string; order: number; text: string }): () => void
  getSectionOrder(name: string): number
}

function readSystemPrompt(ctx: Context): SystemPromptLike | undefined {
  const value = readService(ctx, 'systemPrompt')
  if (
    value !== null
    && typeof value === 'object'
    && typeof (value as SystemPromptLike).section === 'function'
    && typeof (value as SystemPromptLike).getSectionOrder === 'function'
  ) {
    return value as SystemPromptLike
  }
  return undefined
}

export function apply(ctx: Context): void {
  const logger = createDomainLogger(readService(ctx, 'logger'), 'one-assets')

  ctx.effect(() => {
    const prompt = readSystemPrompt(ctx)
    if (prompt === undefined) {
      logger.warn('preset scope 缺少 systemPrompt 服务，ONE persona 降级为不注入')
      return () => {}
    }
    return prompt.section({
      name: PERSONA_SECTION,
      order: prompt.getSectionOrder('DEPLOYMENT_PERSONA_PREFIX'),
      text: ONE_PERSONA,
    })
  }, 'one-assets:persona')

  ctx.effect(() => {
    const unregisters = registerDomainFirmwareSkills(ctx, ONE_DOMAIN.skills, logger, { verifyWinner: false })
    return () => {
      for (let index = unregisters.length - 1; index >= 0; index -= 1) {
        try { unregisters[index]?.() } catch (error) { logger.warn('领域 Skill 反注册失败', error) }
      }
    }
  }, 'one-assets:register-skills')
}
