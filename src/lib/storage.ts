export const KEYS = {
  CHILD: 'nestegg_child',
  PROGRESS: 'nestegg_progress',
  PROJECTION: 'nestegg_projection',
} as const;

export type ChildData = {
  name: string;
  birthYear: number;
  birthMonth: number;
  state: string; // two-letter code
};

export type ProgressData = {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  issuer?: string;
};

export type ProjectionData = {
  monthlyAmount: number;
  birthYear: number;
};

export function getChild(): ChildData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.CHILD);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setChild(data: ChildData): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KEYS.CHILD, JSON.stringify(data)); } catch {}
}

export function getProgress(): ProgressData {
  if (typeof window === 'undefined') return { step1: false, step2: false, step3: false };
  try {
    const raw = localStorage.getItem(KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : { step1: false, step2: false, step3: false };
  } catch { return { step1: false, step2: false, step3: false }; }
}

export function setProgress(data: ProgressData): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KEYS.PROGRESS, JSON.stringify(data)); } catch {}
}

export function getProjection(): ProjectionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.PROJECTION);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setProjection(data: ProjectionData): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KEYS.PROJECTION, JSON.stringify(data)); } catch {}
}
