export interface HeaderStats {
  avg: number;
  status: string;
  priorityMix: string;
}

const SNAP = 'cubic-bezier(.22,1,.36,1)';

function InternalUsePill() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        padding: '2px 6px',
        borderRadius: 3,
        background: '#ffffff',
        boxShadow: 'inset 0 0 0 1px #D6337F',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        color: '#A11A5B',
        animation: 'internalRing 2.1s ease-in-out 1.5s infinite',
      }}
    >
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: 999,
          flex: '0 0 auto',
          background: '#D6337F',
          animation: 'pipPulse 2.1s ease-in-out 1.5s infinite',
        }}
      />
      Internal use only
    </span>
  );
}

export default function RoadmapHeader({ accent, stats }: { accent: string; stats: HeaderStats }) {
  const headBg = [
    `radial-gradient(110% 130% at 0% -20%, color-mix(in srgb, ${accent} 16%, transparent) 0%, transparent 48%)`,
    `radial-gradient(90% 120% at 100% 0%, color-mix(in srgb, ${accent} 10%, transparent) 0%, transparent 52%)`,
    `linear-gradient(120deg, color-mix(in srgb, ${accent} 6%, #ffffff) 0%, transparent 70%)`,
  ].join(',');

  return (
    <div style={{ padding: '32px 40px 30px', background: headBg }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <img src="/valpay-favicon.png" alt="" style={{ height: 56, display: 'block' }} />
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: -1.2,
              color: 'var(--txt)',
            }}
          >
            Q3 Roadmap
          </h1>
          <InternalUsePill />
        </div>

        <div
          style={{
            display: 'flex',
            flex: '0 0 auto',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            marginLeft: 'auto',
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(23,33,74,0.018)',
            border: '1px solid rgba(23,33,74,0.06)',
          }}
        >
          <div style={{ order: 1, flex: '0 0 auto', minWidth: 158 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9.5,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                whiteSpace: 'nowrap',
                color: 'var(--txt-muted)',
              }}
            >
              Q3 2026 delivery
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: -0.3,
                whiteSpace: 'nowrap',
                color: 'var(--txt)',
                marginTop: 3,
              }}
            >
              {stats.status}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                whiteSpace: 'nowrap',
                color: 'var(--txt-muted)',
                marginTop: 3,
              }}
            >
              {stats.priorityMix}
            </div>
          </div>

          <div
            style={{
              order: 2,
              position: 'relative',
              width: 64,
              height: 64,
              flex: '0 0 auto',
              borderRadius: '50%',
              background: `conic-gradient(${accent} ${stats.avg * 3.6}deg, rgba(23,33,74,0.10) 0)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'absolute', inset: 7, borderRadius: '50%', background: '#ffffff' }} />
            <span
              style={{
                position: 'relative',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 17,
                letterSpacing: -1,
                color: 'var(--txt)',
              }}
            >
              {stats.avg}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
