// ============================================================
// readable.ai — Dummy Data for UI Testing
// ============================================================

// ------------------------------------------------------------
// 1. PLAYGROUND — Sample LLM Responses
// ------------------------------------------------------------

export const DUMMY_LLM_RESPONSES = {

  analytics: `Conversion rate increased 23% month-over-month. 
Traffic rose by 1,200 users in the last 7 days. 
Average page load time improved from 2.3s to 1.8s. 
The bounce rate decreased 15% after the redesign. 
Revenue per user climbed to $42.50. 
Total signups this week reached 340.`,

  actions: `Should implement caching for database queries immediately. 
Need to add rate limiting to the /api/chat endpoint to prevent abuse. 
Must fix the memory leak in the session handler before next release. 
Consider optimizing the bundle size — currently at 420kb. 
Recommend adding unit tests for the parser module. 
Fix the email notification bug reported by 12 users.`,

  mixed: `We received 5,000 customer feedback items this week. 
The satisfaction score is 4.2 out of 5.0. 
Should prioritize the top 10 complaints around onboarding. 
Performance degraded 8% due to increased database load. 
Fix the email notification bug ASAP — affecting 200 users. 
Response time averaged 340ms across all endpoints.`,

  health: `Heart rate averaged 72 bpm over the last 7 days. 
Sleep duration improved to 7.4 hours per night. 
Step count reached 8,200 daily average, up 12% from last week. 
Resting heart rate decreased from 68 to 64 bpm. 
Stress score dropped 18% after meditation sessions. 
Calorie burn averaged 2,100 kcal per day.`,

  sales: `Q3 revenue hit $1.2M, up 34% year-over-year. 
Closed 42 new enterprise deals this quarter. 
Average contract value rose to $28,500. 
Churn rate dropped to 2.1% from 3.4% last quarter. 
Pipeline coverage stands at 3.8x quota. 
Sales cycle shortened from 47 days to 31 days.`,

  customerFeedback: `Users love the new onboarding flow — NPS jumped to 68. 
The dark mode feature was requested by 340 users this month. 
Mobile performance complaints dropped 60% after the last patch. 
Support ticket volume decreased 22% week-over-week. 
Top complaint: export to PDF takes too long (reported by 89 users). 
Feature request: Slack integration mentioned 74 times.`,

  devOps: `Deployment frequency increased to 4.2 releases per week. 
Mean time to recovery dropped from 48 minutes to 11 minutes. 
Build pipeline duration reduced from 12 minutes to 6.5 minutes. 
Error rate across production services sits at 0.04%. 
Database query latency averaged 18ms, down from 43ms. 
Uptime held at 99.97% over the past 30 days.`,

  competitive: `Competitor A raised $12M Series A last week. 
Their pricing increased 40% — pushing mid-market customers away. 
Our feature parity score is now 87% against the market leader. 
Should accelerate the custom renderer feature — 3 competitors lack it. 
Their NPS dropped to 31 according to public G2 reviews. 
We have 2x faster parser benchmarks based on internal testing.`,
};


// ------------------------------------------------------------
// 2. PARSED RESPONSE — Mock Output from Parser
// ------------------------------------------------------------

