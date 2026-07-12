import { useState, useEffect } from 'react'
import { Plus, MapPin, User, Truck, AlertTriangle, Trash2, X } from 'lucide-react'
import { Card, Badge, PageHeader, PrimaryBtn } from '../components/UI'

interface Trip {
  id: string;
  from: string;
  to: string;
  driver: string;
  vehicle: string;
  status: string;
  departure: string;
  arrival: string;
  date: string;
  distance: string;
}

interface Driver {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  make: string;
}

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    vehicle: '',
    driver: '',
    departure: '',
    status: 'Scheduled'
  })

  const tabs = ['All', 'Scheduled', 'On Trip', 'Completed', 'Cancelled']

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tripsRes, driversRes, vehiclesRes] = await Promise.all([
        fetch('http://localhost:5000/api/trips'),
        fetch('http://localhost:5000/api/drivers'),
        fetch('http://localhost:5000/api/vehicles')
      ])

      if (tripsRes.ok) {
        const tripsData = await tripsRes.json()
        setTrips(tripsData)
      }
      if (driversRes.ok) {
        const driversData = await driversRes.json()
        setDrivers(driversData)
      }
      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        setVehicles(vehiclesData)
      }
    } catch (err) {
      console.error('Error fetching trips data:', err)
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

  useEffect(() => {
    if (drivers.length > 0 && !formData.driver) {
      setFormData(prev => ({ ...prev, driver: drivers[0].name }))
    }
  }, [drivers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { from, to, date, vehicle, driver, departure } = formData
    if (!from || !to || !date || !vehicle || !driver || !departure) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setShowForm(false)
        setFormData({
          from: '',
          to: '',
          date: new Date().toISOString().split('T')[0],
          vehicle: vehicles[0]?.id || '',
          driver: drivers[0]?.name || '',
          departure: '',
          status: 'Scheduled'
        })
        fetchData()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to dispatch trip.')
      }
    } catch (err) {
      console.error('Error dispatching trip:', err)
      setError('A network error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchData()
      } else {
        alert('Failed to update trip status')
      }
    } catch (err) {
      console.error('Error updating trip:', err)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip record?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchData()
      } else {
        alert('Failed to delete trip')
      }
    } catch (err) {
      console.error('Error deleting trip:', err)
    }
  }

  const data = trips.filter(t => tab === 'All' || t.status === tab)

  return (
    <div>
      <PageHeader
        title="Trip Dispatcher"
        subtitle={loading ? 'Loading trips...' : `Manage and dispatch fleet trips`}
        action={<PrimaryBtn onClick={() => setShowForm(v => !v)}><Plus size={16} /> Create Trip</PrimaryBtn>}
      />

      {/* Create trip form */}
      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>New Trip</h3>
          
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, color: 'var(--danger)', fontSize: 13 }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>From</label>
                <input 
                  type="text" 
                  placeholder="Departure location" 
                  style={inputSt}
                  value={formData.from}
                  onChange={e => setFormData(prev => ({ ...prev, from: e.target.value }))}
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>To</label>
                <input 
                  type="text" 
                  placeholder="Destination" 
                  style={inputSt}
                  value={formData.to}
                  onChange={e => setFormData(prev => ({ ...prev, to: e.target.value }))}
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Date</label>
                <input 
                  type="date" 
                  style={inputSt}
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Vehicle</label>
                <select 
                  style={inputSt}
                  value={formData.vehicle}
                  onChange={e => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
                  required
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id} style={{ background: 'var(--card)' }}>
                      {v.id} – {v.make}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Driver</label>
                <select 
                  style={inputSt}
                  value={formData.driver}
                  onChange={e => setFormData(prev => ({ ...prev, driver: e.target.value }))}
                  required
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.name} style={{ background: 'var(--card)' }}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Departure Time</label>
                <input 
                  type="time" 
                  style={inputSt}
                  value={formData.departure}
                  onChange={e => setFormData(prev => ({ ...prev, departure: e.target.value }))}
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Initial Status</label>
                <select 
                  style={inputSt}
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Scheduled" style={{ background: 'var(--card)' }}>Scheduled</option>
                  <option value="On Trip" style={{ background: 'var(--card)' }}>On Trip</option>
                  <option value="Completed" style={{ background: 'var(--card)' }}>Completed</option>
                  <option value="Cancelled" style={{ background: 'var(--card)' }}>Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button 
                type="submit" 
                disabled={submitting}
                style={{ height: 44, padding: '0 24px', borderRadius: 12, background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                {submitting ? 'Dispatching...' : 'Dispatch Trip'}
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)} 
                style={{ height: 44, padding: '0 20px', borderRadius: 12, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          </form>
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
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
          Loading trips data...
        </div>
      ) : data.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
          No trips found.
        </div>
      ) : (
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

                {/* Driver/Vehicle details */}
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', minWidth: 260 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={13} color="var(--text-secondary)" />
                    <span style={{ fontSize: 13, marginLeft: 6 }}>{t.driver}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Truck size={13} color="var(--text-secondary)" />
                    <span style={{ fontSize: 13, marginLeft: 6, color: 'var(--text-secondary)' }}>{t.vehicle}</span>
                  </div>
                </div>

                {/* Badge status */}
                <div style={{ minWidth: 100, display: 'flex', justifyContent: 'center' }}>
                  <Badge status={t.status} />
                </div>

                {/* Quick Action buttons */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', minWidth: 160, justifyContent: 'flex-end' }}>
                  {t.status === 'Scheduled' && (
                    <>
                      <button onClick={() => handleUpdateStatus(t.id, 'On Trip')} style={actionBtnSt} title="Start Trip">Start</button>
                      <button onClick={() => handleUpdateStatus(t.id, 'Cancelled')} style={cancelBtnSt} title="Cancel Trip">Cancel</button>
                    </>
                  )}
                  {t.status === 'On Trip' && (
                    <>
                      <button onClick={() => handleUpdateStatus(t.id, 'Completed')} style={successBtnSt} title="Complete Trip">Complete</button>
                      <button onClick={() => handleUpdateStatus(t.id, 'Cancelled')} style={cancelBtnSt} title="Cancel Trip">Cancel</button>
                    </>
                  )}
                  {(t.status === 'Completed' || t.status === 'Cancelled') && (
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', padding: '4px 8px' }}>Finalized</span>
                  )}
                  <button onClick={() => handleDeleteTrip(t.id)} style={deleteBtnSt} title="Delete Trip"><Trash2 size={13} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

const inputSt: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--surface)',
  color: 'var(--text-primary)', fontSize: 13, padding: '0 12px',
  fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
}

const actionBtnSt: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid var(--primary)',
  background: 'rgba(245,158,11,0.08)',
  color: 'var(--primary)',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.1s ease',
}

const cancelBtnSt: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid var(--danger)',
  background: 'rgba(239,68,68,0.08)',
  color: 'var(--danger)',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.1s ease',
}

const successBtnSt: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid var(--success)',
  background: 'rgba(34,197,94,0.08)',
  color: 'var(--success)',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.1s ease',
}

const deleteBtnSt: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-secondary)',
  transition: 'all 0.1s ease',
}
