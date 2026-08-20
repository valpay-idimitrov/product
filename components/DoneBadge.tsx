/** Shipped marker: the tick draws itself once, then the ring pulses. */
export default function DoneBadge({ size = 16 }: { size?: number }) {
  return (
    <span
      title="Shipped"
      style={{
        flex: '0 0 auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 'var(--radius-pill)',
        background: '#22c55e',
        animation: 'doneRing 2.6s ease-out infinite',
      }}
    >
      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M2.5 6.4 L4.9 8.8 L9.5 3.4"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="16"
          style={{ animation: 'doneDraw .55s cubic-bezier(.65,0,.35,1) .25s both' }}
        />
      </svg>
    </span>
  );
}
