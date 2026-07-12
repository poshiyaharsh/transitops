import { Bell, Search, MessageSquare, ChevronRight } from 'lucide-react'
import type { Screen } from '../App'

interface Props { screen: Screen, companyName: string }

export default function TopBar({ screen, companyName }: Props) {
  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userFullName = (user?.firstName || '') + ' ' + (user?.lastName || '');
  const initials = user?.firstName ? (user.firstName[0] + (user.lastName?.[0] || '')).toUpperCase() : 'U';

  return (
    <header style={{
      height: 72,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      gap: 16,
      flexShrink: 0,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{companyName}</span>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{screen}</span>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '0 14px',
        height: 40,
        width: 240,
      }}>
        <Search size={15} color="var(--text-secondary)" />
        <input
          placeholder="Search..."
          style={{
            background: 'none', border: 'none', outline: 'none',
            fontSize: 13, color: 'var(--text-primary)',
            flex: 1, fontFamily: 'Inter, sans-serif',
          }}
        />
      </div>

      {/* Icons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[MessageSquare, Bell].map((Icon, i) => (
          <button key={i} style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
          }}>
            <Icon size={17} color="var(--text-secondary)" />
            {i === 1 && (
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--danger)',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Avatar */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: 'linear-gradient(135deg,#F59E0B,#3B82F6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
      }} title={userFullName.trim() || 'User'}>{initials}</div>
    </header>
  )
}
