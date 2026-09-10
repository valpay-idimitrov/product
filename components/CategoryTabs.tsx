'use client';

import { AREA_COLORS } from '@/lib/data';
import { lightenForDark } from '@/lib/derive';
import type { Item } from '@/lib/types';

const SNAP = 'cubic-bezier(.22,1,.36,1)';

export default function CategoryTabs({
  items,
  active,
  accent,
  onSelect,
}: {
  items: Item[];
  active: string;
  accent: string;
  onSelect: (cat: string) => void;
}) {
  const names = ['All', ...Object.keys(AREA_COLORS).filter((a) => items.some((it) => it.area === a))];

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 2, borderBottom: '1px solid var(--row-border)' }}>
      {names.map((name) => {
        const color = name === 'All' ? accent : lightenForDark(AREA_COLORS[name]);
        const on = name === active;
        const count = name === 'All' ? items.length : items.filter((it) => it.area === name).length;
        return (
          <button
            key={name}
            onClick={() => onSelect(name)}
            title={name}
            style={{
              position: 'relative',
              flex: '1 1 auto',
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: -0.1,
              padding: '9px 8px 8px',
              border: '1px solid',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: `background .2s ${SNAP}, color .2s ${SNAP}, border-color .2s ${SNAP}`,
              ...(on
                ? {
                    background: 'var(--card-bg)',
                    color,
                    borderColor: 'var(--row-border)',
                    borderBottomColor: 'var(--card-bg)',
                    marginBottom: -1,
                    fontWeight: 600,
                  }
                : {
                    background: `color-mix(in srgb, ${color} 10%, transparent)`,
                    color: 'var(--txt-muted)',
                    borderColor: 'transparent',
                    borderBottomColor: 'var(--row-border)',
                    fontWeight: 500,
                  }),
            }}
          >
            {/* Accent strip sits inside the tab so the border box stays 1px. */}
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                borderRadius: '6px 6px 0 0',
                background: on ? color : 'transparent',
                transition: `background .2s ${SNAP}`,
              }}
            />
            <span style={{ width: 7, height: 7, borderRadius: 2, flex: '0 0 auto', background: color }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 3,
                transition: `all .2s ${SNAP}`,
                ...(on
                  ? { background: `color-mix(in srgb, ${color} 20%, transparent)`, color }
                  : { background: 'rgba(255,255,255,.08)' }),
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
