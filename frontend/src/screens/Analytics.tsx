import { TrendingUp, TrendingDown } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, PageHeader } from '../components/UI'

const REVENUE = [
  { month: 'Jan', revenue: 2800000, cost: 1600000 },
  { month: 'Feb', revenue: 3100000, cost: 1750000 },
  { month: 'Mar', revenue: 3400000, cost: 1900000 },
  { month: 'Apr', revenue: 3050000, cost: 1820000 },
  { month: 'May', revenue: 3700000, cost: 2100000 },
  { month: 'Jun', revenue: 3600000, cost: 2000000 },
  { month: 'Jul', revenue: 4100000, cost: 2200000 },
]

const FUEL_EFF = [
  { vehicle: 'TRK-101', km_per_l: 6.8 }, { vehicle: 'TRK-102', km_per_l: 5.9 },
  { vehicle: 'VAN-201', km_per_l: 11.2 }, { vehicle: 'VAN-202', km_per_l: 9.4 },
  { vehicle: 'TRK-104', km_per_l: 7.1 },
]

const UTILIZATION = [
  { name: 'Active', value: 71.8, color: '#22C55E' },
  { name: 'Idle', value: 18.2, color: '#9CA3AF' },
  { name: 'In Service', value: 10, color: '#F59E0B' },
]

const DRIVER_PERF = [
  { name: 'Emeka Obi', trips: 312, rating: 4.9, ontime: '97%' },
  { name: 'Chioma Nwosu', trips: 156, rating: 4.9, ontime: '98%' },
  { name: 'Uche Eze', trips: 189, rating: 4.8, ontime: '95%' },
  { name: 'Fatima Bello', trips: 248, rating: 4.7, ontime: '93%' },
  { name: 'Tunde Adeyemi', trips: 421, rating: 4.5, ontime: '91%' },
]

const MONTHLY_TRIPS = [
  { month: 'Jan', trips: 620 }, { month: 'Feb', trips: 710 }, { month: 'Mar', trips: 780 },
  { month: 'Apr', trips: 730 }, { month: 'May', trips: 860 }, { month: 'Jun', trips: 820 }, { month: 'Jul', trips: 940 },
]

export default function Analytics() {
  const totalRevenue = REVENUE.reduce((a, b) => a + b.revenue, 0)
  const totalCost = REVENUE.reduce((a, b) => a + b.cost, 0)
  const roi = (((totalRevenue - totalCost) / totalCost) * 100).toFixed(1)

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Performance insights and fleet intelligence" />

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'YTD Revenue', value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, delta: '+18.4%', up: true },
          { label: 'Fleet ROI', value: `${roi}%`, delta: 'vs last year', up: true },
          { label: 'Operational Cost', value: `₦${(totalCost / 1000000).toFixed(1)}M`, delta: '+11.2%', up: false },
          { label: 'Monthly Trips', value: '940', delta: '+14.6%', up: true },
        ].map(k => (
          <Card key={k.label}>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)' }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>{k.value}</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: k.up ? 'var(--success)' : 'var(--danger)' }}>
              {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {k.delta}
            </p>
          </Card>
        ))}
      </div>

      {/* Revenue chart + Utilization pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Revenue vs. Cost (₦)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} formatter={(v: any) => `₦${Number(v).toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={3} fill="url(#revGrad)" name="Revenue" dot={false} />
              <Area type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={2} fill="url(#costGrad)" name="Cost" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Fleet Utilization</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={UTILIZATION} cx="50%" cy="50%" innerRadius={44} outerRadius={72} dataKey="value" paddingAngle={3}>
                {UTILIZATION.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} formatter={(v: any) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          {UTILIZATION.map(u => (
            <div key={u.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: u.color }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: u.color }}>{u.value}%</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Monthly Trips</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={MONTHLY_TRIPS} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} />
              <Bar dataKey="trips" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Fuel Efficiency (km/L)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={FUEL_EFF} layout="vertical" margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="vehicle" type="category" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={52} />
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} />
              <Bar dataKey="km_per_l" fill="#F59E0B" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Driver Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DRIVER_PERF.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', width: 16 }}>#{i + 1}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{d.name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.trips} trips</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', width: 28, textAlign: 'right' }}>{d.rating}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
