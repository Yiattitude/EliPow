## Parent
[PRD](../PRD.md)

## What to build
打通“公共图谱”与“个人掌握度”的映射。后端在 MySQL 中建立 `User_Node_Mastery` 表以跟踪具体用户对图谱节点的熟悉度。当用户请求个人图谱时，后端需将 Neo4j 的拓扑结构与该用户的掌握度权重做结合返回。前端需要在工作台提供“全局/个人”视角的 Toggle 开关，切换至个人视角时，未掌握节点变暗，已掌握节点亮绿。同时在左下方展示类似游戏天赋树的技能点亮动画。

## Acceptance criteria
- [ ] 后端提供结合了 MySQL 掌握度权重与 Neo4j 拓扑结构的接口响应。
- [ ] 前端图谱页面提供全局/个人视角切换开关。
- [ ] 切换至个人视角时，前端节点能根据权重值正确改变颜色/透明度（平滑动效）。
- [ ] 界面包含一个岗位技能面板（Skill Tree），当节点权重达到阈值，触发 Lottie 充能点亮特效。

## Blocked by
- [01-auth-onboarding.md](./01-auth-onboarding.md)
- [02-graph-infrastructure.md](./02-graph-infrastructure.md)
