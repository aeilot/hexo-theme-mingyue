# hexo-theme-mingyue

`hexo-theme-mingyue` 是一个中国古典风格的 Hexo 主题，强调竖排阅读（从右到左）、书卷式视觉、serif 字体与正文红色中文标点。

## 特性
- 竖排排版：`vertical-rl`，右到左阅读
- 标题风格：统一 `「标题」`
- 首页模块：`bio + posts + tags + footer`（固定顺序）
- 首页开关：`section.posts`、`section.tags`、`section.footer.enabled`
- 文章卡片字段：标题、摘要、时间、tags
- 摘要优先级：`excerpt(<!--more-->) -> description -> content 截断`
- 技术栈：EJS + Sass

## 安装
将主题放入 Hexo 博客的 `themes/hexo-theme-mingyue` 目录：

```bash
cd your-hexo-site/themes
git clone <your-repo-url> hexo-theme-mingyue
```

在 Hexo 站点根目录 `_config.yml` 启用主题：

```yml
theme: hexo-theme-mingyue
```

确保安装 Sass 渲染器：

```bash
pnpm add hexo-renderer-sass
```

## 主题配置
编辑 `themes/hexo-theme-mingyue/_config.mingyue.yml`：

```yml
section:
  posts: true
  tags: true
  footer:
    enabled: true
    title: "未启新卷"

home:
  posts:
    limit: 8
    show_excerpt: true
    show_date: true
    show_tags: true
    excerpt_length: 120
  tags:
    limit: 24

bio:
  title: "明月"
  description: "古调虽自爱，今人多不弹。"
  links: []
```

## 文章摘要
推荐在文章中使用 `<!--more-->` 控制摘要：

```markdown
这里是摘要部分。
<!--more-->
这里是正文部分。
```

## 开发
```bash
cd your-hexo-site
hexo clean
hexo g
hexo s
```

## License
MIT
