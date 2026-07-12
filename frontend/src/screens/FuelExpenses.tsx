import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, X, AlertTriangle, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, PageHeader, PrimaryBtn } from '../components/UI'

interface FuelLog {
  id: string;
  date: string;
  vehicle: string;
  litres: number;
  rate: number;
  total: number;
  station: string;
}

interface MaintenanceLog {
  id: string;
  vehicle: string;
  cost: number;
  date: string;
}

interface Vehicle {
  id: string;
  make: string;
}

interface Trip {
  id: string;
  date: string;
}

export default function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([])
  const [maintLogs, setMaintLogs] = useState<MaintenanceLog[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    vehicle: '',
    date: new Date().toISOString().split('T')[0],
    litres: '',
    rate: '125', // default naira rate
    station: '',
    mileage: '', // optional to update vehicle
    fuel: '' // optional to update vehicle
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const [fuelRes, maintRes, vehiclesRes, tripsRes] = await Promise.all([
        fetch('http://localhost:5000/api/fuelExpenses'),
        fetch('http://localhost:5000/api/maintenance'),
        fetch('http://localhost:5000/api/vehicles'),
        fetch('http://localhost:5000/api/trips')
      ])

      if (fuelRes.ok) setFuelLogs(await fuelRes.json())
      if (maintRes.ok) setMaintLogs(await maintRes.json())
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json())
      if (tripsRes.ok) setTrips(await tripsRes.json())
    } catch (err) {
      console.error('Error fetching fuel/expenses data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (vehicles.length > 0 && !formData.vehicle) {
      setFormData(prev => ({ ...prev, vehicle: vehicles[0].id }))
    }
  }, [vehicles])

  const handleOpenModal = () => {
    setError('')
    setFormData({
      vehicle: vehicles[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      litres: '',
      rate: '125',
      station: '',
      mileage: '',
      fuel: ''
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!formData.vehicle || !formData.date || !formData.litres || !formData.rate || !formData.station) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch('http://localhost:5000/api/fuelExpenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setIsModalOpen(false)
        fetchData()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to log entry.')
      }
    } catch (err) {
      console.error('Error logging fuel:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/fuelExpenses/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      console.error('Error deleting log:', err)
    }
  }

  // Dynamic calculations
  const now = new Date()
  const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const currentMonthFuelLogs = fuelLogs.filter(f => f.date.startsWith(thisMonthStr))
  const currentMonthMaintLogs = maintLogs.filter(m => m.date.startsWith(thisMonthStr))
  const currentMonthTrips = trips.filter(t => t.date.startsWith(thisMonthStr))

  const totalFuelCost = currentMonthFuelLogs.reduce((acc, curr) => acc + curr.total, 0)
  const totalMaintCost = currentMonthMaintLogs.reduce((acc, curr) => acc + curr.cost, 0)
  const grandTotalCost = totalFuelCost + totalMaintCost
  const totalLitres = currentMonthFuelLogs.reduce((acc, curr) => acc + curr.litres, 0)
  
  const avgCostPerTrip = currentMonthTrips.length > 0 
    ? Math.round(grandTotalCost / currentMonthTrips.length) 
    : 0

  // 1. Monthly Fuel vs Maintenance Expenses (₦)
  // We'll prepare data for the last 6 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthlyChartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date()
    d.setMonth(now.getMonth() - (5 - i))
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const mLabel = monthNames[d.getMonth()]

    const monthFuel = fuelLogs.filter(f => f.date.startsWith(mStr)).reduce((acc, curr) => acc + curr.total, 0)
    const monthMaint = maintLogs.filter(m => m.date.startsWith(mStr)).reduce((acc, curr) => acc + curr.cost, 0)

    return {
      month: mLabel,
      fuel: monthFuel,
      expenses: monthMaint
    }
  })

  // 2. Cost Distribution Pie Chart
  const pieData = [
    { name: 'Fuel', value: fuelLogs.reduce((acc, curr) => acc + curr.total, 0) || 1, color: '#F59E0B' },
    { name: 'Maintenance', value: maintLogs.reduce((acc, curr) => acc + curr.cost, 0) || 1, color: '#3B82F6' },
  ]

  // 3. Vehicle-wise Cost Matrix
  const vehicleCosts = vehicles.map(v => {
    const vFuel = fuelLogs.filter(f => f.vehicle === v.id).reduce((acc, curr) => acc + curr.total, 0)
    const vMaint = maintLogs.filter(m => m.vehicle === v.id).reduce((acc, curr) => acc + curr.cost, 0)
    return {
      vehicle: v.id,
      fuel: vFuel,
      maint: vMaint,
      other: 0,
      total: vFuel + vMaint
    }
  }).sort((a, b) => b.total - a.total).slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Fuel & Expenses"
        subtitle="Track fuel consumption and operational costs"
        action={<PrimaryBtn onClick={handleOpenModal}><Plus size={16} /> Log Entry</PrimaryBtn>}
      />

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Cost (Current Month)', value: `₦${grandTotalCost.toLocaleString()}`, delta: `Maint: ₦${totalMaintCost.toLocaleString()}`, up: true },
          { label: 'Fuel Cost (Current Month)', value: `₦${totalFuelCost.toLocaleString()}`, delta: 'Live fuel prices', up: true },
          { label: 'Avg Cost/Trip (Month)', value: `₦${avgCostPerTrip.toLocaleString()}`, delta: `${currentMonthTrips.length} active trips`, up: false },
          { label: 'Litres Dispensed', value: `${totalLitres} L`, delta: 'Operational volume', up: true },
        ].map(k => (
          <Card key={k.label}>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)' }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>{k.value}</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
              {k.delta}
            </p>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Monthly Fuel vs Maintenance Chart */}
        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Monthly Fuel vs. Maintenance Cost (₦)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyChartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} formatter={(v: any) => `₦${Number(v).toLocaleString()}`} />
              <Bar dataKey="fuel" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Fuel" />
              <Bar dataKey="expenses" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Maintenance" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Cost Distribution Chart */}
        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Cost Distribution (All-Time)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1F242D', border: '1px solid #2B313D', borderRadius: 10, fontSize: 13 }} formatter={(v: any) => `₦${Number(v).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pieData.map(d => (
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

      {/* Vehicle-wise cost table + Recent Fuel Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Vehicle-Wise Cost (Fuel + Maint YTD)</h3>
          {vehicleCosts.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>No expenses registered.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Vehicle', 'Fuel', 'Maintenance', 'Total'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', padding: '0 12px 12px 0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicleCosts.map(v => (
                  <tr key={v.vehicle} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={td}><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{v.vehicle}</span></td>
                    <td style={td}>₦{v.fuel.toLocaleString()}</td>
                    <td style={td}>₦{v.maint.toLocaleString()}</td>
                    <td style={{ ...td, fontWeight: 700, color: 'var(--text-primary)' }}>₦{v.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Recent Fuel Logs</h3>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0', fontSize: 13 }}>Loading...</div>
          ) : fuelLogs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0', fontSize: 13 }}>No logs.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto' }}>
              {fuelLogs.map((f) => (
                <div key={f.id} style={{ padding: '12px 14px', background: 'var(--surface)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{f.vehicle}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>({f.id})</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{f.litres}L · {f.station} · {f.date}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)' }}>₦{f.total.toLocaleString()}</span>
                    <button onClick={() => handleDelete(f.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Delete log">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Log Entry Modal */}
      {isModalOpen && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Log Fuel Purchase</h3>
              <button onClick={() => setIsModalOpen(false)} style={closeBtnSt}><X size={18} /></button>
            </div>

            {error && (
              <div style={errorBannerSt}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={labelSt}>Select Vehicle *</label>
                  <select value={formData.vehicle} onChange={e => setFormData(prev => ({ ...prev, vehicle: e.target.value }))} style={selectSt}>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id} style={{ background: 'var(--card)' }}>{v.id} – {v.make}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Date *</label>
                  <input type="date" value={formData.date} onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Litres Dispensed *</label>
                  <input type="number" placeholder="e.g. 100" value={formData.litres} onChange={e => setFormData(prev => ({ ...prev, litres: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Rate per Litre (₦) *</label>
                  <input type="number" value={formData.rate} onChange={e => setFormData(prev => ({ ...prev, rate: e.target.value }))} style={inputSt} required />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelSt}>Station Name *</label>
                  <input type="text" placeholder="e.g. NNPC Lagos Hub" value={formData.station} onChange={e => setFormData(prev => ({ ...prev, station: e.target.value }))} style={inputSt} required />
                </div>

                <div style={{ borderTop: '1px solid var(--border)', gridColumn: 'span 2', paddingTop: 12, marginTop: 4 }}>
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>At-the-Pump Telemetry (Updates Vehicle State)</p>
                </div>

                <div>
                  <label style={labelSt}>Current Odometer (km)</label>
                  <input type="text" placeholder="e.g. 50500" value={formData.mileage} onChange={e => setFormData(prev => ({ ...prev, mileage: e.target.value }))} style={inputSt} />
                </div>

                <div>
                  <label style={labelSt}>Current Fuel level (%)</label>
                  <input type="text" placeholder="e.g. 95" value={formData.fuel} onChange={e => setFormData(prev => ({ ...prev, fuel: e.target.value }))} style={inputSt} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtnSt}>Cancel</button>
                <PrimaryBtn onClick={() => {}} disabled={submitting}>
                  {submitting ? 'Logging...' : 'Log Purchase'}
                </PrimaryBtn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const td: React.CSSProperties = { padding: '12px 12px 12px 0', fontSize: 13, color: 'var(--text-secondary)' }
const modalOverlaySt: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 17, 23, 0.7)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}
const modalContentSt: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 18,
  padding: 24,
  width: 500,
  maxWidth: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  position: 'relative',
}
const closeBtnSt: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 4,
  borderRadius: 6,
}
const cancelBtnSt: React.CSSProperties = {
  height: 40,
  padding: '0 16px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif'
}
const labelSt: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: 6,
}
const inputSt: React.CSSProperties = {
  width: '100%',
  height: 40,
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text-primary)',
  fontSize: 13,
  padding: '0 12px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}
const selectSt: React.CSSProperties = {
  ...inputSt,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '16px',
  paddingRight: 32,
}
const errorBannerSt: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  background: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.3)',
  borderRadius: 10,
  padding: '10px 14px',
  marginBottom: 18,
  color: 'var(--danger)',
  fontSize: 13
}
