export function trackEvent(event: string, properties?: Record<string, unknown>) {
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, properties }),
  }).catch(() => {});
}
