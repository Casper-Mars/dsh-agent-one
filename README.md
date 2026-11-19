# dsh-agent-one

一体化项目主智能体：**一个项目一个会话**，主 agent 持有项目全貌，按需复用
`pm` / `cto` / `dev` 子智能体。

**自包含**：pm / cto / dev 的 persona、领域 Skill 与 preset 已复制进本包，
部署时只装 `dsh-agent-one`，不再安装 `dsh-agent-pm` / `dsh-agent-cto` /
`dsh-agent-dev`。

## Preset

| preset | 职责 |
|---|---|
| `one` | 项目主智能体；路由、上下文维护、任务生命周期 |
| `pm` | 产品经理：洞察、PRD、排序、交接、发布、复盘 |
| `cto` | CTO：技术决策、架构方案、评审、拆解 |
| `dev-leader` | 开发调度：派单、质量门、发布、复盘 |
| `dev-developer` | 编码执行 |
| `dev-tester` | 独立验收 |

工具面与角色 Skill 均从原角色包复制；Skill 共 35 个（one 2 + pm 10 + cto 10 + dev 13）。

## 会话与权限

- 会话键：`project_id`（kit `worker.sessionKey = project`）
- 权限：固定 `workspace-write`；不在本包切换 `danger-full-access`
- 子智能体：`delegate` + `send_message` 复用；`maxDepth: 2`（0=主 agent，1=Leader，2=developer/tester）。
  设成 1 时 Leader 的工具描述会写「remaining levels 0」，模型会直接自己写代码、不派发。

## 子智能体报告契约

子智能体完成前必须调用：

```text
echuan_task_report(task_id=<本卡>, lease_id=<本卡>, summary_md=<交付正文>)
```

子 agent 结束不会释放租约；不报告任务会停在 `in_progress` 直到过期。

## 构建

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

## 部署（三鼎 sanding）

在现有 compose 中只新增 `dsh-agent-one` 一个 service，复用现有 `echuan`：

```bash
docker compose up -d dsh-agent-one
```

默认 `worker.poll.enable: false`，避免与 `dsh-agent` 抢同 kinds 的卡。
需要测试派单时，先暂停 `dsh-agent`，再把
`deployment/agents/dsh-agent-one.patch.yml` 里的 `poll.enable` 改为 `true`。

端口：relay `0.0.0.0:3444`。

## design-kit（副本）

本包的 `design-kit/` 与 `skills/ui-design|ui-prototype|ui-handoff` 是
`dsh-agent-cto` 的**逐字节副本**，不要在这里手改。

- 源：`dsh-agent-cto`
- 同步：在 cto 仓库执行 `pnpm design:sync`
- 校验：`pnpm design:drift`（任何差异退出 1）
- CI：`.github/workflows/design-kit.yml` 会在 design-kit 存在时自动跑
  token 校验与示例实例 check
