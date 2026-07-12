import { Truck, Users, MapPin, AlertTriangle, CheckCircle2, Fuel } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, StatCard, SectionTitle, Badge } from '../components/UI'

const tripData = [
  { day: 'Mon', trips: 42 }, { day: 'Tue', trips: 58 }, { day: 'Wed', trips: 51 },
  { day: 'Thu', trips: 67 }, { day: 'Fri', trips: 73 }, { day: 'Sat', trips: 44 }, { day: 'Sun', trips: 29 },
]
const fuelData = [
  { month: 'Feb', cost: 12400 }, { month: 'Mar', cost: 13800 }, { month: 'Apr', cost: 11900 },
  { month: 'May', cost: 14200 }, { month: 'Jun', cost: 13100 }, { month: 'Jul', cost: 15600 },
]
const RECENT_TRIPS = [
  { id: 'TRP-8821', from: 'Lagos HQ', to: 'Abuja Terminal', driver: 'Emeka Obi', status: 'Completed', time: '2h 14m' },
  { id: 'TRP-8820', from: 'Port Harcourt', to: 'Warri Depot', driver: 'Fatima Bello', status: 'On Trip', time: '45m left' },
  { id: 'TRP-8819', from: 'Kano Hub', to: 'Kaduna Yard', driver: 'Uche Eze', status: 'Completed', time: '3h 02m' },
  { id: 'TRP-8818', from: 'Ibadan Depot', to: 'Lagos HQ', driver: 'Tunde Adeyemi', status: 'Cancelled', time: '—' },
  { id: 'TRP-8817', from: 'Abuja Terminal', to: 'Jos Depot', driver: 'Chioma Nwosu', status: 'Scheduled', time: 'Tomorrow' },
]
const ALERTS = [
  { vehicle: 'TRK-204', msg: 'Oil change due in 200 km', level: 'warning' },
  { vehicle: 'TRK-118', msg: 'Brake inspection overdue', level: 'danger' },
  { vehicle: 'TRK-331', msg: 'Tire pressure low', level: 'warning' },
]

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        <StatCard icon={<Truck size={20} />} label="Total Vehicles" value="124" delta="+3 this month" color="var(--secondary)" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Available" value="89" delta="71.8% of fleet" color="var(--success)" />
        <StatCard icon={<MapPin size={20} />} label="Trips Today" value="34" delta="+12% vs yesterday" color="var(--primary)" />
        <StatCard icon={<Users size={20} />} label="Drivers On Duty" value="28" delta="of 42 total" color="var(--info)" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <SectionTitle>Weekly Trip Volume</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={tripData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} />
              <Area type="monotone" dataKey="trips" stroke="#F59E0B" strokeWidth={3} fill="url(#tripGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Monthly Fuel Cost (₦)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fuelData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} formatter={(v) => [`₦${Number(v).toLocaleString()}`, 'Fuel Cost']} />
              <Bar dataKey="cost" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Fleet utilization + alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        <Card>
          <SectionTitle>Recent Trips</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Trip ID', 'Route', 'Driver', 'Status', 'Duration'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', padding: '0 0 12px', paddingRight: 8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_TRIPS.map((t) => (
                <tr key={t.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={td}><span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 13 }}>{t.id}</span></td>
                  <td style={td}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{t.from}</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>→ {t.to}</p>
                  </td>
                  <td style={td}><span style={{ fontSize: 13 }}>{t.driver}</span></td>
                  <td style={td}><Badge status={t.status} /></td>
                  <td style={{ ...td, color: 'var(--text-secondary)', fontSize: 13 }}>{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <AlertTriangle size={16} color="var(--warning)" />
              <SectionTitle>Maintenance Alerts</SectionTitle>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ALERTS.map(a => (
                <div key={a.vehicle} style={{
                  background: a.level === 'danger' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${a.level === 'danger' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  borderRadius: 10, padding: '10px 12px',
                }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: a.level === 'danger' ? 'var(--danger)' : 'var(--warning)' }}>{a.vehicle}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{a.msg}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Fuel size={16} color="var(--info)" />
              <SectionTitle>Fuel Summary</SectionTitle>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Row label="This Month" value="₦15,600" color="var(--text-primary)" />
              <Row label="Last Month" value="₦13,100" color="var(--text-secondary)" />
              <Row label="Avg per Vehicle" value="₦125.8/L" color="var(--info)" />
              <Row label="Total Litres" value="12,380 L" color="var(--text-secondary)" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}</span>
    </div>
  )
}

const td: React.CSSProperties = { padding: '12px 8px 12px 0', fontSize: 13 }
