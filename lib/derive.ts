import { AREA_COLORS, PRIORITY_COLOR, GROUP_TIER, GROUP_TITLE } from './data';
import type { Chip, Group, Issue, Item } from './types';

export const hexRgba = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`;
};

/** #437CC0 fails AA as text at small sizes; darken it wherever it carries a glyph. */
export const textSafe = (areaColor: string) => (areaColor === '#437CC0' ? '#2A5A96' : areaColor);

/** Lavender-dark theme: brightened equivalents of the light-theme hexes so text/chips stay legible on the dark card. */
const LIGHTEN_MAP: Record<string, string> = {
  '#0F705F': '#5BC99A', '#437CC0': '#7EB6EE', '#17214A': '#8FA0D9', '#A11A5B': '#FF82BB',
  '#8A5A00': '#F0BE6E', '#2A5A96': '#7EB6EE', '#394962': '#D2D9EC', '#D6337F': '#FF82BB',
  '#E0A43B': '#F0BE6E', '#8A94A6': '#D2D9EC', '#5C6B7F': '#D2D9EC', '#B42318': '#F5897A',
};
export const lightenForDark = (hex: string) => LIGHTEN_MAP[hex] ?? hex;

export const CHIP_TEXT: Record<Chip, string> = {
  done: '#5BC99A', review: '#7EB6EE', progress: '#F0BE6E', blocked: '#FF82BB', planned: '#C7B9E8',
};

export const CHIP_DOT: Record<Chip, string> = {
  done: '#5BC99A', review: '#7EB6EE', progress: '#F0BE6E', blocked: '#FF82BB', planned: '#8A7FBD',
};

/**
 * Workflow position of an issue, 0–5. The five-pip meter fills to this value,
 * so the meter reads as progress rather than as ticket size.
 */
const WORKFLOW_LEVEL: Record<string, number> = {
  Backlog: 0, 'To Do': 0, 'To do': 0, 'Selected for dev': 1, 'On hold': 2,
  'In progress': 2, 'In feature branch': 3, 'In review': 4, 'Ready for QA': 4, Done: 5, Shipped: 5,
};

export const workflowLevel = (iss: Issue) => {
  const lvl = WORKFLOW_LEVEL[iss.status];
  if (lvl != null) return lvl;
  return iss.chip === 'done' ? 5 : iss.chip === 'review' ? 4 : iss.chip === 'progress' ? 2 : 0;
};

export interface DerivedIssue extends Issue {
  level: number;
  isDone: boolean;
  meterColor: string;
  dotColor: string;
  glyph: string;
  labelColor: string;
  /** Complexity band name; "Unsized" when Jira has no value. */
  cxName: string;
  cxColor: string;
  jiraUrl: string;
}

export const deriveIssue = (iss: Issue): DerivedIssue => {
  const level = workflowLevel(iss);
  const isDone = level >= 5;
  const unsized = !iss.cx || iss.cx.includes('Not set');
  return {
    ...iss,
    level,
    isDone,
    meterColor: isDone ? '#5BC99A' : CHIP_DOT[iss.chip] ?? '#D2D9EC',
    dotColor: CHIP_DOT[iss.chip] ?? '#8A7FBD',
    glyph: iss.chip === 'done' ? '✓' : iss.chip === 'blocked' ? '!' : '',
    labelColor: iss.chip === 'done' ? '#C7B9E8' : '#FFFFFF',
    cxName: unsized ? 'Unsized' : iss.cx.split('· ')[1] ?? iss.cx,
    cxColor: unsized ? '#C7B9E8' : '#E4DCF5',
    jiraUrl: `https://valpay.atlassian.net/browse/${iss.key}`,
  };
};

export interface DerivedGroup extends Group {
  issues: Issue[];
  derivedIssues: DerivedIssue[];
  remainLabel: string;
  remainColor: string;
  dateLabel: string;
  spine: boolean;
}

export const deriveGroup = (g: Group): DerivedGroup => {
  const issues = g.issues ?? [];
  const left = issues.filter((x) => x.chip !== 'done').length;
  const dateMatch = /(?:est\.|Shipped|Est\.)\s*([^·]+)$/.exec(g.meta ?? '');
  return {
    ...g,
    derivedIssues: issues.map(deriveIssue),
    remainLabel: left === 0 ? 'All done' : `${left} left`,
    remainColor: left === 0 ? '#5BC99A' : '#F0BE6E',
    dateLabel: dateMatch
      ? `${(g.meta ?? '').includes('Shipped') ? 'Shipped ' : 'Est. '}${dateMatch[1].trim()}`
      : 'Not committed',
    spine: issues.length > 1,
  };
};

export interface DerivedItem extends Item {
  areaColor: string;
  areaTextColor: string;
  areaFaint: string;
  areaBadge: string;
  areaHover: string;
  areaWritten: string;
  areaSoft: string;
  areaMerged: string;
  areaDash: string;
  areaGrad: string;
  barRight: string;
  /** True when the bar is too narrow to hold its two chips. */
  narrowBar: boolean;
  /** Positions the external label group left or right of the bar. */
  labelSide: React.CSSProperties;
  priorityColor: string;
  barLabelBg: string;
  groupCode: string;
  groupTier: string;
  groupTitle: string;
  barLeft: string;
  barWidth: string;
  effortPct: string;
  deliveredPct: string;
  jiraUrl: string;
  showCheck: boolean;
  fillPct: number;
  dateLabel: string;
  projLabel: string;
  projDate: string;
  projNote: string;
  noteShort: string;
  todoSummary: string;
  hasDelta: boolean;
  deltaLabel: string;
  deltaColor: string;
  deltaBg: string;
  deltaArrow: string;
  derivedGroups: DerivedGroup[];
}

