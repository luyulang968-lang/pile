# Bored Pile Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable GitHub Pages React app with two responsive engineering tool pages for bored pile drilling progress and tremie concrete placement simulation, including SVG diagrams, local persistence, tests, and Firebase-ready data abstractions.

**Architecture:** Use a Vite + React + React Router static SPA with a shared app shell, page-specific form state, pure calculation helpers, and SVG renderer components. Persistence is isolated behind a storage adapter so the initial `localStorage` implementation can later be swapped for Firebase Realtime Database without rewriting page logic.

**Tech Stack:** React, Vite, React Router, Vitest, Testing Library, plain CSS, SVG, localStorage

---

### Task 1: Scaffold The Static App

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/styles.css`
- Create: `src/router.jsx`

- [ ] **Step 1: Write the failing configuration smoke test**

```jsx
import { describe, expect, it } from 'vitest';
import { createAppRouter } from '../src/router';

describe('router setup', () => {
  it('defines both engineering pages', () => {
    const router = createAppRouter('/pile-tools/');
    const paths = router.routes.map((route) => route.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/drilling-progress');
    expect(paths).toContain('/tremie-placement');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- router.test.jsx`
Expected: FAIL because `src/router` does not exist yet.

- [ ] **Step 3: Write minimal app scaffold**

```jsx
export function createAppRouter() {
  return {
    routes: [
      { path: '/' },
      { path: '/drilling-progress' },
      { path: '/tremie-placement' },
    ],
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- router.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.js index.html src/main.jsx src/App.jsx src/styles.css src/router.jsx tests/router.test.jsx
git commit -m "feat: scaffold bored pile tools app"
```

### Task 2: Add Shared Calculations And Persistence

**Files:**
- Create: `src/lib/format.js`
- Create: `src/lib/storage.js`
- Create: `src/lib/drilling.js`
- Create: `src/lib/tremie.js`
- Test: `tests/calculations.test.js`

- [ ] **Step 1: Write the failing calculation tests**

```js
import { describe, expect, it } from 'vitest';
import { calculateDrillingMetrics } from '../src/lib/drilling';
import { calculateTremieMetrics } from '../src/lib/tremie';

describe('calculateDrillingMetrics', () => {
  it('computes toe progress and status', () => {
    const result = calculateDrillingMetrics({
      platformElevation: 12,
      pileTopElevation: 8,
      pileToeElevation: -18,
      currentDepth: 20,
    });

    expect(result.currentBottomElevation).toBe(-8);
    expect(result.designDepth).toBe(30);
    expect(result.progressPercent).toBeCloseTo(66.67, 2);
    expect(result.status).toBe('drilling');
  });
});

describe('calculateTremieMetrics', () => {
  it('computes concrete level and embedment', () => {
    const result = calculateTremieMetrics({
      pileDiameter: 1.2,
      boreDepth: 32,
      platformElevation: 6,
      tremieSegments: [1, 3, 3, 2],
      bottomOffset: 0.4,
      concreteVolume: 18,
      liftHeight: 1.5,
    });

    expect(result.tremieLength).toBe(9);
    expect(result.concreteHeight).toBeGreaterThan(15);
    expect(result.embedmentStatus).toBe('acceptable');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- calculations.test.js`
Expected: FAIL because calculation modules do not exist yet.

- [ ] **Step 3: Write minimal calculation and storage modules**

```js
export function createPersistenceAdapter(key, fallbackState) {
  return {
    load: () => fallbackState,
    save: () => {},
  };
}
```

```js
export function calculateDrillingMetrics(input) {
  const designDepth = input.platformElevation - input.pileToeElevation;
  const currentBottomElevation = input.platformElevation - input.currentDepth;
  return {
    currentBottomElevation,
    designDepth,
    progressPercent: (input.currentDepth / designDepth) * 100,
    status: 'drilling',
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- calculations.test.js`
Expected: PASS after full drilling and tremie implementations are added.

- [ ] **Step 5: Commit**

```bash
git add src/lib/format.js src/lib/storage.js src/lib/drilling.js src/lib/tremie.js tests/calculations.test.js
git commit -m "feat: add engineering calculations and persistence adapter"
```

### Task 3: Build The Responsive Shell And Navigation

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Modify: `src/router.jsx`
- Create: `src/components/AppShell.jsx`

- [ ] **Step 1: Write the failing shell rendering test**

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from '../src/components/AppShell';

test('renders the navigation labels', () => {
  render(
    <MemoryRouter>
      <AppShell />
    </MemoryRouter>
  );

  expect(screen.getByText('钻孔桩成孔进度')).toBeInTheDocument();
  expect(screen.getByText('导管提管与混凝土灌注模拟')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- shell.test.jsx`
Expected: FAIL because `AppShell` does not exist yet.

- [ ] **Step 3: Write minimal responsive shell**

```jsx
export function AppShell() {
  return (
    <div>
      <nav>
        <span>钻孔桩成孔进度</span>
        <span>导管提管与混凝土灌注模拟</span>
      </nav>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- shell.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/styles.css src/router.jsx src/components/AppShell.jsx tests/shell.test.jsx
git commit -m "feat: add responsive engineering app shell"
```

### Task 4: Implement The Drilling Progress Page

**Files:**
- Create: `src/pages/DrillingProgressPage.jsx`
- Create: `src/components/DrillingDiagram.jsx`
- Modify: `src/router.jsx`
- Test: `tests/drilling-page.test.jsx`

- [ ] **Step 1: Write the failing page behavior test**

```jsx
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { DrillingProgressPage } from '../src/pages/DrillingProgressPage';

test('updates drilling results when depth changes', async () => {
  const user = userEvent.setup();
  render(<DrillingProgressPage />);

  const depthInput = screen.getByLabelText('当前实测孔深 (m)');
  await user.clear(depthInput);
  await user.type(depthInput, '30');

  expect(screen.getByText('Reached design toe level')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- drilling-page.test.jsx`
Expected: FAIL because the page does not exist yet.

- [ ] **Step 3: Write minimal page and SVG diagram**

```jsx
export function DrillingProgressPage() {
  return (
    <section>
      <label>
        当前实测孔深 (m)
        <input aria-label="当前实测孔深 (m)" defaultValue="20" />
      </label>
      <p>Reached design toe level</p>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- drilling-page.test.jsx`
Expected: PASS after wiring calculations and state updates.

- [ ] **Step 5: Commit**

```bash
git add src/pages/DrillingProgressPage.jsx src/components/DrillingDiagram.jsx src/router.jsx tests/drilling-page.test.jsx
git commit -m "feat: add drilling progress simulator"
```

### Task 5: Implement The Tremie Placement Page

**Files:**
- Create: `src/pages/TremiePlacementPage.jsx`
- Create: `src/components/TremieDiagram.jsx`
- Test: `tests/tremie-page.test.jsx`

- [ ] **Step 1: Write the failing page behavior test**

```jsx
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { TremiePlacementPage } from '../src/pages/TremiePlacementPage';

test('adds tremie segments and updates embedment status', async () => {
  const user = userEvent.setup();
  render(<TremiePlacementPage />);

  await user.click(screen.getByRole('button', { name: '新增导管节段' }));

  expect(screen.getAllByLabelText(/导管节段长度/)).toHaveLength(6);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tremie-page.test.jsx`
Expected: FAIL because the page does not exist yet.

- [ ] **Step 3: Write minimal tremie page and SVG diagram**

```jsx
export function TremiePlacementPage() {
  return (
    <section>
      <button type="button">新增导管节段</button>
      <label>
        导管节段长度 1 (m)
        <input aria-label="导管节段长度 1 (m)" defaultValue="1" />
      </label>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tremie-page.test.jsx`
Expected: PASS after dynamic list and embedment logic are implemented.

- [ ] **Step 5: Commit**

```bash
git add src/pages/TremiePlacementPage.jsx src/components/TremieDiagram.jsx tests/tremie-page.test.jsx
git commit -m "feat: add tremie placement simulator"
```

### Task 6: Document Deployment And Firebase Extension

**Files:**
- Create: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Write the failing documentation check**

```js
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('readme documents GitHub Pages and Firebase extension', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  expect(readme).toContain('GitHub Pages');
  expect(readme).toContain('Firebase Realtime Database');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- readme.test.js`
Expected: FAIL because `README.md` does not exist yet.

- [ ] **Step 3: Write README and deploy scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- readme.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add README.md package.json tests/readme.test.js
git commit -m "docs: add setup and deployment guide"
```
