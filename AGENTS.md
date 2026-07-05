# AI Agent Instructions

## Quick Start
```bash
# Backend (Spring Boot 3.5.0 / Java 17 / port 8080)
cd backend && mvn spring-boot:run

# Frontend (React 19 / Vite 8 / TypeScript 6 / Tailwind 4 / port 5173)
cd frontend && npm run dev
```

## Key Architecture
- **Core loop**: 测评 → 推荐 → 学习 → 反馈 → 再推荐
- **Learning path is mainline; QA is retrieval-grounded, not free-form chat**
- AI output must be structured: current_level, gap_topics, next_steps, recommended_resources, explanation, sources
- No Spring AI dependency yet — will be added later

## Ports & Config
| Item | Value |
|---|---|
| Backend | `localhost:8080` |
| Frontend | `localhost:5173` |
| DB | `localhost:3306` / `elipow` / `root`:`Life510525` |
| CORS | Only `http://localhost:5173` allowed (hardcoded) |
| JWT | HMAC-SHA384, 24h expiry, secret in `application.properties` (dev only) |

## Known Gaps (to be built)
- **No JWT auth filter** — `SecurityConfig` uses `.httpBasic()`, no `OncePerRequestFilter` wired yet
- **No Axios interceptor** — JWT token not attached to requests from frontend
- **No Spring AI dependency** — pom.xml lacks it despite being in the architecture
- DB password and JWT secret in plaintext in source (dev only — externalize before deploy)

## DB Schema
- 15 tables, defined in `db.sql` (at project root)
- Stored procedures in `db2.sql`, test data in `db3.sql`

## Commands
```bash
npm run build   # tsc && vite build
npm run preview # preview production build
```

## Docs (read, do not duplicate)
- Product scope: [doc/项目开发要求.md](doc/项目开发要求.md)
- Tech stack: [doc/项目概览/技术栈.md](doc/项目概览/技术栈.md)
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

## Frontend Design Skill
- For all frontend design, implementation, review, or refactor work, load and follow the local skill: [.agents/skills/linear-frontend-design/SKILL.md](.agents/skills/linear-frontend-design/SKILL.md).
- This Linear-inspired product style overrides earlier generic glassmorphism/neon direction when there is a conflict: prefer calm dark surfaces, compact density, precise hierarchy, subtle motion, source traceability, and workflow-first screens.

## Build/Test
- No build or test commands found in this workspace. If code is added later, document commands here.
