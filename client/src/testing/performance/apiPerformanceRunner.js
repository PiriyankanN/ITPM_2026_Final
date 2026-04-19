import axios from "axios";
import fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import performanceTestConfig from "./apiPerformance.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportPath = path.join(__dirname, "api-performance-report.json");

function createHttpClient(baseURL, timeout) {
  return axios.create({
    baseURL,
    timeout,
    validateStatus: () => true
  });
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function percentile(values, percentileRank) {
  if (!values.length) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(
    sorted.length - 1,
    Math.ceil((percentileRank / 100) * sorted.length) - 1
  );

  return sorted[index];
}

function summarizeErrors(results) {
  const errorCounts = new Map();

  for (const result of results) {
    if (result.success) {
      continue;
    }

    const errorKey = result.error || `HTTP_${result.statusCode || "UNKNOWN"}`;
    errorCounts.set(errorKey, (errorCounts.get(errorKey) || 0) + 1);
  }

  return [...errorCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([error, count]) => ({ error, count }));
}

async function executeSingleRequest(client, endpoint) {
  const requestStartedAt = performance.now();

  try {
    const response = await client.request({
      method: endpoint.method,
      url: endpoint.url,
      data: endpoint.data,
      headers: endpoint.headers
    });

    const durationMs = performance.now() - requestStartedAt;
    const success = response.status >= 200 && response.status < 400;

    return {
      success,
      durationMs,
      statusCode: response.status,
      error: success ? null : `HTTP_${response.status}`
    };
  } catch (error) {
    return {
      success: false,
      durationMs: performance.now() - requestStartedAt,
      statusCode: null,
      error: error.code || error.message || "REQUEST_FAILED"
    };
  }
}

async function runWorker(client, endpoint, iterationsPerWorker) {
  const results = [];

  for (let iteration = 0; iteration < iterationsPerWorker; iteration += 1) {
    results.push(await executeSingleRequest(client, endpoint));
  }

  return results;
}

function buildScenarioSummary(results, scenarioStartedAt, scenarioEndedAt, scenario) {
  const durations = results.map((result) => result.durationMs);
  const totalRequests = results.length;
  const successfulRequests = results.filter((result) => result.success).length;
  const failedRequests = totalRequests - successfulRequests;
  const elapsedSeconds = (scenarioEndedAt - scenarioStartedAt) / 1000;

  const averageResponseTimeMs =
    durations.reduce((sum, duration) => sum + duration, 0) / (durations.length || 1);

  return {
    scenario: scenario.name,
    concurrency: scenario.concurrency,
    iterationsPerWorker: scenario.iterationsPerWorker,
    totalRequests,
    successfulRequests,
    failedRequests,
    failureRate: round((failedRequests / (totalRequests || 1)) * 100),
    throughputRps: round(totalRequests / (elapsedSeconds || 1)),
    elapsedSeconds: round(elapsedSeconds),
    responseTimeMs: {
      min: round(Math.min(...durations)),
      avg: round(averageResponseTimeMs),
      p95: round(percentile(durations, 95)),
      max: round(Math.max(...durations))
    },
    topErrors: summarizeErrors(results)
  };
}

async function runScenarioForEndpoint(client, endpoint, scenario) {
  const scenarioStartedAt = performance.now();

  const workerResults = await Promise.all(
    Array.from({ length: scenario.concurrency }, () =>
      runWorker(client, endpoint, scenario.iterationsPerWorker)
    )
  );

  const scenarioEndedAt = performance.now();
  const flattenedResults = workerResults.flat();

  return buildScenarioSummary(
    flattenedResults,
    scenarioStartedAt,
    scenarioEndedAt,
    scenario
  );
}

function printEndpointSummary(endpointName, summaries) {
  console.log(`\nEndpoint: ${endpointName}`);
  console.table(
    summaries.map((summary) => ({
      scenario: summary.scenario,
      concurrency: summary.concurrency,
      requests: summary.totalRequests,
      "avg-ms": summary.responseTimeMs.avg,
      "p95-ms": summary.responseTimeMs.p95,
      "max-ms": summary.responseTimeMs.max,
      "throughput-rps": summary.throughputRps,
      "failure-rate-%": summary.failureRate
    }))
  );

  for (const summary of summaries) {
    if (!summary.topErrors.length) {
      continue;
    }

    console.log(`Top errors for ${summary.scenario}:`);
    console.table(summary.topErrors);
  }
}

async function writeReport(report) {
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
}

async function run() {
  const client = createHttpClient(
    performanceTestConfig.baseUrl,
    performanceTestConfig.timeoutMs
  );

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: performanceTestConfig.baseUrl,
    timeoutMs: performanceTestConfig.timeoutMs,
    endpoints: []
  };

  console.log(`Running API performance tests against ${performanceTestConfig.baseUrl}`);

  for (const endpoint of performanceTestConfig.endpoints) {
    const endpointReport = {
      endpoint: endpoint.name,
      method: endpoint.method,
      url: endpoint.url,
      scenarios: []
    };

    for (const scenario of performanceTestConfig.scenarios) {
      console.log(
        `Executing ${scenario.name} on ${endpoint.method} ${endpoint.url} with concurrency ${scenario.concurrency}`
      );
      const summary = await runScenarioForEndpoint(client, endpoint, scenario);
      endpointReport.scenarios.push(summary);
    }

    report.endpoints.push(endpointReport);
    printEndpointSummary(endpoint.name, endpointReport.scenarios);
  }

  await writeReport(report);
  console.log(`\nDetailed report written to ${reportPath}`);
}

run().catch((error) => {
  console.error("Performance test run failed.");
  console.error(error);
  process.exitCode = 1;
});
