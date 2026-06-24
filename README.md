# Forge AI 实用力探索站

Forge AI 锻造训战营专属测试站原型，包含：

- 学员端 AI 实用力探索流程
- 结果页画像、路径建议、7 天行动计划
- 服务端数据提交
- 内部诊断后台 `/admin`
- 内部后台口令保护
- 二维码与品牌海报生成脚本

## 本地运行

```bash
npm install
set ADMIN_PASSWORD=你的内部口令
npm start
```

访问：

- 学员端：http://127.0.0.1:3000/
- 内部后台：http://127.0.0.1:3000/admin

如果没有设置 `ADMIN_PASSWORD`，原型默认口令是：

```text
ForgeInternal2026!
```

正式部署必须修改。

## 生成二维码和海报

```bash
set PUBLIC_URL=https://你的生产域名/
npm run generate:poster
```

生成文件：

- `assets/forge-ai-explorer-qr.svg`
- `assets/forge-ai-explorer-poster.svg`

## 部署建议

后台需要服务端接口，不能用纯 GitHub Pages。推荐：

- Render
- Railway
- Fly.io
- 自有 Node 服务器

Render 可直接使用本仓库的 `render.yaml`。部署时必须配置：

- `ADMIN_PASSWORD`
- `SESSION_SECRET`

## 数据说明

数据默认写入：

```text
data/submissions.json
```

该文件已加入 `.gitignore`，不会提交到 GitHub。生产环境如果重启或迁移服务器，建议后续换成正式数据库，例如 PostgreSQL、Supabase 或 MongoDB。
