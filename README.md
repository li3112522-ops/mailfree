# iMail - 临时邮箱服务

<p align="center">
  <img src="public/favicon.svg" alt="iMail Logo" width="80" height="80">
</p>

<p align="center">
  <strong>基于 Cloudflare Workers 的现代化临时邮箱服务</strong>
</p>

<p align="center">
  采用 Apple Human Interface Guidelines 设计风格，毛玻璃效果，优雅美观
</p>

---

**当前版本：V5.0** - 全新 Apple HIG 风格界面重构

## 一键部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/li3112522-ops/mailfree)

### [点击查看一键部署指南](docs/yijianbushu.md)

## 功能特性

### 现代化界面 (V5.0 新特性)

- **Apple HIG 设计**：遵循 Apple Human Interface Guidelines，界面简洁优雅
- **毛玻璃效果**：采用 backdrop-filter 实现华丽的毛玻璃卡片效果
- **胶囊按钮**：圆润的胶囊形状按钮，符合现代设计趋势
- **SVG 图标系统**：使用 Lucide Icons，清晰锐利的矢量图标
- **响应式设计**：完美适配桌面和移动设备
- **移动端 Tab Bar**：iOS 风格的底部导航栏
- **流畅动画**：平滑的过渡动画和微交互反馈

### 邮箱管理

- **智能生成**：随机生成临时邮箱地址，支持自定义长度和域名
- **历史记录**：自动保存历史生成的邮箱，方便重复使用
- **便捷删除**：支持删除单个邮箱和批量管理
- **一键切换**：快速在不同邮箱间切换
- **邮箱置顶**：重要邮箱置顶显示

### 用户管理

- **三层权限模型**：严格管理员(Strict Admin) / 高级用户(Admin) / 普通用户(User)
- **用户列表**：查看用户名、角色、邮箱上限/已用、发件权限、创建时间
- **创建/编辑用户**：支持改名、重置密码、角色切换、调整邮箱上限
- **分配邮箱**：批量为用户分配邮箱地址
- **权限防护**：前端快速鉴权，未授权自动跳转

### 邮件功能

- **实时接收**：自动接收和显示邮件，支持 HTML 和纯文本
- **自动刷新**：选中邮箱后自动检查新邮件
- **智能预览**：自动提取和高亮显示验证码内容
- **一键复制**：智能识别验证码并优先复制
- **发件支持**：接入 Resend，支持多域名配置和智能选择 API 密钥

---

## 技术架构

### 前端设计系统

```
public/
├── css/
│   ├── variables.css      # CSS 变量（颜色、圆角、阴影等）
│   ├── base.css           # 基础样式重置
│   ├── animations.css     # 动画定义
│   └── components/
│       ├── buttons.css    # 胶囊按钮组件
│       ├── inputs.css     # 输入框组件
│       ├── cards.css      # 毛玻璃卡片组件
│       ├── modals.css     # iOS 风格弹窗组件
│       └── tabbar.css     # 移动端 Tab Bar
├── icons/
│   └── sprite.svg         # Lucide SVG 图标精灵
├── js/
│   ├── icons.js           # 图标加载工具
│   └── ...
└── html/
    ├── login.html         # 登录页
    ├── app.html           # 主应用模板
    ├── admin.html         # 用户管理
    ├── mailboxes.html     # 邮箱总览
    ├── mailbox.html       # 单邮箱页
    └── api.html           # API 文档
```

### 设计规范

| 属性 | 值 |
|------|-----|
| 主色调 | `#007AFF` (Apple Blue) |
| 成功色 | `#34C759` (Apple Green) |
| 危险色 | `#FF3B30` (Apple Red) |
| 警告色 | `#FF9500` (Apple Orange) |
| 胶囊按钮圆角 | `9999px` |
| 大卡片圆角 | `28px` |
| 小卡片圆角 | `20px` |
| 输入框圆角 | `12px` |

### 技术栈

