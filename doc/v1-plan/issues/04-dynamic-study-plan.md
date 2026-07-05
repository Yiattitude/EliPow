## Parent
[PRD](../PRD.md)

## What to build
基于 AI 推断实现动态的周度学习计划。用户在弹窗输入可用时间预算（如 10h）后，后端核心服务 `StudyPlanService` 需要基于用户的目标岗位路径和当前节点掌握度，在图谱中向上追溯并截取总耗时匹配的任务序列。前端 Dashboard 使用 `@xyflow/react` 将该任务序列渲染成一条横向的、带有前置/后续支线依赖关系的学习时间轴，并允许用户拖拽微调节点顺序。

## Acceptance criteria
- [ ] 前端每周提供强制弹窗，让用户输入/确认本周的时间预算。
- [ ] 后端能根据时间预算、目标岗位、当前掌握度，精准返回预估耗时吻合且满足拓扑依赖的知识点列表。
- [ ] Dashboard 使用 `@xyflow/react` 渲染横向时间轴，正确表达节点间的依赖分支关系。
- [ ] 用户可以通过拖拽改变无严格依赖节点的顺序，调整结果能成功持久化到后端。

## Blocked by
- [03-personal-graph-sync.md](./03-personal-graph-sync.md)
