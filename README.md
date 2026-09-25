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
- `GET|POST /api/reagent-usages`（支持 `reagentId` / `userId` / `status` 筛选）
- `GET /api/audit-logs`

## 领用与库存联动

- 领用单状态：待审批（PendingApproval）→ 已领用（Received）/ 已取消（Cancelled）。
- 仅已提交（Submitted）或要求修改（RevisionRequired）的实验可创建领用单；提交后冻结对应数量，可用库存 = 库存 - 冻结。
- 实验审核通过：冻结转实扣，领用单转已领用；驳回或退回：取消领用单并释放冻结，库存与领用状态同步更新。
- 可用库存不足或实验状态不合规时，接口返回 409 错误。

## 本地验证

```bash
npm run check
npm --prefix backend start
curl http://127.0.0.1:3000/api/health
docker compose config
```

## License

MIT
