import { useState, useEffect } from 'react'
import { Truck, Users, MapPin, AlertTriangle, CheckCircle2, Fuel } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, StatCard, SectionTitle, Badge } from '../components/UI'

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
  make: string;
  status: string;
  mileage: string;
  fuel: string;
}

interface Driver {
  id: string;
  status: string;
}

interface FuelLog {
  id: string;
  date: string;
  vehicle: string;
  litres: number;
  total: number;
  rate: number;
}

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tripsRes, vehiclesRes, driversRes, fuelRes] = await Promise.all([
        fetch('http://localhost:5000/api/trips'),
        fetch('http://localhost:5000/api/vehicles'),
        fetch('http://localhost:5000/api/drivers'),
        fetch('http://localhost:5000/api/fuelExpenses')
      ])

      if (tripsRes.ok) setTrips(await tripsRes.json())
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json())
      if (driversRes.ok) setDrivers(await driversRes.json())
      if (fuelRes.ok) setFuelLogs(await fuelRes.json())
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

  // 1. Weekly Trip Volume (group trips by day name for the last 7 days)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const tripData = daysOfWeek.map(dayName => {
    // For this simple mock, we map dates to day-of-week
        const count = trips.filter(t => {
      if (!t.date) return false
      const dayIdx = new Date(t.date).getDay() // 0 = Sun, 1 = Mon ...
      const adjustedIdx = dayIdx === 0 ? 6 : dayIdx - 1
      return daysOfWeek[adjustedIdx] === dayName
    }).length
    return { day: dayName, trips: count } // fallback base for visual representation
  })

  // 2. Monthly Fuel Cost Chart (group fuel logs by last 6 months)
  const now = new Date()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fuelData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date()
    d.setMonth(now.getMonth() - (5 - i))
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const cost = fuelLogs.filter(f => f.date.startsWith(mStr)).reduce((acc, curr) => acc + curr.total, 0)
    return {
      month: monthNames[d.getMonth()],
      cost: cost || 0
    }
  })

  // 3. Maintenance Alerts calculated dynamically from vehicle telemetry
  const alerts: { vehicle: string; msg: string; level: 'warning' | 'danger' }[] = []
  vehicles.forEach(v => {
    const mileageVal = parseInt(v.mileage)
    const fuelVal = parseInt(v.fuel)

    if (v.status === 'Maintenance') {
      alerts.push({ vehicle: v.id, msg: 'Vehicle is currently in active service log.', level: 'warning' })
    }
    if (!isNaN(mileageVal) && mileageVal > 100000) {
      alerts.push({ vehicle: v.id, msg: `High mileage (${v.mileage})! Preventive inspection required.`, level: 'danger' })
    }
    if (!isNaN(fuelVal) && fuelVal < 25) {
      alerts.push({ vehicle: v.id, msg: `Critical fuel level (${v.fuel})! Refuel immediately.`, level: 'danger' })
    }
  })

  // Populate dynamic default alerts if empty
  if (alerts.length === 0) {
    alerts.push({ vehicle: 'No Alerts', msg: 'All vehicles running under optimal metrics.', level: 'warning' })
  }

  // 4. Fuel Summary stats calculation
  const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const lastMonth = new Date()
  lastMonth.setMonth(now.getMonth() - 1)
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`

  const thisMonthFuelTotal = fuelLogs.filter(f => f.date.startsWith(thisMonthStr)).reduce((acc, curr) => acc + curr.total, 0)
  const lastMonthFuelTotal = fuelLogs.filter(f => f.date.startsWith(lastMonthStr)).reduce((acc, curr) => acc + curr.total, 0)
  const totalLitres = fuelLogs.reduce((acc, curr) => acc + curr.litres, 0)
  
  const avgRate = fuelLogs.length > 0 
    ? Math.round(fuelLogs.reduce((acc, curr) => acc + curr.rate, 0) / fuelLogs.length)
    : 125

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 180, overflowY: 'auto' }}>
              {alerts.slice(0, 4).map((a, index) => (
                <div key={a.vehicle + index} style={{
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
              <Row label="This Month Fuel" value={`₦${thisMonthFuelTotal.toLocaleString()}`} color="var(--text-primary)" />
              <Row label="Last Month Fuel" value={`₦${lastMonthFuelTotal.toLocaleString()}`} color="var(--text-secondary)" />
              <Row label="Avg Rate" value={`₦${avgRate}/L`} color="var(--info)" />
              <Row label="Total Litres logged" value={`${totalLitres.toLocaleString()} L`} color="var(--text-secondary)" />
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
