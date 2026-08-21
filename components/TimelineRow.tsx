'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import DetailPanel from './DetailPanel';
import ShippedBadge from './ShippedBadge';
import type { DerivedItem } from '@/lib/derive';

const SNAP = 'cubic-bezier(.22,1,.36,1)';
const MONO = 'var(--font-mono)';

export default function TimelineRow({
  item,
  months,
  expanded,
  dimmed,
  delay,
  animName,
  onToggle,
}: {
  item: DerivedItem;
  months: number;
  expanded: boolean;
  dimmed: boolean;
  delay: number;
  /** Alternates per tab switch so the entrance animation replays. */
  animName: string;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [hover, setHover] = useState(false);

  /**
   * The panel stays mounted so it animates closed as well as open, and its
   * height is measured rather than assumed — a fixed max-height clips the
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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderTop: '1px solid var(--row-border)',
        background: hover ? 'rgba(128,128,128,0.04)' : 'transparent',
        opacity: dimmed ? 0.6 : 1,
        transition: `background .18s ${SNAP}, opacity .26s ${SNAP}`,
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
          // Delay lives in the shorthand: a sibling animationDelay key resets it.
          animation: `${animName} .34s ${SNAP} ${delay}ms both`,
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
            {/* Relative wrapper hosts the shipped badge on the code's corner. */}
            <span style={{ position: 'relative', flex: '0 0 auto', display: 'inline-flex' }}>
              <span
                title={item.groupTitle}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 26,
                  height: 16,
                  lineHeight: 1,
                  borderRadius: 2,
                  fontFamily: MONO,
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
              {item.showCheck && (
                <ShippedBadge size={14} stroke={2.4} style={{ position: 'absolute', top: -6, right: -6, zIndex: 4 }} />
              )}
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
          {Array.from({ length: months - 1 }, (_, k) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 1,
                transform: 'translateX(-0.5px)',
                background: 'var(--grid-col)',
                zIndex: 0,
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
              // Floor so a one-week span stays legible; does not shift any date.
              minWidth: 62,
              borderRadius: 4,
              overflow: 'hidden',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: item.areaSoft,
              boxShadow: `inset 0 0 0 1px ${item.areaHover}`,
            }}
          >
            {/* Single gradient fill with a slow shimmer sweep over it. */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${item.progress}%`,
                background: item.areaGrad,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(100deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%)',
                  backgroundSize: '220% 100%',
                  animation: 'shimmer 7s ease-in-out infinite',
                }}
              />
            </div>

            {/* Below ~130px the bar cannot hold both chips; they render outside
                the overflow:hidden box instead of being clipped. */}
            {!item.narrowBar && (
              <>
                <span
                  style={{
                    position: 'relative',
                    margin: '0 4px',
                    padding: '2px 7px',
                    borderRadius: 3,
                    fontFamily: MONO,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    whiteSpace: 'nowrap',
                    color: '#fff',
                    background: item.areaTextColor,
                  }}
                >
                  {item.progress}%
                </span>
                {item.note ? (
                  <span
                    title={item.note}
                    style={{
                      position: 'relative',
                      margin: '0 4px 0 5px',
                      padding: '3px 7px',
                      borderRadius: 3,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#ffffff',
                      boxShadow: 'inset 0 0 0 1px rgba(214,51,127,.45)',
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      color: '#A11A5B',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: 999, flex: '0 0 auto', background: '#D6337F' }} />
                    {item.note}
                  </span>
                ) : (
                <span
                  style={{
                    position: 'relative',
                    margin: '0 4px 0 5px',
                    padding: '3px 7px',
                    borderRadius: 3,
                    background: '#ffffff',
                    boxShadow: `inset 0 0 0 1px ${item.areaHover}`,
                    fontFamily: MONO,
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
                )}
              </>
            )}
          </div>

          {item.narrowBar && (
            <span
              style={{
                position: 'absolute',
                top: 'calc(50% - 10px)',
                ...item.labelSide,
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  padding: '2px 7px',
                  borderRadius: 3,
                  fontFamily: MONO,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  color: '#fff',
                  background: item.areaTextColor,
                }}
              >
                {item.progress}%
              </span>
              {item.note ? (
                <span
                  title={item.note}
                  style={{
                    padding: '3px 7px',
                    borderRadius: 3,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#ffffff',
                    boxShadow: 'inset 0 0 0 1px rgba(214,51,127,.45)',
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    color: '#A11A5B',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: 999, flex: '0 0 auto', background: '#D6337F' }} />
                  {item.note}
                </span>
              ) : (
              <span
                style={{
                  padding: '3px 7px',
                  borderRadius: 3,
                  background: '#ffffff',
                  boxShadow: `inset 0 0 0 1px ${item.areaHover}`,
                  fontFamily: MONO,
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.3,
                  color: item.areaTextColor,
                }}
              >
                {item.dateLabel}
              </span>
              )}
            </span>
          )}

          {item.showCheck && (
            <ShippedBadge
              size={16}
              stroke={2.2}
              style={{
                position: 'absolute',
                top: 'calc(50% - 19px)',
                left: item.barRight,
                transform: 'translateX(-50%)',
                zIndex: 4,
              }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          maxHeight: expanded ? height : 0,
          overflow: 'hidden',
          transition: `max-height .44s ${SNAP}`,
        }}
      >
        <div ref={contentRef} style={{ paddingBottom: 18 }}>
          <div style={{ padding: '18px 24px 22px 37px' }}>
            <DetailPanel item={item} expanded={expanded} />
          </div>
        </div>
      </div>
    </div>
  );
}
