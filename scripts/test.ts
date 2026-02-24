// CLI test script — run with: npm test
// Tests core business logic without requiring a running server or database.
// Add tests here as new logic is added to src/lib/ and src/data/.

import { calcProjection } from '../src/lib/projection';
import { getPlanForState, FALLBACK_PLAN } from '../src/data/statePlans';

let passed = 0;
let failed = 0;

function assert(description: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (ok) {
    console.log(`  ✓ ${description}`);
    passed++;
  } else {
    console.error(`  ✗ ${description}`);
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    received: ${JSON.stringify(actual)}`);
    failed++;
  }
}

function suite(name: string, fn: () => void) {
  console.log(`\n${name}`);
  fn();
}

// ─── calcProjection ───────────────────────────────────────────────────────────

suite('calcProjection()', () => {
  assert(
    '$50/month × 18 years @ 7% → $21,536',
    Math.round(calcProjection(50, 18)),
    21536
  );
  assert(
    '$100/month × 18 years @ 7% → $43,072',
    Math.round(calcProjection(100, 18)),
    43072
  );
  assert(
    '$0/month → $0 (no divide-by-zero)',
    calcProjection(0, 18),
    0
  );
  assert(
    '0 years to grow → $0 (child already 18)',
    calcProjection(50, 0),
    0
  );
  assert(
    'custom rate: $50/month × 10 years @ 5% → $7,764',
    Math.round(calcProjection(50, 10, 0.05)),
    7764
  );
});

// ─── getPlanForState ──────────────────────────────────────────────────────────

suite('getPlanForState()', () => {
  const ny = getPlanForState('NY');
  assert('NY has a state tax deduction', ny.hasTaxDeduction, true);
  assert('NY plan is NY 529 Direct Plan', ny.planName, 'NY 529 Direct Plan');

  const va = getPlanForState('VA');
  assert('VA has a state tax deduction', va.hasTaxDeduction, true);
  assert('VA plan is Invest529', va.planName, 'Invest529');

  const ca = getPlanForState('CA');
  assert('CA (no deduction) falls back to Utah my529', ca.planName, 'Utah my529');
  assert('CA has no state tax deduction', ca.hasTaxDeduction, false);

  const tx = getPlanForState('TX');
  assert('TX (no income tax) falls back to Utah my529', tx.planName, 'Utah my529');

  const unknown = getPlanForState('ZZ');
  assert('Unknown state code falls back to Utah my529', unknown.planName, FALLBACK_PLAN.planName);

  const lower = getPlanForState('ny');
  assert('Lowercase state code still resolves', lower.planName, 'NY 529 Direct Plan');
});

// ─── Summary ─────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n${total} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
