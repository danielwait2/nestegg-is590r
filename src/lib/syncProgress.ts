export async function syncProgress() {
  try {
    const child = JSON.parse(localStorage.getItem('nestegg_child') ?? 'null');
    const progress = JSON.parse(localStorage.getItem('nestegg_progress') ?? 'null');
    const projectionRaw = localStorage.getItem('nestegg_projection');
    const projection = projectionRaw ? JSON.parse(projectionRaw) : null;

    if (!child) return;

    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        child,
        progress,
        monthlyAmount: projection?.monthlyAmount ?? 50,
      }),
    });
  } catch {}
}
