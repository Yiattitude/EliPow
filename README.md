# 电荔 Elipow

面向电气相关专业本科生（重点服务上海电力大学）的个性化 AI 学习助手。以电力行业五级分层知识图谱为驱动，主线是「测评 → 推荐 → 学习 → 反馈 → 再推荐」的闭环；问答基于 GraphRAG 检索溯源，而非自由聊天。

## 核心特性

- **五级分层知识网络**：技术领域 → 岗位标准 → 知识点 → 应用场景 → 操作步骤
- **个人动态图谱**：基于 BKT 掌握度模型随学习行为实时演化
- **个性化学习路径**：根据目标岗位、当前掌握度、时间预算推断最短路径
- **苏格拉底式问答**：单 Agent + 严苛 System Prompt，引导思考而非直接给答案
- **产教融合**：对接企业真实运维案例与现行技术标准

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + Vite 8 + TypeScript 6 + Tailwind 4 |
| 图谱可视化 | `@xyflow/react`（局部路径图） + AntV G6（全局大图谱） |
| 状态管理 | Zustand |
| 后端 | Spring Boot 3.5 + Java 17 + Spring Security + MyBatis Plus |
| 数据库 | MySQL（用户/业务） + Neo4j（图数据库，规划中） + Redis（缓存） |
| AI | Spring AI（规划中） + GraphRAG |

## 目录结构

```
Elipow/
├── frontend/                # React 前端
│   └── src/
│       ├── components/      # LearningPathMap、SocraticChatPanel 等
│       ├── pages/           # Home、Login、Register、NotFound
│       ├── store/           # Zustand 状态
│       └── lib/api.ts       # axios 实例
├── backend/                 # Spring Boot 后端
│   └── src/main/java/com/elipow/backend/
│       ├── config/          # CorsConfig、SecurityConfig、GlobalExceptionHandler
│       ├── controller/      # AuthControllerImpl
│       ├── service/         # AuthService
│       ├── entity/          # 15 张表对应的实体
│       ├── mapper/          # MyBatis Plus Mapper
│       └── util/JwtUtil.java
├── doc/                     # 产品与后端文档（必读）
│   ├── 项目概览/            # PRD、技术栈、功能模块
│   ├── backend/             # 接口、数据库、业务流程
│   ├── frontend/            # 页面规划
│   └── v1-plan/issues/      # V1 开发任务拆解（6 个垂直切片）
├── db.sql / db2.sql / db3.sql  # 建表脚本、存储过程、测试数据
└── AGENTS.md                # AI 协作约定（团队成员请先读）
```

## 环境要求

- Node.js 18+
- Java 17
- Maven 3.9+（或使用 `backend/` 内的 Maven Wrapper）
- MySQL 8.x

## 快速开始

### 1. 准备数据库

```bash
# 登录 MySQL 后执行
CREATE DATABASE elipow DEFAULT CHARACTER SET utf8mb4;
USE elipow;
SOURCE db.sql;     # 建表
SOURCE db2.sql;    # 存储过程
SOURCE db3.sql;    # 测试数据
```

默认连接配置（见 [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties)）：
- 地址：`localhost:3306`
- 库名：`elipow`
- 账号 / 密码：`root` / `Life510525`
- ⚠️ 部署前必须外置化密钥与密码

### 2. 启动后端（端口 8080）

```bash
cd backend
./mvnw spring-boot:run          # Windows 用 mvnw.cmd
```

健康检查：
```bash
curl http://localhost:8080/api/health
# 期望：{"status":"ok"}
```

Swagger UI：http://localhost:8080/swagger-ui/index.html

### 3. 启动前端（端口 5173）

```bash
cd frontend
npm install
npm run dev
```

打开 http://localhost:5173 。CORS 仅允许此地址访问后端。

## 端口与配置一览

| 项 | 值 |
|---|---|
| 前端 | `http://localhost:5173` |
| 后端 | `http://localhost:8080` |
| MySQL | `localhost:3306` / `elipow` |
| CORS 白名单 | 仅 `http://localhost:5173`（硬编码） |
| JWT | HMAC-SHA384，24h 有效期 |

## 当前开发状态

V1 采用**单 Agent + 严苛 System Prompt** 架构（详见 [CONTEXT.md](CONTEXT.md) 与 [AGENTS.md](AGENTS.md)），暂不实现多智能体编排。

### 已完成
- 用户登录/注册（`/api/auth/**`）
- JWT 工具类、BCrypt 密码加密
- 基础 App Shell + 学习路径图原型 + 苏格拉底悬浮聊天窗（前端原型）
- 15 张表结构、MyBatis Plus 实体与 Mapper

### 待补齐（已知缺口）
- **JWT 鉴权过滤器**：`SecurityConfig` 当前用 `.httpBasic()`，尚未接入 `OncePerRequestFilter`
- **Axios 拦截器**：前端请求未自动携带 JWT
- **Spring AI 依赖**：pom.xml 暂未引入
- **Neo4j 接入**：图数据库与 GraphRAG 待搭建
- 密码、JWT Secret 仍以明文写在源码（仅开发期，部署前需外置）

V1 任务拆解见 [doc/v1-plan/issues/](doc/v1-plan/issues/)，共 6 个垂直切片：认证画像、图谱基础设施、个人图谱同步、动态学习计划、苏格拉底 Agent、向量 RAG 高亮。

## 协作约定

1. **开工前先 `git pull`**，避免基于旧代码改了半天
2. **小步快跑**：完成一个小功能就 `commit` + `push`
3. **commit message 写人话**，例如「实现登录页表单校验」而非「update」
4. **前端样式**遵循 [.agents/skills/linear-frontend-design/SKILL.md](.agents/skills/linear-frontend-design/SKILL.md)：Linear 风格（冷静暗色、紧凑密度），覆盖早期 glassmorphism/neon 方向
5. **AI 响应不得直接给答案**，使用苏格拉底式提问引导用户

## 关键文档导航

- 产品范围与原则：[doc/项目概览/项目开发要求.md](doc/项目概览/项目开发要求.md)
- PRD：[doc/项目概览/PRD.md](doc/项目概览/PRD.md)
- 技术栈：[doc/项目概览/技术栈.md](doc/项目概览/技术栈.md)
- 系统全链路逻辑视图：[doc/项目概览/系统全链路逻辑视图.md](doc/项目概览/系统全链路逻辑视图.md)
- 前端页面规划：[doc/frontend/页面与功能规划文档.md](doc/frontend/页面与功能规划文档.md)
- 后端接口设计：[doc/backend/接口设计文档.md](doc/backend/接口设计文档.md)
- 数据库设计：[doc/backend/数据库设计文档.md](doc/backend/数据库设计文档.md)
- ER 图谱视图：[doc/backend/数据库ER图谱模型视图.md](doc/backend/数据库ER图谱模型视图.md)
- 业务流程：[doc/backend/业务流程文档.md](doc/backend/业务流程文档.md)
- 知识图谱数据导入规范：[doc/backend/知识图谱数据导入规范.md](doc/backend/知识图谱数据导入规范.md)

## License

本项目为教学/课程作业用途，暂未指定开源协议。