export const DUMMY_PARSED_RESPONSE = {
  metrics: [
    { value: 23, unit: '%', label: 'Conversion rate increase', direction: 'up', confidence: 0.95 },
    { value: 1200, unit: 'users', label: 'Traffic increase', direction: 'up', confidence: 0.91 },
    { value: 1.8, unit: 's', label: 'Page load time', direction: 'down', confidence: 0.88 },
    { value: 15, unit: '%', label: 'Bounce rate decrease', direction: 'down', confidence: 0.87 },
    { value: 42.50, unit: '$', label: 'Revenue per user', direction: 'up', confidence: 0.93 },
    { value: 340, unit: 'signups', label: 'Weekly signups', direction: 'up', confidence: 0.89 },
  ],
  insights: [
    { text: 'Page load time improved from 2.3s to 1.8s after infrastructure upgrade.', confidence: 0.91 },
    { text: 'Bounce rate decrease correlates with the recent redesign launch.', confidence: 0.84 },
    { text: 'Revenue per user growth is outpacing traffic growth — monetization is improving.', confidence: 0.79 },
  ],
  actions: [
    { text: 'Implement caching for database queries immediately.', priority: 'high', confidence: 0.96 },
    { text: 'Add rate limiting to /api/chat to prevent abuse.', priority: 'high', confidence: 0.94 },
    { text: 'Fix the memory leak in the session handler before next release.', priority: 'high', confidence: 0.92 },
    { text: 'Optimize bundle size — currently at 420kb.', priority: 'medium', confidence: 0.87 },
    { text: 'Add unit tests for the parser module.', priority: 'medium', confidence: 0.83 },
  ],
  raw: 'Conversion rate increased 23% month-over-month...',
  confidence: 0.91,
};


// ------------------------------------------------------------
// 3. PRICING PAGE — Plans
// ------------------------------------------------------------

export const DUMMY_PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'forever',
    description: 'For indie hackers and side projects.',
    cta: 'Start for free',
    ctaHref: '/playground',
    highlighted: false,
    features: [
      'CardsRenderer + StatsRenderer',
      'Dark + Light themes',
      'npm package access',
      'Playground (no sign-in)',
      'Community support',
      '100 parses / day',
    ],
    missing: [
      'ChatRenderer + TimelineRenderer',
      'Custom themes',
      'Streaming support',
      'Usage analytics',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    billing: 'per month',
    yearlyPrice: 290,
    description: 'For teams shipping AI features fast.',
    cta: 'Start Pro',
    ctaHref: '/api/stripe/checkout?plan=pro',
    highlighted: true,
    badge: 'Most popular',
    features: [
      'All 6 renderers',
      'Custom theme via CSS variable map',
      'Custom domain for embed',
      'Streaming support',
      'Usage analytics dashboard',
      'Email support',
      'Unlimited parses',
    ],
    missing: [],
  },
  {
    id: 'whitelabel',
    name: 'White-Label',
    price: 299,
    billing: 'per month',
    description: 'For SaaS products that need full control.',
    cta: 'Contact us',
    ctaHref: 'mailto:hi@readable.ai',
    highlighted: false,
    features: [
      'Everything in Pro',
      'Remove readable.ai branding',
      'Custom renderer SDK',
      'SLA + priority support',
      'Private Slack channel',
      'Quarterly roadmap input',
      'Dedicated onboarding call',
    ],
    missing: [],
  },
];


// ------------------------------------------------------------
// 4. EMBED CONFIGURATOR — Script Tag Output
// ------------------------------------------------------------

export const DUMMY_EMBED_CONFIG = {
  renderer: 'cards',
  theme: 'dark',
  hint: 'analytics',
  selector: '#ai-output',
};

export const generateEmbedScript = (config: typeof DUMMY_EMBED_CONFIG) => `
<div id="${config.selector.replace('#', '')}"></div>

<script src="https://readable.ai/embed.js"></script>
<script>
  Readable.init({
    selector: '${config.selector}',
    renderer: '${config.renderer}',
    theme: '${config.theme}',
    hint: '${config.hint}',
  });

  // Pass your AI response to Readable
  const response = await fetch('/api/ai');
  const { text } = await response.json();
  Readable.render(text);
</script>
`.trim();


// ------------------------------------------------------------
// 5. ABOUT PAGE — Timeline / Story
// ------------------------------------------------------------

