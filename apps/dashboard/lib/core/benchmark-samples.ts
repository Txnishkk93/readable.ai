export const BENCHMARK_SAMPLES = [
  {
    name: 'analytics-growth',
    input: 'Revenue grew 23% to $1.2M in Q2. Conversion rate improved from 3.8% to 4.9%. We acquired 1,450 new users this month.',
    expected: {
      metrics: [
        { label: 'Revenue', value: '$1.2M', unit: '$' },
        { label: 'Growth', value: '23%', unit: '%' },
        { label: 'Conversion rate', value: '4.9%', unit: '%' },
        { label: 'New users', value: '1450', unit: 'users' },
      ],
      insights: [],
      actions: [],
    },
  },
  {
    name: 'support-backlog',
    input: 'We resolved 420 tickets this week. The average response time dropped from 18 minutes to 9 minutes. Need to improve the escalation routing for enterprise accounts.',
    expected: {
      metrics: [
        { label: 'Tickets resolved', value: '420', unit: 'tickets' },
        { label: 'Average response time', value: '9', unit: 'min' },
      ],
      insights: [],
      actions: [{ text: 'improve the escalation routing for enterprise accounts', priority: 'medium' }],
    },
  },
  {
    name: 'billing-prompt',
    input: 'Monthly churn sits at 4.2%. ARPU increased to $42.50. Should add a billing reminder before renewal for high-risk accounts.',
    expected: {
      metrics: [
        { label: 'Monthly churn', value: '4.2%', unit: '%' },
        { label: 'ARPU', value: '$42.50', unit: '$' },
      ],
      actions: [{ text: 'add a billing reminder before renewal for high-risk accounts', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'latency-detection',
    input: 'Why are p95 API latencies still 520ms? The database cluster is under heavier load and the main queue is backing up. This might be a connection-pool issue.',
    expected: {
      metrics: [{ label: 'P95 API latency', value: '520', unit: 'ms' }],
      insights: [
        { text: 'The database cluster is under heavier load and the main queue is backing up', category: 'observation' },
        { text: 'This might be a connection-pool issue', category: 'question' },
      ],
      actions: [],
    },
  },
  {
    name: 'experiment-result',
    input: 'Experiment B increased click-through rate by 12.4%. Signup conversion rose from 5.1% to 6.8%. Recommend expanding the test to mobile users.',
    expected: {
      metrics: [
        { label: 'Click-through rate', value: '12.4%', unit: '%' },
        { label: 'Signup conversion', value: '6.8%', unit: '%' },
      ],
      actions: [{ text: 'expand the test to mobile users', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'feedback-summary',
    input: 'Customer satisfaction improved to 4.6/5 after the onboarding update. We received 3,200 survey responses. Consider A/B testing the pricing page copy.',
    expected: {
      metrics: [
        { label: 'Customer satisfaction', value: '4.6', unit: '/5' },
        { label: 'Survey responses', value: '3200', unit: 'responses' },
      ],
      actions: [{ text: 'A/B testing the pricing page copy', priority: 'low' }],
      insights: [],
    },
  },
  {
    name: 'engineer-update',
    input: 'We reduced page load time from 2.9s to 1.7s. Must fix the remaining hydration warnings in the dashboard. There are 18 open frontend issues.',
    expected: {
      metrics: [
        { label: 'Page load time', value: '1.7', unit: 's' },
        { label: 'Open frontend issues', value: '18', unit: 'issues' },
      ],
      actions: [{ text: 'fix the remaining hydration warnings in the dashboard', priority: 'high' }],
      insights: [],
    },
  },
  {
    name: 'qa-issue',
    input: 'Failure rate dropped 3.1% after the patch. We observed 120 flaky tests. Need to add retries around the payment API.',
    expected: {
      metrics: [
        { label: 'Failure rate', value: '3.1%', unit: '%' },
        { label: 'Flaky tests', value: '120', unit: 'tests' },
      ],
      actions: [{ text: 'add retries around the payment API', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'pipeline-alert',
    input: 'Deployment failures reached 8% for the last release. The rollback completed in 17 minutes. We should improve the smoke test gate.',
    expected: {
      metrics: [
        { label: 'Deployment failures', value: '8%', unit: '%' },
        { label: 'Rollback duration', value: '17', unit: 'min' },
      ],
      actions: [{ text: 'improve the smoke test gate', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'search-relevance',
    input: 'Search relevance improved by 9.2%. CTR is 6.4%. We saw 2,300 more qualified leads this month.',
    expected: {
      metrics: [
        { label: 'Search relevance', value: '9.2%', unit: '%' },
        { label: 'CTR', value: '6.4%', unit: '%' },
        { label: 'Qualified leads', value: '2300', unit: 'leads' },
      ],
      insights: [],
      actions: [],
    },
  },
  {
    name: 'security-summary',
    input: 'We blocked 2,400 malicious requests in the last 24 hours. The incident rate fell 18%. Need to add rate limiting to the public API.',
    expected: {
      metrics: [
        { label: 'Malicious requests blocked', value: '2400', unit: 'requests' },
        { label: 'Incident rate', value: '18%', unit: '%' },
      ],
      actions: [{ text: 'add rate limiting to the public API', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'weekly-summary',
    input: 'Sessions increased 31%. Retention was 72% after the redesign. This is a strong signal that the onboarding flow is working.',
    expected: {
      metrics: [
        { label: 'Sessions', value: '31%', unit: '%' },
        { label: 'Retention', value: '72%', unit: '%' },
      ],
      insights: [{ text: 'This is a strong signal that the onboarding flow is working', category: 'observation' }],
      actions: [],
    },
  },
  {
    name: 'customer-feedback',
    input: 'NPS is 62 and satisfaction rose from 4.1 to 4.5. We received 1,120 comments in customer interviews. Need to prioritize onboarding friction.',
    expected: {
      metrics: [
        { label: 'NPS', value: '62', unit: 'points' },
        { label: 'Satisfaction', value: '4.5', unit: '/5' },
        { label: 'Customer comments', value: '1120', unit: 'comments' },
      ],
      actions: [{ text: 'prioritize onboarding friction', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'operations-report',
    input: 'The queue backlog dropped from 530 jobs to 180 jobs. Error rate improved 9% over the last sprint. Recommend reducing idle worker count.',
    expected: {
      metrics: [
        { label: 'Queue backlog', value: '180', unit: 'jobs' },
        { label: 'Error rate', value: '9%', unit: '%' },
      ],
      actions: [{ text: 'reducing idle worker count', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'pricing-test',
    input: 'Subscription revenue hit $840k this quarter, up 18%. MRR is $280k and churn is 3.7%. Consider testing a lower entry plan.',
    expected: {
      metrics: [
        { label: 'Subscription revenue', value: '$840k', unit: '$' },
        { label: 'MRR', value: '$280k', unit: '$' },
        { label: 'Churn', value: '3.7%', unit: '%' },
      ],
      actions: [{ text: 'testing a lower entry plan', priority: 'low' }],
      insights: [],
    },
  },
  {
    name: 'analytics-mix',
    input: 'We saw 19,000 more organic visits this month. The conversion rate remains at 2.4%. This suggests landing-page copy still needs work.',
    expected: {
      metrics: [
        { label: 'Organic visits', value: '19000', unit: 'visits' },
        { label: 'Conversion rate', value: '2.4%', unit: '%' },
      ],
      insights: [{ text: 'This suggests landing-page copy still needs work', category: 'observation' }],
      actions: [],
    },
  },
  {
    name: 'ml-ops',
    input: 'Model latency is 1200ms on average. Precision is 94%. We should deploy the fallback model during peak hours.',
    expected: {
      metrics: [
        { label: 'Model latency', value: '1200', unit: 'ms' },
        { label: 'Precision', value: '94%', unit: '%' },
      ],
      actions: [{ text: 'deploy the fallback model during peak hours', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'support-incident',
    input: 'The incident lasted 3 hours and 20 minutes. We had 76 escalations this morning. Why did the auth queue spike?',
    expected: {
      metrics: [
        { label: 'Incident duration', value: '3', unit: 'h' },
        { label: 'Escalations', value: '76', unit: 'escalations' },
      ],
      insights: [{ text: 'Why did the auth queue spike?', category: 'question' }],
      actions: [],
    },
  },
  {
    name: 'a11y-metrics',
    input: 'Accessibility scores improved 7.8%. Bounce rate fell to 26%. Need to fix keyboard navigation gaps on the settings page.',
    expected: {
      metrics: [
        { label: 'Accessibility scores', value: '7.8%', unit: '%' },
        { label: 'Bounce rate', value: '26%', unit: '%' },
      ],
      actions: [{ text: 'fix keyboard navigation gaps on the settings page', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'team-status',
    input: 'Sprint velocity is 42 story points. We completed 13 tickets. The release remains on track.',
    expected: {
      metrics: [
        { label: 'Sprint velocity', value: '42', unit: 'story points' },
        { label: 'Tickets completed', value: '13', unit: 'tickets' },
      ],
      insights: [{ text: 'The release remains on track', category: 'factual' }],
      actions: [],
    },
  },
  {
    name: 'ad-spend',
    input: 'Ad spend increased to $6,800 this month. CAC dropped from $112 to $94. Consider reducing spend in low-converting segments.',
    expected: {
      metrics: [
        { label: 'Ad spend', value: '$6800', unit: '$' },
        { label: 'CAC', value: '$94', unit: '$' },
      ],
      actions: [{ text: 'reducing spend in low-converting segments', priority: 'low' }],
      insights: [],
    },
  },
  {
    name: 'retention-note',
    input: 'Retention climbed to 78% after the product update. This indicates the new checklist is driving more long-term engagement.',
    expected: {
      metrics: [{ label: 'Retention', value: '78%', unit: '%' }],
      insights: [{ text: 'This indicates the new checklist is driving more long-term engagement', category: 'observation' }],
      actions: [],
    },
  },
  {
    name: 'outage-impact',
    input: 'The outage affected 6,500 customers for 42 minutes. We need a clearer on-call handoff process.',
    expected: {
      metrics: [
        { label: 'Customers affected', value: '6500', unit: 'customers' },
        { label: 'Outage duration', value: '42', unit: 'min' },
      ],
      actions: [{ text: 'need a clearer on-call handoff process', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'content-performance',
    input: 'LinkedIn engagement is up 15% and newsletter conversions are 3.2%. The content mix is working better for product updates.',
    expected: {
      metrics: [
        { label: 'LinkedIn engagement', value: '15%', unit: '%' },
        { label: 'Newsletter conversions', value: '3.2%', unit: '%' },
      ],
      insights: [{ text: 'The content mix is working better for product updates', category: 'observation' }],
      actions: [],
    },
  },
  {
    name: 'dfi-review',
    input: 'The new dashboard reduced report generation time from 12 min to 6 min. We must fix the inconsistent cache invalidation.',
    expected: {
      metrics: [
        { label: 'Report generation time', value: '6', unit: 'min' },
      ],
      actions: [{ text: 'fix the inconsistent cache invalidation', priority: 'high' }],
      insights: [],
    },
  },
  {
    name: 'conversion-funnel',
    input: 'Trial-to-paid conversion is 4.7%. Activation is 63% and expansion revenue is $90k. Should redesign the onboarding checklist.',
    expected: {
      metrics: [
        { label: 'Trial-to-paid conversion', value: '4.7%', unit: '%' },
        { label: 'Activation', value: '63%', unit: '%' },
        { label: 'Expansion revenue', value: '$90k', unit: '$' },
      ],
      actions: [{ text: 'redesign the onboarding checklist', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'qa-pipeline',
    input: 'Selenium suite runtime dropped from 34 minutes to 22 minutes. Need to add coverage for the new identity flow.',
    expected: {
      metrics: [
        { label: 'Selenium suite runtime', value: '22', unit: 'min' },
      ],
      actions: [{ text: 'add coverage for the new identity flow', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'logistics-update',
    input: 'Delivery speed improved 11% while fulfillment cost rose to $18.50 per order. We observed 440 delayed shipments.',
    expected: {
      metrics: [
        { label: 'Delivery speed', value: '11%', unit: '%' },
        { label: 'Fulfillment cost', value: '$18.50', unit: '$' },
        { label: 'Delayed shipments', value: '440', unit: 'shipments' },
      ],
      insights: [],
      actions: [],
    },
  },
  {
    name: 'product-health',
    input: 'Daily active users are 14,200. Weekly churn is 2.9%. Could we reduce the initial setup friction?',
    expected: {
      metrics: [
        { label: 'Daily active users', value: '14200', unit: 'users' },
        { label: 'Weekly churn', value: '2.9%', unit: '%' },
      ],
      insights: [{ text: 'Could we reduce the initial setup friction?', category: 'question' }],
      actions: [],
    },
  },
  {
    name: 'customer-success',
    input: 'Expansion revenue hit $240k, an increase of 27%. Should prioritize renewal outreach for the 8 accounts at risk.',
    expected: {
      metrics: [
        { label: 'Expansion revenue', value: '$240k', unit: '$' },
        { label: 'Increase', value: '27%', unit: '%' },
      ],
      actions: [{ text: 'prioritize renewal outreach for the 8 accounts at risk', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'shipping-delay',
    input: 'Shipping time is now 3.4 days, down from 5.1 days. We need to cut carrier-related exceptions in Europe.',
    expected: {
      metrics: [
        { label: 'Shipping time', value: '3.4', unit: 'days' },
      ],
      actions: [{ text: 'cut carrier-related exceptions in Europe', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'risk-alert',
    input: 'The risk score is 72 and exposure grew 11%. Must tighten permissions around the finance connector.',
    expected: {
      metrics: [
        { label: 'Risk score', value: '72', unit: 'points' },
        { label: 'Exposure', value: '11%', unit: '%' },
      ],
      actions: [{ text: 'tighten permissions around the finance connector', priority: 'high' }],
      insights: [],
    },
  },
  {
    name: 'launch-readiness',
    input: 'Launch readiness is 88%. Critical blockers are down to 2, and we should reduce the QA backlog before release.',
    expected: {
      metrics: [
        { label: 'Launch readiness', value: '88%', unit: '%' },
        { label: 'Critical blockers', value: '2', unit: 'blockers' },
      ],
      actions: [{ text: 'reduce the QA backlog before release', priority: 'medium' }],
      insights: [],
    },
  },
  {
    name: 'data-quality',
    input: 'Data freshness is 96% and missing rows are 1,900. This is improving, but we still need a schema audit.',
    expected: {
      metrics: [
        { label: 'Data freshness', value: '96%', unit: '%' },
        { label: 'Missing rows', value: '1900', unit: 'rows' },
      ],
      actions: [{ text: 'need a schema audit', priority: 'medium' }],
      insights: [{ text: 'This is improving', category: 'observation' }],
    },
  },
];
