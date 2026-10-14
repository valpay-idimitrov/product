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
  pct?: number;
  pctLabel?: string;
  meta: string;
  status?: string;
  chip: Chip;
  lines?: string[];
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
