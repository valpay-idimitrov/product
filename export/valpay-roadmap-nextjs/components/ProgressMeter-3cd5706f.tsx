import type { DerivedIssue } from '@/lib/derive';

const PIPS = [1, 2, 3, 4, 5];

/**
 * Five-pip workflow meter. Fill count is the issue's position in the pipeline
 * (Backlog 0 → Done 5) and the colour is its status, so a completed issue reads
 * green and full rather than faint.
 */
export default function ProgressMeter({ issue }: { issue: DerivedIssue }) {
  return (
    <span
      title={`${issue.status} — ${issue.isDone ? 'complete' : 'in flight'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        animation: issue.isDone ? 'pipPulse 2.1s ease-in-out infinite' : undefined,
      }}
    >
      {PIPS.map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 11,
            borderRadius: 1.5,
            background: i <= issue.level ? issue.meterColor : 'rgba(255,255,255,0.14)',
          }}
        />
      ))}
    </span>
  );
}
