/* ============================================================
   Trilingual content dictionary (RU / EN / ZH).
   Mirrored shape. All visible strings live here.
   Source of truth: SCENARIO_V2.md (Section 7 copy table).
   ============================================================ */

window.SITE_CONTENT = {
  /* --------------------------------------------------------- RU */
  ru: {
    meta: {
      lang: "ru",
      ogLocale: "ru_RU",
      title:
        "Степан Турченко - внедрение ИИ, Senior Fullstack и Tech Lead",
      description:
        "Специалист по внедрению ИИ, Senior Fullstack инженер и Tech Lead. Внедряю ИИ в реальные процессы компаний и отвечаю за инженерию, которая держит продукты в продакшене в США, Великобритании и России.",
      skipLink: "Перейти к содержимому",
    },
    nav: {
      wordmark: "Степан Турченко",
      links: [
        { id: "work", label: "Работы" },
        { id: "approach", label: "Подход" },
        { id: "stack", label: "Стек" },
        { id: "about", label: "Обо мне" },
      ],
      cta: "Связаться",
      menuOpen: "Открыть меню",
      menuClose: "Закрыть меню",
    },
    hero: {
      eyebrow: "Внедрение ИИ · Senior Fullstack · Tech Lead",
      headlineBefore: "Внедряю ИИ в ",
      headlineAccent: "реальный",
      headlineAfter: " бизнес и отвечаю за инженерию за ним.",
      subtext:
        "Более 6 лет строю и поддерживаю продакшен-продукты в США, Великобритании и России.",
      ctaPrimary: "Смотреть работы",
      ctaSecondary: "Связаться",
    },
    proof: {
      leadBefore: "Реальная ",
      leadAccent: "работа",
      leadAfter: ", а не красивые цифры.",
      items: [
        { lead: "В продакшене 6+ лет", qualifier: "выпущено и работает, не демо" },
        { lead: "США · Великобритания · Россия", qualifier: "продукты на трёх рынках" },
        { lead: "Основатель Nana800", qualifier: "моя собственная платформа автоматизации" },
        { lead: "От стартапов до госмасштаба", qualifier: "включая городское спорт-приложение мэрии Москвы" },
      ],
    },
    approach: {
      index: "Внедрение ИИ",
      headlineBefore: "Привожу хаотичный ИИ к ",
      headlineAccent: "единой",
      headlineAfter: " системе в процессах компании.",
      lead: "Помогаю компаниям перейти от разрозненных промптов к общей среде, где агенты, контекст, правила и навыки переиспользуются всей командой.",
      ladder: {
        title: "Пять уровней зрелости ИИ",
        caption: "Чем выше уровень, тем меньше хаоса и тем больше общего. Веду компании вверх по этой шкале.",
        levels: [
          { label: "ИИ не используется" },
          { label: "Только чат: спросить в окне" },
          { label: "Агенты, но хаотично: каждый сам по себе" },
          { label: "Агенты плюс обмен тем, что работает" },
          { label: "Единая среда: общие агенты, контекст, правила, форматы и навыки" },
        ],
      },
      examples: {
        title: "Было вручную, стало с агентом",
        caption: "Реальные навыки, которые я собрал и встроил в рабочие процессы.",
        items: [
          { area: "Проджект", before: "Вручную читать тред в Slack, выбирать исполнителя и заводить задачу.", after: "Агент читает тред, выбирает исполнителя, находит доску и колонку, создаёт задачу и возвращает ссылку." },
          { area: "Финансы", before: "Вручную собирать чеки, сверять доходы и сводить таблицу.", after: "Агент собирает чеки и списания, сверяет доходы, строит таблицу и по расписанию публикует в Slack." },
          { area: "QA", before: "Вручную проходить фичу по инструкции и писать баг-репорт.", after: "Агент тестирует фичу по инструкции, двигает задачу по колонкам, пишет баг-репорт и спрашивает версию, если её нет." },
          { area: "Аналитика", before: "Вручную выгружать цифры из всех источников и искать, что изменилось.", after: "Агент собирает сырые цифры из всех источников, находит рост и спад, строит график с короткими выводами и по расписанию публикует в Slack." },
        ],
      },
      pillars: {
        title: "На чём держится этот переход",
        items: [
          { title: "Общая память (gbrain)", body: "Личная и командная база знаний как общая память между сессиями и людьми: проекты, плейбуки и заметки дают всему парку агентов один источник контекста." },
          { title: "Автоматизация процессов", body: "Агенты по расписанию сами собирают отчёты и кладут их в Slack без человека, а память копится между сессиями, так что контекст не вводится заново. Главный агент делегирует субагентам, каждый работает в изолированном контексте и возвращает результат." },
          { title: "Единый слой ИИ", body: "Навык - это способность, описанная текстом, написанная один раз и переиспользуемая вместо переписывания того же промпта. Общие и расширяемые навыки, общий контекст, правила и форматы превращают разрозненный ИИ в повторяемые процессы компании." },
        ],
      },
    },
    cases: {
      index: "Работы",
      sectionTitle: "Избранные работы",
      headline: "Продукты, которые я построил и масштабировал.",
      items: [
        {
          title: "Painta",
          role: "Лид AI-продукта, fullstack (команда из 2)",
          oneline:
            "AI-коуч по рисованию целиком: приложение на React Native, backend на Supabase, платежи и N8N-автоматизации, живой и растёт.",
          tags: ["AI Product", "React Native", "Supabase"],
        },
        {
          title: "Aspect Health",
          role: "Fullstack и управление командой (команда из 5)",
          oneline:
            "Платформа women-health с AI-приложением: три года владел тремя тяжёлыми сервисами на Node.js и GCP и вёл QA на всю компанию.",
          tags: ["Node.js", "Nest.js", "GCP", "QA"],
        },
        {
          title: "Nana800",
          role: "Основатель и технический лид",
          oneline:
            "Мой low-code продукт: визуальные сценарии, интеграции и AI-блоки превращают идеи в рабочие автоматизированные процессы.",
          tags: ["Founder", "Low-code", "AI"],
        },
        {
          title: "Московский спорт",
          role: "Тех-лид, мобильное и QA",
          oneline:
            "Спорт-приложение мэрии Москвы: возглавил команду из пяти, взял проект и довёл до стабильного опубликованного релиза.",
          tags: ["Gov", "Mobile", "Tech Lead"],
        },
      ],
    },
    work: {
      index: "Ещё",
      headline: "Что ещё я выпускал.",
      lead: "Сайты, приложения и платформы в ритейле, здоровье, спорте и B2B.",
      items: [
        { title: "Bigam", role: "Мобильный инженер и тех-лид", oneline: "Retail-приложение сети строительных магазинов: каталог, фильтры, доставка, оплата в приложении и при получении, персональные цены и интеграции с 1С, выпущено в стор.", tags: ["Retail", "Mobile", "1C"] },
        { title: "Small", role: "Мобильный инженер (тех-команда из 3)", oneline: "Приложение супермаркета без касс: покупки без очередей через сканирование QR и штрихкодов и оплату в приложении картой, Google Pay или Apple Pay.", tags: ["Retail", "Payments"] },
        { title: "Liverpool", role: "Мобильный лид и тимлид", oneline: "Приложение доставки еды для сети ресторанов: меню, заказы, оплата Сбер и картой и трекинг доставки в реальном времени через веб-сокеты.", tags: ["Delivery", "WebSockets"] },
        { title: "Bismap", role: "Backend и мобильное (один разработчик)", oneline: "B2B-приложение для тендеров: регистрация бизнеса, заявки и весь backend, передано заказчику в самостоятельное управление.", tags: ["B2B", "Backend"] },
        { title: "Stayfit", role: "Senior fullstack (React Native, Node.js)", oneline: "Корпоративное wellbeing-приложение: спорт-челленджи, онлайн-консультации, обучающий контент и соревнования команд.", tags: ["Wellbeing", "Fullstack"] },
        { title: "GroupQ", role: "Мобильный инженер и backend", oneline: "Приложение лояльности для АЗС: бонусы, акции, цены на топливо, маршруты, интеграции с Yandex API и 1С.", tags: ["Loyalty", "Maps"] },
        { title: "Ageeva Stom", role: "Веб (сайт клиники)", oneline: "Сайт частной стоматологии в Калининграде: доверие, услуги, запись и маршрут.", tags: ["Web", "Clinic"] },
        { title: "Solnechnaya Arka", role: "Веб (каталог)", oneline: "Витрина теплиц и садовых конструкций: каталог, преимущества, доставка и заявки.", tags: ["Web", "Catalog"] },
        { title: "ProFitness", role: "Веб (лендинг сети)", oneline: "Сайт сети фитнес-клубов на четыре локации: услуги и первый контакт с клиентом.", tags: ["Web", "Landing"] },
      ],
      credential: {
        badge: "Хакатон",
        text: "11 место на чемпионате России по программированию, 2022. За 48 часов собрал с командой рабочий продукт для Газпромбанка.",
      },
    },
    stack: {
      index: "Стек",
      headline: "На чём я строю.",
      clusters: [
        { title: "ИИ и автоматизация", emphasis: true, chips: ["Claude Code", "AI Agents", "Prompt Engineering", "N8N", "Cursor", "AI workflow automation"] },
        { title: "Фронтенд и мобильное", chips: ["React", "React Native", "TypeScript", "Zustand", "Expo"] },
        { title: "Backend и данные", chips: ["Node.js", "Nest.js", "PostgreSQL", "Supabase", "Redis", "RabbitMQ", "Microservices"] },
        { title: "DevOps и облако", chips: ["Docker", "CI/CD", "Google Cloud", "AWS", "Grafana", "Loki", "Nginx", "Traefik"] },
      ],
      cert: "Сертификаты W3 по TypeScript и React.",
    },
    about: {
      index: "О себе",
      headline: "Обо мне",
      body: "Более 6 лет работаю над тяжёлыми приложениями и командами вокруг них: от women-health стартапа в Делавэре до ритейл- и B2B-продуктов в России и agentic-мобильной разработки в Великобритании. Веду всё целиком: архитектуру, релизы, DevOps, найм и ту работу по надёжности, без которой продукт не держит реальную нагрузку. Провожу собеседования, переговоры и релизы на английском, одинаково спокойно беру и весь роадмап, и одну сложную задачу. Сейчас большая часть внимания уходит на внедрение ИИ-агентов и автоматизации в реальную работу компаний.",
      facts: "База - Калининград, Россия. Английский свободный, русский родной. Доступен для полной удалённой занятости.",
    },
    photos: {
      kicker: "Человек за работами",
      caption: "Степан Турченко",
    },
    contact: {
      index: "Контакт",
      headlineBefore: "Расскажите, что вы ",
      headlineAccent: "строите",
      headlineAfter: ".",
      subline: "Внедрение ИИ, продукт для запуска или команда, которой нужен лид.",
      cta: "Связаться",
      emailLabel: "Почта",
      phoneLabel: "Телефон",
    },
    footer: {
      name: "Степан Турченко · 2026",
      backToTop: "Наверх",
    },
  },

  /* --------------------------------------------------------- EN */
  en: {
    meta: {
      lang: "en",
      ogLocale: "en_US",
      title: "Stepan Turchenko - AI Integration Specialist & Senior Fullstack",
      description:
        "AI Integration Specialist, Senior Fullstack engineer and Tech Lead. I bring AI into real business processes and own the engineering that keeps products running in production across the US, UK and Russia.",
      skipLink: "Skip to content",
    },
    nav: {
      wordmark: "Stepan Turchenko",
      links: [
        { id: "work", label: "Work" },
        { id: "approach", label: "Approach" },
        { id: "stack", label: "Stack" },
        { id: "about", label: "About" },
      ],
      cta: "Get in touch",
      menuOpen: "Open menu",
      menuClose: "Close menu",
    },
    hero: {
      eyebrow: "AI Integration · Senior Fullstack · Tech Lead",
      headlineBefore: "I put AI to work inside ",
      headlineAccent: "real",
      headlineAfter: " businesses, and ship the engineering behind it.",
      subtext:
        "More than six years building and running production products across the US, UK and Russia.",
      ctaPrimary: "See selected work",
      ctaSecondary: "Get in touch",
    },
    proof: {
      leadBefore: "Real ",
      leadAccent: "work",
      leadAfter: ", not vanity numbers.",
      items: [
        { lead: "In production for 6+ years", qualifier: "shipped and kept running, not demos" },
        { lead: "USA · UK · Russia", qualifier: "products across three markets" },
        { lead: "Founder, Nana800", qualifier: "my own automation platform" },
        { lead: "From startups to state scale", qualifier: "including a city-scale Moscow government sport app" },
      ],
    },
    approach: {
      index: "AI integration",
      headlineBefore: "I turn chaotic AI into one ",
      headlineAccent: "unified",
      headlineAfter: " system across a company's processes.",
      lead: "I move companies from scattered prompts to a shared environment where agents, context, rules, and skills are reused by the whole team.",
      ladder: {
        title: "Five levels of AI maturity",
        caption: "The higher the level, the less chaos and the more is shared. I move companies up this scale.",
        levels: [
          { label: "Not using AI" },
          { label: "Chat only: ask in a window" },
          { label: "Agents, but chaotic: everyone on their own" },
          { label: "Agents plus sharing what works" },
          { label: "A unified environment: shared agents, context, rules, formats, and skills" },
        ],
      },
      examples: {
        title: "Manual before, with an agent now",
        caption: "Real skills I built and wired into working processes.",
        items: [
          { area: "PM", before: "Manually read a Slack thread, pick the assignee, and open a task.", after: "An agent reads the thread, picks the assignee, finds the board and column, creates the task, and posts the link back." },
          { area: "Finance", before: "Manually collect receipts, reconcile income, and assemble the table.", after: "An agent collects receipts and charges, reconciles income, builds the table, and posts to Slack on a schedule." },
          { area: "QA", before: "Manually walk a feature through its instructions and write the bug report.", after: "An agent tests the feature by the instructions, moves the task across columns, writes the bug report, and asks for the version if it is missing." },
          { area: "Analytics", before: "Manually pull numbers from every source and hunt for what changed.", after: "An agent pulls raw numbers from all sources, finds what went up and down, builds a chart with a short takeaway, and posts to Slack on a schedule." },
        ],
      },
      pillars: {
        title: "What carries this shift",
        items: [
          { title: "Shared memory (gbrain)", body: "A personal and shared knowledge base as memory across sessions and people: projects, playbooks, and notes give the whole fleet of agents one source of context." },
          { title: "Process automation", body: "Scheduled agents assemble reports and drop them in Slack with no human, and memory accumulates across sessions so context is never re-entered. A main agent delegates to subagents, each working in isolated context and returning a result." },
          { title: "A unified AI layer", body: "A skill is a capability described in text, written once and reused instead of rewriting the same prompt. Shared, extendable skills plus shared context, rules, and formats turn ad-hoc AI into repeatable company processes." },
        ],
      },
    },
    cases: {
      index: "Work",
      sectionTitle: "Selected work",
      headline: "Products I built and scaled.",
      items: [
        {
          title: "Painta",
          role: "AI product lead, fullstack (team of 2)",
          oneline:
            "An AI art coach end to end: React Native app, Supabase backend, payments, and N8N automations, live and growing.",
          tags: ["AI Product", "React Native", "Supabase"],
        },
        {
          title: "Aspect Health",
          role: "Fullstack and team management (team of 5)",
          oneline:
            "A women-health platform with an AI app: three years owning three heavy services on Node.js and GCP, plus company-wide QA.",
          tags: ["Node.js", "Nest.js", "GCP", "QA"],
        },
        {
          title: "Nana800",
          role: "Founder and technical lead",
          oneline:
            "My own low-code product: visual scenarios, integrations, and AI blocks turn ideas into working automated processes.",
          tags: ["Founder", "Low-code", "AI"],
        },
        {
          title: "Moscow Sport",
          role: "Tech lead, mobile and QA",
          oneline:
            "The Moscow government sport app: I led a team of five, took it over, and shipped it to a stable, published release.",
          tags: ["Gov", "Mobile", "Tech Lead"],
        },
      ],
    },
    work: {
      index: "More",
      headline: "More things I have shipped.",
      lead: "Sites, apps, and platforms across retail, health, sport, and B2B.",
      items: [
        { title: "Bigam", role: "Mobile engineer and tech lead", oneline: "A hardware-store chain retail app: catalog, filters, delivery, in-app and on-delivery payment, personalized pricing, and 1C integrations, shipped to store.", tags: ["Retail", "Mobile", "1C"] },
        { title: "Small", role: "Mobile engineer (tech team of 3)", oneline: "A cashier-free supermarket app: shop without checkout lines via QR and barcode scanning and in-app payment by card, Google Pay, or Apple Pay.", tags: ["Retail", "Payments"] },
        { title: "Liverpool", role: "Mobile lead and team lead", oneline: "A food-delivery app for a restaurant chain: menu, ordering, Sber and card payments, and real-time delivery tracking over web sockets.", tags: ["Delivery", "WebSockets"] },
        { title: "Bismap", role: "Backend and mobile (solo developer)", oneline: "A B2B tenders app: business registration, applications, and the full backend, then handed to the client to run.", tags: ["B2B", "Backend"] },
        { title: "Stayfit", role: "Senior fullstack (React Native, Node.js)", oneline: "A corporate wellbeing app: sport challenges, online consultations, training content, and team competition.", tags: ["Wellbeing", "Fullstack"] },
        { title: "GroupQ", role: "Mobile engineer and backend", oneline: "A fuel-station loyalty app: bonuses, promos, fuel prices, route maps, Yandex API and 1C integrations.", tags: ["Loyalty", "Maps"] },
        { title: "Ageeva Stom", role: "Web (clinic site)", oneline: "A private dental clinic site in Kaliningrad: trust, services, booking, and directions.", tags: ["Web", "Clinic"] },
        { title: "Solnechnaya Arka", role: "Web (catalog store)", oneline: "A greenhouse and garden-structures storefront: catalog, benefits, delivery, and leads.", tags: ["Web", "Catalog"] },
        { title: "ProFitness", role: "Web (chain landing)", oneline: "A fitness-chain site across four locations: services and first client contact.", tags: ["Web", "Landing"] },
      ],
      credential: {
        badge: "Hackathon",
        text: "11th place in the All-Russia programming championship, 2022. Built a working product for Gazprombank in 48 hours with a team.",
      },
    },
    stack: {
      index: "Stack",
      headline: "What I build with.",
      clusters: [
        { title: "AI & Automation", emphasis: true, chips: ["Claude Code", "AI Agents", "Prompt Engineering", "N8N", "Cursor", "AI workflow automation"] },
        { title: "Frontend & Mobile", chips: ["React", "React Native", "TypeScript", "Zustand", "Expo"] },
        { title: "Backend & Data", chips: ["Node.js", "Nest.js", "PostgreSQL", "Supabase", "Redis", "RabbitMQ", "Microservices"] },
        { title: "DevOps & Cloud", chips: ["Docker", "CI/CD", "Google Cloud", "AWS", "Grafana", "Loki", "Nginx", "Traefik"] },
      ],
      cert: "W3-certified in TypeScript and React.",
    },
    about: {
      index: "About",
      headline: "About",
      body: "More than six years on heavy applications and the teams behind them, from a women-health startup in Delaware to retail and B2B products in Russia and agentic mobile work in the UK. I run things end to end: architecture, delivery, DevOps, hiring, and the reliability work that keeps a product up under real load. I interview, negotiate, and ship in English, and I am as comfortable owning a roadmap as I am taking on a single hard problem. Right now most of my attention goes to bringing AI agents and automation into how companies actually operate.",
      facts: "Based in Kaliningrad, Russia. English proficient, Russian native. Available for full-time remote.",
    },
    photos: {
      kicker: "The person behind the work",
      caption: "Stepan Turchenko",
    },
    contact: {
      index: "Contact",
      headlineBefore: "Let me know what you are ",
      headlineAccent: "building",
      headlineAfter: ".",
      subline: "AI integration, a product to ship, or an engineering team to lead.",
      cta: "Get in touch",
      emailLabel: "Email",
      phoneLabel: "Phone",
    },
    footer: {
      name: "Stepan Turchenko · 2026",
      backToTop: "Back to top",
    },
  },

  /* --------------------------------------------------------- ZH */
  zh: {
    meta: {
      lang: "zh",
      ogLocale: "zh_CN",
      title: "斯捷潘·图尔琴科 - AI 集成专家 / 高级全栈工程师 / 技术负责人",
      description:
        "AI 集成专家、高级全栈工程师与技术负责人。我把 AI 落地到企业真实的业务流程中，并负责支撑产品在美国、英国和俄罗斯稳定运行的整套工程。",
      skipLink: "跳到内容",
    },
    nav: {
      wordmark: "斯捷潘·图尔琴科",
      links: [
        { id: "work", label: "作品" },
        { id: "approach", label: "方法" },
        { id: "stack", label: "技术栈" },
        { id: "about", label: "关于" },
      ],
      cta: "联系我",
      menuOpen: "打开菜单",
      menuClose: "关闭菜单",
    },
    hero: {
      eyebrow: "AI 集成 · 高级全栈 · 技术负责人",
      headlineBefore: "把 AI ",
      headlineAccent: "真正",
      headlineAfter: "用进企业的业务里，并交付支撑它的整套工程。",
      subtext: "六年多在美国、英国和俄罗斯打造并运维生产环境中的产品。",
      ctaPrimary: "查看作品",
      ctaSecondary: "联系我",
    },
    proof: {
      leadBefore: "真实的",
      leadAccent: "成果",
      leadAfter: "，不是漂亮的数字。",
      items: [
        { lead: "投入生产 6 年以上", qualifier: "已上线并持续运行，不是演示" },
        { lead: "美国 · 英国 · 俄罗斯", qualifier: "横跨三个市场的产品" },
        { lead: "Nana800 创始人", qualifier: "我自己的自动化平台" },
        { lead: "从初创到政府级规模", qualifier: "包括为莫斯科市政府打造的城市级体育应用" },
      ],
    },
    approach: {
      index: "AI 集成",
      headlineBefore: "我把混乱的 AI 收敛成贯穿企业流程的",
      headlineAccent: "统一",
      headlineAfter: "系统。",
      lead: "我帮助企业从零散的提示词，走向一个共享的环境：智能体、上下文、规则和技能由整个团队复用。",
      ladder: {
        title: "AI 成熟度的五个层级",
        caption: "层级越高，混乱越少、共享越多。我带企业沿这条标尺往上走。",
        levels: [
          { label: "尚未使用 AI" },
          { label: "仅用聊天：在窗口里提问" },
          { label: "用上了智能体，但很混乱：各做各的" },
          { label: "智能体加上对有效做法的共享" },
          { label: "统一环境：共享的智能体、上下文、规则、格式与技能" },
        ],
      },
      examples: {
        title: "以前靠手动，现在交给智能体",
        caption: "这些都是我构建并接入实际流程的真实技能。",
        items: [
          { area: "项目管理", before: "手动阅读 Slack 讨论串，挑选负责人并创建任务。", after: "智能体阅读讨论串，挑选负责人，找到看板和列，创建任务并把链接发回。" },
          { area: "财务", before: "手动收集票据、核对收入并汇总表格。", after: "智能体收集票据与扣款，核对收入，生成表格，并按计划发布到 Slack。" },
          { area: "QA", before: "手动按说明走查功能并撰写缺陷报告。", after: "智能体按说明测试功能，在各列之间移动任务，撰写缺陷报告，缺少版本时主动询问。" },
          { area: "数据分析", before: "手动从各个来源导出数字，逐一排查变化。", after: "智能体从所有来源拉取原始数字，找出涨跌，生成带简短结论的图表，并按计划发布到 Slack。" },
        ],
      },
      pillars: {
        title: "支撑这次转变的根基",
        items: [
          { title: "共享记忆 (gbrain)", body: "一个个人与团队共用的知识库，作为跨会话、跨成员的共享记忆：项目、操作手册与笔记，让整支智能体队伍拥有同一份上下文来源。" },
          { title: "流程自动化", body: "按计划运行的智能体自行汇总报告并发布到 Slack，无需人工；记忆在会话之间不断累积，上下文无需重新输入。主智能体把任务委派给子智能体，每个子智能体在隔离的上下文中工作并返回结果。" },
          { title: "统一的 AI 层", body: "技能是用文字描述的一种能力，只写一次便可复用，无需每次重写相同的提示词。共享且可扩展的技能，加上共享的上下文、规则与格式，把临时拼凑的 AI 变成可重复的企业流程。" },
        ],
      },
    },
    cases: {
      index: "作品",
      sectionTitle: "精选作品",
      headline: "我打造并扩展过的产品。",
      items: [
        {
          title: "Painta",
          role: "AI 产品负责人，全栈（2 人团队）",
          oneline: "一款端到端打造的 AI 绘画教练：React Native 应用、Supabase 后端、支付与 N8N 自动化，已上线并持续增长。",
          tags: ["AI Product", "React Native", "Supabase"],
        },
        {
          title: "Aspect Health",
          role: "全栈与团队管理（5 人团队）",
          oneline: "一个带 AI 应用的女性健康平台：三年间端到端负责三个基于 Node.js 与 GCP 的高负载服务，并建立全公司 QA。",
          tags: ["Node.js", "Nest.js", "GCP", "QA"],
        },
        {
          title: "Nana800",
          role: "创始人兼技术负责人",
          oneline: "我自己的低代码产品：可视化场景、集成与 AI 模块，把想法变成可运行的自动化流程。",
          tags: ["Founder", "Low-code", "AI"],
        },
        {
          title: "莫斯科体育",
          role: "技术负责人、移动端与 QA",
          oneline: "莫斯科市政府的体育应用：我带领五人团队接手项目，并将它交付到稳定的正式发布版本。",
          tags: ["Gov", "Mobile", "Tech Lead"],
        },
      ],
    },
    work: {
      index: "更多",
      headline: "我还交付过的一些产品。",
      lead: "涵盖零售、健康、体育与 B2B 的网站、应用和平台。",
      items: [
        { title: "Bigam", role: "移动工程师兼技术负责人", oneline: "一款建材连锁零售应用：商品目录、筛选、配送、应用内与货到付款、个性化定价以及 1C 集成，已上架商店。", tags: ["Retail", "Mobile", "1C"] },
        { title: "Small", role: "移动工程师（3 人技术团队）", oneline: "一款无收银台超市应用：通过扫描二维码和条形码免排队购物，并支持应用内银行卡、Google Pay 或 Apple Pay 支付。", tags: ["Retail", "Payments"] },
        { title: "Liverpool", role: "移动端负责人兼团队负责人", oneline: "一款连锁餐厅的外卖应用：菜单、下单、Sber 与银行卡支付，以及基于 WebSocket 的实时配送追踪。", tags: ["Delivery", "WebSockets"] },
        { title: "Bismap", role: "后端与移动端（独立开发）", oneline: "一款 B2B 招投标应用：企业注册、投标申请以及完整后端，随后交付给客户自主运营。", tags: ["B2B", "Backend"] },
        { title: "Stayfit", role: "高级全栈 (React Native, Node.js)", oneline: "一款企业健康应用：运动挑战、在线咨询、训练内容与团队竞赛。", tags: ["Wellbeing", "Fullstack"] },
        { title: "GroupQ", role: "移动工程师与后端", oneline: "一款加油站会员应用：积分、促销、油价、路线地图，以及 Yandex API 与 1C 集成。", tags: ["Loyalty", "Maps"] },
        { title: "Ageeva Stom", role: "网站（诊所）", oneline: "加里宁格勒一家私立牙科诊所的网站：信任感、服务项目、预约与导航。", tags: ["Web", "Clinic"] },
        { title: "Solnechnaya Arka", role: "网站（商品目录）", oneline: "一个温室与花园结构的展示商店：商品目录、优势、配送与销售线索。", tags: ["Web", "Catalog"] },
        { title: "ProFitness", role: "网站（连锁落地页）", oneline: "一个覆盖四个门店的连锁健身网站：服务介绍与客户首次联系。", tags: ["Web", "Landing"] },
      ],
      credential: {
        badge: "黑客松",
        text: "2022 年全俄编程锦标赛第 11 名。48 小时内与团队为 Gazprombank 做出了一个可用的产品。",
      },
    },
    stack: {
      index: "技术栈",
      headline: "我用什么来构建。",
      clusters: [
        { title: "AI 与自动化", emphasis: true, chips: ["Claude Code", "AI Agents", "Prompt Engineering", "N8N", "Cursor", "AI workflow automation"] },
        { title: "前端与移动端", chips: ["React", "React Native", "TypeScript", "Zustand", "Expo"] },
        { title: "后端与数据", chips: ["Node.js", "Nest.js", "PostgreSQL", "Supabase", "Redis", "RabbitMQ", "Microservices"] },
        { title: "DevOps 与云", chips: ["Docker", "CI/CD", "Google Cloud", "AWS", "Grafana", "Loki", "Nginx", "Traefik"] },
      ],
      cert: "持有 W3 的 TypeScript 与 React 认证。",
    },
    about: {
      index: "关于",
      headline: "关于",
      body: "六年多专注于高负载应用以及支撑它们的团队，从特拉华州的一家女性健康初创公司，到俄罗斯的零售与 B2B 产品，再到英国的智能体移动端开发。我端到端地掌控一切：架构、交付、DevOps、招聘，以及让产品在真实负载下不宕机的可靠性工作。我用英语进行面试、谈判和发布，既能独立扛起整条路线图，也能专注解决单个棘手的难题。眼下，我的大部分精力都投入在把 AI 智能体和自动化真正带进企业的日常运转中。",
      facts: "常驻俄罗斯加里宁格勒。英语流利，俄语母语。可全职远程。",
    },
    photos: {
      kicker: "作品背后的人",
      caption: "斯捷潘·图尔琴科",
    },
    contact: {
      index: "联系",
      headlineBefore: "告诉我你在",
      headlineAccent: "打造",
      headlineAfter: "什么。",
      subline: "AI 集成、一个待交付的产品，或一支需要负责人的工程团队。",
      cta: "联系我",
      emailLabel: "邮箱",
      phoneLabel: "电话",
    },
    footer: {
      name: "斯捷潘·图尔琴科 · 2026",
      backToTop: "返回顶部",
    },
  },
};

