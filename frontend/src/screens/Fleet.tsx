import { useState } from 'react'
import { Plus, Filter, Search, MoreHorizontal, Eye } from 'lucide-react'
import { Card, Badge, PageHeader, PrimaryBtn } from '../components/UI'

const VEHICLES = [
  { id: 'TRK-101', make: 'Mercedes Benz Actros', year: 2022, type: 'Heavy Truck', driver: 'Emeka Obi', status: 'Available', mileage: '48,200 km', fuel: '62%' },
  { id: 'TRK-102', make: 'MAN TGS 26.440', year: 2021, type: 'Heavy Truck', driver: 'Fatima Bello', status: 'On Trip', mileage: '71,450 km', fuel: '38%' },
  { id: 'TRK-103', make: 'Isuzu FTR 850', year: 2023, type: 'Medium Truck', driver: '—', status: 'Maintenance', mileage: '22,800 km', fuel: '80%' },
  { id: 'VAN-201', make: 'Toyota HiAce', year: 2022, type: 'Minivan', driver: 'Uche Eze', status: 'Available', mileage: '31,600 km', fuel: '55%' },
  { id: 'VAN-202', make: 'Ford Transit Custom', year: 2020, type: 'Minivan', driver: 'Tunde Adeyemi', status: 'On Trip', mileage: '95,300 km', fuel: '24%' },
  { id: 'TRK-104', make: 'DAF XF 480', year: 2021, type: 'Heavy Truck', driver: '—', status: 'Available', mileage: '61,100 km', fuel: '90%' },
  { id: 'TRK-105', make: 'Scania R500', year: 2019, type: 'Heavy Truck', driver: 'Chioma Nwosu', status: 'On Trip', mileage: '110,200 km', fuel: '41%' },
  { id: 'TRK-106', make: 'Volvo FH16', year: 2018, type: 'Heavy Truck', driver: '—', status: 'Retired', mileage: '215,400 km', fuel: '0%' },
]

const COLS = ['Vehicle ID', 'Make & Model', 'Type', 'Assigned Driver', 'Status', 'Mileage', 'Fuel', 'Actions']

export default function Fleet() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const statuses = ['All', 'Available', 'On Trip', 'Maintenance', 'Retired']
  const data = VEHICLES.filter(v =>
    (filter === 'All' || v.status === filter) &&
    (v.id.toLowerCase().includes(search.toLowerCase()) || v.make.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <PageHeader
        title="Fleet Management"
        subtitle={`${VEHICLES.length} vehicles registered`}
        action={<PrimaryBtn><Plus size={16} /> Add Vehicle</PrimaryBtn>}
      />

      {/* Summary pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total', count: 8, color: 'var(--text-secondary)' },
          { label: 'Available', count: 3, color: 'var(--success)' },
          { label: 'On Trip', count: 3, color: 'var(--secondary)' },
          { label: 'Maintenance', count: 1, color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '14px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</span>
          </div>
        ))}
      </div>

      <Card>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '7px 14px', borderRadius: 8, border: '1px solid',
                borderColor: filter === s ? 'var(--primary)' : 'var(--border)',
                background: filter === s ? 'rgba(245,158,11,0.1)' : 'transparent',
                color: filter === s ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: 12 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicles..."
                style={{ height: 38, paddingLeft: 36, paddingRight: 12, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
            </div>
            <button style={{ height: 38, padding: '0 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif' }}>
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {COLS.map(c => (
                <th key={c} style={{ textAlign: 'left', padding: '0 12px 12px 0', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={td}><span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{v.id}</span></td>
                <td style={td}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{v.make}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{v.year}</p>
                </td>
                <td style={{ ...td, color: 'var(--text-secondary)', fontSize: 13 }}>{v.type}</td>
                <td style={{ ...td, fontSize: 13 }}>{v.driver}</td>
                <td style={td}><Badge status={v.status} /></td>
                <td style={{ ...td, fontSize: 13, color: 'var(--text-secondary)' }}>{v.mileage}</td>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 64, height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: v.fuel,
                        background: parseInt(v.fuel) < 30 ? 'var(--danger)' : parseInt(v.fuel) < 60 ? 'var(--warning)' : 'var(--success)',
                      }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{v.fuel}</span>
                  </div>
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={iconBtn}><Eye size={14} /></button>
                    <button style={iconBtn}><MoreHorizontal size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

const td: React.CSSProperties = { padding: '14px 12px 14px 0', verticalAlign: 'middle' }
const iconBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
  background: 'transparent', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
}
