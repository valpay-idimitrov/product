import { AREA_COLORS, PRIORITY_COLOR, GROUP_TIER, GROUP_TITLE } from './data';
import type { Chip, Group, Issue, Item } from './types';

export const hexRgba = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`;
};

/** #437CC0 fails AA as text at small sizes; darken it wherever it carries a glyph. */
export const textSafe = (areaColor: string) => (areaColor === '#437CC0' ? '#2A5A96' : areaColor);

export const CHIP_TEXT: Record<Chip, string> = {
  done: '#0F705F', review: '#2A5A96', progress: '#8A5A00', blocked: '#A11A5B', planned: '#394962',
};

export const CHIP_DOT: Record<Chip, string> = {
  done: '#0F705F', review: '#2A5A96', progress: '#E0A43B', blocked: '#D6337F', planned: '#C3CAD4',
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
    meterColor: isDone ? '#0F705F' : CHIP_DOT[iss.chip] ?? '#8A94A6',
    dotColor: CHIP_DOT[iss.chip] ?? '#C3CAD4',
    glyph: iss.chip === 'done' ? '✓' : iss.chip === 'blocked' ? '!' : '',
    labelColor: iss.chip === 'done' ? '#5C6B7F' : '#17214A',
    cxName: unsized ? 'Unsized' : iss.cx.split('· ')[1] ?? iss.cx,
    // #8A94A6 measures 3.06:1 on white — below AA at 9px. #5C6B7F is 5.43:1.
    cxColor: unsized ? '#5C6B7F' : '#394962',
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
    remainColor: left === 0 ? '#0F705F' : '#8A5A00',
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
  derivedGroups: DerivedGroup[];
}

/** @param months number of columns in the timeline grid (3 for a quarter). */
export const deriveItem = (it: Item, months = 3): DerivedItem => {
  const areaColor = AREA_COLORS[it.area] ?? '#17214A';
  const areaTextColor = textSafe(areaColor);
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
    areaFaint: hexRgba(areaColor, 0.05),
    areaBadge: hexRgba(areaColor, 0.12),
    areaHover: hexRgba(areaColor, 0.14),
    areaWritten: hexRgba(areaColor, 0.38),
    areaSoft: `color-mix(in srgb, ${areaColor} 9%, #ffffff)`,
    areaMerged: `color-mix(in srgb, ${areaColor} 45%, #062922)`,
    areaDash: hexRgba(areaColor, 0.38),
    areaGrad: `linear-gradient(90deg, ${areaColor}, color-mix(in srgb, ${areaColor} 86%, #ffffff))`,
    priorityColor: PRIORITY_COLOR[it.priority] ?? areaColor,
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
      left + width > 88
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
      it.id === 'domains'
        ? 'ETA 30 Sep – 7 Oct'
        : (() => {
            const raw = (est?.committed ?? it.effort ?? '').replace(/\s*20\d\d\b/, '');
            return raw === 'Shipped' || !raw ? raw : `ETA ${raw.replace(/^ETA\s*/i, '')}`;
          })(),
    projLabel: est ? (est.committed ? 'Committed' : 'Projected') : '',
    projDate: est ? est.committed ?? est.date : '',
    projNote: est ? est.committedNote ?? est.dateNote : '',
    noteShort: it.note === 'blocked by Adyen API' ? 'Blocked by Adyen' : it.note === 'pending commercials' ? 'Pending commercials' : it.note ?? '',
    todoSummary: !all.length
      ? ''
      : outstanding === 0
        ? `All ${all.length} complete`
        : `${outstanding} of ${all.length} outstanding`,
    derivedGroups: (it.groups ?? []).map(deriveGroup),
  };
};
