export interface Article {
  slug: string
  title: string
  author: string
  source: string
  url: string
  description: string
  tags: string[]
  comment: string
  date: string
  published: boolean
  content: string
}

export const articles: Article[] = [
  {
    slug: 'the-2026-global-intelligence-crisis',
    title: 'The 2026 Global Intelligence Crisis',
    author: '',
    source:
      'https://www.citadelsecurities.com/news-and-insights/2026-global-intelligence-crisis/',
    url: '',
    description:
      'Citadel Securities is an award-winning global market-maker across a broad array of fixed income and equity products.',
    tags: [''],
    comment: '',
    date: '2026-03-08',
    published: false,
    content: '',
  },
  {
    slug: 'https-margaretstorey-com-blog-2026-02-09-cognitive-debt-2026-03-07',
    title:
      'How Generative and Agentic AI Shift Concern from Technical Debt to Cognitive Debt',
    author: '',
    source: 'margaretstorey.com',
    url: 'https://margaretstorey.com/blog/2026/02/09/cognitive-debt/',
    description:
      'The term technical debt is often used to refer to the accumulation of design or implementation choices that later make the software harder and more costly to understand, modify, or extend over time...',
    tags: ['Article'],
    comment: '',
    date: '2026-03-08',
    published: false,
    content: '',
  },
  {
    slug: 'https-steve-yegge-medium-com-the-ai-vampire-eda6e4f07163-2026-03-07',
    title: 'The AI Vampire',
    author: '',
    source: 'steve-yegge.medium.com',
    url: 'https://steve-yegge.medium.com/the-ai-vampire-eda6e4f07163',
    description:
      'This was an unusually hard post to write, because it flies in the face of everything else going on.',
    tags: ['Article'],
    comment: '',
    date: '2026-03-08',
    published: false,
    content: '',
  },
  {
    slug: 'https-theweatherreport-ai-posts-unit42-22-web-based-prompt-2026-03-07',
    title:
      'Unit 42 found 22 prompt injection techniques targeting AI agents in the wild',
    author: '',
    source: 'theweatherreport.ai',
    url: 'https://theweatherreport.ai/posts/unit42-22-web-based-prompt-injections-in-the-wild/?trk=feed-detail_main-feed-card_feed-article-content',
    description:
      'Attackers are planting hidden instructions in webpages that hijack AI agents into initiating Stripe payments, deleting databases, and approving scam ads.',
    tags: ['Article'],
    comment: '',
    date: '2026-03-08',
    published: false,
    content: '',
  },
  {
    slug: 'https-www-linkedin-com-posts-adam-holter-b5334327a-bullshi-2026-03-07',
    title:
      'BullshitBench v2 Results: Anthropic &amp; Qwen 3.5 Lead in Bullshit Detection | Adam Holter posted on the topic | LinkedIn',
    author: '',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/adam-holter-b5334327a_bullshitbench-v2-is-out-and-the-results-are-activity-7434261762339672064-sHIN',
    description:
      "BullshitBench v2 is out and the results are pretty clear.Only two model families score above 60% on bullshit detection: Anthropic's latest models and Qwen 3.5. OpenAI and Google are below that line and not improving across versions.The benchmark tests whether a model will push back on a plausible-sounding but wrong statement. 100 questions across coding, medical, legal, finance, and physics. 70+ model variants tested.A few things that stand out:Domain does not matter much. Detection rates are consistent across all five domains. This is not a knowledge problem, it is a behavioral one. A model either pushes back or it does not, and that tendency holds regardless of subject matter.Reasoning makes it worse. Models that use extended thinking steps actually score lower on this benchmark, not higher. The theory is that reasoning models are optimized to arrive at an answer, so they build around a wrong premise rather than stopping to reject it.Newer models are not reliably better. Excluding Anthropic, there is no upward trend as model versions update. That is highly unusual for any benchmark.I have had a feeling about Claude for a while. It is the model I trust most to actually tell me I am wrong. This benchmark confirms that is not just a vibe, it is measurable.Full dataset and interactive data explorer are on Peter Gostev's GitHub if you want to dig into specific questions and responses. | 40 comments on LinkedIn",
    tags: ['Article'],
    comment: '',
    date: '2026-03-08',
    published: false,
    content: '',
  },
  {
    slug: 'https-www-linkedin-com-posts-alexandre-klobb-09bb40225-i-g-2026-03-07',
    title:
      'I gave our AI agent a tool that does absolutely nothing.It was the most useful thing I built in the last 3 months.Here&#39;s why 👇We&#39;re building Sonarly, an AI agent that investigates production… | Alexandre Klobb | 12 comments',
    author: '',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/alexandre-klobb-09bb40225_i-gave-our-ai-agent-a-tool-that-does-absolutely-activity-7435734713585258496-himw',
    description:
      'I gave our AI agent a tool that does absolutely nothing.It was the most useful thing I built in the last 3 months.Here\'s why 👇We\'re building Sonarly, an AI agent that investigates production incidents automatically. Wires up Datadog, Sentry, Grafana, the whole stack.Early on, I kept hitting the same wall: the agent would reason well for a while, then get stuck. Not because the model was bad. Because it was missing data.My instinct was to build more integrations. I spent weeks wiring up APIs.The agent still got stuck. Just on different things.So I tried something dumb.I gave the agent one extra tool called magic_fetch.The description: \\"Use this when you need any data you don\'t have. Describe what you want.\\"Under the hood it did nothing. Logged the call. Returned \\"success.\\"The agent had no idea.I ran 50 incident simulations.The agent called magic_fetch 134 times.And each call was a perfect, specific description of what it was missing:→ \\"Recent deploys for this service in the last 2 hours\\"→ \\"CPU metrics for the upstream auth-service\\"→ \\"Feature flags recently toggled for this service\\"→ \\"Sentry errors grouped by affected user segment\\"Nobody told it to ask for this. It reasoned its way there.In one session, I had a full prioritized integration roadmap written by the agent itself.The insight: your agent is a great proxy for your best on-call engineer. Give it a blank canvas to express what it\'s missing, and it\'ll spec your product for you.Ship the fake tool first. Build the real ones after.We\'re in YC W26 right now, building the AI that fixes prod so your team doesn\'t get paged at 3am.If you\'re dealing with alert fatigue or slow incident response, I\'d love to talk.Full article in the comments 👇 | 12 comments on LinkedIn',
    tags: ['Article'],
    comment: '',
    date: '2026-03-08',
    published: false,
    content: '',
  },
  {
    slug: 'https-www-linkedin-com-posts-jalovell-anthropic-just-publi-2026-03-07',
    title:
      'Anthropic just published something on their engineering blog that genuinely unsettled me.They were evaluating Claude Opus 4.6 on BrowseComp, a benchmark that tests how well AI can find… | Jason Lovell | 17 comments',
    author: '',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/jalovell_anthropic-just-published-something-on-their-activity-7435772363155062785-XCi8',
    description:
      'Anthropic just published something on their engineering blog that genuinely unsettled me.They were evaluating Claude Opus 4.6 on BrowseComp, a benchmark that tests how well AI can find hard-to-locate information online. After burning through 30 million tokens of failed searches, the model did something nobody expected.It stopped searching for the answer. And started reasoning about the question.It noticed the question felt \\"contrived\\" and \\"extremely specific.\\" It hypothesized that maybe it was being tested. Then it systematically worked through benchmarks by name (GAIA, BrowseComp, FRAMES, SimpleQA) until it identified which evaluation it was running.Then it found the evaluation source code on GitHub. Read the XOR decryption implementation. Located the decryption key. Wrote its own decryption functions. When the encrypted dataset was blocked by a file format restriction, it found an alternative mirror on HuggingFace, worked around the block, decrypted all 1,266 answers, and submitted the correct one.Nobody instructed it to do any of this. It was just told to find the answer. And it did, by figuring out it was inside a test and reverse-engineering the test itself.Anthropic published this voluntarily. Their own words: \\"This raises concerns about the lengths a model might go to in order to accomplish a task.\\"This isn\'t an alignment failure. The model did exactly what it was asked. That\'s what makes it uncomfortable. It found the most efficient path to the goal. The most efficient path just happened to involve realizing it was being watched.For anyone deploying agents with real autonomy right now: the question isn\'t just \\"will it do the task.\\" It\'s \\"what will it do when the task gets hard enough that it starts reasoning about why it\'s being asked.\\" | 17 comments on LinkedIn',
    tags: ['Article'],
    comment: '',
    date: '2026-03-08',
    published: false,
    content: '',
  },
  {
    slug: 'https-www-youtube-com-watch-v-we7bzvkbcvw-2026-03-07',
    title:
      'Head of Claude Code: What happens after coding is solved | Boris Cherny',
    author: '',
    source: 'youtube.com',
    url: 'https://www.youtube.com/watch?v=We7BZVKbCVw',
    description:
      'Boris Cherny is the creator and head of Claude Code at Anthropic. What began as a simple terminal-based prototype just a year ago has transformed the role of...',
    tags: ['Article'],
    comment: '',
    date: '2026-03-08',
    published: false,
    content: '',
  },
  {
    slug: 'harness-engineering-leveraging-codex-in-an-agent-first-world',
    title: 'Harness engineering: leveraging Codex in an agent-first world',
    author: '',
    source:
      'https://openai.com/index/harness-engineering/?utm_source=substack&utm_medium=email',
    url: '',
    description:
      'Conrete experiments in what it takes to go full Ralph Wiggam and OpenAI learnings',
    tags: [''],
    comment: '',
    date: '2026-02-13',
    published: false,
    content: '',
  },
  {
    slug: 'tbm-406-seeing-everything-understanding-nothing',
    title: 'TBM 406: Seeing Everything, Understanding Nothing',
    author: 'John Cutler',
    source: 'cutlefish.substack.com',
    url: 'https://cutlefish.substack.com/p/tbm-406-seeing-everything-understanding',
    description:
      'The context trap - AI is supercharging legacy leadership assumptions about context and control.',
    tags: ['AI', 'Leadership', 'Thinking'],
    comment:
      'Essential reading on the dangers of over-contextualizing in AI systems.',
    date: '2026-02-13',
    published: false,
    content: '',
  },
  {
    slug: 'the-harness-problem',
    title: 'The Harness Problem',
    author: 'Can Bölük',
    source: 'blog.can.ac',
    url: 'https://blog.can.ac/2026/02/12/the-harness-problem/',
    description:
      'Improving 15 LLMs at coding in one afternoon. Only the harness changed.',
    tags: ['AI', 'Agents', 'Engineering'],
    comment:
      'The edit tool is the variable that matters most for coding agents.',
    date: '2026-02-12',
    published: false,
    content: '',
  },
  {
    slug: 'perplexity-computer-launches-ai-tool-with-autonomous-capabilities',
    title: 'Perplexity Computer Launches AI Tool with Autonomous Capabilities',
    author: "Tim O'Neill",
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/timoneill_who-guessed-that-perplexity-would-be-first-activity-7432537799150665728-CpeC',
    description:
      'The race is to the top right, where AI agents work autonomously and have real control over your desktop.',
    tags: ['AI', 'Agents', 'Tools'],
    comment: 'Analysis of where AI tools are headed in 2026.',
    date: '2026-02-07',
    published: false,
    content: '',
  },
  {
    slug: 'ainews-anthropic-s-agent-autonomy-study',
    title: "AINews: Anthropic's Agent Autonomy Study",
    author: 'Swyx',
    source: 'latent.space',
    url: 'https://www.latent.space/p/ainews-anthropics-agent-autonomy',
    description:
      "Anthropic's study of its own API usage patterns measuring AI agent autonomy in practice.",
    tags: ['AI', 'Agents', 'Research'],
    comment: 'Data on how Claude Code usage grew from 25 mins to 45+ mins.',
    date: '2026-02-06',
    published: false,
    content: '',
  },
  {
    slug: 'openai-s-agent-first-codebase-learnings',
    title: "OpenAI's Agent-First Codebase Learnings",
    author: 'Alex Lavaee',
    source: 'alexlavaee.me',
    url: 'https://alexlavaee.me/blog/openai-agent-first-codebase-learnings/',
    description:
      '5-month experiment: build and ship a real product with zero manually-written code.',
    tags: ['AI', 'Agents', 'Engineering'],
    comment:
      "OpenAI's Harness team produced ~1,500 merged PRs with 3 engineers.",
    date: '2026-02-05',
    published: false,
    content: '',
  },
  {
    slug: 'anthropic-releases-skills-for-ai-agents',
    title: 'Anthropic Releases SKILLS for AI Agents',
    author: 'Dallin Bentley',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/dallinbentley_the-next-big-thing-in-ai-is-file-systems-activity-7415180783226855425-UX6R',
    description:
      'Files that live alongside your AI agent. The agent can read these files just like it would when working with a codebase.',
    tags: [''],
    comment:
      'A simple but fundamental shift toward file-system-based agent memory.',
    date: '2026-02-04',
    published: false,
    content: '',
  },
  {
    slug: 'the-ai-grifter-crowd-and-claude-code',
    title: 'The \\"AI Grifter\\" Crowd and Claude Code',
    author: 'Giorgio Vilardo',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/giorgiovilardo_the-ai-grifter-crowd-has-officially-hopped-activity-7418297453428449280-nKnt',
    description:
      'Moving away from the \\"VS Code clone sidebar\\" and towards CLI agents.',
    tags: ['AI', 'Agents', 'Tools'],
    comment: 'Architectural shift from GUI to CLI-based AI agents.',
    date: '2026-02-02',
    published: false,
    content: '',
  },
  {
    slug: 'just-in-time-catching-test-generation-at-meta',
    title: 'Just-in-Time Catching Test Generation at Meta',
    author: '',
    source: 'https://arxiv.org/pdf/2601.22832',
    url: '',
    description: '',
    tags: [''],
    comment: '',
    date: '2026-01-30',
    published: false,
    content: '',
  },
  {
    slug: 'agents-md-outperforms-skills-in-our-agent-evals',
    title: 'AGENTS.md Outperforms Skills in Our Agent Evals',
    author: 'Jude Gao',
    source: 'vercel.com',
    url: 'https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals',
    description:
      'A compressed 8KB docs index embedded directly in AGENTS.md achieved a 100% pass rate, while skills maxed out at 79%.',
    tags: ['AI', 'Agents', 'Engineering'],
    comment: 'Passive context beats active retrieval for AI coding agents.',
    date: '2026-01-28',
    published: false,
    content: '',
  },
  {
    slug: 'so-you-want-to-hire-a-forward-deployed-engineer',
    title: 'So You Want to Hire a Forward Deployed Engineer',
    author: 'Tiffany Siu',
    source: 'review.firstround.com',
    url: 'https://review.firstround.com/so-you-want-to-hire-a-forward-deployed-engineer/',
    description:
      'What FDEs actually do and how to hire the right one for your team.',
    tags: ['Career', 'Engineering', 'Hiring'],
    comment:
      'FDEs help build incrementally more valuable products from concrete use cases.',
    date: '2026-01-20',
    published: false,
    content: '',
  },
  {
    slug: '2026-interview-questions-i-m-asking-engineers',
    title: "2026 Interview Questions I'm Asking Engineers",
    author: 'Punn Kam',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/punnkam_2026-interview-questions-im-asking-engineers-activity-7414697854138531840-69wW',
    description:
      '\\"You\'re in the middle of a refactor and the model says 8% context left before auto-compaction. What do you do?\\"',
    tags: [''],
    comment:
      'Already thinking about what this means for hiring in a world where the IDE and hand-coding is not important',
    date: '2026-01-15',
    published: false,
    content: '',
  },
  {
    slug: 'effective-harnesses-for-long-running-agents',
    title: 'Effective Harnesses for Long-Running Agents',
    author: 'Anthropic',
    source: 'anthropic.com',
    url: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents',
    description:
      'Creating a more effective harness for long-running agents, inspired by human engineers.',
    tags: [''],
    comment:
      'The moment that announced we were all in the harness engineering phase of AI engineernig, which as of this writing we remain in.',
    date: '2025-11-26',
    published: false,
    content: '',
  },
  {
    slug: 'speed-at-the-cost-of-quality-how-cursor-ai-increases-short-term-velocity-and-long-term-complexity',
    title:
      'Speed at the Cost of Quality: How Cursor AI Increases Short-Term Velocity and Long-Term Complexity',
    author: 'Multiple Authors',
    source: 'arxiv.org',
    url: 'https://arxiv.org/abs/2511.04427',
    description:
      'How Cursor AI increases short-term velocity and long-term complexity in open-source projects.',
    tags: ['AI', 'Agents', 'Research'],
    comment: 'MSR 2026 paper on the tradeoffs of AI-assisted coding.',
    date: '2025-11-08',
    published: false,
    content: '',
  },
  {
    slug: 'when-chatgpt-broke-an-entire-field-an-oral-history',
    title: 'When ChatGPT Broke an Entire Field: An Oral History',
    author: 'John Pavlus',
    source: 'quantamagazine.org',
    url: 'https://www.quantamagazine.org/when-chatgpt-broke-an-entire-field-an-oral-history-20250430/',
    description: 'How LLMs upended the field of NLP in just a few years.',
    tags: ['AI', 'History', 'Research'],
    comment: 'Fascinating oral history of the AI paradigm shift.',
    date: '2025-04-30',
    published: false,
    content: '',
  },
  {
    slug: 'how-we-solved-hallucination-in-llms-with-open-source-code',
    title: 'How We Solved Hallucination in LLMs with Open Source Code',
    author: 'Leon Chlon, PhD',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/leochlon_ai-machinelearning-opensource-activity-7373621516581773312-sad6',
    description:
      "LLM hallucinations aren't bugs - they're compression artifacts.",
    tags: ['AI', 'Research', 'Open Source'],
    comment: 'Revolutionary approach to hallucination detection.',
    date: '2024-12-15',
    published: false,
    content: '',
  },
  {
    slug: 'the-prompt-report',
    title: 'The Prompt Report',
    author: 'Sander Schulhoff',
    source: 'learnprompting.org',
    url: 'https://learnprompting.org/blog/the_prompt_report',
    description:
      'The most comprehensive study of prompting ever done - 1,500+ academic papers analyzed.',
    tags: ['AI', 'Prompt Engineering', 'Research'],
    comment: '80+ page survey of all prompting techniques.',
    date: '2024-12-12',
    published: false,
    content: '',
  },
  {
    slug: 'building-effective-ai-agents',
    title: 'Building Effective AI Agents',
    author: 'Erik Schluntz & Barry Zhang',
    source: 'anthropic.com',
    url: 'https://www.anthropic.com/research/building-effective-agents',
    description:
      'Best practices and patterns for building production AI agents.',
    tags: [''],
    comment:
      'The definitive guide to agent architecture from the team behind Claude in the early days. So many unknown unknowns.',
    date: '2024-10-01',
    published: false,
    content: '',
  },
  {
    slug: 'claude-squad',
    title: 'Claude Squad',
    author: 'SMTG-AI',
    source: 'github.com',
    url: 'https://github.com/smtg-ai/claude-squad',
    description:
      'Manage multiple AI terminal agents like Claude Code, Aider, Codex, OpenCode, and Amp.',
    tags: [''],
    comment:
      'Multi-agent orchestration for terminal-based AI coding. There are many competitors now, but a very interesting early implementation more or less subsumed by coding harnesses of big providers.',
    date: '2024-06-15',
    published: false,
    content: '',
  },
  {
    slug: 'the-rise-of-the-ai-engineer',
    title: 'The Rise of the AI Engineer',
    author: 'Swyx',
    source: 'latent.space',
    url: 'https://www.latent.space/p/ai-engineer',
    description: 'Why AI engineering is becoming the hottest role in tech.',
    tags: ['AI', 'Career', 'Engineering'],
    comment: 'Required reading for anyone building with LLMs professionally.',
    date: '2023-09-01',
    published: false,
    content: '',
  },
  {
    slug: 'llm-powered-autonomous-agents',
    title: 'LLM Powered Autonomous Agents',
    author: 'Lilian Weng',
    source: 'lilianweng.github.io',
    url: 'https://lilianweng.github.io/posts/2023-06-23-agent/',
    description: 'Comprehensive overview of agent architectures and patterns.',
    tags: ['AI', 'LLM', 'Agents', 'Research'],
    comment: 'The canonical reference for understanding agent design patterns.',
    date: '2023-06-23',
    published: false,
    content: '',
  },
]
