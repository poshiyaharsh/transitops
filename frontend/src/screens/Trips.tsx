import { useState } from 'react'
import { Plus, MapPin, User, Truck } from 'lucide-react'
import { Card, Badge, PageHeader, PrimaryBtn } from '../components/UI'

const TRIPS = [
  { id: 'TRP-8821', from: 'Lagos HQ', to: 'Abuja Terminal', driver: 'Emeka Obi', vehicle: 'TRK-101', status: 'Completed', departure: '06:00', arrival: '08:14', date: '2026-07-12', distance: '762 km' },
  { id: 'TRP-8820', from: 'Port Harcourt', to: 'Warri Depot', driver: 'Fatima Bello', vehicle: 'TRK-102', status: 'On Trip', departure: '09:30', arrival: '—', date: '2026-07-12', distance: '196 km' },
  { id: 'TRP-8819', from: 'Kano Hub', to: 'Kaduna Yard', driver: 'Uche Eze', vehicle: 'VAN-201', status: 'Completed', departure: '07:15', arrival: '10:17', date: '2026-07-12', distance: '185 km' },
  { id: 'TRP-8818', from: 'Ibadan Depot', to: 'Lagos HQ', driver: 'Tunde Adeyemi', vehicle: 'VAN-202', status: 'Cancelled', departure: '11:00', arrival: '—', date: '2026-07-12', distance: '128 km' },
  { id: 'TRP-8817', from: 'Abuja Terminal', to: 'Jos Depot', driver: 'Chioma Nwosu', vehicle: 'TRK-105', status: 'Scheduled', departure: '08:00', arrival: '—', date: '2026-07-13', distance: '340 km' },
  { id: 'TRP-8816', from: 'Lagos HQ', to: 'Benin City', driver: 'Emeka Obi', vehicle: 'TRK-101', status: 'Completed', departure: '05:30', arrival: '08:45', date: '2026-07-11', distance: '335 km' },
]

export default function Trips() {
  const [tab, setTab] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const tabs = ['All', 'Scheduled', 'On Trip', 'Completed', 'Cancelled']
  const data = TRIPS.filter(t => tab === 'All' || t.status === tab)

  return (
    <div>
      <PageHeader
        title="Trip Dispatcher"
        subtitle="Manage and dispatch fleet trips"
        action={<PrimaryBtn onClick={() => setShowForm(v => !v)}><Plus size={16} /> Create Trip</PrimaryBtn>}
      />

      {/* Create trip form */}
      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>New Trip</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { label: 'From', placeholder: 'Departure location' },
              { label: 'To', placeholder: 'Destination' },
              { label: 'Date', placeholder: 'YYYY-MM-DD', type: 'date' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>{f.label}</label>
                <input type={f.type ?? 'text'} placeholder={f.placeholder} style={inputSt} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Vehicle</label>
              <select style={inputSt}>
                <option>TRK-101 – Mercedes Actros</option>
                <option>TRK-104 – DAF XF 480</option>
                <option>VAN-201 – Toyota HiAce</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Driver</label>
              <select style={inputSt}>
                <option>Emeka Obi</option>
                <option>Uche Eze</option>
                <option>Chioma Nwosu</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Departure Time</label>
              <input type="time" style={inputSt} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button style={{ height: 44, padding: '0 24px', borderRadius: 12, background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Dispatch Trip
            </button>
            <button onClick={() => setShowForm(false)} style={{ height: 44, padding: '0 20px', borderRadius: 12, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 16px', borderRadius: 8, border: '1px solid',
            borderColor: tab === t ? 'var(--primary)' : 'var(--border)',
            background: tab === t ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: tab === t ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>{t}</button>
        ))}
      </div>

      {/* Trip cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map(t => (
          <Card key={t.id} style={{ padding: '18px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ minWidth: 90 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--primary)' }}>{t.id}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{t.date}</p>
              </div>

              {/* Route visual */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} color="var(--success)" />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{t.from}</span>
                  </div>
                  <p style={{ margin: '3px 0 0 19px', fontSize: 11, color: 'var(--text-secondary)' }}>{t.departure}</p>
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--card)', padding: '0 6px' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.distance}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} color="var(--danger)" />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{t.to}</span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--text-secondary)', textAlign: 'right' }}>{t.arrival}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20, alignItems: 'center', minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={13} color="var(--text-secondary)" />
                  <span style={{ fontSize: 13, marginLeft: 6 }}>{t.driver}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Truck size={13} color="var(--text-secondary)" />
                  <span style={{ fontSize: 13, marginLeft: 6, color: 'var(--text-secondary)' }}>{t.vehicle}</span>
                </div>
              </div>

              <Badge status={t.status} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const inputSt: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--surface)',
  color: 'var(--text-primary)', fontSize: 13, padding: '0 12px',
  fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
}
