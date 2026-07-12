import { useState, useEffect } from 'react'
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
const ALERTS = [
  { vehicle: 'TRK-204', msg: 'Oil change due in 200 km', level: 'warning' },
  { vehicle: 'TRK-118', msg: 'Brake inspection overdue', level: 'danger' },
  { vehicle: 'TRK-331', msg: 'Tire pressure low', level: 'warning' },
]

interface Trip {
  id: string;
  from: string;
  to: string;
  driver: string;
  status: string;
  departure: string;
  arrival: string;
  date: string;
}

interface Vehicle {
  id: string;
  status: string;
  createdAt: string;
}

interface Driver {
  id: string;
  status: string;
}

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        fetch('http://localhost:5000/api/trips'),
        fetch('http://localhost:5000/api/vehicles'),
        fetch('http://localhost:5000/api/drivers')
      ])

      if (tripsRes.ok) {
        const tripsData = await tripsRes.json()
        setTrips(tripsData)
      }
      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        setVehicles(vehiclesData)
      }
      if (driversRes.ok) {
        const driversData = await driversRes.json()
        setDrivers(driversData)
      }
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Calculate KPIs
  const totalVehiclesCount = vehicles.length
  const availableVehiclesCount = vehicles.filter(v => v.status === 'Available').length
  const availablePercentage = totalVehiclesCount > 0 ? ((availableVehiclesCount / totalVehiclesCount) * 100).toFixed(1) : '0'

  const todayStr = new Date().toISOString().split('T')[0]
  const tripsTodayCount = trips.filter(t => t.date === todayStr).length

  const driversOnDutyCount = drivers.filter(d => d.status === 'On Trip').length
  const totalDriversCount = drivers.length

  const recentTrips = trips.slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        <StatCard icon={<Truck size={20} />} label="Total Vehicles" value={loading ? '...' : String(totalVehiclesCount)} delta="+0 this month" color="var(--secondary)" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Available" value={loading ? '...' : String(availableVehiclesCount)} delta={loading ? '...' : `${availablePercentage}% of fleet`} color="var(--success)" />
        <StatCard icon={<MapPin size={20} />} label="Trips Today" value={loading ? '...' : String(tripsTodayCount)} delta="Active dispatcher" color="var(--primary)" />
        <StatCard icon={<Users size={20} />} label="Drivers On Duty" value={loading ? '...' : String(driversOnDutyCount)} delta={loading ? '...' : `of ${totalDriversCount} total`} color="var(--info)" />
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
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} formatter={(v: any) => [`₦${Number(v).toLocaleString()}`, 'Fuel Cost']} />
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
                {['Trip ID', 'Route', 'Driver', 'Status', 'Arrival'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', padding: '0 0 12px', paddingRight: 8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)' }}>
                    Loading recent trips...
                  </td>
                </tr>
              ) : recentTrips.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)' }}>
                    No recent trips found.
                  </td>
                </tr>
              ) : (
                recentTrips.map((t) => (
                  <tr key={t.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={td}><span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 13 }}>{t.id}</span></td>
                    <td style={td}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{t.from}</p>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>→ {t.to}</p>
                    </td>
                    <td style={td}><span style={{ fontSize: 13 }}>{t.driver}</span></td>
                    <td style={td}><Badge status={t.status} /></td>
                    <td style={{ ...td, color: 'var(--text-secondary)', fontSize: 13 }}>{t.arrival}</td>
                  </tr>
                ))
              )}
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
