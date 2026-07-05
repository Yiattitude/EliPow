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
- Backend API: [doc/backend/接口设计文档.md](doc/backend/接口设计文档.md)
- Backend DB: [doc/backend/数据库设计文档.md](doc/backend/数据库设计文档.md)
- Backend flows: [doc/backend/业务流程文档.md](doc/backend/业务流程文档.md)
- Roles: [doc/backend/权限与角色文档.md](doc/backend/权限与角色文档.md)

## Gotchas
- Tailwind 4 uses `@import "tailwindcss"` + `@tailwindcss/postcss` plugin; legacy `tailwind.config.js` is vestigial
- Spring Boot 3.5.0 removed `spring.mvc.pathmatch.matching-strategy` — use `springdoc-openapi-starter-webmvc-api` not `-ui`
- Vite config is minimal (no proxy, no path aliases, API URL hardcoded in `api.ts`)
- Port 8080 may hold stale process after crash; `taskkill` before `mvn spring-boot:run`
- Error codes: 4001 (validation), 5000 (server error)
- Auth state persisted to localStorage under key `elipow-auth`
