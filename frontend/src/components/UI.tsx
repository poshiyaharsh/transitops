import { TrendingUp } from 'lucide-react'

export function Card({ children, style, onMouseEnter, onMouseLeave }: {
  children: React.ReactNode; style?: React.CSSProperties
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
}) {
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 18,
      padding: 24,
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function StatCard({ icon, label, value, delta, color }: {
  icon: React.ReactNode; label: string; value: string; delta: string; color: string
}) {
  const isUp = delta.startsWith('+')
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</p>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</p>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: isUp ? 'var(--success)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {isUp ? <TrendingUp size={12} /> : null}
            {delta}
          </p>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{children}</h3>
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Available: { bg: 'rgba(34,197,94,0.12)', text: '#22C55E' },
  'On Trip': { bg: 'rgba(59,130,246,0.12)', text: '#3B82F6' },
  Maintenance: { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B' },
  Retired: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444' },
  Completed: { bg: 'rgba(34,197,94,0.12)', text: '#22C55E' },
  Cancelled: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444' },
  Scheduled: { bg: 'rgba(249,115,22,0.12)', text: '#F97316' },
  Active: { bg: 'rgba(56,189,248,0.12)', text: '#38BDF8' },
  Inactive: { bg: 'rgba(156,163,175,0.12)', text: '#9CA3AF' },
}

export function Badge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: 'rgba(156,163,175,0.12)', text: '#9CA3AF' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.text,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.text, marginRight: 6, flexShrink: 0 }} />
      {status}
    </span>
  )
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{title}</h1>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function PrimaryBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      height: 44, padding: '0 20px', borderRadius: 12,
      background: disabled ? 'var(--border)' : 'var(--primary)', border: 'none',
      color: disabled ? 'var(--text-secondary)' : '#fff', fontSize: 14, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--primary-hover)' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = 'var(--primary)' }}
    >
      {children}
    </button>
  )
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder ?? 'Search...'}
      style={{
        height: 40, width: 240, borderRadius: 10,
        background: 'var(--surface)', border: '1px solid var(--border)',
        color: 'var(--text-primary)', fontSize: 13,
        padding: '0 14px', fontFamily: 'Inter, sans-serif', outline: 'none',
      }}
    />
  )
}
