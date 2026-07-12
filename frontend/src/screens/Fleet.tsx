import { useState, useEffect } from 'react'
import { Plus, Filter, Search, Eye, Edit2, Trash2, X, AlertTriangle } from 'lucide-react'
import { Card, Badge, PageHeader, PrimaryBtn } from '../components/UI'

interface Vehicle {
  id: string;
  make: string;
  year: number;
  type: string;
  driver: string;
  status: string;
  mileage: string;
  fuel: string;
}

interface Driver {
  id: string;
  name: string;
}

const COLS = ['Vehicle ID', 'Make & Model', 'Type', 'Assigned Driver', 'Status', 'Mileage', 'Fuel', 'Actions']

export default function Fleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  // Modals States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null)
  
  const [formData, setFormData] = useState({
    make: '',
    year: new Date().getFullYear(),
    type: 'Heavy Truck',
    driver: '—',
    status: 'Available',
    mileage: '0 km',
    fuel: '100%'
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/vehicles')
      if (res.ok) {
        const data = await res.json()
        setVehicles(data)
      } else {
        console.error('Failed to fetch vehicles')
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDrivers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/drivers')
      if (res.ok) {
        const data = await res.json()
        setDrivers(data)
      }
    } catch (err) {
      console.error('Error fetching drivers:', err)
    }
  }

  useEffect(() => {
    fetchVehicles()
    fetchDrivers()
  }, [])

  const handleOpenAddModal = () => {
    setError('')
    setFormData({
      make: '',
      year: new Date().getFullYear(),
      type: 'Heavy Truck',
      driver: '—',
      status: 'Available',
      mileage: '0 km',
      fuel: '100%'
    })
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (v: Vehicle) => {
    setError('')
    setCurrentVehicle(v)
    setFormData({
      make: v.make,
      year: v.year,
      type: v.type,
      driver: v.driver,
      status: v.status,
      mileage: v.mileage,
      fuel: v.fuel
    })
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (v: Vehicle) => {
    setCurrentVehicle(v)
    setIsDeleteModalOpen(true)
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!formData.make || !formData.year) {
      setError('Please provide vehicle make and year.')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setIsAddModalOpen(false)
        fetchVehicles()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to add vehicle.')
      }
    } catch (err) {
      console.error('Error adding vehicle:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!currentVehicle) return

    try {
      setSubmitting(true)
      const res = await fetch(`http://localhost:5000/api/vehicles/${currentVehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setIsEditModalOpen(false)
        fetchVehicles()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to update vehicle.')
      }
    } catch (err) {
      console.error('Error updating vehicle:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!currentVehicle) return
    setError('')

    try {
      setSubmitting(true)
      const res = await fetch(`http://localhost:5000/api/vehicles/${currentVehicle.id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setIsDeleteModalOpen(false)
        fetchVehicles()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to delete vehicle.')
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const statuses = ['All', 'Available', 'On Trip', 'Maintenance', 'Retired']
  const data = vehicles.filter(v =>
    (filter === 'All' || v.status === filter) &&
    (v.id.toLowerCase().includes(search.toLowerCase()) || v.make.toLowerCase().includes(search.toLowerCase()))
  )

  const totalCount = vehicles.length
  const availableCount = vehicles.filter(v => v.status === 'Available').length
  const onTripCount = vehicles.filter(v => v.status === 'On Trip').length
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length

  return (
    <div>
      <PageHeader
        title="Fleet Management"
        subtitle={loading ? 'Loading vehicles...' : `${totalCount} vehicles registered`}
        action={<PrimaryBtn onClick={handleOpenAddModal}><Plus size={16} /> Add Vehicle</PrimaryBtn>}
      />

      {/* Summary pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total', count: totalCount, color: 'var(--text-secondary)' },
          { label: 'Available', count: availableCount, color: 'var(--success)' },
          { label: 'On Trip', count: onTripCount, color: 'var(--secondary)' },
          { label: 'Maintenance', count: maintenanceCount, color: 'var(--warning)' },
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
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            Loading vehicles data...
          </div>
        ) : data.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            No vehicles registered.
          </div>
        ) : (
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
                      <button onClick={() => handleOpenEditModal(v)} style={iconBtn} title="Edit Vehicle"><Edit2 size={14} /></button>
                      <button onClick={() => handleOpenDeleteModal(v)} style={iconBtnDelete} title="Delete Vehicle"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Register New Vehicle</h3>
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
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelSt}>Make & Model *</label>
                  <input type="text" placeholder="e.g. Mercedes Benz Actros" value={formData.make} onChange={e => setFormData(prev => ({ ...prev, make: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Year *</label>
                  <input type="number" placeholder="e.g. 2022" value={formData.year} onChange={e => setFormData(prev => ({ ...prev, year: parseInt(e.target.value, 10) }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Vehicle Type *</label>
                  <select value={formData.type} onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))} style={selectSt}>
                    <option value="Heavy Truck" style={{ background: 'var(--card)' }}>Heavy Truck</option>
                    <option value="Medium Truck" style={{ background: 'var(--card)' }}>Medium Truck</option>
                    <option value="Minivan" style={{ background: 'var(--card)' }}>Minivan</option>
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Assigned Driver</label>
                  <select value={formData.driver} onChange={e => setFormData(prev => ({ ...prev, driver: e.target.value }))} style={selectSt}>
                    <option value="—" style={{ background: 'var(--card)' }}>—</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.name} style={{ background: 'var(--card)' }}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Initial Status</label>
                  <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} style={selectSt}>
                    <option value="Available" style={{ background: 'var(--card)' }}>Available</option>
                    <option value="On Trip" style={{ background: 'var(--card)' }}>On Trip</option>
                    <option value="Maintenance" style={{ background: 'var(--card)' }}>Maintenance</option>
                    <option value="Retired" style={{ background: 'var(--card)' }}>Retired</option>
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Mileage (km)</label>
                  <input type="text" placeholder="e.g. 15,000 km" value={formData.mileage} onChange={e => setFormData(prev => ({ ...prev, mileage: e.target.value }))} style={inputSt} />
                </div>

                <div>
                  <label style={labelSt}>Fuel Level (%)</label>
                  <input type="text" placeholder="e.g. 85%" value={formData.fuel} onChange={e => setFormData(prev => ({ ...prev, fuel: e.target.value }))} style={inputSt} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={cancelBtnSt}>Cancel</button>
                <PrimaryBtn onClick={() => {}} disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register Vehicle'}
                </PrimaryBtn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {isEditModalOpen && currentVehicle && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Edit Vehicle ({currentVehicle.id})</h3>
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
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelSt}>Make & Model *</label>
                  <input type="text" value={formData.make} onChange={e => setFormData(prev => ({ ...prev, make: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Year *</label>
                  <input type="number" value={formData.year} onChange={e => setFormData(prev => ({ ...prev, year: parseInt(e.target.value, 10) }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Vehicle Type *</label>
                  <select value={formData.type} onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))} style={selectSt}>
                    <option value="Heavy Truck" style={{ background: 'var(--card)' }}>Heavy Truck</option>
                    <option value="Medium Truck" style={{ background: 'var(--card)' }}>Medium Truck</option>
                    <option value="Minivan" style={{ background: 'var(--card)' }}>Minivan</option>
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Assigned Driver</label>
                  <select value={formData.driver} onChange={e => setFormData(prev => ({ ...prev, driver: e.target.value }))} style={selectSt}>
                    <option value="—" style={{ background: 'var(--card)' }}>—</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.name} style={{ background: 'var(--card)' }}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Status</label>
                  <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} style={selectSt}>
                    <option value="Available" style={{ background: 'var(--card)' }}>Available</option>
                    <option value="On Trip" style={{ background: 'var(--card)' }}>On Trip</option>
                    <option value="Maintenance" style={{ background: 'var(--card)' }}>Maintenance</option>
                    <option value="Retired" style={{ background: 'var(--card)' }}>Retired</option>
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Mileage (km)</label>
                  <input type="text" value={formData.mileage} onChange={e => setFormData(prev => ({ ...prev, mileage: e.target.value }))} style={inputSt} />
                </div>

                <div>
                  <label style={labelSt}>Fuel Level (%)</label>
                  <input type="text" value={formData.fuel} onChange={e => setFormData(prev => ({ ...prev, fuel: e.target.value }))} style={inputSt} />
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

      {/* Delete Vehicle Modal */}
      {isDeleteModalOpen && currentVehicle && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Delete Vehicle</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} style={closeBtnSt}><X size={18} /></button>
            </div>

            {error && (
              <div style={errorBannerSt}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
              Are you sure you want to delete <b style={{ color: 'var(--text-primary)' }}>{currentVehicle.make} ({currentVehicle.id})</b>? This action cannot be undone.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} style={cancelBtnSt}>Cancel</button>
              <button onClick={handleDeleteSubmit} disabled={submitting} style={{
                height: 40, padding: '0 18px', borderRadius: 10, background: 'var(--danger)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
              }}>
                {submitting ? 'Deleting...' : 'Delete Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const td: React.CSSProperties = { padding: '14px 12px 14px 0', verticalAlign: 'middle' }
const iconBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
  background: 'transparent', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
  transition: 'all 0.15s ease',
}
const iconBtnDelete: React.CSSProperties = {
  ...iconBtn,
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
