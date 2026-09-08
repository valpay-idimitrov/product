export type Chip = 'done' | 'review' | 'progress' | 'blocked' | 'planned';

export interface Issue {
  key: string;
  label: string;
  status: string;
  chip: Chip;
  cx: string;
  release?: string;
}

export interface Group {
  name: string;
  key: string;
  pct: number;
  pctLabel: string;
  meta: string;
  status: string;
  chip: Chip;
  lines: string[];
  issues: Issue[];
  countOverride?: string;
  hasSpine?: boolean;
}

export interface Estimates {
  source: string;
  effort: string;
  effortNote: string;
  delivered: string;
  deliveredNote: string;
  date: string;
  dateNote: string;
  committed?: string;
  committedNote?: string;
  basis?: string;
}

export interface Bullet { t: string; d: string }

export interface Item {
  id: string;
  title: string;
  titleNote?: string;
  group: string;
  jira: string;
  area: string;
  priority: string;
  status: 'shipped' | 'in-progress' | 'planned';
  progress: number;
  prevProgress?: number;
  effort: string;
  targetDate?: string;
  /** Timeline span in month units across the quarter: 0 = Jul, 1 = Aug, 2 = Sep. */
  s: number;
  e: number;
  note?: string;
  desc?: string;
  context?: string;
  bullets: Bullet[];
  subItems: unknown[];
  groups?: Group[];
  estimates?: Estimates;
}
