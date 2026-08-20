import Overline from './Overline';
import ProgressMeter from './ProgressMeter';
import type { DerivedItem } from '@/lib/derive';

// text-wrap: pretty is newer than some @types/react builds; cast keeps tsc clean.
const PRETTY = { textWrap: 'pretty' } as React.CSSProperties;

const GRID = 'var(--panel-grid)';

export default function DetailPanel({
  item,
  expanded,
}: {
  item: DerivedItem;
  expanded: boolean;
}) {
  const est = item.estimates;
  const hasGroups = item.derivedGroups.length > 0;

  return (
    <div
      style={{
        border: '1px solid var(--hairline)',
        borderRadius: 14,
        background: '#ffffff',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        opacity: expanded ? 1 : 0,
        transform: expanded ? 'translateY(0)' : 'translateY(-6px)',
        transition:
          'opacity .3s cubic-bezier(.22,1,.36,1) .06s, transform .34s cubic-bezier(.22,1,.36,1) .06s',
      }}
    >
      {est && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) auto',
              gap: 36,
              alignItems: 'start',
              padding: '22px 24px 20px',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <Overline>Effort complete</Overline>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '7px 0 13px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 38,
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: -1.6,
                    color: item.areaTextColor,
                  }}
                >
                  {est.effort}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--txt-faint)' }}>
                  {est.effortNote}
                </span>
              </div>

              {/* Two-layer track: written work behind, merged work solid in front. */}
              <div
                style={{
                  position: 'relative',
                  height: 6,
                  borderRadius: 'var(--radius-pill)',
                  overflow: 'hidden',
                  background: 'rgba(23,33,74,.07)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '0 auto 0 0',
                    borderRadius: 'var(--radius-pill)',
                    width: item.effortPct,
                    background: item.areaWritten,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '0 auto 0 0',
                    borderRadius: 'var(--radius-pill)',
                    width: item.deliveredPct,
                    background: item.areaColor,
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 11 }}>
                <Legend swatch={item.areaColor} label={`${est.delivered} merged`} />
                <Legend swatch={item.areaWritten} label="written" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--txt-faint)' }}>
                  {est.deliveredNote}
                </span>
              </div>
            </div>

            <div
              style={{
                flex: '0 0 auto',
                paddingLeft: 28,
                borderLeft: '1px solid rgba(23,33,74,.08)',
                maxWidth: 230,
              }}
            >
              <Overline color="#2A5A96">{item.projLabel}</Overline>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 23,
                  fontWeight: 600,
                  lineHeight: 1.1,
                  letterSpacing: -0.7,
                  marginTop: 7,
                  color: 'var(--txt)',
                }}
              >
                {item.projDate}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9.5,
                  lineHeight: '15px',
                  color: 'var(--txt-faint)',
                  marginTop: 6,
                  ...PRETTY,
                }}
              >
                {item.projNote}
              </div>
            </div>
          </div>

          {/* How the numbers above were derived — kept visible, not in a tooltip. */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              lineHeight: '16px',
              color: 'var(--txt-faint)',
              padding: '11px 24px 12px',
              borderTop: '1px solid rgba(23,33,74,.06)',
              background: 'rgba(23,33,74,.015)',
              ...PRETTY,
            }}
          >
            {est.source}
          </div>
        </>
      )}

      {hasGroups && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: GRID,
              alignItems: 'baseline',
              gap: 14,
              padding: '16px 24px 7px',
              borderTop: '1px solid rgba(23,33,74,.06)',
            }}
          >
            <Overline color="var(--txt)" style={{ gridColumn: '1 / 4' }}>
              To reach 100%
            </Overline>
            <Overline>Complexity</Overline>
            <Overline>Progress</Overline>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9.5,
                fontWeight: 700,
                color: item.areaTextColor,
              }}
            >
              {item.todoSummary}
            </span>
          </div>

          <div style={{ padding: '0 0 8px' }}>
            {item.derivedGroups.map((g) => (
              <div key={g.key} style={{ position: 'relative' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: GRID,
                    alignItems: 'center',
                    gap: 14,
                    padding: '15px 24px 8px',
                  }}
                >
                  <span
                    style={{
                      gridColumn: '1 / 4',
                      minWidth: 0,
                      fontSize: 12.5,
                      fontWeight: 600,
                      letterSpacing: -0.1,
                      color: 'var(--txt)',
                    }}
                  >
                    {g.name}
                  </span>
                  <span
                    style={{
                      gridColumn: '4 / 6',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9.5,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      color: g.remainColor,
                    }}
                  >
                    {g.remainLabel}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9.5,
                      whiteSpace: 'nowrap',
                      color: 'var(--txt-faint)',
                    }}
                  >
                    {g.dateLabel}
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  {/* Connector spine behind the dots; suppressed for single-issue groups. */}
                  {g.spine && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 32,
                        top: 6,
                        bottom: 16,
                        width: 1,
                        background: 'rgba(23,33,74,.14)',
                      }}
                    />
                  )}

                  {g.derivedIssues.map((iss) => (
                    <div
                      key={iss.key}
                      style={{
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: GRID,
                        alignItems: 'center',
                        gap: 14,
                        padding: '6px 24px',
                        borderRadius: 7,
                        transition: 'background .16s var(--ease-snap)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = item.areaHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span
                        title={iss.status}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 13,
                          height: 13,
                          marginLeft: 1,
                          boxSizing: 'border-box',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: 7,
                          fontWeight: 700,
                          lineHeight: 1,
                          color: iss.chip === 'done' || iss.chip === 'blocked' ? '#ffffff' : 'transparent',
                          ...(iss.chip === 'done' || iss.chip === 'blocked'
                            ? { background: iss.dotColor, border: '3px solid #ffffff' }
                            : iss.chip === 'planned'
                              ? { background: '#ffffff', border: '2px solid #C3CAD4', outline: '3px solid #ffffff' }
                              : {
                                  background: `${iss.dotColor}3D`,
                                  border: `2px solid ${iss.dotColor}`,
                                  outline: '3px solid #ffffff',
                                }),
                        }}
                      >
                        {iss.glyph}
                      </span>

                      <a
                        href={iss.jiraUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: 0.2,
                          color: item.areaTextColor,
                          textDecoration: 'none',
                        }}
                      >
                        {iss.key}
                      </a>

                      <span
                        style={{
                          minWidth: 0,
                          fontSize: 12.5,
                          lineHeight: '18px',
                          ...PRETTY,
                          color: iss.labelColor,
                        }}
                      >
                        {iss.label}
                      </span>

                      <span
                        title={`Complexity ${iss.cx || 'not set'}`}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          fontWeight: 600,
                          letterSpacing: 0.3,
                          whiteSpace: 'nowrap',
                          color: iss.cxColor,
                        }}
                      >
                        {iss.cxName}
                      </span>

                      <ProgressMeter issue={iss} />

                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          fontWeight: 600,
                          letterSpacing: 0.4,
                          whiteSpace: 'nowrap',
                          color: 'var(--txt-muted)',
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: 'var(--radius-pill)',
                            flex: '0 0 auto',
                            background: iss.dotColor,
                          }}
                        />
                        {iss.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!hasGroups && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: 'var(--txt-faint)',
            padding: '14px 24px 16px',
            borderTop: est ? '1px solid rgba(23,33,74,.06)' : 'none',
          }}
        >
          No linked Jira issues yet
        </div>
      )}
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        color: 'var(--txt-muted)',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 2, flex: '0 0 auto', background: swatch }} />
      {label}
    </span>
  );
}
