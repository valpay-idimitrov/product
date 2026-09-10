import { AREA_COLORS } from '@/lib/data';
import type { Item } from '@/lib/types';

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
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 8, flexWrap: 'wrap' }}>
      {names.map((name) => {
        const color = name === 'All' ? accent : AREA_COLORS[name];
        const on = name === active;
        const count = name === 'All' ? items.length : items.filter((it) => it.area === name).length;
        return (
          <button
            key={name}
            onClick={() => onSelect(name)}
            title={name}
            style={{
              position: 'relative',
              flex: '1 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: -0.1,
              padding: '8px 14px',
              border: '1px solid',
              borderRadius: 999,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background .2s cubic-bezier(.22,1,.36,1), color .2s cubic-bezier(.22,1,.36,1), border-color .2s cubic-bezier(.22,1,.36,1)',
              ...(on
                ? { background: 'rgba(183,156,232,0.18)', color: '#FFFFFF', borderColor: '#B79CE8', fontWeight: 600 }
                : { background: 'rgba(255,255,255,0.04)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.12)', fontWeight: 500 }),
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 2, flex: '0 0 auto', background: color }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 3,
                transition: 'all .2s cubic-bezier(.22,1,.36,1)',
                ...(on
                  ? { background: `color-mix(in srgb, ${color} 12%, transparent)`, color }
                  : { background: 'rgba(23,33,74,.05)' }),
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
