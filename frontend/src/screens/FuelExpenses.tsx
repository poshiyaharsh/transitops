import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, PageHeader, PrimaryBtn } from '../components/UI'

const MONTHLY = [
  { month: 'Jan', fuel: 11200, expenses: 4800 },
  { month: 'Feb', fuel: 12400, expenses: 5200 },
  { month: 'Mar', fuel: 13800, expenses: 6100 },
  { month: 'Apr', fuel: 11900, expenses: 4400 },
  { month: 'May', fuel: 14200, expenses: 5800 },
  { month: 'Jun', fuel: 13100, expenses: 5100 },
  { month: 'Jul', fuel: 15600, expenses: 6400 },
]

const VEHICLE_COSTS = [
  { vehicle: 'TRK-101', fuel: 28400, maint: 12500, other: 4200, total: 45100 },
  { vehicle: 'TRK-102', fuel: 31200, maint: 38000, other: 5100, total: 74300 },
  { vehicle: 'VAN-201', fuel: 14800, maint: 5000, other: 2400, total: 22200 },
  { vehicle: 'VAN-202', fuel: 22600, maint: 8000, other: 3100, total: 33700 },
  { vehicle: 'TRK-104', fuel: 19900, maint: 2500, other: 1800, total: 24200 },
]

const PIE_DATA = [
  { name: 'Fuel', value: 92100, color: '#F59E0B' },
  { name: 'Maintenance', value: 66000, color: '#3B82F6' },
  { name: 'Other', value: 16600, color: '#22C55E' },
]

const FUEL_LOGS = [
  { date: '2026-07-12', vehicle: 'TRK-101', litres: 280, rate: '₦125/L', total: '₦35,000', station: 'NNPC Lagos' },
  { date: '2026-07-12', vehicle: 'TRK-102', litres: 320, rate: '₦125/L', total: '₦40,000', station: 'Total PH' },
  { date: '2026-07-11', vehicle: 'VAN-201', litres: 80, rate: '₦125/L', total: '₦10,000', station: 'Ardova Kano' },
  { date: '2026-07-11', vehicle: 'TRK-104', litres: 240, rate: '₦125/L', total: '₦30,000', station: 'NNPC Abuja' },
]

export default function FuelExpenses() {
  return (
    <div>
      <PageHeader
        title="Fuel & Expenses"
        subtitle="Track fuel consumption and operational costs"
        action={<PrimaryBtn><Plus size={16} /> Log Entry</PrimaryBtn>}
      />

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Cost (Jul)', value: '₦174,700', delta: '+12%', up: true },
          { label: 'Fuel Cost (Jul)', value: '₦15,600', delta: '+19%', up: true },
          { label: 'Avg Cost/Trip', value: '₦5,138', delta: '-3%', up: false },
          { label: 'Litres Dispensed', value: '920 L', delta: 'this month', up: true },
        ].map(k => (
          <Card key={k.label}>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)' }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>{k.value}</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: k.up ? 'var(--success)' : 'var(--danger)' }}>
              {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {k.delta}
            </p>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Monthly Fuel vs. Expenses (₦ thousands)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} formatter={(v: any) => `₦${Number(v).toLocaleString()}`} />
              <Bar dataKey="fuel" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Fuel" />
              <Bar dataKey="expenses" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Cost Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {PIE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} formatter={(v: any) => `₦${Number(v).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PIE_DATA.map(d => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>₦{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Vehicle-wise cost */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Vehicle-Wise Cost (YTD)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Vehicle', 'Fuel', 'Maintenance', 'Other', 'Total'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', padding: '0 12px 12px 0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VEHICLE_COSTS.map(v => (
                <tr key={v.vehicle} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={td}><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{v.vehicle}</span></td>
                  <td style={td}>₦{v.fuel.toLocaleString()}</td>
                  <td style={td}>₦{v.maint.toLocaleString()}</td>
                  <td style={td}>₦{v.other.toLocaleString()}</td>
                  <td style={{ ...td, fontWeight: 700, color: 'var(--text-primary)' }}>₦{v.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Recent Fuel Logs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FUEL_LOGS.map((f, i) => (
              <div key={i} style={{ padding: '12px 14px', background: 'var(--surface)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{f.vehicle}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)' }}>{f.total}</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{f.litres}L · {f.station} · {f.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

const td: React.CSSProperties = { padding: '12px 12px 12px 0', fontSize: 13, color: 'var(--text-secondary)' }