export const DUMMY_ABOUT_TIMELINE = [
  {
    date: 'Jan 2026',
    title: 'The frustration',
    body: 'Building आत्mann, I spent 3 days writing a component to display an AI response. It broke the next week when the model changed its output format. I built it again. I knew something was wrong.',
  },
  {
    date: 'Feb 2026',
    title: 'The pattern',
    body: 'Talked to 12 developers. Every single one had the same story — they had built their own display layer, it was fragile, and they hated maintaining it. The problem was universal.',
  },
  {
    date: 'Mar 2026',
    title: 'The insight',
    body: "You don't need 100% parsing accuracy. You need 80% accuracy plus graceful fallback. That insight made the parser feel buildable — not impossible.",
  },
  {
    date: 'Apr 2026',
    title: 'readable.ai ships',
    body: '6 weeks from first commit to npm publish. The playground launched to 200 developers on day one. The most common response: "I needed this 6 months ago."',
  },
];


// ------------------------------------------------------------
// 6. DASHBOARD — Usage Analytics (mock charts)
// ------------------------------------------------------------

export const DUMMY_USAGE_DATA = {
  totalParses: 14832,
  thisWeek: 2341,
  weeklyGrowth: 18,
  topRenderers: [
    { name: 'cards', count: 6200, pct: 42 },
    { name: 'stats', count: 4100, pct: 28 },
    { name: 'chat', count: 2800, pct: 19 },
    { name: 'timeline', count: 1600, pct: 11 },
  ],
  dailyParses: [
    { day: 'Mon', count: 280 },
    { day: 'Tue', count: 410 },
    { day: 'Wed', count: 390 },
    { day: 'Thu', count: 520 },
    { day: 'Fri', count: 480 },
    { day: 'Sat', count: 190 },
    { day: 'Sun', count: 71 },
  ],
  topHints: [
    { hint: 'analytics', count: 4200 },
    { hint: 'none', count: 3800 },
    { hint: 'feedback', count: 2100 },
    { hint: 'devops', count: 1400 },
    { hint: 'sales', count: 980 },
  ],
};


// ------------------------------------------------------------
// 7. TESTIMONIALS (for landing + about page)
// ------------------------------------------------------------

export const DUMMY_TESTIMONIALS = [
  {
    name: 'Aryan Mehta',
    role: 'Founder, Feedlens',
    avatar: 'AM',
    text: 'I was building the same display component for the 4th time when I found readable.ai. Took 20 minutes to integrate and it looked better than anything I had shipped before.',
  },
  {
    name: 'Sara Kim',
    role: 'Senior Engineer, Draftly',
    avatar: 'SK',
    text: 'The streaming support is the killer feature. Our users see AI output render progressively instead of waiting for a text wall to appear. Night and day difference in feel.',
  },
  {
    name: 'Priya Nair',
    role: 'Solo dev, Summari',
    avatar: 'PN',
    text: "The parser handles edge cases I didn't even think about. Bullet lists, percentages, currency — all detected correctly. Saved me weeks of regex hell.",
  },
  {
    name: 'Lucas Ferreira',
    role: 'CTO, Briefcast',
    avatar: 'LF',
    text: 'We evaluated three solutions. readable.ai was the only one with zero dependencies and a proper TypeScript API. The White-Label tier was exactly what we needed.',
  },
];


// ------------------------------------------------------------
// 8. API KEYS (dashboard mock)
// ------------------------------------------------------------

export const DUMMY_API_KEYS = [
  {
    id: 'key_01',
    name: 'Production',
    key: 'rai_prod_xk9••••••••••••••••••••3f2a',
    created: '2026-03-01',
    lastUsed: '2026-04-10',
    status: 'active',
  },
  {
    id: 'key_02',
    name: 'Staging',
    key: 'rai_stg_mb4••••••••••••••••••••9c1d',
    created: '2026-03-15',
    lastUsed: '2026-04-09',
    status: 'active',
  },
  {
    id: 'key_03',
    name: 'Local dev',
    key: 'rai_dev_zz7••••••••••••••••••••0a8e',
    created: '2026-02-20',
    lastUsed: '2026-03-28',
    status: 'revoked',
  },
];