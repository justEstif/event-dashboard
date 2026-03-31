/**
 * logger
 *
 * Single logger instance for the entire application.
 * Emits structured JSON to stdout — captured automatically by Vercel logs.
 *
 * Every event is stamped with environment metadata injected by Vercel:
 *   - VERCEL_ENV          (production | preview | development)
 *   - VERCEL_GIT_COMMIT_SHA
 *   - VERCEL_REGION
 */

const env = {
  environment: process.env.VERCEL_ENV ?? "local",
  commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? "dev",
  region: process.env.VERCEL_REGION ?? "local",
};

export type LogEvent = Record<string, unknown>;

function emit(level: "info" | "error", event: LogEvent) {
  const line = JSON.stringify({ level, ...env, ...event });
  if (level === "error") {
    console.error(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (event: LogEvent) => emit("info", event),
  error: (event: LogEvent) => emit("error", event),
};
