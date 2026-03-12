# hexo-theme-mingyue

A Hexo theme inspired by the traditional Chinese vertical book layout. Text flows top-to-bottom, right-to-left, replicating the reading experience of a classical Chinese manuscript with parchment textures, ink tones, and brush-red accents.

## Features

- **Vertical right-to-left text** -- content is rendered in `writing-mode: vertical-rl`, the native reading direction of classical Chinese
- **Traditional Chinese date formatting** -- dates displayed in Tiangan-Dizhi (Heavenly Stems & Earthly Branches) notation with Chinese numerals
- **Lenticular bracket titles** -- all titles are automatically wrapped in「」brackets
- **CJK punctuation highlighting** -- punctuation marks rendered in brush-red for typographic emphasis
- **Western text rotation** -- Latin and numeric text automatically rotated for proper display within vertical columns
- **Book-cover title panel** -- sidebar styled as a traditional book cover with navigation and social links
- **Classical aesthetic** -- warm parchment background, ink-dark text, subtle radial gradients, and earth-tone borders
- **Responsive layout** -- three breakpoints (1200px, 900px, 600px) adjusting column dimensions and spacing
- **i18n support** -- Simplified Chinese, Traditional Chinese, Japanese, and Korean localizations included
- **Social links** -- GitHub, X/Twitter, Mastodon, Telegram, Weibo, Zhihu (via Font Awesome icons)
- **Zero build dependencies** -- pure Hexo + EJS + SCSS, no additional tooling required

## Installation

Clone the theme into your Hexo site's `themes` directory:

```bash
cd your-hexo-site
git clone https://github.com/aeilot/hexo-theme-mingyue.git themes/hexo-theme-mingyue
```

Then set the theme in your site's `_config.yml`:

```yaml
theme: hexo-theme-mingyue
```

## Configuration

Create or edit `_config.mingyue.yml` in the theme directory. The theme automatically loads this file and merges it into the Hexo theme config.

### Full default configuration

```yaml
section:
  posts: true
  tags: false
  footer:
    enabled: true
    title: "未启新卷"

home:
  posts:
    limit: 8
    show_excerpt: true
    show_date: true
    show_tags: false
    excerpt_length: 120
  tags:
    limit: 24

bio:
  title: "明月"
  description: "古调虽自爱，今人多不弹。"
  links:
    - name: "文摘"
      url: "/"
    - name: "关于"
      url: "/about/"
    - name: "归档"
      url: "/archives/"
  social_links:
    - name: "github"
      label: "GitHub"
      url: "https://github.com/yourname"
      enabled: true
    - name: "telegram"
      label: "Telegram"
      url: "https://t.me/yourname"
      enabled: true
    - name: "twitter"
      label: "Twitter"
      url: "https://x.com/yourname"
      enabled: true

style:
  accent_red: "#a31f1f"
  paper_bg: "#f7f1e3"
  ink_text: "#2d241c"
  border_ink: "#8b7355"

footer:
  custom_text: ""

content:
  sideways:
    western_enabled: true
```

### Configuration reference

| Option | Type | Default | Description |
|---|---|---|---|
| `section.posts` | boolean | `true` | Show posts section on the home page |
| `section.tags` | boolean | `false` | Show tags section on the home page |
| `section.footer.enabled` | boolean | `true` | Show footer section on the home page |
| `section.footer.title` | string | `"未启新卷"` | Footer column title |
| `home.posts.limit` | number | `8` | Number of posts displayed on the home page |
| `home.posts.show_excerpt` | boolean | `true` | Show post excerpts |
| `home.posts.show_date` | boolean | `true` | Show post dates |
| `home.posts.show_tags` | boolean | `false` | Show post tags on the home page |
| `home.posts.excerpt_length` | number | `120` | Maximum excerpt length in characters |
| `home.tags.limit` | number | `24` | Maximum number of tags to display |
| `bio.title` | string | `"明月"` | Site title shown in the title panel |
| `bio.description` | string | | Site description / motto |
| `bio.links` | array | | Navigation links (`name` + `url`) |
| `bio.social_links` | array | | Social links (`name`, `label`, `url`, `enabled`) |
| `style.accent_red` | color | `#a31f1f` | Accent color for punctuation and highlights |
| `style.paper_bg` | color | `#f7f1e3` | Page background color |
| `style.ink_text` | color | `#2d241c` | Main text color |
| `style.border_ink` | color | `#8b7355` | Border and divider color |
| `footer.custom_text` | string | `""` | Custom footer text |
| `content.sideways.western_enabled` | boolean | `true` | Rotate Western text inline in vertical columns |

### Supported social links

| `name` value | Icon |
|---|---|
| `github` | GitHub |
| `twitter` / `x` | X (Twitter) |
| `mastodon` | Mastodon |
| `telegram` | Telegram |
| `weibo` | Weibo |
| `zhihu` | Zhihu |
| _(any other)_ | Generic link |

## Languages

Set the language in your site's `_config.yml`:

```yaml
language: zh-CN
```

Supported values: `zh-CN`, `zh-TW`, `ja`, `ko`.

## Directory structure

```
hexo-theme-mingyue/
├── _config.mingyue.yml        # Theme configuration
├── index.js                   # Hexo helper registrations
├── scripts/
│   ├── helpers.js             # Date formatting, bracket titles, excerpts
│   └── load-theme-config.js   # Config file loader
├── layout/
│   ├── layout.ejs             # Base HTML shell
│   ├── index.ejs              # Home page
│   ├── post.ejs               # Single post
│   ├── page.ejs               # Generic page
│   ├── archive.ejs            # Archive listing
│   ├── tag.ejs                # Tag listing
│   ├── category.ejs           # Category listing
│   └── partial/               # Reusable partials
├── source/
│   ├── css/                   # SCSS stylesheets
│   └── js/                    # Client-side scripts
└── languages/                 # i18n files
```

## License

MIT
