const defaultBaseUrl = process.env.PERF_BASE_URL || "http://localhost:5000/api";
const authToken = process.env.PERF_AUTH_TOKEN;

const defaultHeaders = authToken
  ? {
      Authorization: `Bearer ${authToken}`
    }
  : {};

export const performanceTestConfig = {
  baseUrl: defaultBaseUrl,
  timeoutMs: Number(process.env.PERF_TIMEOUT_MS || 10000),
  scenarios: [
    {
      name: "light-load",
      concurrency: 5,
      iterationsPerWorker: 8
    },
    {
      name: "moderate-load",
      concurrency: 20,
      iterationsPerWorker: 10
    },
    {
      name: "heavy-load",
      concurrency: 50,
      iterationsPerWorker: 12
    }
  ],
  endpoints: [
    {
      name: "rooms-list",
      method: "GET",
      url: "/rooms",
      headers: defaultHeaders
    },
    {
      name: "food-services-list",
      method: "GET",
      url: "/food",
      headers: defaultHeaders
    },
    {
      name: "bus-routes-list",
      method: "GET",
      url: "/routes",
      headers: defaultHeaders
    }
  ]
};

export default performanceTestConfig;
