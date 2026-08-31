import { describe, expect, it } from 'vitest';
import { parseAIResponse } from './parser';
import { BENCHMARK_SAMPLES } from './benchmark-samples';

function metricMatch(actual: { label: string; value: string | number; unit?: string } | undefined, expected: { label: string; value: string | number; unit?: string }) {
  if (!actual) return false;
  const labelMatch = actual.label.toLowerCase().includes(expected.label.toLowerCase()) || expected.label.toLowerCase().includes(actual.label.toLowerCase());
  const valueMatch = String(actual.value).toLowerCase() === String(expected.value).toLowerCase() || String(actual.value).includes(String(expected.value));
  const unitMatch = !expected.unit || !actual.unit || actual.unit.toLowerCase() === expected.unit.toLowerCase() || actual.unit.toLowerCase().includes(expected.unit.toLowerCase().replace(/\$/g, ''));
  return labelMatch && valueMatch && unitMatch;
}

describe('benchmark parser coverage', () => {
  it('should parse benchmark samples with realistic metric extraction', () => {
    const results = BENCHMARK_SAMPLES.map((sample) => {
      const parsed = parseAIResponse(sample.input);
      const expectedMetrics = sample.expected.metrics ?? [];
      const expectedActions = sample.expected.actions ?? [];
      const expectedInsights = sample.expected.insights ?? [];

      const metricsMatched = expectedMetrics.filter((expectedMetric) =>
        parsed.metrics.some((actualMetric) => metricMatch(actualMetric, expectedMetric))
      );

      const actionsMatched = expectedActions.filter((expectedAction) =>
        parsed.actions.some((actualAction) =>
          actualAction.text.toLowerCase().includes(expectedAction.text.toLowerCase()) ||
          expectedAction.text.toLowerCase().includes(actualAction.text.toLowerCase())
        )
      );

      const insightsMatched = expectedInsights.filter((expectedInsight) =>
        parsed.insights.some((actualInsight) =>
          actualInsight.text.toLowerCase().includes(expectedInsight.text.toLowerCase()) ||
          expectedInsight.text.toLowerCase().includes(actualInsight.text.toLowerCase())
        )
      );

      return {
        sample: sample.name,
        metricsPrecision: metricsMatched.length / Math.max(1, parsed.metrics.length),
        metricsRecall: metricsMatched.length / Math.max(1, expectedMetrics.length),
        actionsPrecision: actionsMatched.length / Math.max(1, parsed.actions.length),
        actionsRecall: actionsMatched.length / Math.max(1, expectedActions.length),
        insightsPrecision: insightsMatched.length / Math.max(1, parsed.insights.length),
        insightsRecall: insightsMatched.length / Math.max(1, expectedInsights.length),
      };
    });

    const summary = results.reduce((acc, result) => {
      acc.metricsPrecision += result.metricsPrecision;
      acc.metricsRecall += result.metricsRecall;
      acc.actionsPrecision += result.actionsPrecision;
      acc.actionsRecall += result.actionsRecall;
      acc.insightsPrecision += result.insightsPrecision;
      acc.insightsRecall += result.insightsRecall;
      acc.samples += 1;
      return acc;
    }, {
      metricsPrecision: 0,
      metricsRecall: 0,
      actionsPrecision: 0,
      actionsRecall: 0,
      insightsPrecision: 0,
      insightsRecall: 0,
      samples: 0,
    });

    const avgMetricsPrecision = summary.metricsPrecision / summary.samples;
    const avgMetricsRecall = summary.metricsRecall / summary.samples;
    const avgActionsPrecision = summary.actionsPrecision / summary.samples;
    const avgActionsRecall = summary.actionsRecall / summary.samples;
    const avgInsightsPrecision = summary.insightsPrecision / summary.samples;
    const avgInsightsRecall = summary.insightsRecall / summary.samples;

    expect(avgMetricsPrecision).toBeGreaterThanOrEqual(0.1);
    expect(avgMetricsRecall).toBeGreaterThanOrEqual(0.1);
    expect(avgActionsPrecision).toBeGreaterThanOrEqual(0.1);
    expect(avgActionsRecall).toBeGreaterThanOrEqual(0.1);
    expect(avgInsightsPrecision).toBeGreaterThanOrEqual(0.1);
    expect(avgInsightsRecall).toBeGreaterThanOrEqual(0.1);

    console.table(results.map((item) => ({
      sample: item.sample,
      metricsPrecision: item.metricsPrecision.toFixed(2),
      metricsRecall: item.metricsRecall.toFixed(2),
      actionsPrecision: item.actionsPrecision.toFixed(2),
      actionsRecall: item.actionsRecall.toFixed(2),
      insightsPrecision: item.insightsPrecision.toFixed(2),
      insightsRecall: item.insightsRecall.toFixed(2),
    })));
  });
});
