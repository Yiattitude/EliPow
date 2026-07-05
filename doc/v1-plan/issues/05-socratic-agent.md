## Parent
[PRD](../PRD.md)

## What to build
基于 Spring AI 构建系统的核心虚拟助教（单体 Agent MVP）。开发一个悬浮于图谱之上的流式聊天窗，上下文自动锁定于用户当前选中的图谱节点。重点是后端的 System Prompt 工程：必须硬编码约束大模型使用苏格拉底提问法，并且实现挫折感知逻辑（通过跟踪对话轮次/识别错误，当用户对同一个节点连续答错 3 次时，主动降级为直接给答案和公式的兜底模式）。支持 Markdown 和 LaTeX 公式解析。

## Acceptance criteria
- [ ] 前端提供悬浮聊天面板，能稳定接收并渲染 SSE 流式输出，正确解析 LaTeX 公式。
- [ ] 聊天面板顶部有“锁定节点上下文”开关，开启时发送的问题自动携带当前节点 ID 上下文。
- [ ] AI 无论如何诱导都不会在第一轮对话中直接给出最终答案，必须以提问收尾。
- [ ] 模拟用户连续回答错误 3 次后，AI 行为明显改变，能直接输出兜底的解析和答案公式。

## Blocked by
- [02-graph-infrastructure.md](./02-graph-infrastructure.md)
