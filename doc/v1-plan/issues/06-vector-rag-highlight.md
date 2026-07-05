## Parent
[PRD](../PRD.md)

## What to build
为 Agent 赋予权威文档溯源能力。部署 Milvus 或 PGVector 向量数据库，存放电力教材和国网标准 PDF 的切片。通过 Function Calling 给 Agent 提供检索文档的能力，并强制它在回答中包含类似 `<ref id="xxx">` 的标签。前端聊天窗拦截此标签，并在页面右侧的内置 PDF 阅览器中，自动跳转到对应的原文件页码并高亮引用的段落。此模块涉及向量准确率调优，需人工参与审查 (HITL)。

## Acceptance criteria
- [ ] 后端能够通过大模型的 Function Calling 触发对向量数据库的语义检索。
- [ ] Agent 输出的文本中稳定包含可解析的 `<ref>` 标签，且标签映射至具体的文档块。
- [ ] 前端解析 `<ref>` 标签为可点击元素。
- [ ] 点击引用标签时，右侧 PDF 阅览器加载对应文档，翻页至特定位置，并醒目高亮对应段落。

## Blocked by
- [05-socratic-agent.md](./05-socratic-agent.md)
