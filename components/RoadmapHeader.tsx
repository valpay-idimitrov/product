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
        position: 'relative',
        margin: '0 3px',
        padding: '4px 8px',
        borderRadius: 3,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2.5,
        background: 'var(--note-bg)',
        boxShadow: 'inset 0 0 0 1px #D6337F',
        fontSize: 8,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.15,
        color: 'var(--note-color)',
        whiteSpace: 'nowrap',
        animation: 'internalRing 1.2s ease-in-out infinite',
      }}
    >
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: 999,
          flex: '0 0 auto',
          background: '#D6337F',
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
    `linear-gradient(120deg, color-mix(in srgb, ${accent} 10%, transparent) 0%, transparent 70%)`,
  ].join(',');

  return (
    <div style={{ padding: '32px 40px 30px', background: headBg }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/valpay-logo-transparent.webp" alt="ValPay" style={{ height: 34, display: 'block' }} />
          <span style={{ width: 1.5, height: 20, background: 'var(--txt-faint)', opacity: 0.7 }} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 0.3,
              color: 'var(--txt)',
            }}
          >
            Roadmap
          </span>
          <span style={{ width: 1.5, height: 20, background: 'var(--txt-faint)', opacity: 0.7, marginRight: 4 }} />
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
            background: 'var(--panel-bg)',
            border: '1px solid var(--panel-border)',
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
              Q3–Q4 2026 delivery
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
              background: `conic-gradient(${accent} ${stats.avg * 3.6}deg, var(--ring-track) 0)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'absolute', inset: 7, borderRadius: '50%', background: 'var(--ring-hole)' }} />
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
