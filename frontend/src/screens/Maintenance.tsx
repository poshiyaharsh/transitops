import { Plus, Wrench, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { Card, Badge, PageHeader, PrimaryBtn } from '../components/UI'

const LOGS = [
  { id: 'MNT-441', vehicle: 'TRK-103', type: 'Engine Overhaul', tech: 'Ade Mechanics Ltd', date: '2026-07-10', cost: '₦480,000', status: 'Maintenance', note: 'Cylinder head gasket replaced' },
  { id: 'MNT-440', vehicle: 'TRK-101', type: 'Oil & Filter Change', tech: 'In-house', date: '2026-07-08', cost: '₦12,500', status: 'Completed', note: 'Next due at 50,000 km' },
  { id: 'MNT-439', vehicle: 'VAN-202', type: 'Brake Pad Replacement', tech: 'BrakePro Workshop', date: '2026-07-05', cost: '₦38,000', status: 'Completed', note: 'Front and rear done' },
  { id: 'MNT-438', vehicle: 'TRK-102', type: 'Tire Rotation', tech: 'In-house', date: '2026-07-01', cost: '₦5,000', status: 'Completed', note: '' },
  { id: 'MNT-437', vehicle: 'TRK-106', type: 'Full Inspection', tech: 'TransitCare Ltd', date: '2026-06-28', cost: '₦75,000', status: 'Completed', note: 'Vehicle flagged for retirement' },
]

const UPCOMING = [
  { vehicle: 'TRK-101', service: 'Oil Change', due: '50,000 km', current: '48,200 km', urgency: 'warning' },
  { vehicle: 'TRK-118', service: 'Brake Inspection', due: 'Overdue', current: '—', urgency: 'danger' },
  { vehicle: 'VAN-201', service: 'Annual Inspection', due: '2026-08-01', current: '—', urgency: 'info' },
  { vehicle: 'TRK-102', service: 'Tire Change', due: '75,000 km', current: '71,450 km', urgency: 'warning' },
]

export default function Maintenance() {
  return (
    <div>
      <PageHeader
        title="Maintenance"
        subtitle="Service history and upcoming maintenance"
        action={<PrimaryBtn><Plus size={16} /> Log Service</PrimaryBtn>}
      />

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: <Wrench size={18} />, label: 'In Service', value: '1', color: 'var(--warning)' },
          { icon: <CheckCircle2 size={18} />, label: 'Completed (MTD)', value: '4', color: 'var(--success)' },
          { icon: <AlertTriangle size={18} />, label: 'Overdue', value: '1', color: 'var(--danger)' },
          { icon: <Clock size={18} />, label: 'Upcoming (30d)', value: '3', color: 'var(--info)' },
        ].map(s => (
          <Card key={s.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        {/* Log */}
        <Card>
          <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700 }}>Service Log</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Vehicle', 'Service Type', 'Technician', 'Date', 'Cost', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', padding: '0 10px 12px 0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOGS.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={td}><span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12 }}>{l.id}</span></td>
                  <td style={td}><span style={{ fontWeight: 600, fontSize: 13 }}>{l.vehicle}</span></td>
                  <td style={td}>
                    <p style={{ margin: 0, fontSize: 13 }}>{l.type}</p>
                    {l.note && <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{l.note}</p>}
                  </td>
                  <td style={{ ...td, fontSize: 13, color: 'var(--text-secondary)' }}>{l.tech}</td>
                  <td style={{ ...td, fontSize: 13, color: 'var(--text-secondary)' }}>{l.date}</td>
                  <td style={{ ...td, fontSize: 13, fontWeight: 600 }}>{l.cost}</td>
                  <td style={td}><Badge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Upcoming */}
        <Card>
          <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700 }}>Upcoming Service</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {UPCOMING.map(u => {
              const color = u.urgency === 'danger' ? 'var(--danger)' : u.urgency === 'warning' ? 'var(--warning)' : 'var(--info)'
              return (
                <div key={u.vehicle + u.service} style={{
                  padding: '14px 16px', borderRadius: 12,
                  background: 'var(--surface)',
                  border: `1px solid ${u.urgency === 'danger' ? 'rgba(239,68,68,0.3)' : u.urgency === 'warning' ? 'rgba(245,158,11,0.2)' : 'var(--border)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color }}>{u.vehicle}</span>
                    {u.urgency === 'danger' && <AlertTriangle size={14} color="var(--danger)" />}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{u.service}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>Due: {u.due} {u.current !== '—' ? `· Current: ${u.current}` : ''}</p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

const td: React.CSSProperties = { padding: '12px 10px 12px 0', verticalAlign: 'top' }
