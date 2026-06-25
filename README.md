# Forge AI 实用力探索站

Forge AI 锻造训战营专属测试站，包含：

- 学员端 AI 实用力探索流程
- 结果页画像、路径建议、7 天行动计划
- Supabase 数据提交
- 内部诊断后台 `/admin.html`
- Supabase 邮箱密码登录保护
- 二维码与品牌海报生成脚本

## 免费生产架构

- 前台与后台页面：GitHub Pages
- 数据库与登录：Supabase
- 后台地址：`/admin.html`

GitHub Pages 不能保存数据，所以测试数据写入 Supabase。Supabase 的匿名 key 可以放在前端，真正的安全边界由 Row Level Security 控制。

## Supabase 初始化

1. 创建 Supabase 免费项目。
2. 进入 SQL Editor。
3. 执行仓库里的 `supabase.sql`。
4. 进入 Authentication → Users，创建 Forge 内部管理员账号。
5. 进入 Project Settings → API，复制：
   - Project URL
   - anon public key
6. 填入 `public/config.js`：

```js
window.FORGE_SUPABASE = {
  url: "你的 Supabase Project URL",
  anonKey: "你的 anon public key"
};
```

## GitHub Pages 发布

仓库已配置 `.github/workflows/pages.yml`。推送到 `main` 后，GitHub Actions 会发布 `public` 文件夹。

生产地址预计为：

```text
https://forgeeason.github.io/forge-ai-explorer/
```

后台地址：

```text
https://forgeeason.github.io/forge-ai-explorer/admin.html
```

如果 GitHub 提示 Pages 未启用，进入 Settings → Pages，将 Source 选择为 GitHub Actions。

## 本地运行（Node 备用）

```bash
npm install
set ADMIN_PASSWORD=你的内部口令
npm start
```

访问：

- 学员端：http://127.0.0.1:3000/
- 内部后台：http://127.0.0.1:3000/admin.html

Node 服务端只是备用本地开发方式。正式免费方案推荐 GitHub Pages + Supabase。

## 生成二维码和海报

```bash
set PUBLIC_URL=https://你的生产域名/
npm run generate:poster
```

生成文件：

- `assets/forge-ai-explorer-qr.svg`
- `assets/forge-ai-explorer-poster.svg`

## 部署建议

如果以后要使用 Render/Railway/Fly.io，也可以继续用 `server.js` 和 `render.yaml`。

## 数据说明

Node 备用模式下，数据默认写入：

```text
data/submissions.json
```

该文件已加入 `.gitignore`，不会提交到 GitHub。生产环境如果重启或迁移服务器，建议后续换成正式数据库，例如 PostgreSQL、Supabase 或 MongoDB。
