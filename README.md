# 大敏单车官网

无锡大敏单车有限公司的中英文品牌官网。项目采用静态 HTML、CSS 和原生 JavaScript 构建，包含品牌介绍、产品展示、产品详情、售后支持、使用场景和客户咨询表单。

## 页面

- 中文首页：`public/index.html`
- 英文首页：`public/en/index.html`
- 中文产品页：`public/products/`
- 英文产品页：`public/en/products/`
- 中英文售后页：`public/support.html`、`public/en/support.html`

## 技术结构

- Tailwind CSS 3：生成生产版基础样式
- `public/assets/css/home.css`：首页专用样式
- `public/assets/css/page.css`：产品页和售后页共享样式
- `public/assets/js/home.js`：中英文首页共享交互逻辑
- AOS：滚动进入动画
- Font Awesome：页面图标

## 本地运行

环境要求：Node.js、npm 和 Python 3。

```bash
npm run build:css
npm start
```

启动后访问 [http://localhost:3000](http://localhost:3000)。

修改 HTML 中的 Tailwind 类名后，需要重新执行：

```bash
npm run build:css
```

## 客户咨询表单

表单提交逻辑位于 `public/assets/js/home.js`。将 `FEISHU_FORM_ENDPOINT` 配置为可公开接收浏览器请求的飞书自动化或 Webhook 地址后，表单才会开放提交。

请勿在前端代码中写入飞书 App Secret、tenant access token 或其他私密凭据。当前接收地址为空，因此提交按钮会保持禁用，用户仍可通过页面中的电话和邮箱联系。

## 场景视频

首页预留以下视频文件：

- `public/assets/videos/commute.mp4`
- `public/assets/videos/campus.mp4`
- `public/assets/videos/trunk.mp4`
- `public/assets/videos/weekend.mp4`

视频尚未加入仓库时，场景卡片会显示海报图，不影响其他页面功能。

## 部署

项目可以作为静态站点部署到 Vercel。仓库中的 `vercel.json` 已配置英文入口 `/en` 和 `/en/` 的重写规则，站点发布目录为 `public`。

建议在发布前执行：

```bash
node --check public/assets/js/home.js
npm run build:css
```