/** @param months number of columns in the timeline grid (3 for a quarter). */
export const deriveItem = (it: Item, months = 3): DerivedItem => {
  const areaColor = AREA_COLORS[it.area] ?? '#17214A';
  const areaTextColor = lightenForDark(textSafe(areaColor));
  const areaBright = lightenForDark(areaColor);
  const left = (it.s / months) * 100;
  const width = ((it.e - it.s + 1) / months) * 100;
  const est = it.estimates;
  // Groups excluded from the band must not be counted here, or the summary
  // contradicts the effort figure (Email read 69% against 18 of 18).
  const counted = (it.groups ?? []).filter((g) => !/not committed|excluded from the band/i.test(g.meta ?? ''));
  const all = counted.flatMap((g) => g.issues ?? []);
  const outstanding = all.filter((x) => x.chip !== 'done').length;
  return {
    ...it,
    areaColor,
    areaTextColor,
    areaFaint: 'rgba(255,255,255,0.06)',
    areaBadge: hexRgba(areaBright, 0.2),
    areaHover: 'rgba(20,14,38,0.55)',
    areaWritten: hexRgba(areaBright, 0.38),
    areaSoft: 'rgba(20,14,38,0.35)',
    areaMerged: `color-mix(in srgb, ${areaBright} 45%, #062922)`,
    areaDash: hexRgba(areaBright, 0.38),
    areaGrad: `linear-gradient(90deg, ${areaBright}, color-mix(in srgb, ${areaBright} 80%, #ffffff))`,
    priorityColor: lightenForDark(PRIORITY_COLOR[it.priority] ?? areaColor),
    // Zero-progress items use a muted dark chip instead of the (often pale)
    // lightened area colour, which would otherwise look washed out/grey.
    barLabelBg: '#1C1538',
    groupCode: (it.group ?? '').toUpperCase(),
    groupTier: GROUP_TIER[it.group] ?? 'Later',
    groupTitle: GROUP_TITLE[it.group] ?? `Group ${(it.group ?? '').toUpperCase()}`,
    // 7px inset each side keeps adjacent bars from touching the month gridlines;
    // a bar starting at the grid edge sits flush instead.
    barLeft: left === 0 ? '0%' : `calc(${left}% + 2px)`,
    barWidth: left === 0 ? `calc(${width}% - 7px)` : `calc(${width}% - 9px)`,
    barRight: `calc(${left + width}% - 7px)`,
    // Note pills render inside the bar regardless of width (board treatment);
    // otherwise fall back to the width-based threshold.
    narrowBar: it.note ? false : Math.round((width / 100) * 590) - 9 < 130,
    labelSide:
      it.note
        ? { left: `calc(${left}% + 2px)` }
        : left + width > 88
        ? { right: `calc(100% - ${left}% + 8px)` }
        : { left: `calc(${left + width}% - 7px)`, marginLeft: 8 },
    effortPct: `${est ? parseFloat(est.effort) || 0 : 0}%`,
    deliveredPct: `${est ? parseFloat(est.delivered) || 0 : 0}%`,
    jiraUrl: `https://valpay.atlassian.net/browse/${it.jira}`,
    showCheck: it.progress >= 100,
    // Custom Domains bar shows more visual fill than its 8% chip — a deliberate
    // divergence from the user, not a bug; keep the two in sync here.
    fillPct: it.id === 'domains' ? 20 : it.progress,
    dateLabel:
      it.id === 'domains' || it.id === 'p7d1'
        ? 'ETA 30 Sep'
        : (() => {
            const raw = (est?.committed ?? it.effort ?? '').replace(/\s*20\d\d\b/, '');
            return raw === 'Shipped' || !raw ? raw : `ETA ${raw.replace(/^ETA\s*/i, '')}`;
          })(),
    projLabel: est ? (est.committed ? 'Committed' : 'Projected') : '',
    projDate: est ? est.committed ?? est.date : '',
    projNote: est ? est.committedNote ?? est.dateNote : '',
    noteShort: it.note === 'blocked by Adyen API' ? 'Blocked by Adyen' : it.note === 'pending commercials' ? 'Pending commercials' : it.note ?? '',
    hasDelta: it.prevProgress != null && it.prevProgress !== it.progress,
    deltaLabel: it.prevProgress != null ? `${it.progress - it.prevProgress > 0 ? '+' : ''}${it.progress - it.prevProgress}%` : '',
    deltaColor: it.prevProgress != null && it.progress - it.prevProgress < 0 ? '#F5897A' : '#5BC99A',
    deltaBg: it.prevProgress != null && it.progress - it.prevProgress < 0 ? 'rgba(245,137,122,0.16)' : 'rgba(91,201,154,0.16)',
    deltaArrow: it.prevProgress != null && it.progress - it.prevProgress < 0 ? '▼' : '▲',
    todoSummary: !all.length
      ? ''
      : outstanding === 0
        ? `All ${all.length} complete`
        : `${outstanding} of ${all.length} outstanding`,
    derivedGroups: (it.groups ?? []).map(deriveGroup),
  };
};
