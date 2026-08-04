// Seed 6 demo resources with full 4-language content
// Run: node scripts/seed.mjs
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '..', '.env')
const envRaw = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envRaw.split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => {
    const i = l.indexOf('=')
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const L = (zh, en, ja, ko) => ({ zh, en, ja, ko })

const categories = [
  { slug: 'ai',           name: L('AI', 'AI', 'AI', 'AI'), color: '#a855f7', icon: 'Sparkles', sort_order: 1 },
  { slug: 'dev',          name: L('开发', 'Development', '開発', '개발'), color: '#3b82f6', icon: 'Code2', sort_order: 2 },
  { slug: 'network',      name: L('网络', 'Network', 'ネットワーク', '네트워크'), color: '#10b981', icon: 'Globe', sort_order: 3 },
  { slug: 'learning',     name: L('学习', 'Learning', '学習', '학습'), color: '#f97316', icon: 'GraduationCap', sort_order: 4 },
  { slug: 'productivity', name: L('效率', 'Productivity', '効率', '효율'), color: '#06b6d4', icon: 'Zap', sort_order: 5 },
]

const resources = [
  {
    slug: 'claude',
    category: 'ai',
    brand_color: '#D97757',
    logo_url: 'https://claude.ai/favicon.ico',
    website_url: 'https://claude.ai',
    name: L('Claude', 'Claude', 'Claude', 'Claude'),
    slogan: L(
      'Anthropic 出品的对话式 AI 助手,以安全和思考深度见长',
      'Anthropic\'s conversational AI, known for safety and deep reasoning',
      'Anthropic の会話型 AI、安全性と深い思考で知られる',
      'Anthropic의 대화형 AI, 안전성과 깊이 있는 사고로 유명'
    ),
    description: L(
      'Claude 是 Anthropic 打造的下一代 AI 助手,凭借 200K 上下文窗口、精准的长文处理能力和宪法 AI 训练方法,在写作、编程、分析任务中表现卓越。它擅长遵循复杂指令,并在保持诚实与无害之间取得平衡。',
      'Claude is Anthropic\'s next-generation AI assistant. With a 200K context window, precise long-document handling, and Constitutional AI training, it excels at writing, coding, and analytical tasks while balancing helpfulness with honesty.',
      'Claude は Anthropic が開発した次世代 AI アシスタント。200K のコンテキストウィンドウ、正確な長文処理、憲法 AI トレーニングを備え、ライティング、コーディング、分析タスクで優れた性能を発揮します。',
      'Claude는 Anthropic이 개발한 차세대 AI 어시스턴트입니다. 200K 컨텍스트 창, 정밀한 장문 처리, 헌법 AI 훈련을 통해 글쓰기, 코딩, 분석 작업에서 뛰어난 성능을 발휘합니다.'
    ),
    use_cases: L(
      ['长文档摘要与分析', '代码审查与重构', '技术文档写作', '合同/论文精读'],
      ['Long document summarization', 'Code review and refactoring', 'Technical writing', 'Contract/paper analysis'],
      ['長文書の要約と分析', 'コードレビューとリファクタリング', '技術文書作成', '契約書・論文の精読'],
      ['긴 문서 요약 및 분석', '코드 리뷰 및 리팩토링', '기술 문서 작성', '계약서/논문 정독']
    ),
    highlights: L(
      ['200K token 超长上下文', '强大的推理链能力', '内置 Artifacts 交互式创作', '文件/图片多模态输入'],
      ['200K token context window', 'Advanced reasoning chains', 'Built-in Artifacts for interactive creation', 'File and image multimodal input'],
      ['200K トークンのコンテキスト', '高度な推論能力', 'Artifacts でインタラクティブ制作', 'ファイル・画像のマルチモーダル入力'],
      ['200K 토큰 컨텍스트 창', '고급 추론 능력', 'Artifacts 대화형 창작 기능', '파일/이미지 멀티모달 입력']
    ),
    trending: true, editors_pick: true, featured: true, rating: 4.8, view_count: 12840,
    info_grid: [
      { icon: 'Brain', label: L('模型', 'Model', 'モデル', '모델'), value: L('Claude 3.5 Sonnet', 'Claude 3.5 Sonnet', 'Claude 3.5 Sonnet', 'Claude 3.5 Sonnet') },
      { icon: 'Zap', label: L('能力', 'Capability', '能力', '기능'), value: L('文本 · 代码 · 视觉', 'Text · Code · Vision', 'テキスト・コード・視覚', '텍스트·코드·비전') },
      { icon: 'FileInput', label: L('输入', 'Input', '入力', '입력'), value: L('文字 / 图片 / PDF', 'Text / Image / PDF', 'テキスト/画像/PDF', '텍스트/이미지/PDF') },
      { icon: 'FileOutput', label: L('输出', 'Output', '出力', '출력'), value: L('文字 · Artifacts', 'Text · Artifacts', 'テキスト・Artifacts', '텍스트·Artifacts') },
      { icon: 'DollarSign', label: L('定价', 'Pricing', '料金', '가격'), value: L('免费 / $20 起', 'Free / from $20', '無料 / $20〜', '무료 / $20부터') },
      { icon: 'Monitor', label: L('平台', 'Platform', 'プラットフォーム', '플랫폼'), value: L('Web · iOS · API', 'Web · iOS · API', 'Web · iOS · API', 'Web · iOS · API') },
    ],
    pros: [
      L('长上下文表现业界领先', 'Industry-leading long context performance', '長文脈処理性能が業界トップ', '장문 컨텍스트 처리 성능 업계 최고'),
      L('回答严谨,少一本正经胡说', 'Careful reasoning, less hallucination', '厳密な推論で幻覚が少ない', '엄밀한 추론으로 환각 감소'),
      L('Artifacts 让创作可交互', 'Artifacts enable interactive creation', 'Artifacts で対話的な作成が可能', 'Artifacts로 대화형 창작 가능'),
      L('中日韩多语言表现优秀', 'Excellent CJK language support', '中日韓の多言語対応が優秀', '중일한 다국어 지원 우수'),
    ],
    cons: [
      L('部分地区无法直接访问', 'Not directly available in some regions', '一部地域から直接アクセス不可', '일부 지역에서 직접 접근 불가'),
      L('免费版消息数量有限', 'Limited free tier messages', '無料版のメッセージ数に制限', '무료 버전 메시지 수 제한'),
      L('图片生成能力尚未支持', 'No image generation yet', '画像生成には未対応', '이미지 생성 미지원'),
    ],
    pricing: [
      { name: L('免费版', 'Free', '無料', '무료'), price: '$0', period: L('/月', '/mo', '/月', '/월'), features: [L('每日有限对话', 'Limited daily messages', '毎日限定メッセージ', '일일 제한 메시지'), L('Claude 3.5 Sonnet 访问', 'Claude 3.5 Sonnet access', 'Claude 3.5 Sonnet 利用可', 'Claude 3.5 Sonnet 이용')], sort_order: 1 },
      { name: L('Pro', 'Pro', 'Pro', 'Pro'), price: '$20', period: L('/月', '/mo', '/月', '/월'), features: [L('对话次数 5x', '5x more messages', 'メッセージ 5倍', '메시지 5배'), L('优先访问', 'Priority access', '優先アクセス', '우선 접근'), L('Projects & Artifacts', 'Projects & Artifacts', 'Projects & Artifacts', 'Projects & Artifacts')], highlighted: true, sort_order: 2 },
      { name: L('Team', 'Team', 'Team', 'Team'), price: '$25', period: L('/席/月', '/seat/mo', '/席/月', '/석/월'), features: [L('团队协作', 'Team collaboration', 'チームコラボ', '팀 협업'), L('中央账单', 'Central billing', '一括請求', '중앙 결제')], sort_order: 3 },
      { name: L('API', 'API', 'API', 'API'), price: '$3/$15', period: L('/M 输入/输出 tokens', '/M in/out tokens', '/M in/out tokens', '/M in/out 토큰'), features: [L('按量计费', 'Pay as you go', '従量課金', '사용량 기반')], sort_order: 4 },
    ],
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80', caption: L('Claude 对话界面', 'Claude chat interface', 'Claude チャット画面', 'Claude 채팅 인터페이스'), sort_order: 1 },
      { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80', caption: L('Artifacts 交互式创作', 'Artifacts interactive creation', 'Artifacts インタラクティブ', 'Artifacts 대화형 창작'), sort_order: 2 },
    ],
    alt_slugs: ['chatgpt'],
  },
  {
    slug: 'chatgpt',
    category: 'ai',
    brand_color: '#10A37F',
    logo_url: 'https://openai.com/favicon.ico',
    website_url: 'https://chat.openai.com',
    name: L('ChatGPT', 'ChatGPT', 'ChatGPT', 'ChatGPT'),
    slogan: L(
      'OpenAI 出品的全能对话式 AI,生态最完整',
      'OpenAI\'s all-around conversational AI with the richest ecosystem',
      'OpenAI の万能会話 AI、最も完成されたエコシステム',
      'OpenAI의 만능 대화형 AI, 가장 풍부한 생태계'
    ),
    description: L(
      'ChatGPT 是最广为人知的 AI 助手,基于 GPT-4o 与 o1 系列模型,提供多模态输入输出、代码解释器、DALL·E 图像生成、GPTs 自定义机器人、庞大插件生态,是 AI 生产力工具的事实标准。',
      'ChatGPT is the most widely-used AI assistant, powered by GPT-4o and o1 models. It offers multimodal I/O, code interpreter, DALL·E image generation, custom GPTs, and a huge plugin ecosystem—the de-facto standard for AI productivity.',
      'ChatGPT は最も広く使われている AI アシスタント。GPT-4o と o1 を搭載し、マルチモーダル、Code Interpreter、DALL·E 画像生成、カスタム GPTs、豊富なプラグイン生態を提供します。',
      'ChatGPT는 가장 널리 사용되는 AI 어시스턴트로, GPT-4o와 o1 모델 기반입니다. 멀티모달 입출력, Code Interpreter, DALL·E 이미지 생성, 커스텀 GPTs, 방대한 플러그인 생태계를 제공합니다.'
    ),
    use_cases: L(
      ['日常问答与写作', '编程助手', '图像生成', '数据分析与图表'],
      ['Everyday Q&A and writing', 'Coding assistant', 'Image generation', 'Data analysis and charts'],
      ['日常 Q&A とライティング', 'プログラミング支援', '画像生成', 'データ分析とグラフ'],
      ['일상 질문답변 및 글쓰기', '프로그래밍 도우미', '이미지 생성', '데이터 분석 및 차트']
    ),
    highlights: L(
      ['GPT-4o 多模态', 'o1 深度推理', '海量 GPTs 商店', 'Code Interpreter'],
      ['GPT-4o multimodal', 'o1 deep reasoning', 'Massive GPT Store', 'Code Interpreter'],
      ['GPT-4o マルチモーダル', 'o1 深い推論', '巨大な GPT ストア', 'Code Interpreter'],
      ['GPT-4o 멀티모달', 'o1 심층 추론', '방대한 GPT 스토어', 'Code Interpreter']
    ),
    trending: true, editors_pick: true, featured: true, rating: 4.7, view_count: 25620,
    info_grid: [
      { icon: 'Brain', label: L('模型', 'Model', 'モデル', '모델'), value: L('GPT-4o · o1', 'GPT-4o · o1', 'GPT-4o · o1', 'GPT-4o · o1') },
      { icon: 'Zap', label: L('能力', 'Capability', '能力', '기능'), value: L('文本 · 图像 · 语音', 'Text · Image · Voice', 'テキスト・画像・音声', '텍스트·이미지·음성') },
      { icon: 'FileInput', label: L('输入', 'Input', '入力', '입력'), value: L('文字 / 图片 / 音频 / PDF', 'Text / Image / Audio / PDF', 'テキスト/画像/音声/PDF', '텍스트/이미지/오디오/PDF') },
      { icon: 'FileOutput', label: L('输出', 'Output', '出力', '출력'), value: L('文字 · 图像 · 语音', 'Text · Image · Voice', 'テキスト・画像・音声', '텍스트·이미지·음성') },
      { icon: 'DollarSign', label: L('定价', 'Pricing', '料金', '가격'), value: L('免费 / $20 起', 'Free / from $20', '無料 / $20〜', '무료 / $20부터') },
      { icon: 'Monitor', label: L('平台', 'Platform', 'プラットフォーム', '플랫폼'), value: L('Web · iOS · Android · API', 'Web · iOS · Android · API', 'Web · iOS · Android · API', 'Web · iOS · Android · API') },
    ],
    pros: [
      L('生态最完整,插件与 GPTs 丰富', 'Richest ecosystem, plugins & custom GPTs', '最も充実したエコシステム', '가장 풍부한 생태계'),
      L('多模态一站式(图像+语音)', 'One-stop multimodal (image + voice)', 'マルチモーダルをワンストップで', '멀티모달 원스톱'),
      L('全球用户量最大', 'Largest global user base', '世界最大のユーザー数', '전 세계 최대 사용자 기반'),
    ],
    cons: [
      L('长文表现不如 Claude', 'Long-context inferior to Claude', '長文脈は Claude に劣る', '장문 처리는 Claude보다 약함'),
      L('创造性写作偏保守', 'Conservative in creative writing', 'クリエイティブ表現が保守的', '창의적 글쓰기 다소 보수적'),
    ],
    pricing: [
      { name: L('免费版', 'Free', '無料', '무료'), price: '$0', period: L('/月', '/mo', '/月', '/월'), features: [L('GPT-4o mini 无限', 'GPT-4o mini unlimited', 'GPT-4o mini 無制限', 'GPT-4o mini 무제한'), L('每日少量 GPT-4o', 'Limited GPT-4o daily', '毎日少量の GPT-4o', '일일 GPT-4o 제한')], sort_order: 1 },
      { name: L('Plus', 'Plus', 'Plus', 'Plus'), price: '$20', period: L('/月', '/mo', '/月', '/월'), features: [L('GPT-4o + o1 更多次数', 'More GPT-4o + o1', 'GPT-4o + o1 増量', 'GPT-4o + o1 증가'), L('DALL·E 图像生成', 'DALL·E images', 'DALL·E 画像生成', 'DALL·E 이미지 생성')], highlighted: true, sort_order: 2 },
      { name: L('Team', 'Team', 'Team', 'Team'), price: '$25', period: L('/席/月', '/seat/mo', '/席/月', '/석/월'), features: [L('团队工作区', 'Team workspace', 'チームワークスペース', '팀 작업 공간')], sort_order: 3 },
      { name: L('API', 'API', 'API', 'API'), price: '$2.5/$10', period: L('/M 输入/输出', '/M in/out', '/M in/out', '/M in/out'), features: [L('按量计费', 'Pay as you go', '従量課金', '사용량 기반')], sort_order: 4 },
    ],
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1600&q=80', caption: L('ChatGPT 主界面', 'ChatGPT interface', 'ChatGPT 画面', 'ChatGPT 인터페이스'), sort_order: 1 },
      { url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80', caption: L('DALL·E 图像生成', 'DALL·E image generation', 'DALL·E 画像生成', 'DALL·E 이미지 생성'), sort_order: 2 },
    ],
    alt_slugs: ['claude'],
  },
  {
    slug: 'mdn',
    category: 'dev',
    brand_color: '#000000',
    logo_url: 'https://developer.mozilla.org/favicon-48x48.png',
    website_url: 'https://developer.mozilla.org',
    name: L('MDN Web Docs', 'MDN Web Docs', 'MDN Web Docs', 'MDN Web Docs'),
    slogan: L(
      'Web 开发者的圣经级文档,Mozilla 官方维护',
      'The bible of web development docs, maintained by Mozilla',
      'Web 開発者の聖書、Mozilla 公式',
      '웹 개발자의 성경, Mozilla 공식 문서'
    ),
    description: L(
      'MDN Web Docs 是最权威的 Web 平台参考文档,涵盖 HTML、CSS、JavaScript、Web API、HTTP、可访问性等全部内容。示例丰富、浏览器兼容性表格清晰,是每个前端与全栈开发者最信赖的技术资料。',
      'MDN Web Docs is the most authoritative reference for the Web platform, covering HTML, CSS, JavaScript, Web APIs, HTTP, accessibility, and more. Rich examples and clear browser compatibility tables make it every developer\'s trusted resource.',
      'MDN Web Docs は Web プラットフォームで最も権威ある参考資料。HTML、CSS、JavaScript、Web API、HTTP、アクセシビリティを網羅し、豊富な例と明確なブラウザ互換性表が特徴。',
      'MDN Web Docs는 웹 플랫폼의 가장 권위 있는 참조 문서로 HTML, CSS, JavaScript, Web API, HTTP, 접근성 등을 포괄합니다. 풍부한 예제와 명확한 브라우저 호환성 표가 특징입니다.'
    ),
    use_cases: L(['查 API 语法', '学 CSS 新特性', '看浏览器兼容性', '入门教程'], ['Look up API syntax', 'Learn new CSS', 'Check browser compat', 'Beginner tutorials'], ['API 構文の確認', '新 CSS の学習', 'ブラウザ互換性', '入門チュートリアル'], ['API 문법 확인', '새 CSS 학습', '브라우저 호환성', '입문 튜토리얼']),
    highlights: L(['权威准确', '浏览器兼容性表', 'BCD 数据开源', '多语言版本'], ['Authoritative', 'Browser compat tables', 'BCD data open-source', 'Multi-language'], ['権威と正確性', 'ブラウザ互換性表', 'BCD データオープンソース', '多言語対応'], ['권위 있고 정확', '브라우저 호환성 표', 'BCD 데이터 오픈소스', '다국어 지원']),
    trending: false, editors_pick: true, featured: true, rating: 4.9, view_count: 8730,
    info_grid: [
      { icon: 'BookOpen', label: L('类型', 'Type', 'タイプ', '유형'), value: L('文档 / 参考', 'Docs / Reference', 'ドキュメント/参考', '문서/참조') },
      { icon: 'Tag', label: L('主题', 'Topics', 'トピック', '주제'), value: L('HTML · CSS · JS · Web API', 'HTML · CSS · JS · Web API', 'HTML · CSS · JS · Web API', 'HTML · CSS · JS · Web API') },
      { icon: 'DollarSign', label: L('定价', 'Pricing', '料金', '가격'), value: L('完全免费', 'Free', '完全無料', '완전 무료') },
      { icon: 'Languages', label: L('语言', 'Language', '言語', '언어'), value: L('中/英/日/多语', 'zh/en/ja/multi', '中/英/日/多言語', '중/영/일/다국어') },
    ],
    pros: [L('权威可信', 'Authoritative', '権威性', '권위성'), L('示例丰富', 'Rich examples', '豊富な例', '풍부한 예제'), L('完全免费开源', 'Free & open-source', '無料オープンソース', '무료 오픈소스')],
    cons: [L('中文翻译滞后', 'Chinese translation lags', '中国語翻訳が遅い', '중국어 번역 지연'), L('搜索有时不够精准', 'Search sometimes imprecise', '検索精度に難あり', '검색 정확도 부족 때때로')],
    pricing: [{ name: L('免费', 'Free', '無料', '무료'), price: '$0', period: L('永久', 'forever', '永久', '영구'), features: [L('全部功能免费', 'All free', 'すべて無料', '모두 무료')], highlighted: true, sort_order: 1 }],
    screenshots: [{ url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1600&q=80', caption: L('MDN 文档界面', 'MDN docs interface', 'MDN ドキュメント画面', 'MDN 문서 인터페이스'), sort_order: 1 }],
    alt_slugs: ['public-apis'],
  },
  {
    slug: 'public-apis',
    category: 'dev',
    brand_color: '#0284c7',
    logo_url: 'https://github.com/favicon.ico',
    website_url: 'https://github.com/public-apis/public-apis',
    name: L('Public APIs', 'Public APIs', 'Public APIs', 'Public APIs'),
    slogan: L('免费公开 API 的巨型索引', 'A massive index of free public APIs', '無料公開 API の巨大インデックス', '무료 공개 API의 거대한 인덱스'),
    description: L(
      '一个由社区维护的 GitHub 仓库,收录了数百个免费、公开可用的 API,按分类整理:动画、金融、地理、天气、电影、AI/ML 等。是构建 side project 与教学项目的宝藏地图。',
      'A community-maintained GitHub repo that catalogs hundreds of free, publicly available APIs organized by category: animals, finance, geo, weather, movies, AI/ML and more. A treasure map for side projects.',
      'コミュニティで維持される GitHub リポジトリで、無料の公開 API を数百件カテゴリ別に整理。動物、金融、地理、天気、映画、AI/ML など。',
      '커뮤니티가 관리하는 GitHub 저장소로 무료 공개 API 수백 개를 카테고리별로 정리합니다. 동물, 금융, 지리, 날씨, 영화, AI/ML 등.'
    ),
    use_cases: L(['side project 数据源', '学习 REST', '快速 demo', '教学素材'], ['Side project data', 'Learn REST', 'Quick demo', 'Teaching material'], ['サイドプロジェクト', 'REST 学習', 'クイックデモ', '教材'], ['사이드 프로젝트', 'REST 학습', '빠른 데모', '교재']),
    highlights: L(['数百个免费 API', '按分类清晰整理', '完全开源', '认证方式标注'], ['Hundreds of free APIs', 'Well organized', 'Open source', 'Auth type labeled'], ['数百の無料 API', 'カテゴリ別整理', 'オープンソース', '認証タイプ表記'], ['수백 개 무료 API', '카테고리별 정리', '오픈 소스', '인증 유형 표시']),
    editors_pick: true, rating: 4.6, view_count: 6320,
    info_grid: [
      { icon: 'Github', label: L('形式', 'Format', '形式', '형식'), value: L('GitHub 仓库', 'GitHub repo', 'GitHub リポジトリ', 'GitHub 저장소') },
      { icon: 'Star', label: L('Stars', 'Stars', 'Stars', 'Stars'), value: L('320k+', '320k+', '320k+', '320k+') },
      { icon: 'DollarSign', label: L('定价', 'Pricing', '料金', '가격'), value: L('免费', 'Free', '無料', '무료') },
    ],
    pros: [L('宝库级 API 汇总', 'Treasure trove of APIs', '宝の山', '보물창고 수준 API 목록'), L('社区活跃维护', 'Actively maintained', 'アクティブに維持', '활발한 유지 관리')],
    cons: [L('部分 API 可能失效', 'Some APIs may be deprecated', '一部 API が失効', '일부 API 만료 가능'), L('查询体验偏简陋', 'Search UX is basic', '検索 UX は簡素', '검색 경험 기본적')],
    pricing: [{ name: L('免费', 'Free', '無料', '무료'), price: '$0', period: L('永久', 'forever', '永久', '영구'), features: [L('全部内容免费', 'All free', '完全無料', '전체 무료')], highlighted: true, sort_order: 1 }],
    screenshots: [{ url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&q=80', caption: L('API 分类列表', 'API category list', 'API カテゴリ一覧', 'API 카테고리 목록'), sort_order: 1 }],
    alt_slugs: ['mdn'],
  },
  {
    slug: 'awesome-selfhosted',
    category: 'network',
    brand_color: '#22c55e',
    logo_url: 'https://raw.githubusercontent.com/awesome-selfhosted/awesome-selfhosted/master/logo.svg',
    website_url: 'https://awesome-selfhosted.net',
    name: L('Awesome Self-Hosted', 'Awesome Self-Hosted', 'Awesome Self-Hosted', 'Awesome Self-Hosted'),
    slogan: L('自托管应用与开源软件的巨型合集', 'A huge list of self-hosted apps and open source software', 'セルフホストアプリの巨大コレクション', '자체 호스팅 앱의 거대한 컬렉션'),
    description: L(
      '收录数千个可以自托管的开源应用,包括生产力、协作、笔记、密码管理、媒体服务器、监控、CI/CD 等,是搭建私有云与摆脱大厂依赖的必备清单。',
      'Catalogs thousands of self-hostable open-source apps across productivity, collaboration, notes, password managers, media servers, monitoring, CI/CD, and more. Essential for anyone building a private cloud.',
      '数千のセルフホスト可能なオープンソースアプリを網羅。生産性、コラボ、ノート、パスワード管理、メディアサーバー、監視、CI/CD など。',
      '수천 개의 자체 호스팅 가능한 오픈소스 앱을 수록. 생산성, 협업, 노트, 비밀번호 관리, 미디어 서버, 모니터링, CI/CD 등.'
    ),
    use_cases: L(['搭建私有云', '替代 SaaS', '构建 homelab', '开源选型'], ['Build private cloud', 'SaaS alternatives', 'Homelab', 'Open-source picks'], ['プライベートクラウド構築', 'SaaS 代替', 'Homelab', 'OSS 選定'], ['개인 클라우드 구축', 'SaaS 대체', 'Homelab', 'OSS 선정']),
    highlights: L(['数千个应用', '按功能分类', '许可证明确', '社区维护'], ['Thousands of apps', 'Categorized', 'Licenses labeled', 'Community-driven'], ['数千のアプリ', 'カテゴリ整理', 'ライセンス明記', 'コミュニティ運営'], ['수천 개 앱', '카테고리 분류', '라이선스 표기', '커뮤니티 운영']),
    trending: true, editors_pick: true, rating: 4.7, view_count: 4210,
    info_grid: [
      { icon: 'Server', label: L('类型', 'Type', 'タイプ', '유형'), value: L('自托管索引', 'Self-hosted index', 'セルフホスト索引', '자체 호스팅 색인') },
      { icon: 'Github', label: L('平台', 'Platform', 'プラットフォーム', '플랫폼'), value: L('GitHub · Web', 'GitHub · Web', 'GitHub · Web', 'GitHub · Web') },
      { icon: 'DollarSign', label: L('定价', 'Pricing', '料金', '가격'), value: L('免费', 'Free', '無料', '무료') },
    ],
    pros: [L('无所不包', 'Comprehensive', '網羅的', '포괄적'), L('明确许可证', 'Clear licensing', 'ライセンス明確', '라이선스 명확')],
    cons: [L('新手需要动手能力', 'Requires technical skills', '技術力が必要', '기술 능력 필요')],
    pricing: [{ name: L('免费', 'Free', '無料', '무료'), price: '$0', period: L('永久', 'forever', '永久', '영구'), features: [L('全部内容免费', 'All free', '完全無料', '전체 무료')], highlighted: true, sort_order: 1 }],
    screenshots: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80', caption: L('自托管应用清单', 'Self-hosted list', 'セルフホスト一覧', '자체 호스팅 목록'), sort_order: 1 }],
    alt_slugs: [],
  },
  {
    slug: 'papers-with-code',
    category: 'learning',
    brand_color: '#21CBCA',
    logo_url: 'https://paperswithcode.com/favicon.ico',
    website_url: 'https://paperswithcode.com',
    name: L('Papers with Code', 'Papers with Code', 'Papers with Code', 'Papers with Code'),
    slogan: L('机器学习论文 + 官方开源实现', 'ML papers + official open-source implementations', 'ML 論文 + 公式実装', 'ML 논문 + 공식 오픈소스 구현'),
    description: L(
      '把机器学习论文和它的开源实现关联在一起,并维护 SOTA 排行榜。适合追前沿、复现实验、选模型、找 baseline 的研究者和工程师。',
      'Links ML papers to their open-source implementations and maintains SOTA leaderboards. Perfect for researchers and engineers chasing the frontier, reproducing experiments, or picking baselines.',
      'ML 論文とそのオープンソース実装を紐付け、SOTA リーダーボードを維持。最先端追跡、実験再現、モデル選定に最適。',
      'ML 논문과 오픈소스 구현을 연결하고 SOTA 리더보드를 유지 관리. 최전선 추적, 실험 재현, 모델 선정에 이상적.'
    ),
    use_cases: L(['查 SOTA', '找论文实现', '选 baseline', '追前沿'], ['Check SOTA', 'Find implementations', 'Pick baselines', 'Track frontier'], ['SOTA 確認', '実装検索', 'ベースライン選定', '最先端追跡'], ['SOTA 확인', '구현 찾기', '베이스라인 선정', '최전선 추적']),
    highlights: L(['SOTA 排行榜', '论文-代码联动', '数据集索引', '完全免费'], ['SOTA leaderboards', 'Paper-code linked', 'Dataset index', 'Free'], ['SOTA ランキング', '論文-コード連携', 'データセット索引', '無料'], ['SOTA 순위', '논문-코드 연동', '데이터셋 색인', '무료']),
    editors_pick: true, rating: 4.8, view_count: 3980,
    info_grid: [
      { icon: 'BookOpen', label: L('类型', 'Type', 'タイプ', '유형'), value: L('论文与代码索引', 'Paper & code index', '論文・コード索引', '논문·코드 색인') },
      { icon: 'Trophy', label: L('特色', 'Feature', '特徴', '특징'), value: L('SOTA 排行榜', 'SOTA leaderboards', 'SOTA ランキング', 'SOTA 순위') },
      { icon: 'DollarSign', label: L('定价', 'Pricing', '料金', '가격'), value: L('免费', 'Free', '無料', '무료') },
    ],
    pros: [L('论文与代码一站式', 'Paper + code in one place', '論文とコードを一括で', '논문과 코드 원스톱'), L('SOTA 数据可信', 'Trustworthy SOTA data', 'SOTA データが信頼できる', 'SOTA 데이터 신뢰성')],
    cons: [L('部分领域更新滞后', 'Some fields update slowly', '一部分野の更新が遅い', '일부 분야 업데이트 지연')],
    pricing: [{ name: L('免费', 'Free', '無料', '무료'), price: '$0', period: L('永久', 'forever', '永久', '영구'), features: [L('全部免费开放', 'All open', '完全無料', '전체 무료')], highlighted: true, sort_order: 1 }],
    screenshots: [{ url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80', caption: L('Papers with Code 主页', 'PwC homepage', 'PwC トップ', 'PwC 홈'), sort_order: 1 }],
    alt_slugs: [],
  },
]

async function main() {
  console.log('Wiping existing seed data...')
  // Note: cascading deletes handle child tables
  await supabase.from('alternatives').delete().gte('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('resources').delete().gte('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('categories').delete().gte('id', '00000000-0000-0000-0000-000000000000')

  console.log('Inserting categories...')
  const { data: catRows, error: catErr } = await supabase.from('categories').insert(categories).select()
  if (catErr) { console.error(catErr); process.exit(1) }
  const catMap = Object.fromEntries(catRows.map(c => [c.slug, c.id]))
  console.log(`  ${catRows.length} categories inserted`)

  console.log('Inserting resources...')
  const resourceIdMap = {}
  for (const r of resources) {
    const { data: row, error } = await supabase.from('resources').insert({
      slug: r.slug,
      name: r.name,
      slogan: r.slogan,
      description: r.description,
      logo_url: r.logo_url,
      website_url: r.website_url,
      brand_color: r.brand_color,
      category_id: catMap[r.category],
      trending: !!r.trending,
      editors_pick: !!r.editors_pick,
      featured: !!r.featured,
      rating: r.rating,
      view_count: r.view_count,
      use_cases: r.use_cases,
      highlights: r.highlights,
    }).select().single()
    if (error) { console.error(error); process.exit(1) }
    resourceIdMap[r.slug] = row.id

    // info grid
    if (r.info_grid?.length) {
      const rows = r.info_grid.map((g, i) => ({ ...g, resource_id: row.id, sort_order: i + 1 }))
      await supabase.from('info_grid').insert(rows)
    }
    // pros/cons
    const pcRows = []
    ;(r.pros || []).forEach((p, i) => pcRows.push({ resource_id: row.id, type: 'pro', content: p, sort_order: i + 1 }))
    ;(r.cons || []).forEach((c, i) => pcRows.push({ resource_id: row.id, type: 'con', content: c, sort_order: i + 1 }))
    if (pcRows.length) await supabase.from('pros_cons').insert(pcRows)
    // pricing
    if (r.pricing?.length) {
      const rows = r.pricing.map(p => ({ resource_id: row.id, name: p.name, price: p.price, price_period: p.period, features: p.features, highlighted: !!p.highlighted, sort_order: p.sort_order }))
      await supabase.from('pricing_plans').insert(rows)
    }
    // screenshots
    if (r.screenshots?.length) {
      const rows = r.screenshots.map(s => ({ resource_id: row.id, url: s.url, caption: s.caption, sort_order: s.sort_order }))
      await supabase.from('screenshots').insert(rows)
    }
    console.log(`  ✓ ${r.slug}`)
  }

  // alternatives (needs both ids)
  console.log('Linking alternatives...')
  for (const r of resources) {
    for (const altSlug of (r.alt_slugs || [])) {
      if (resourceIdMap[altSlug]) {
        await supabase.from('alternatives').insert({
          resource_id: resourceIdMap[r.slug],
          alt_resource_id: resourceIdMap[altSlug],
        })
      }
    }
  }

  console.log('Seed complete!')
}
main().catch(e => { console.error(e); process.exit(1) })
