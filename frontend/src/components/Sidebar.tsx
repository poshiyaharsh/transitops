import {
  LayoutDashboard, Truck, Users, MapPin, Wrench, Fuel, BarChart3, Settings, Zap, LogOut
} from 'lucide-react'
import type { Screen } from '../App'

const NAV_ITEMS: { label: Screen; icon: React.ReactNode }[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Fleet', icon: <Truck size={18} /> },
  { label: 'Drivers', icon: <Users size={18} /> },
  { label: 'Trips', icon: <MapPin size={18} /> },
  { label: 'Maintenance', icon: <Wrench size={18} /> },
  { label: 'Fuel & Expenses', icon: <Fuel size={18} /> },
  { label: 'Analytics', icon: <BarChart3 size={18} /> },
  { label: 'Settings', icon: <Settings size={18} /> },
]

interface Props {
  active: Screen
  onNavigate: (s: Screen) => void
  onLogout: () => void
  companyName: string
}

export default function Sidebar({ active, onNavigate, onLogout, companyName }: Props) {
  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userFullName = (user?.firstName || '') + ' ' + (user?.lastName || '');
  const initials = user?.firstName ? (user.firstName[0] + (user.lastName?.[0] || '')).toUpperCase() : 'U';

  return (
    <aside style={{
      width: 260,
      minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        height: 72,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: 10,
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={18} color="#fff" fill="#fff" />
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {companyName}
        </span>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>
          Main Menu
        </p>
        {NAV_ITEMS.map(({ label, icon }) => {
          const isActive = active === label
          return (
            <button
              key={label}
              onClick={() => onNavigate(label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '11px 14px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary)' : 'transparent',
                transition: 'all 0.15s ease',
                marginBottom: 2,
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{icon}</span>
              {label}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg,#F59E0B,#3B82F6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>{initials}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userFullName.trim() || 'Unknown'}</p>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user?.role || 'User'}</p>
        </div>
        <button onClick={onLogout} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 8, borderRadius: 8,
          color: 'var(--text-secondary)'
        }}
        title="Log out"
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
