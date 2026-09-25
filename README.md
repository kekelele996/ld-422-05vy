# 科学研究实验记录与协作平台

## Docker 启动

```bash
FRONTEND_PORT=18802 BACKEND_PORT=19302 docker compose up --build
```

- 前端访问地址：http://localhost:18802
- 后端健康检查：http://localhost:19302/api/health
- 演示鉴权：前端请求默认携带 `x-demo-role: PI`；接口支持 `Authorization: Bearer demo-admin-token`。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Vue 3、TypeScript、Vite、Element Plus、Tiptap、ECharts、Pinia |
| 后端 | Express 风格分层、TypeScript、JWT、Prisma schema |
| 数据库 | PostgreSQL 15，Docker Compose 命名卷 |
| 部署 | Docker Compose、Nginx 静态前端、Node HTTP 后端 |

## 目录结构

```text
frontend/src/
  api/ stores/ types/ components/common/ components/editor/ hooks/ pages/ router/ utils/ constants/
backend/src/
  routes/ controllers/ services/ models/ middlewares/ types/ utils/ config/ prisma/
```

## 枚举位置

- 后端枚举：`backend/src/types/enums.ts`
- 前端枚举：`frontend/src/types/enums.ts`

## 主要接口

- `GET /api/dashboard`
- `GET|POST /api/projects`
- `GET /api/members`
- `GET|POST /api/experiments`
- `PATCH /api/experiments/:id/submit`
- `PATCH /api/experiments/:id/review`
- `GET|POST /api/reagents`
- `PATCH /api/reagents/:id/stock-in`
- `GET|POST /api/reagent-usages`
- `GET /api/audit-logs`

## 本地验证

```bash
npm run check
npm --prefix backend start
curl http://127.0.0.1:3000/api/health
docker compose config
```

## License

MIT