- **Cloudflare Workers**：边缘计算，全球加速
- **D1 数据库**：SQLite 兼容的无服务器数据库
- **R2 存储**：对象存储，保存邮件原始内容
- **Resend API**：邮件发送服务

---

## 部署步骤

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/li3112522-ops/mailfree)

### [一键部署指南](docs/yijianbushu.md)

> 提示：如需开启发件功能，请查看《[Resend 密钥获取与配置教程](docs/resend.md)》。

### 配置邮件路由

1. 进入域名的 Email Routing 设置
2. 添加 Catch-all 规则
3. 目标设置为 Worker: `temp-mail-worker`

---

## 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| TEMP_MAIL_DB | D1 数据库绑定 | 是 |
| MAIL_EML | R2 存储桶绑定 | 是 |
| MAIL_DOMAIN | 邮箱域名（支持多个，逗号分隔） | 是 |
| ADMIN_PASSWORD | 管理员密码 | 是 |
| ADMIN_NAME | 管理员用户名（默认 `admin`） | 否 |
| JWT_TOKEN | JWT 签名密钥 | 是 |
| RESEND_API_KEY | Resend 发件配置 | 否 |
| FORWARD_RULES | 邮件转发规则 | 否 |

### 多域名发件配置

```bash
# 键值对格式（推荐）
RESEND_API_KEY="domain1.com=re_key1,domain2.com=re_key2"

# JSON 格式
RESEND_API_KEY='{"domain1.com":"re_key1","domain2.com":"re_key2"}'

# 单密钥格式（兼容旧版）
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## API 文档

### 认证方式

请求携带与 `JWT_TOKEN` 相同的令牌时，将被视为最高管理员：

- `Authorization: Bearer <JWT_TOKEN>`
- `X-Admin-Token: <JWT_TOKEN>`
- `?admin_token=<JWT_TOKEN>`

### 完整文档

- 查看文档：[`docs/api.md`](docs/api.md)
- 在线查看：部署后访问 `/html/api.html`

---

## 版本历史

### V5.0 (当前)
- 全新 Apple HIG 风格界面
- 组件化 CSS 设计系统
- Lucide SVG 图标替换 emoji
- 移动端 Tab Bar 导航
- API 文档页面

### V4.5
- 多域名发送配置
- 智能 API 密钥选择
- 批量发送优化

### V4.0
- 邮箱单点登录
- 全局邮箱管理
- 列表/卡片双视图

### V3.5
- R2 存储支持
- 性能优化
- 移动端适配

### V3.0
- 三层权限系统
- 用户管理后台

[查看完整版本历史](docs/v3.md)

---

## 故障排除

### 常见问题

1. **邮件接收不到**
   - 检查 Cloudflare Email Routing 配置
   - 确认域名 MX 记录设置
   - 验证 MAIL_DOMAIN 环境变量

2. **数据库错误**
   - 确认 D1 绑定名称为 TEMP_MAIL_DB
   - 运行 `wrangler d1 list` 确认数据库存在

3. **登录问题**
   - 确认 ADMIN_PASSWORD 已设置
   - 检查 JWT_TOKEN 配置
   - 清除浏览器缓存和 Cookie

4. **界面异常**
   - 在 Cloudflare 控制台 Purge Everything
   - 浏览器强制刷新 (Ctrl/Cmd+F5)

### 调试技巧

```bash
# 本地调试
wrangler dev

# 查看日志
wrangler tail

# 检查数据库
wrangler d1 execute TEMP_MAIL_DB --command "SELECT * FROM mailboxes LIMIT 10"
```

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=li3112522-ops/mailfree&type=Date)](https://www.star-history.com/#li3112522-ops/mailfree&Date)

## 联系方式

- 微信：`iYear1213`

## 赞赏支持

如果你觉得本项目对你有帮助，欢迎赞赏支持：

<p align="left">
  <img src="pic/alipay.jpg" alt="支付宝赞赏码" height="400" />
  <img src="pic/weichat.jpg" alt="微信赞赏码" height="400" />
</p>

## 许可证

Apache-2.0 license
