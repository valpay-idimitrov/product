/** Shipped marker: the tick draws itself once, then the ring keeps pulsing. */
export default function ShippedBadge({
  size = 16,
  stroke = 2.2,
  style,
}: {
  size?: number;
  stroke?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      title="Shipped"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 'var(--radius-pill)',
        background: '#22C55E',
        border: '2px solid #ffffff',
        boxSizing: 'border-box',
        animation: 'doneRing 2.6s ease-out infinite',
        ...style,
      }}
    >
      <svg width={size / 2} height={size / 2} viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M2.5 6.4 L4.9 8.8 L9.5 3.4"
          stroke="#ffffff"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="16"
          style={{ animation: 'doneDraw .55s cubic-bezier(.65,0,.35,1) .25s both' }}
        />
      </svg>
    </span>
  );
}
