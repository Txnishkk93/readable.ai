import { parseAIResponse } from './parser';

// Test cases based on real LLM responses
const TEST_RESPONSES = [
  // Analytics response
  {
    input: 'Conversion rate increased 23%. Traffic up 1200 users. Average page load time improved from 2.3s to 1.8s.',
    expectedMetrics: 3,
  },
  // Action items
  {
    input: 'Should implement caching for database queries. Need to add rate limiting. Must fix the memory leak.',
    expectedActions: 3,
  },
  // Mixed content
  {
    input: 'We received 5000 customer feedback items. The satisfaction score is 4.2/5. Should prioritize the top 10 complaints.',
    expectedMetrics: 2,
    expectedActions: 1,
  },
  // Question and insights
  {
    input: 'Why did performance degrade? The API is slow. We observed 500ms latency. This might be a database issue.',
    expectedInsights: 3,
  },
];

function runTests(): void {
  console.log('Running parser tests...\n');

  let passed = 0;
  let failed = 0;

  for (const test of TEST_RESPONSES) {
    try {
      const result = parseAIResponse(test.input);

      // Validate structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid result structure');
      }

      if (!Array.isArray(result.metrics)) {
        throw new Error('metrics is not an array');
      }

      if (!Array.isArray(result.insights)) {
        throw new Error('insights is not an array');
      }

      if (!Array.isArray(result.actions)) {
        throw new Error('actions is not an array');
      }

      // Check expected counts
      if ('expectedMetrics' in test && result.metrics.length !== test.expectedMetrics) {
        throw new Error(
          `Expected ${test.expectedMetrics} metrics, got ${result.metrics.length}`
        );
      }

      if ('expectedActions' in test && result.actions.length !== test.expectedActions) {
        throw new Error(
          `Expected ${test.expectedActions} actions, got ${result.actions.length}`
        );
      }

      if ('expectedInsights' in test && result.insights.length !== test.expectedInsights) {
        throw new Error(
          `Expected ${test.expectedInsights} insights, got ${result.insights.length}`
        );
      }

      console.log(`✓ PASS: "${test.input.substring(0, 50)}..."`);
      console.log(`  - Metrics: ${result.metrics.length}, Actions: ${result.actions.length}, Insights: ${result.insights.length}`);
      passed++;
    } catch (error) {
      console.log(`✗ FAIL: "${test.input.substring(0, 50)}..."`);
      console.log(`  - Error: ${error instanceof Error ? error.message : String(error)}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);

  if (failed === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
