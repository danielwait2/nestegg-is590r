type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  ts: string;
  level: LogLevel;
  route: string;
  event: string;
  [key: string]: unknown;
}

export function log(
  level: LogLevel,
  route: string,
  event: string,
  data?: Record<string, unknown>
) {
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    route,
    event,
    ...data,
  };
  console.log(JSON.stringify(entry));
}
