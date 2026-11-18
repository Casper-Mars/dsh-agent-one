# dsh-agent-one

一体化项目主智能体：**一个项目一个会话**，主 agent 持有项目全貌，按需复用
`pm` / `cto` / `dev` 子智能体。与 `dsh-agent-dev` 同源，但只提供一个 preset：`one`。

## 结构

| 组件 | 职责 |
|---|---|
| `one` preset | 项目主智能体；路由、上下文维护、任务生命周期 |
| `pm` / `cto` / `dev-*` preset | 角色子智能体；深度技能留在各自包里 |
| `one-routing` skill | 任务该自己答 / 交谁 / 复用哪个 child |
| `one-project-memory` skill | 项目结论、child id、未决项与压缩时机 |

## 会话与权限

- 会话键：`project_id`（kit `worker.sessionKey = project`）
- 权限：固定 `workspace-write`；`dev-domain` 不再给子 agent 提权
- 子智能体：`delegate` + `send_message` 复用；默认 `maxDepth: 1`

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

## 部署（sanding）

```bash
docker compose up -d echuan-one dsh-agent-one
```

端口：平台 `127.0.0.1:8722`，relay `0.0.0.0:3444`。
