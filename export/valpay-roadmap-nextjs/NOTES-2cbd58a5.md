# Notes for the design pass

- The board is hard-coded to 1280px wide (components/Roadmap.tsx); responsive behaviour would be new work.
- Layout is almost entirely inline styles in the components; tokens live in app/globals.css.
- Keep: colour tokens, AA-contrast overrides (textSafe / lightenForDark in lib/derive.ts), and --panel-grid (keeps section header, group header and issue rows aligned).
- lib/data.ts is the FULL dataset (all 21 items, Jira snapshot of 20 Aug 2026).
- Fonts: Plus Jakarta Sans + Inter, loaded in app/layout.tsx.
