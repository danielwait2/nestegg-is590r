# shadcn/ui Components — NestEgg Quick Reference

**Version confirmed:** shadcn CLI 3.x (latest as of 2026-02-21)
**Date verified:** 2026-02-21

---

## Install & Init (Next.js App Router)

```bash
# In an existing Next.js project
npx shadcn@latest init
```

The CLI will prompt for style (default or new-york), base color, and CSS variables. It creates `components/ui/`, updates `tailwind.config.ts`, and adds the `cn` utility.

### Add components as needed

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add slider
npx shadcn@latest add checkbox
npx shadcn@latest add card
npx shadcn@latest add dialog

# Or add multiple at once
npx shadcn@latest add button input select slider checkbox card dialog
```

> Note: With npm + React 19 you may need `--legacy-peer-deps`. pnpm/yarn/bun handle this automatically.

---

## Button

```bash
npx shadcn@latest add button
```

```tsx
import { Button } from "@/components/ui/button"

// Variants: default | outline | secondary | ghost | destructive | link
// Sizes:    default | sm | lg | icon

<Button>Save</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button disabled>Loading...</Button>
```

---

## Input

```bash
npx shadcn@latest add input
```

```tsx
import { Input } from "@/components/ui/input"

<Input type="email" placeholder="you@example.com" />
<Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
```

---

## Select

```bash
npx shadcn@latest add select
```

```tsx
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select account type" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectItem value="401k">401(k)</SelectItem>
      <SelectItem value="roth_ira">Roth IRA</SelectItem>
      <SelectItem value="taxable">Taxable</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

---

## Slider

```bash
npx shadcn@latest add slider
```

```tsx
import { Slider } from "@/components/ui/slider"

// Uncontrolled
<Slider defaultValue={[5]} min={1} max={10} step={0.5} />

// Controlled
<Slider
  value={[riskLevel]}
  onValueChange={([val]) => setRiskLevel(val)}
  min={1}
  max={10}
  step={1}
  className="w-full"
/>

// Range (two thumbs)
<Slider defaultValue={[20, 80]} max={100} step={1} />
```

---

## Checkbox

```bash
npx shadcn@latest add checkbox
```

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Uncontrolled with label
<div className="flex items-center gap-2">
  <Checkbox id="reinvest" />
  <Label htmlFor="reinvest">Reinvest dividends</Label>
</div>

// Controlled
<Checkbox
  id="compound"
  checked={isCompound}
  onCheckedChange={(checked) => setIsCompound(Boolean(checked))}
/>
```

---

## Card

```bash
npx shadcn@latest add card
```

```tsx
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Retirement Portfolio</CardTitle>
    <CardDescription>Projected to reach goal by 2045</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">$124,500</p>
    <p className="text-muted-foreground">Current balance</p>
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Edit</Button>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

---

## Dialog

```bash
npx shadcn@latest add dialog
```

```tsx
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Uncontrolled (trigger inside Dialog)
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Goal</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Retirement Goal</DialogTitle>
      <DialogDescription>
        Update your target amount and timeline.
      </DialogDescription>
    </DialogHeader>
    {/* form fields here */}
  </DialogContent>
</Dialog>

// Controlled (open from external state)
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Delete</DialogTitle>
    </DialogHeader>
    <div className="flex gap-2 justify-end">
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    </div>
  </DialogContent>
</Dialog>
```

---

## Utility: cn (class merging)

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", condition && "conditional-class", className)} />
```
