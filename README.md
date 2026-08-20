# ValPay Q3 Roadmap — Next.js

Q3 2026 delivery roadmap. Gantt-style quarter view with expandable rows showing
each epic's Jira children, complexity, workflow progress and projected dates.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build` for a production build, `npm run typecheck` for types only.

## Layout

```
app/
  layout.tsx          root shell, Google Fonts (Plus Jakarta Sans + Inter)
  page.tsx            centres the board
  globals.css         ValPay design tokens, keyframes, reduced-motion guard
components/
  Roadmap.tsx         state (category filter, expanded row), stats, month header
  RoadmapHeader.tsx   title, delivery ring, shipped/in-progress/not-started panel
  CategoryTabs.tsx    full-width area tabs, coloured per area
  TimelineRow.tsx     one initiative: label cell + quarter bar + expand animation
  DetailPanel.tsx     expanded content: projection hero + grouped Jira issues
  ProgressMeter.tsx   five-pip workflow meter
  DoneBadge.tsx       self-drawing tick + pulse ring for shipped rows
  Overline.tsx        the small uppercase mono label used throughout
lib/
  types.ts            Item / Group / Issue / Estimates
  data.ts             the roadmap content + palette + group ordering
  derive.ts           pure view-model helpers (colours, spans, meters, roll-ups)
```

## Where the numbers come from

`data.ts` holds a snapshot taken from Jira on **20 Aug 2026**. Percentages are
rolled up from each child issue's **Complexity** field, discounted by status, and
divided by an observed throughput of **1.44 estimate-days per week**
(`OBSERVED_RATE`). Each row's `estimates.source` states its own basis and is
rendered in the panel, so a reader can see what a figure rests on.

Two caveats carried over from the source data:

- **Deposits** has 6 of 10 children unsized; they are assumed *Hard*. At *Normal*
  the row reads 34% and late September instead of 21% and 4 Nov.
- **Theming** shows the tech lead's committed date (23 Sep) with the model's own
  projection (13 Dec) beneath it. Both are in `estimates`.

To go live against Jira, replace `ITEMS` with a fetch in a server component and
keep `derive.ts` as-is — it is pure and has no Jira coupling.

## Notable implementation details

- **Row expand** measures real content height via `ResizeObserver` rather than a
  fixed `max-height`; panels stay mounted so they animate closed as well as open.
- **One CSS variable, `--panel-grid`, drives three row types** (section header,
  group header, issue row) so their columns cannot drift apart.
- **The pip meter encodes workflow position, not ticket size** — Backlog 0 through
  Done 5 — and turns green and pulses when complete. Complexity has its own column.
- The pulse animates the meter, not each of its five bars; animating every bar put
  enough infinitely-animating nodes on the page to stall rendering.
- `#437CC0` is darkened to `#2A5A96` wherever it carries text (`textSafe`), and the
  unsized-complexity label uses `#5C6B7F` — both for AA contrast at small sizes.
