import { describe, expect, it } from 'vitest';
import { parseAIResponse } from './parser';

const TEST_RESPONSES = [
  {
    name: 'analytics metrics',
    input: 'Conversion rate increased 23%. Traffic up 1200 users. Average page load time improved from 2.3s to 1.8s.',
    expectedMetrics: 3,
    expectedActions: 0,
    expectedInsights: 0,
  },
  {
    name: 'action items',
    input: 'Should implement caching for database queries. Need to add rate limiting. Must fix the memory leak.',
    expectedMetrics: 0,
    expectedActions: 3,
    expectedInsights: 0,
  },
  {
    name: 'mixed content',
    input: 'We received 5000 customer feedback items. The satisfaction score is 4.2/5. Should prioritize the top 10 complaints.',
    expectedMetrics: 2,
    expectedActions: 1,
    expectedInsights: 0,
  },
  {
    name: 'question and insights',
    input: 'Why did performance degrade? The API is slow. We observed 500ms latency. This might be a database issue.',
    expectedMetrics: 1,
    expectedActions: 0,
    expectedInsights: 3,
  },
];

describe('parseAIResponse', () => {
  it.each(TEST_RESPONSES)('$name', ({ input, expectedMetrics, expectedActions, expectedInsights }) => {
    const result = parseAIResponse(input);

    expect(Array.isArray(result.metrics)).toBe(true);
    expect(Array.isArray(result.insights)).toBe(true);
    expect(Array.isArray(result.actions)).toBe(true);
    expect(result.metrics.length).toBe(expectedMetrics);
    expect(result.actions.length).toBe(expectedActions);
    expect(result.insights.length).toBe(expectedInsights);
  });
});
