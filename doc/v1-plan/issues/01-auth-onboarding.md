## Parent
[PRD](../PRD.md)

## What to build
实现用户的基础登录认证以及冷启动阶段的数据采集。用户完成注册登录后，会被强制要求在一个分步卡片流中选择“目标岗位”和“薄弱科目”。这些选项将被持久化，为后续生成该用户的专属学习路径提供基础画像数据。此切片要求打通从前端组件渲染、数据提交到后端鉴权及 Profile 表落库的完整链路。

## Acceptance criteria
- [ ] 用户可以通过标准界面完成登录/注册。
- [ ] 首次登录的用户会被强制跳转至 Onboarding 页面。
- [ ] 用户在 Onboarding 页面可以从下拉组件中选择目标岗位（如电气工程师）和薄弱科目。
- [ ] 前端提交的画像数据能正确持久化到后端的 `User_Profile` 数据表中。
- [ ] 拥有画像数据的用户后续登录不再看到 Onboarding 页面。

## Blocked by
None - can start immediately
