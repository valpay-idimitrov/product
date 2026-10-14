export default function Overline({
  children,
  color = 'var(--txt-faint)',
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 8.5,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1.15,
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
