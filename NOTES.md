# Notes for the design pass

> Synced from the design-review pass: lib/data.ts now reflects the live roadmap edits
> (full Q3 set minus the retired "Capital with Adyen" Q3 row, and the current 12-item
> Q4 priority list — Adyen Capital, Fiserv onboarding, DCC, Notification system,
> Analytics, Automated chargeback defense, Tech Debt: Midware, 2FA, Tax Engine & VAT,
> Digital Wallets, Tech Debt: Data stabilization, Tech Debt: QA Environments). Three
> new areas were added to AREA_COLORS: Product, Tech Debt, Security. derive.ts and
> TimelineRow.tsx were updated so every bar carries a `minWidth` floor (115px shipped,
> 230px noted, 100px default) guaranteeing its inline chips never clip, and the
> shipped-badge wrapper is `inline-flex` so it doesn't inherit extra line-height.


- The board is hard-coded to 1280px wide (components/Roadmap.tsx); responsive behaviour would be new work.
- Layout is almost entirely inline styles in the components; tokens live in app/globals.css.
- Keep: colour tokens, AA-contrast overrides (textSafe / lightenForDark in lib/derive.ts), and --panel-grid (keeps section header, group header and issue rows aligned).
- lib/data.ts here is a 3-item SAMPLE of the real file; AREA_COLORS, GROUP_ORDER etc. are complete.
- Fonts: Plus Jakarta Sans + Inter (loaded in app/layout.tsx, omitted here).