/* ---- Language-independent data (channels, asset paths) ---- */
window.SITE_STATIC = {
  langs: [
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
    { code: "zh", label: "ZH" },
  ],
  caseShots: {
    Painta: "./assets/project-screenshots/painta.png",
    "Aspect Health": "./assets/project-screenshots/aspect-health.png",
    Nana800: "./assets/project-screenshots/nana800.png",
    "Moscow Sport": "./assets/project-screenshots/mos-sport.png",
    "Московский спорт": "./assets/project-screenshots/mos-sport.png",
    莫斯科体育: "./assets/project-screenshots/mos-sport.png",
  },
  workShots: {
    Bigam: "./assets/project-screenshots/bigam.png",
    Bismap: "./assets/project-screenshots/bismap.png",
    GroupQ: "./assets/project-screenshots/groupq.png",
    Stayfit: "./assets/project-screenshots/stayfit.png",
    "Ageeva Stom": "./assets/project-screenshots/ageeva-stom.png",
    "Solnechnaya Arka": "./assets/project-screenshots/solnechnaya-arka.png",
    ProFitness: "./assets/project-screenshots/profitness.png",
  },
  photos: [
    "./assets/stepan-end-1.png",
    "./assets/stepan-end-2.png",
    "./assets/stepan-end-3.png",
  ],
  channels: [
    { kind: "email", labelKey: "emailLabel", value: "stepanstepan4@gmail.com", href: "mailto:stepanstepan4@gmail.com" },
    { kind: "phone", labelKey: "phoneLabel", value: "+7 962 263 98 09", href: "tel:+79622639809" },
    { kind: "linkedin", label: "LinkedIn", value: "linkedin.com/in/stepanturchenko", href: "https://www.linkedin.com/in/stepanturchenko" },
    { kind: "telegram", label: "Telegram", value: "t.me/Stepan_Turchenko", href: "https://t.me/Stepan_Turchenko" },
    { kind: "instagram", label: "Instagram", value: "@stepan_turchenko", href: "https://www.instagram.com/stepan_turchenko/" },
  ],
};
