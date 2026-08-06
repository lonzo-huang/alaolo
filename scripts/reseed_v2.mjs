// Reseed all 20+ items across 4 super categories with new Linear/Raycast design system
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('/app/.env', 'utf-8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })

const L = (zh, en) => ({ zh, en, ja: en, ko: en, de: en, fr: en, nl: en, es: en, it: en, ru: en })
const favicon = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

// 4 super category subgroups (categories table still used for color grouping)
// We keep the categories table with 4 rows now
const superCategories = [
  { slug: 'tools',           name: L('工具', 'Tools'),          color: '#8B5CF6', icon: 'Wrench',       sort_order: 1 },
  { slug: 'knowledge',       name: L('知识', 'Knowledge'),      color: '#3B82F6', icon: 'BookOpen',     sort_order: 2 },
  { slug: 'resources',       name: L('资源', 'Resources'),      color: '#10B981', icon: 'FolderOpen',   sort_order: 3 },
  { slug: 'recommendations', name: L('推荐', 'Recommendations'), color: '#F5C518', icon: 'Sparkles',     sort_order: 4 },
]

const items = [
  // TOOLS
  { slug:'claude', super:'tools', sub:'AI', name:L('Claude','Claude'), slogan:L('Anthropic 出品的深度对话 AI','Anthropic\'s deep-reasoning AI'), desc:L('200K 上下文 · Artifacts 交互创作 · 中日韩表现优异','200K context · Artifacts for interactive creation · excellent CJK'), logo:favicon('claude.ai'), url:'https://claude.ai', brand:'#D97757', price:'Freemium', rating:4.8, views:12840, featured:true, editors:true, trending:true, platforms:['Web','iOS','API'], tags:L(['AI','对话','长文'],['AI','Chat','LongCtx']) },
  { slug:'chatgpt', super:'tools', sub:'AI', name:L('ChatGPT','ChatGPT'), slogan:L('OpenAI 出品的万能 AI 助手','OpenAI\'s all-purpose AI'), desc:L('GPT-4o 多模态 · o1 深度推理 · GPT Store 生态','GPT-4o multimodal · o1 reasoning · massive GPT Store'), logo:favicon('openai.com'), url:'https://chat.openai.com', brand:'#10A37F', price:'Freemium', rating:4.7, views:25620, featured:true, editors:true, trending:true, platforms:['Web','iOS','Android','API'], tags:L(['AI','对话','图像'],['AI','Chat','Image']) },
  { slug:'cursor', super:'tools', sub:'Dev', name:L('Cursor','Cursor'), slogan:L('AI 优先的代码编辑器','The AI-first code editor'), desc:L('基于 VS Code · Claude/GPT 深度融合 · Composer 全项目改造','Built on VS Code · deep AI · Composer whole-project edits'), logo:favicon('cursor.com'), url:'https://cursor.com', brand:'#000000', price:'Freemium', rating:4.8, views:15420, featured:true, trending:true, platforms:['macOS','Windows','Linux'], tags:L(['编辑器','AI','编程'],['Editor','AI','Coding']) },
  { slug:'raycast', super:'tools', sub:'Productivity', name:L('Raycast','Raycast'), slogan:L('macOS 上极致快的启动器','Blazing-fast macOS launcher'), desc:L('快捷键调起一切 · 剪贴板 · Snippets · 插件生态','Instant launch · Clipboard · Snippets · huge extension ecosystem'), logo:favicon('raycast.com'), url:'https://raycast.com', brand:'#FF6363', price:'Freemium', rating:4.9, views:8720, editors:true, platforms:['macOS'], tags:L(['启动器','效率','macOS'],['Launcher','Productivity','macOS']) },
  { slug:'linear', super:'tools', sub:'Productivity', name:L('Linear','Linear'), slogan:L('为高绩效团队打造的项目管理','Project management for high-performance teams'), desc:L('极速键盘操作 · 干净的界面美学 · 现代化的 Issue 追踪','Fast keyboard-first · minimal aesthetic · modern issue tracking'), logo:favicon('linear.app'), url:'https://linear.app', brand:'#5E6AD2', price:'Freemium', rating:4.8, views:6540, editors:true, platforms:['Web','macOS','iOS'], tags:L(['项目管理','团队','协作'],['PM','Team','Collab']) },
  { slug:'v0', super:'tools', sub:'AI', name:L('v0 by Vercel','v0 by Vercel'), slogan:L('AI 生成 shadcn/Tailwind UI','AI generates shadcn/Tailwind UI'), desc:L('输入描述即输出组件代码 · 可直接复制 · Next.js 优化','Describe → get shadcn code · copy directly · Next.js optimized'), logo:favicon('v0.dev'), url:'https://v0.dev', brand:'#000000', price:'Freemium', rating:4.6, views:9230, trending:true, platforms:['Web'], tags:L(['AI','UI','React'],['AI','UI','React']) },
  { slug:'excalidraw', super:'tools', sub:'Design', name:L('Excalidraw','Excalidraw'), slogan:L('手绘风的白板绘图工具','Hand-drawn style whiteboard'), desc:L('架构图 · 流程草图 · 会议白板 · 完全免费开源','Architecture diagrams · quick sketches · fully open-source'), logo:favicon('excalidraw.com'), url:'https://excalidraw.com', brand:'#6965DB', price:'Free', rating:4.8, views:5410, platforms:['Web'], tags:L(['白板','绘图','协作'],['Whiteboard','Draw','Collab']) },
  { slug:'obsidian', super:'tools', sub:'Notes', name:L('Obsidian','Obsidian'), slogan:L('基于本地 Markdown 的双链笔记','Local-first Markdown notes with backlinks'), desc:L('双向链接 · 图谱视图 · 插件体系极其丰富 · 数据主权','Backlinks · graph view · vast plugin ecosystem · data ownership'), logo:favicon('obsidian.md'), url:'https://obsidian.md', brand:'#7C3AED', price:'Free', rating:4.7, views:7810, platforms:['macOS','Windows','Linux','iOS'], tags:L(['笔记','Markdown','PKM'],['Notes','Markdown','PKM']) },

  // KNOWLEDGE
  { slug:'mdn', super:'knowledge', sub:'Web', name:L('MDN Web Docs','MDN Web Docs'), slogan:L('Web 平台最权威的开放文档','The authoritative reference for the Web platform'), desc:L('HTML / CSS / JavaScript / Web API 全面覆盖 · 兼容性表清晰','Full coverage of HTML/CSS/JS/Web APIs · clear browser compat tables'), logo:favicon('developer.mozilla.org'), url:'https://developer.mozilla.org', brand:'#000000', price:'Free', rating:4.9, views:8730, editors:true, readTime:'5-30 min', difficulty:'Beginner', cover:'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80', tags:L(['文档','Web','前端'],['Docs','Web','Frontend']) },
  { slug:'papers-with-code', super:'knowledge', sub:'AI', name:L('Papers with Code','Papers with Code'), slogan:L('机器学习论文和开源实现的映射','ML papers ↔ open-source implementations'), desc:L('SOTA 排行榜 · 论文与代码互相关联 · 数据集索引','SOTA leaderboards · papers linked to code · dataset index'), logo:favicon('paperswithcode.com'), url:'https://paperswithcode.com', brand:'#21CBCA', price:'Free', rating:4.8, views:3980, editors:true, readTime:'10 min+', difficulty:'Advanced', cover:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', tags:L(['AI','论文','研究'],['AI','Papers','Research']) },
  { slug:'ibm-quantum', super:'knowledge', sub:'Quantum', name:L('IBM Quantum Learning','IBM Quantum Learning'), slogan:L('免费的量子计算教程与实验平台','Free quantum computing course + hands-on lab'), desc:L('从量子门到 Qiskit 编程 · 真实量子硬件 · Grover / Shor 算法','From gates to Qiskit · real quantum hardware · Grover/Shor algorithms'), logo:favicon('quantum.ibm.com'), url:'https://learning.quantum.ibm.com', brand:'#0F62FE', price:'Free', rating:4.7, views:2340, featured:true, trending:true, readTime:'20 min', difficulty:'Advanced', cover:'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80', tags:L(['量子','Qiskit','课程'],['Quantum','Qiskit','Course']) },
  { slug:'react-docs', super:'knowledge', sub:'Web', name:L('React 官方文档','React Official Docs'), slogan:L('全新交互式的 React 学习平台','The reimagined interactive React docs'), desc:L('从 Hooks 到 Server Components · 大量可运行示例 · 现代最佳实践','Hooks to Server Components · runnable examples · modern best practices'), logo:favicon('react.dev'), url:'https://react.dev', brand:'#61DAFB', price:'Free', rating:4.9, views:6820, editors:true, readTime:'10 min', difficulty:'Intermediate', cover:'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', tags:L(['React','前端','文档'],['React','Frontend','Docs']) },
  { slug:'k8s-docs', super:'knowledge', sub:'DevOps', name:L('Kubernetes 官方文档','Kubernetes Docs'), slogan:L('容器编排的官方教程与参考','Official K8s tutorials and reference'), desc:L('从概念到生产 · YAML 示例丰富 · 中文完整翻译','From concepts to production · YAML examples · full Chinese translation'), logo:favicon('kubernetes.io'), url:'https://kubernetes.io/docs', brand:'#326CE5', price:'Free', rating:4.6, views:3410, readTime:'15 min+', difficulty:'Intermediate', cover:'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80', tags:L(['K8s','DevOps','云原生'],['K8s','DevOps','Cloud']) },
  { slug:'webdev', super:'knowledge', sub:'Web', name:L('web.dev','web.dev'), slogan:L('Google 出品的现代 Web 指南','Google\'s modern web guides'), desc:L('性能 / 无障碍 / SEO / Core Web Vitals 深度文章','Performance / a11y / SEO / Core Web Vitals in-depth articles'), logo:favicon('web.dev'), url:'https://web.dev', brand:'#4285F4', price:'Free', rating:4.7, views:2890, readTime:'8 min', difficulty:'Intermediate', cover:'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80', tags:L(['Web','性能','SEO'],['Web','Perf','SEO']) },

  // RESOURCES
  { slug:'public-apis', super:'resources', sub:'API', name:L('Public APIs','Public APIs'), slogan:L('免费公开 API 的巨型索引','Massive index of free public APIs'), desc:L('数百个 API 按分类整理 · 认证方式清晰','Hundreds categorized · auth type labeled'), logo:favicon('github.com'), url:'https://github.com/public-apis/public-apis', brand:'#0284c7', price:'Free', rating:4.6, views:6320, editors:true, github_stars:320000, tags:L(['API','开发','清单'],['API','Dev','List']) },
  { slug:'awesome-selfhosted', super:'resources', sub:'SelfHosted', name:L('Awesome Self-Hosted','Awesome Self-Hosted'), slogan:L('自托管应用的巨型合集','Huge list of self-hostable open-source apps'), desc:L('数千个开源自托管应用 · 按功能分类 · 许可证明确','Thousands of self-hostable apps · categorized · licenses labeled'), logo:favicon('github.com'), url:'https://github.com/awesome-selfhosted/awesome-selfhosted', brand:'#22c55e', price:'Free', rating:4.7, views:4210, editors:true, trending:true, github_stars:200000, tags:L(['自托管','开源','清单'],['Self-hosted','OSS','List']) },
  { slug:'huggingface-datasets', super:'resources', sub:'AI', name:L('HuggingFace Datasets','HuggingFace Datasets'), slogan:L('机器学习数据集的中央枢纽','The hub for ML datasets'), desc:L('10 万+ 数据集 · 一行代码加载 · 涵盖 NLP/CV/音频','100k+ datasets · one-line loading · NLP/CV/audio'), logo:favicon('huggingface.co'), url:'https://huggingface.co/datasets', brand:'#FF9D00', price:'Free', rating:4.8, views:5120, github_stars:20000, tags:L(['数据集','AI','ML'],['Datasets','AI','ML']) },
  { slug:'free-programming-books', super:'resources', sub:'Learning', name:L('Free Programming Books','Free Programming Books'), slogan:L('免费编程电子书的集合仓库','Collection of free programming books'), desc:L('数千本免费书籍 · 多语言 · 按语言/主题分类','Thousands of free books · multilingual · organized by language/topic'), logo:favicon('github.com'), url:'https://github.com/EbookFoundation/free-programming-books', brand:'#F97316', price:'Free', rating:4.9, views:3210, github_stars:340000, tags:L(['电子书','编程','免费'],['Books','Coding','Free']) },
  { slug:'github-trending', super:'resources', sub:'Community', name:L('GitHub Trending','GitHub Trending'), slogan:L('GitHub 每日热门项目','GitHub\'s daily trending repos'), desc:L('每日/每周热门 · 按语言过滤 · 发现新兴项目','Daily/weekly trending · filter by language · discover new projects'), logo:favicon('github.com'), url:'https://github.com/trending', brand:'#000000', price:'Free', rating:4.5, views:8920, tags:L(['GitHub','热门','发现'],['GitHub','Trending','Discovery']) },
  { slug:'awesome-lists', super:'resources', sub:'Community', name:L('Awesome Lists','Awesome Lists'), slogan:L('awesome-* 主题清单的总目录','The meta-list of all awesome-* lists'), desc:L('几乎每个技术领域都有一个 awesome list · 社区精选','Every tech topic has an awesome list · community curated'), logo:favicon('github.com'), url:'https://github.com/sindresorhus/awesome', brand:'#EF4444', price:'Free', rating:4.8, views:4630, github_stars:340000, tags:L(['清单','导航','社区'],['Lists','Directory','Community']) },

  // RECOMMENDATIONS (affiliate/paid)
  { slug:'mullvad-vpn', super:'recommendations', sub:'VPN', name:L('Mullvad VPN','Mullvad VPN'), slogan:L('把匿名做到极致的隐私网络','No-account privacy-first VPN'), desc:L('无需邮箱注册 · 固定 €5/月 · 隐私政策清晰可查 · 支持加密货币','No email needed · flat €5/month · clear privacy policy · crypto payments'), logo:favicon('mullvad.net'), url:'https://mullvad.net', brand:'#FFCD00', price:'Paid', rating:4.7, views:2140, editors:true, reason:L('隐私爱好者的黄金标准 · 无日志经过独立审计','Gold standard for privacy · no-logs verified by third-party audit'), tags:L(['VPN','隐私','匿名'],['VPN','Privacy','Anonymous']) },
  { slug:'hetzner-cloud', super:'recommendations', sub:'Cloud', name:L('Hetzner Cloud','Hetzner Cloud'), slogan:L('性价比极高的欧洲云主机','Best-value European cloud hosting'), desc:L('€4.5 起 · 同价位配置远超 AWS · 适合自建服务与小型项目','From €4.5 · 3x compute per euro vs AWS · perfect for indie/self-hosted'), logo:favicon('hetzner.com'), url:'https://www.hetzner.com/cloud', brand:'#D50C2D', price:'Paid', rating:4.6, views:3210, trending:true, discount:L('新用户 €20 试用金','€20 signup credit'), reason:L('小项目部署首选 · 性价比无对手','Best value for indie deployments · unbeatable'), tags:L(['云主机','欧洲','高性价比'],['VPS','EU','Value']) },
  { slug:'fathom-analytics', super:'recommendations', sub:'Analytics', name:L('Fathom Analytics','Fathom Analytics'), slogan:L('无 Cookie 的隐私友好分析','Cookie-free privacy-first analytics'), desc:L('符合 GDPR · 脚本体积极小 · Dashboard 简洁一目了然','GDPR compliant · tiny script · dashboard that just shows what matters'), logo:favicon('usefathom.com'), url:'https://usefathom.com', brand:'#7B1FA2', price:'Paid', rating:4.5, views:1820, reason:L('Google Analytics 的伦理替代品','The ethical alternative to Google Analytics'), tags:L(['分析','隐私','无Cookie'],['Analytics','Privacy','NoCookie']) },
  { slug:'setapp', super:'recommendations', sub:'macOS', name:L('Setapp','Setapp'), slogan:L('一份订阅解锁数百款 Mac 软件','One subscription, hundreds of Mac apps'), desc:L('$9.99/月覆盖 CleanMyMac / Bartender / Ulysses 等付费 App · 自动更新','$9.99/mo covers CleanMyMac, Bartender, Ulysses & more · auto-updates'), logo:favicon('setapp.com'), url:'https://setapp.com', brand:'#F65E7C', price:'Paid', rating:4.3, views:2340, discount:L('7 天免费试用','7-day free trial'), reason:L('每月省下几百美元的软件购买费','Save hundreds of dollars/year on Mac apps'), tags:L(['Mac','订阅','软件'],['Mac','Subscription','Software']) },
  { slug:'vercel', super:'recommendations', sub:'Hosting', name:L('Vercel Pro','Vercel Pro'), slogan:L('前端部署与边缘计算的行业标杆','The frontend deployment standard'), desc:L('$20/月 · 边缘函数 · 分析 · 无缝集成 Next.js / Nuxt','$20/mo · Edge Functions · Analytics · seamless Next.js/Nuxt'), logo:favicon('vercel.com'), url:'https://vercel.com', brand:'#000000', price:'Freemium', rating:4.7, views:5210, editors:true, reason:L('Next.js 应用最佳部署方式 · DX 无出其右','Best way to deploy Next.js · unmatched DX'), tags:L(['部署','边缘','前端'],['Deploy','Edge','Frontend']) },
  { slug:'cloudflare-pro', super:'recommendations', sub:'Network', name:L('Cloudflare Pro','Cloudflare Pro'), slogan:L('全球最大的 CDN 与安全网络','World\'s largest CDN and security network'), desc:L('$20/月 · WAF · Argo 智能路由 · Workers 边缘计算','$20/mo · WAF · Argo smart routing · Workers edge compute'), logo:favicon('cloudflare.com'), url:'https://www.cloudflare.com/plans/pro', brand:'#F38020', price:'Freemium', rating:4.6, views:4830, reason:L('免费版已足够,Pro 版加速与安全再上一层','Free is amazing, Pro takes speed and security further'), tags:L(['CDN','安全','WAF'],['CDN','Security','WAF']) },
]

async function main() {
  console.log('Wiping data...')
  await sb.from('resources').delete().gte('id', '00000000-0000-0000-0000-000000000000')
  await sb.from('categories').delete().gte('id', '00000000-0000-0000-0000-000000000000')

  console.log('Inserting 4 super categories...')
  const { data: cats } = await sb.from('categories').insert(superCategories).select()
  const catMap = Object.fromEntries((cats || []).map(c => [c.slug, c.id]))

  console.log(`Inserting ${items.length} items...`)
  for (const it of items) {
    const { error } = await sb.from('resources').insert({
      slug: it.slug,
      name: it.name, slogan: it.slogan, description: it.desc,
      logo_url: it.logo, website_url: it.url, brand_color: it.brand,
      category_id: catMap[it.super],
      super_category: it.super, subcategory: it.sub,
      price_type: it.price, rating: it.rating, view_count: it.views,
      featured: !!it.featured, editors_pick: !!it.editors, trending: !!it.trending,
      read_time: it.readTime, difficulty: it.difficulty,
      cover_image: it.cover, github_stars: it.github_stars,
      platforms: it.platforms ? { list: it.platforms } : null,
      discount: it.discount ? JSON.stringify(it.discount) : null,
      recommendation_reason: it.reason,
      highlights: it.tags,
      use_cases: it.tags,
    })
    if (error) console.error(`  ✗ ${it.slug}: ${error.message}`)
    else console.log(`  ✓ ${it.slug}`)
  }
  console.log('\n✅ Reseed complete')
}
main().catch(e => { console.error(e); process.exit(1) })
