# Recharts — NestEgg Projection Charts Quick Reference

**Version confirmed:** recharts 3.7.0
**Date verified:** 2026-02-21

---

## Install

```bash
npm install recharts
```

---

## Important: "use client" required

Recharts uses browser APIs and cannot render in React Server Components. Always add `"use client"` to any file that imports recharts.

---

## Basic LineChart (client component)

```tsx
"use client"

import {
  LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend,
} from "recharts"

const data = [
  { year: 2025, balance: 50000 },
  { year: 2030, balance: 120000 },
  { year: 2035, balance: 210000 },
  { year: 2040, balance: 340000 },
  { year: 2045, balance: 500000 },
]

export function ProjectionChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis
          tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value: number) =>
            `$${value.toLocaleString()}`
          }
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
          name="Projected Balance"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

---

## Multiple lines (e.g. optimistic / base / conservative)

```tsx
<LineChart data={data}>
  <XAxis dataKey="year" />
  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="optimistic" stroke="#16a34a" strokeWidth={2} dot={false} />
  <Line type="monotone" dataKey="base"       stroke="#2563eb" strokeWidth={2} dot={false} />
  <Line type="monotone" dataKey="conservative" stroke="#dc2626" strokeWidth={2} dot={false} strokeDasharray="5 5" />
</LineChart>
```

Data shape:
```ts
const data = [
  { year: 2025, optimistic: 55000, base: 50000, conservative: 45000 },
  // ...
]
```

---

## Key component props

### ResponsiveContainer

| Prop | Type | Notes |
|------|------|-------|
| `width` | string \| number | Use `"100%"` for fluid width |
| `height` | number | Fixed pixel height required (e.g. `320`) |

### LineChart

| Prop | Type | Notes |
|------|------|-------|
| `data` | array | Array of data objects |
| `margin` | object | `{ top, right, bottom, left }` |

### Line

| Prop | Type | Notes |
|------|------|-------|
| `dataKey` | string | Key from data objects |
| `type` | string | `"monotone"` for smooth curves |
| `stroke` | string | Line color (hex or CSS var) |
| `strokeWidth` | number | Line thickness |
| `dot` | boolean | `false` removes dots from data points |
| `name` | string | Label shown in tooltip/legend |

### XAxis / YAxis

| Prop | Type | Notes |
|------|------|-------|
| `dataKey` | string | XAxis only — the key for x values |
| `tickFormatter` | function | Format tick labels (e.g. currency) |
| `domain` | array | `['auto', 'auto']` or `[0, 600000]` |

### Tooltip

| Prop | Type | Notes |
|------|------|-------|
| `formatter` | function | `(value, name) => [formatted, label]` |
| `labelFormatter` | function | Format the label (x-axis value) |

---

## Lazy-load in Next.js (recommended for large bundles)

Create a thin wrapper component:

```tsx
// components/charts/ProjectionChart.tsx
"use client"
// ... recharts imports and component definition (see above)
```

Then lazy-load it in a Server Component or page:

```tsx
// app/dashboard/page.tsx (Server Component)
import dynamic from "next/dynamic"

const ProjectionChart = dynamic(
  () => import("@/components/charts/ProjectionChart").then(m => m.ProjectionChart),
  {
    ssr: false,
    loading: () => <div className="h-80 animate-pulse bg-muted rounded-lg" />,
  }
)

export default function DashboardPage() {
  return (
    <div>
      <h1>Portfolio Projection</h1>
      <ProjectionChart />
    </div>
  )
}
```

`ssr: false` is required because recharts uses `window`/DOM APIs unavailable during server rendering.

---

## Custom Tooltip example

```tsx
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-background p-3 shadow text-sm">
      <p className="font-medium mb-1">Year: {label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.stroke }}>
          {entry.name}: ${entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// Usage
<Tooltip content={<CustomTooltip />} />
```
