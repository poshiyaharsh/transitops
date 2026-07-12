import { useState } from 'react'
import { Plus, AlertTriangle, Star, Phone, Mail } from 'lucide-react'
import { Card, Badge, PageHeader, PrimaryBtn } from '../components/UI'

const DRIVERS = [
  { id: 'DRV-001', name: 'Emeka Obi', phone: '+234 801 234 5678', email: 'emeka@transitops.io', license: 'FG-8821-NG', expiry: '2025-04-15', status: 'Available', rating: 4.9, trips: 312, vehicle: 'TRK-101' },
  { id: 'DRV-002', name: 'Fatima Bello', phone: '+234 802 345 6789', email: 'fatima@transitops.io', license: 'FG-7744-NG', expiry: '2026-09-30', status: 'On Trip', rating: 4.7, trips: 248, vehicle: 'TRK-102' },
  { id: 'DRV-003', name: 'Uche Eze', phone: '+234 803 456 7890', email: 'uche@transitops.io', license: 'FG-5512-NG', expiry: '2026-01-10', status: 'Available', rating: 4.8, trips: 189, vehicle: 'VAN-201' },
  { id: 'DRV-004', name: 'Tunde Adeyemi', phone: '+234 804 567 8901', email: 'tunde@transitops.io', license: 'FG-3301-NG', expiry: '2025-11-22', status: 'On Trip', rating: 4.5, trips: 421, vehicle: 'VAN-202' },
  { id: 'DRV-005', name: 'Chioma Nwosu', phone: '+234 805 678 9012', email: 'chioma@transitops.io', license: 'FG-9981-NG', expiry: '2027-03-18', status: 'Available', rating: 4.9, trips: 156, vehicle: 'TRK-105' },
  { id: 'DRV-006', name: 'Bayo Ogundimu', phone: '+234 806 789 0123', email: 'bayo@transitops.io', license: 'FG-1155-NG', expiry: '2024-12-01', status: 'Inactive', rating: 3.8, trips: 88, vehicle: '—' },
]

function isExpiringSoon(date: string): boolean {
  const exp = new Date(date)
  const now = new Date()
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diff < 90
}

export default function Drivers() {
  const [filter, setFilter] = useState('All')
  const statuses = ['All', 'Available', 'On Trip', 'Inactive']

  const data = DRIVERS.filter(d => filter === 'All' || d.status === filter)

  return (
    <div>
      <PageHeader
        title="Drivers"
        subtitle={`${DRIVERS.length} drivers registered`}
        action={<PrimaryBtn><Plus size={16} /> Add Driver</PrimaryBtn>}
      />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 16px', borderRadius: 8, border: '1px solid',
            borderColor: filter === s ? 'var(--primary)' : 'var(--border)',
            background: filter === s ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: filter === s ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {data.map(d => {
          const expiring = isExpiringSoon(d.expiry)
          return (
            <Card key={d.id} style={{ cursor: 'pointer', transition: 'transform 0.15s,box-shadow 0.15s' }}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `hsl(${d.id.charCodeAt(4) * 12},60%,40%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{d.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{d.id}</p>
                  </div>
                </div>
                <Badge status={d.status} />
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Safety Rating</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{d.rating}</span>
                  </div>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Total Trips</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{d.trips}</p>
                </div>
              </div>

              {/* License */}
              <div style={{
                padding: '10px 12px', borderRadius: 10,
                background: expiring ? 'rgba(245,158,11,0.08)' : 'var(--surface)',
                border: `1px solid ${expiring ? 'rgba(245,158,11,0.3)' : 'transparent'}`,
                marginBottom: 14,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>License: <b style={{ color: 'var(--text-primary)' }}>{d.license}</b></span>
                  {expiring && <AlertTriangle size={13} color="var(--warning)" />}
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: expiring ? 'var(--warning)' : 'var(--text-secondary)' }}>
                  Expires {d.expiry}{expiring ? ' — Renew soon' : ''}
                </p>
              </div>

              {/* Contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Phone size={13} color="var(--text-secondary)" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.phone}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Mail size={13} color="var(--text-secondary)" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.email}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
