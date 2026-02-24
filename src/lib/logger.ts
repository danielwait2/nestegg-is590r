// Structured logger — outputs JSON to stdout/stderr.
// Every log entry includes: level, event, timestamp, and any context passed in.
// Use logger.info/warn/error in API routes instead of bare console.log.

type Level = 'info' | 'warn' | 'error' | 'debug';

function log(level: Level, event: string, context?: Record<string, unknown>) {
  const entry = {
    level,
    event,
    ts: new Date().toISOString(),
    ...context,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info:  (event: string, context?: Record<string, unknown>) => log('info',  event, context),
  warn:  (event: string, context?: Record<string, unknown>) => log('warn',  event, context),
  error: (event: string, context?: Record<string, unknown>) => log('error', event, context),
  debug: (event: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') log('debug', event, context);
  },
};
