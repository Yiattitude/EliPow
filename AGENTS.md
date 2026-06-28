# AI Agent Instructions

## Project Snapshot
- Product: Electric power undergraduate learning assistant.
- Goal: learning path is the main line; QA is resource reuse, not free-form chat.
- Architecture: React frontend, Spring Boot backend, Spring AI for RAG and tool calling.

## Key Docs (link, do not duplicate)
- Product scope and principles: [doc/项目开发要求.md](doc/项目开发要求.md)
- Product overview: [doc/项目概览/项目简介.md](doc/项目概览/项目简介.md)
- Tech stack: [doc/项目概览/技术栈.md](doc/项目概览/技术栈.md)
- PRD: [doc/项目概览/PRD.md](doc/项目概览/PRD.md)
- Modules: [doc/项目概览/功能模块.md](doc/项目概览/功能模块.md)
- System logic view: [doc/项目概览/系统全链路逻辑视图.md](doc/项目概览/系统全链路逻辑视图.md)
- Frontend planning: [doc/frontend/页面与功能规划文档.md](doc/frontend/页面与功能规划文档.md)
- Backend API: [doc/backend/接口设计文档.md](doc/backend/接口设计文档.md)
- Backend DB: [doc/backend/数据库设计文档.md](doc/backend/数据库设计文档.md)
- DB visual schema: [doc/backend/数据库ER图谱模型视图.md](doc/backend/数据库ER图谱模型视图.md)
- Backend flows: [doc/backend/业务流程文档.md](doc/backend/业务流程文档.md)
- Graph data ingestion: [doc/backend/知识图谱数据导入规范.md](doc/backend/知识图谱数据导入规范.md)
- Roles/permissions: [doc/backend/权限与角色文档.md](doc/backend/权限与角色文档.md)
- Exceptions/boundaries: [doc/backend/异常与边界处理文档.md](doc/backend/异常与边界处理文档.md)
- Data dictionary: [doc/backend/数据字典文档.md](doc/backend/数据字典文档.md)

## Behavioral Guardrails
- **MVP Architecture Rule**: V1 uses a **Single-Agent** architecture with hard System Prompts (Pseudo-Socratic), rather than Multi-Agent orchestration. Do not implement complex agent routing or Guardrail models.
- Prioritize learning path and user profile; QA is secondary and must be grounded in retrieval.
- Prefer structured outputs for AI responses (e.g., current level, gaps, next steps, sources).
- Keep answers traceable to resources; avoid unsupported free-form generation. AI responses MUST NOT give direct answers, but instead use Socratic questioning to guide the user.

## Build/Test
- No build or test commands found in this workspace. If code is added later, document commands here.
