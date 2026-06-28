# Elipow

面向电气相关专业本科生的学习助手。本仓库包含基于 Vite 的前端与 Spring Boot 后端，暂不包含 AI 功能。

## 目录结构
- frontend/ Vite + React + TypeScript
- backend/ Spring Boot (Maven, Java 17)
- doc/ 产品与后端文档

## 环境要求
- Node.js 18+
- Java 17
- Maven（或使用 backend/ 内的 Maven Wrapper）

## 前端（Vite）
```bash
cd frontend
npm install
npm run dev
```
打开 http://localhost:5173

## 后端（Spring Boot）
```bash
cd backend
./mvnw spring-boot:run
```
后端运行于 http://localhost:8080

## 健康检查
```bash
curl http://localhost:8080/api/health
```
期望响应：
```json
{"status":"ok"}
```

## 说明
- CORS 已配置为允许 http://localhost:5173。
- 安全配置允许匿名访问 /api/health 和 Swagger 相关端点。
