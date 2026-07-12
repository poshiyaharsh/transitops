import { useState, useEffect } from 'react'
import { Plus, Wrench, AlertTriangle, CheckCircle2, Clock, Trash2, Edit2, X } from 'lucide-react'
import { Card, Badge, PageHeader, PrimaryBtn } from '../components/UI'

interface MaintenanceLog {
  id: string;
  vehicle: string;
  type: string;
  tech: string;
  date: string;
  cost: number;
  status: 'Maintenance' | 'Completed';
  note?: string;
}

interface Vehicle {
  id: string;
  make: string;
  status: string;
  mileage: string;
}

export default function Maintenance() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentLog, setCurrentLog] = useState<MaintenanceLog | null>(null)

  const [formData, setFormData] = useState({
    vehicle: '',
    type: '',
    tech: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    status: 'Maintenance',
    note: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const [logsRes, vehiclesRes] = await Promise.all([
        fetch('http://localhost:5000/api/maintenance'),
        fetch('http://localhost:5000/api/vehicles')
      ])

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setLogs(logsData)
      }
      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        setVehicles(vehiclesData)
      }
    } catch (err) {
      console.error('Error fetching maintenance data:', err)
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

  const handleOpenAddModal = () => {
    setError('')
    setFormData({
      vehicle: vehicles[0]?.id || '',
      type: '',
      tech: '',
      date: new Date().toISOString().split('T')[0],
      cost: '',
      status: 'Maintenance',
      note: ''
    })
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (log: MaintenanceLog) => {
    setError('')
    setCurrentLog(log)
    setFormData({
      vehicle: log.vehicle,
      type: log.type,
      tech: log.tech,
      date: log.date,
      cost: String(log.cost),
      status: log.status,
      note: log.note || ''
    })
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (log: MaintenanceLog) => {
    setCurrentLog(log)
    setIsDeleteModalOpen(true)
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!formData.vehicle || !formData.type || !formData.tech || !formData.cost) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch('http://localhost:5000/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setIsAddModalOpen(false)
        fetchData()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to log maintenance.')
      }
    } catch (err) {
      console.error('Error logging maintenance:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!currentLog) return

    try {
      setSubmitting(true)
      const res = await fetch(`http://localhost:5000/api/maintenance/${currentLog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setIsEditModalOpen(false)
        fetchData()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to update maintenance log.')
      }
    } catch (err) {
      console.error('Error updating maintenance log:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!currentLog) return
    setError('')

    try {
      setSubmitting(true)
      const res = await fetch(`http://localhost:5000/api/maintenance/${currentLog.id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setIsDeleteModalOpen(false)
        fetchData()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to delete log.')
      }
    } catch (err) {
      console.error('Error deleting maintenance log:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  // Stats calculation
  const inServiceCount = logs.filter(l => l.status === 'Maintenance').length
  const completedCount = logs.filter(l => l.status === 'Completed').length
  
  // Calculate upcoming / warnings based on vehicle mileages (mock logic for dynamic feel)
  const upcomingServices = vehicles
    .filter(v => {
      const mile = parseInt(v.mileage)
      return !isNaN(mile) && mile > 40000 && v.status !== 'Maintenance'
    })
    .map(v => {
      const mile = parseInt(v.mileage)
      const urgency = mile > 90000 ? 'danger' : 'warning'
      const service = mile > 80000 ? 'Full Brake Overhaul' : 'Oil & Filters Replacement'
      const due = mile > 90000 ? 'Overdue' : `${Math.ceil(mile / 10000) * 10000} km`
      return { vehicle: v.id, service, due, current: v.mileage, urgency }
    })

  const overdueCount = upcomingServices.filter(u => u.urgency === 'danger').length
  const upcomingCount = upcomingServices.length

  return (
    <div>
      <PageHeader
        title="Maintenance"
        subtitle="Service history and upcoming maintenance"
        action={<PrimaryBtn onClick={handleOpenAddModal}><Plus size={16} /> Log Service</PrimaryBtn>}
      />

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: <Wrench size={18} />, label: 'In Service', value: String(inServiceCount), color: 'var(--warning)' },
          { icon: <CheckCircle2 size={18} />, label: 'Completed Services', value: String(completedCount), color: 'var(--success)' },
          { icon: <AlertTriangle size={18} />, label: 'Flagged / Overdue', value: String(overdueCount), color: 'var(--danger)' },
          { icon: <Clock size={18} />, label: 'Upcoming Alerts', value: String(upcomingCount), color: 'var(--info)' },
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
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>Loading maintenance logs...</div>
          ) : logs.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>No logs registered.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['ID', 'Vehicle', 'Service Type', 'Technician', 'Date', 'Cost', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', padding: '0 10px 12px 0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={td}><span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12 }}>{l.id}</span></td>
                    <td style={td}><span style={{ fontWeight: 600, fontSize: 13 }}>{l.vehicle}</span></td>
                    <td style={td}>
                      <p style={{ margin: 0, fontSize: 13 }}>{l.type}</p>
                      {l.note && <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{l.note}</p>}
                    </td>
                    <td style={{ ...td, fontSize: 13, color: 'var(--text-secondary)' }}>{l.tech}</td>
                    <td style={{ ...td, fontSize: 13, color: 'var(--text-secondary)' }}>{l.date}</td>
                    <td style={{ ...td, fontSize: 13, fontWeight: 600 }}>₦{Number(l.cost).toLocaleString()}</td>
                    <td style={td}><Badge status={l.status} /></td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleOpenEditModal(l)} style={iconBtn} title="Edit Service"><Edit2 size={13} /></button>
                        <button onClick={() => handleOpenDeleteModal(l)} style={iconBtn} title="Delete Log"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Upcoming */}
        <Card>
          <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700 }}>Upcoming Service</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcomingServices.length === 0 ? (
              <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All vehicles are within safe operational limits.</span>
              </div>
            ) : (
              upcomingServices.map(u => {
                const color = u.urgency === 'danger' ? 'var(--danger)' : 'var(--warning)'
                return (
                  <div key={u.vehicle + u.service} style={{
                    padding: '14px 16px', borderRadius: 12,
                    background: 'var(--surface)',
                    border: `1px solid ${u.urgency === 'danger' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.2)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color }}>{u.vehicle}</span>
                      {u.urgency === 'danger' && <AlertTriangle size={14} color="var(--danger)" />}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{u.service}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>Due: {u.due} {u.current !== '—' ? `· Current: ${u.current}` : ''}</p>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>

      {/* Add Maintenance Modal */}
      {isAddModalOpen && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Log Maintenance Service</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={closeBtnSt}><X size={18} /></button>
            </div>

            {error && (
              <div style={errorBannerSt}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit}>
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
                  <label style={labelSt}>Service Type *</label>
                  <input type="text" placeholder="e.g. Oil & Filter Change" value={formData.type} onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Technician / Workshop *</label>
                  <input type="text" placeholder="e.g. Ade Mechanics Ltd" value={formData.tech} onChange={e => setFormData(prev => ({ ...prev, tech: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Service Date *</label>
                  <input type="date" value={formData.date} onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Total Cost (₦) *</label>
                  <input type="number" placeholder="e.g. 15000" value={formData.cost} onChange={e => setFormData(prev => ({ ...prev, cost: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Status</label>
                  <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} style={selectSt}>
                    <option value="Maintenance" style={{ background: 'var(--card)' }}>Active Maintenance</option>
                    <option value="Completed" style={{ background: 'var(--card)' }}>Completed</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelSt}>Service Details / Notes</label>
                  <textarea placeholder="Write any specific repairs done..." value={formData.note} onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))} style={textareaSt} rows={3} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={cancelBtnSt}>Cancel</button>
                <PrimaryBtn onClick={() => {}} disabled={submitting}>
                  {submitting ? 'Logging...' : 'Log Service'}
                </PrimaryBtn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Maintenance Modal */}
      {isEditModalOpen && currentLog && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Edit Service Record ({currentLog.id})</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={closeBtnSt}><X size={18} /></button>
            </div>

            {error && (
              <div style={errorBannerSt}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={labelSt}>Vehicle</label>
                  <select value={formData.vehicle} onChange={e => setFormData(prev => ({ ...prev, vehicle: e.target.value }))} style={selectSt}>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id} style={{ background: 'var(--card)' }}>{v.id} – {v.make}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Service Type *</label>
                  <input type="text" value={formData.type} onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Technician / Workshop *</label>
                  <input type="text" value={formData.tech} onChange={e => setFormData(prev => ({ ...prev, tech: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Service Date *</label>
                  <input type="date" value={formData.date} onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Total Cost (₦) *</label>
                  <input type="number" value={formData.cost} onChange={e => setFormData(prev => ({ ...prev, cost: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Status</label>
                  <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} style={selectSt}>
                    <option value="Maintenance" style={{ background: 'var(--card)' }}>Active Maintenance</option>
                    <option value="Completed" style={{ background: 'var(--card)' }}>Completed</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelSt}>Service Details / Notes</label>
                  <textarea value={formData.note} onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))} style={textareaSt} rows={3} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={cancelBtnSt}>Cancel</button>
                <PrimaryBtn onClick={() => {}} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </PrimaryBtn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Maintenance Modal */}
      {isDeleteModalOpen && currentLog && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Delete Service Record</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} style={closeBtnSt}><X size={18} /></button>
            </div>

            {error && (
              <div style={errorBannerSt}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
              Are you sure you want to delete the maintenance record <b style={{ color: 'var(--text-primary)' }}>{currentLog.type} ({currentLog.id})</b> for vehicle <b style={{ color: 'var(--text-primary)' }}>{currentLog.vehicle}</b>? This action cannot be undone.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} style={cancelBtnSt}>Cancel</button>
              <button onClick={handleDeleteSubmit} disabled={submitting} style={{
                height: 40, padding: '0 18px', borderRadius: 10, background: 'var(--danger)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
              }}>
                {submitting ? 'Deleting...' : 'Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const td: React.CSSProperties = { padding: '12px 10px 12px 0', verticalAlign: 'top' }
const iconBtn: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)',
  background: 'transparent', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
  transition: 'all 0.1s ease',
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
const textareaSt: React.CSSProperties = {
  width: '100%',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text-primary)',
  fontSize: 13,
  padding: '10px 12px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  resize: 'none'
}
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
  width: 520,
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
