'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import DetailPanel from './DetailPanel';
import DoneBadge from './DoneBadge';
import type { DerivedItem } from '@/lib/derive';

export default function TimelineRow({
  item,
  months,
  expanded,
  dimmed,
  delay,
  onToggle,
}: {
  item: DerivedItem;
  months: number;
  expanded: boolean;
  dimmed: boolean;
  delay: number;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  /**
   * The panel stays mounted so it can animate closed as well as open, and its
   * height is measured rather than guessed — a hard-coded max-height clips the
   * taller rows (VP-605 alone runs past 1200px).
   */
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setHeight(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      style={{
        borderTop: '1px solid var(--row-border)',
        opacity: dimmed ? 0.6 : 1,
        transition: 'background .18s var(--ease-snap), opacity .26s var(--ease-snap)',
      }}
    >
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        style={{
          display: 'grid',
          gridTemplateColumns: '406px 1fr',
          columnGap: 32,
          alignItems: 'stretch',
          minHeight: 66,
          padding: '3px 0',
          cursor: 'pointer',
          animation: 'rowIn .34s var(--ease-snap) both',
          animationDelay: `${delay}ms`,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 3,
            padding: '10px 20px 10px 0',
            minWidth: 0,
            borderRight: '1px solid var(--row-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
            <span
              title={item.groupTitle}
              style={{
                flex: '0 0 auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 16,
                lineHeight: 1,
                borderRadius: 2,
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                whiteSpace: 'nowrap',
                background: item.areaBadge,
                color: item.areaTextColor,
              }}
            >
              {item.groupCode}
            </span>

            <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span
                title={item.title}
                style={{
                  minWidth: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: '16px',
                  letterSpacing: -0.15,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'var(--txt)',
                }}
              >
                {item.title}
              </span>
              {item.titleNote && (
                <span
                  style={{
                    flex: '0 0 auto',
                    fontSize: 10.5,
                    fontWeight: 500,
                    lineHeight: '16px',
                    whiteSpace: 'nowrap',
                    color: 'var(--txt-faint)',
                  }}
                >
                  {item.titleNote}
                </span>
              )}
            </div>

            {item.showCheck && <DoneBadge />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 37, minWidth: 0 }}>
            <span style={{ flex: '0 0 auto', width: 7, height: 7, borderRadius: 2, background: item.areaColor }} />
            <span
              style={{
                fontSize: 9.5,
                lineHeight: '14px',
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                color: 'var(--txt-faint)',
                whiteSpace: 'nowrap',
              }}
            >
              {item.area}
            </span>
            <span
              style={{
                fontSize: 9,
                lineHeight: '14px',
                fontWeight: 700,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
                color: item.priorityColor,
                whiteSpace: 'nowrap',
              }}
            >
              {item.priority}
            </span>
          </div>
        </div>

        <div style={{ position: 'relative', minHeight: 62 }}>
          {/* Month gridlines */}
          {Array.from({ length: months - 1 }, (_, k) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 1,
                background: 'var(--grid-col)',
                left: `${((k + 1) * 100) / months}%`,
              }}
            />
          ))}

          <div
            title={item.desc}
            style={{
              position: 'absolute',
              top: 'calc(50% - 12px)',
              height: 24,
              left: item.barLeft,
              width: item.barWidth,
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: `color-mix(in srgb, ${item.areaColor} 9%, #ffffff)`,
              boxShadow: `inset 0 0 0 1px ${item.areaHover}`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '0 auto 0 0',
                width: `${item.progress}%`,
                background: `repeating-linear-gradient(135deg, color-mix(in srgb, ${item.areaColor} 34%, #ffffff) 0 5px, color-mix(in srgb, ${item.areaColor} 16%, #ffffff) 5px 10px)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '0 auto 0 0',
                width: item.deliveredPct,
                background: item.areaColor,
              }}
            />
            {item.progress > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: item.areaTextColor,
                  left: `${item.progress}%`,
                  transform: 'translateX(-2px)',
                }}
              />
            )}

            <span
              style={{
                position: 'relative',
                margin: '0 4px',
                padding: '2px 7px',
                borderRadius: 3,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.3,
                whiteSpace: 'nowrap',
                color: '#ffffff',
                background: item.areaTextColor,
              }}
            >
              {item.progress}%
            </span>
            <span
              style={{
                position: 'relative',
                margin: '0 4px 0 5px',
                padding: '3px 7px',
                borderRadius: 3,
                background: '#ffffff',
                boxShadow: `inset 0 0 0 1px ${item.areaHover}`,
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.3,
                whiteSpace: 'nowrap',
                color: item.areaTextColor,
              }}
            >
              {item.dateLabel}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          maxHeight: expanded ? height : 0,
          overflow: 'hidden',
          transition: 'max-height .44s var(--ease-snap)',
        }}
      >
        <div ref={contentRef} style={{ paddingBottom: 18 }}>
          <div style={{ padding: '18px 24px 22px 37px' }}>
            <DetailPanel item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}
