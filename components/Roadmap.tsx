'use client';

import { useMemo, useState } from 'react';
import CategoryTabs from './CategoryTabs';
import RoadmapHeader, { type HeaderStats } from './RoadmapHeader';
import TimelineRow from './TimelineRow';
import { GROUP_ORDER, ITEMS, QUARTER_MONTHS } from '@/lib/data';
import { deriveItem } from '@/lib/derive';

const MONTHS = QUARTER_MONTHS.length;
const ACCENT = '#D9CDF2';

export default function Roadmap() {
  const [cat, setCat] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Bumped on every tab switch; alternates the row animation name so React
  // replays the stagger instead of reusing settled nodes.
  const [animTick, setAnimTick] = useState(0);

  const rows = useMemo(() => {
    const sorted = [...ITEMS].sort(
      (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group),
    );
    const visible = cat === 'All' ? sorted : sorted.filter((it) => it.area === cat);
    return visible.map((it) => deriveItem(it, MONTHS));
  }, [cat]);

  const stats: HeaderStats = useMemo(() => {
    const total = rows.length || 1;
    const avg = Math.round(rows.reduce((s, r) => s + r.progress, 0) / total);
    const crit = rows.filter((r) => r.priority === 'Critical').length;
    return {
      avg,
      status: avg >= 80 ? 'Ahead of schedule' : avg >= 55 ? 'On track' : avg >= 30 ? 'In motion' : 'Ramping up',
      priorityMix:
        crit === rows.length
          ? `All ${rows.length} rated Critical priority`
          : `${crit}/${rows.length} rated Critical priority`,
    };
  }, [rows]);

  return (
    <div
      style={{
        width: 1040,
        margin: '0 auto',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        color: 'var(--txt)',
        background: 'radial-gradient(120% 100% at 15% -10%, #8578B8 0%, #665896 42%, #4C4076 100%)',
      }}
    >
      <RoadmapHeader accent={ACCENT} stats={stats} />

      <div style={{ padding: '26px 40px 0' }}>
        <CategoryTabs
          items={ITEMS}
          active={cat}
          accent={ACCENT}
          onSelect={(c) => {
            setCat(c);
            setExpandedId(null);
            setAnimTick((t) => t + 1);
          }}
        />
      </div>

      <div style={{ padding: '22px 40px 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '406px 1fr', columnGap: 32 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px 18px 0',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1.1,
              textTransform: 'uppercase',
              color: 'var(--txt-faint)',
              borderRight: '1px solid var(--row-border)',
            }}
          >
            Initiative
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${MONTHS},1fr)` }}>
            {QUARTER_MONTHS.map((m, i) => (
              <div
                key={m}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 30,
                  paddingBottom: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: 'var(--txt-faint)',
                  borderLeft: i === 0 ? 'none' : '1px solid var(--grid-col)',
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 40px 36px' }}>
        {rows.map((item, i) => (
          <TimelineRow
            key={item.id}
            item={item}
            months={MONTHS}
            expanded={expandedId === item.id}
            dimmed={expandedId !== null && expandedId !== item.id}
            delay={i * 34}
            animName={animTick % 2 ? 'rowInB' : 'rowIn'}
            onToggle={() => setExpandedId((cur) => (cur === item.id ? null : item.id))}
          />
        ))}
      </div>
    </div>
  );
}
