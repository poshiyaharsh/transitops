import { useState, useEffect } from 'react'
import { Plus, AlertTriangle, Star, Phone, Mail, Edit2, Trash2, X } from 'lucide-react'
import { Card, Badge, PageHeader, PrimaryBtn } from '../components/UI'

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  license: string;
  expiry: string;
  status: string;
  rating: number;
  trips: number;
  vehicle: string;
}

function isExpiringSoon(date: string): boolean {
  if (!date) return false
  const exp = new Date(date)
  const now = new Date()
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diff < 90
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    license: '',
    expiry: '',
    status: 'Available',
    rating: '5.0',
    trips: '0',
    vehicle: '—'
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const statuses = ['All', 'Available', 'On Trip', 'Inactive']

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/drivers')
      if (res.ok) {
        const data = await res.json()
        setDrivers(data)
      } else {
        console.error('Failed to fetch drivers')
      }
    } catch (err) {
      console.error('Error fetching drivers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  const handleOpenAddModal = () => {
    setError('')
    setFormData({
      name: '',
      phone: '',
      email: '',
      license: '',
      expiry: '',
      status: 'Available',
      rating: '5.0',
      trips: '0',
      vehicle: '—'
    })
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (d: Driver) => {
    setError('')
    setCurrentDriver(d)
    setFormData({
      name: d.name,
      phone: d.phone,
      email: d.email,
      license: d.license,
      expiry: d.expiry,
      status: d.status,
      rating: String(d.rating),
      trips: String(d.trips),
      vehicle: d.vehicle
    })
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (d: Driver) => {
    setCurrentDriver(d)
    setIsDeleteModalOpen(true)
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name || !formData.phone || !formData.email || !formData.license || !formData.expiry) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch('http://localhost:5000/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: formData.rating ? parseFloat(formData.rating) : 5.0,
          trips: formData.trips ? parseInt(formData.trips, 10) : 0,
        })
      })

      if (res.ok) {
        setIsAddModalOpen(false)
        fetchDrivers()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to register driver.')
      }
    } catch (err) {
      console.error('Error registering driver:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!currentDriver) return

    try {
      setSubmitting(true)
      const res = await fetch(`http://localhost:5000/api/drivers/${currentDriver.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: formData.rating ? parseFloat(formData.rating) : 5.0,
          trips: formData.trips ? parseInt(formData.trips, 10) : 0,
        })
      })

      if (res.ok) {
        setIsEditModalOpen(false)
        fetchDrivers()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to update driver.')
      }
    } catch (err) {
      console.error('Error updating driver:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!currentDriver) return
    setError('')

    try {
      setSubmitting(true)
      const res = await fetch(`http://localhost:5000/api/drivers/${currentDriver.id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setIsDeleteModalOpen(false)
        fetchDrivers()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to delete driver.')
      }
    } catch (err) {
      console.error('Error deleting driver:', err)
      setError('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const data = drivers.filter(d => filter === 'All' || d.status === filter)

  return (
    <div>
      <PageHeader
        title="Drivers"
        subtitle={`${drivers.length} drivers registered`}
        action={
          <PrimaryBtn onClick={handleOpenAddModal}>
            <Plus size={16} /> Add Driver
          </PrimaryBtn>
        }
      />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 16px', borderRadius: 8, border: '1px solid',
            borderColor: filter === s ? 'var(--primary)' : 'var(--border)',
            background: filter === s ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: filter === s ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
          Loading drivers data...
        </div>
      ) : data.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
          No drivers found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {data.map(d => {
            const expiring = isExpiringSoon(d.expiry)
            return (
              <Card key={d.id} style={{ transition: 'transform 0.15s,box-shadow 0.15s' }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)' }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: `hsl(${(d.id || '').charCodeAt(4) * 12 || 120},60%,40%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>
                      {d.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{d.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{d.id}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <Badge status={d.status} />
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <button onClick={() => handleOpenEditModal(d)} style={iconBtnSmall} title="Edit Driver"><Edit2 size={12} /></button>
                      <button onClick={() => handleOpenDeleteModal(d)} style={iconBtnSmall} title="Delete Driver"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '10px 12px' }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Safety Rating</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Star size={13} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{d.rating}</span>
                    </div>
                  </div>
                  <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '10px 12px' }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Total Trips</p>
                    <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{d.trips}</p>
                  </div>
                </div>

                {/* License */}
                <div style={{
                  padding: '10px 12px', borderRadius: 10,
                  background: expiring ? 'rgba(245,158,11,0.08)' : 'var(--surface)',
                  border: `1px solid ${expiring ? 'rgba(245,158,11,0.3)' : 'transparent'}`,
                  marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>License: <b style={{ color: 'var(--text-primary)' }}>{d.license}</b></span>
                    {expiring && <AlertTriangle size={13} color="var(--warning)" />}
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: expiring ? 'var(--warning)' : 'var(--text-secondary)' }}>
                    Expires {d.expiry}{expiring ? ' — Renew soon' : ''}
                  </p>
                </div>

                {/* Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Phone size={13} color="var(--text-secondary)" />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.phone}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Mail size={13} color="var(--text-secondary)" />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.email}</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Driver Modal */}
      {isAddModalOpen && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Register New Driver</h3>
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
                  <label style={labelSt}>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="text" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Phone Number <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="tel" placeholder="e.g. +234 801 234 5678" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="email" placeholder="e.g. john@transitops.io" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>License Plate / Number <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="text" placeholder="e.g. FG-1234-NG" value={formData.license} onChange={e => setFormData(prev => ({ ...prev, license: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>License Expiry Date <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="date" value={formData.expiry} onChange={e => setFormData(prev => ({ ...prev, expiry: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Assigned Vehicle</label>
                  <input type="text" placeholder="e.g. TRK-101 or —" value={formData.vehicle} onChange={e => setFormData(prev => ({ ...prev, vehicle: e.target.value }))} style={inputSt} />
                </div>

                <div>
                  <label style={labelSt}>Current Status</label>
                  <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} style={selectSt}>
                    <option value="Available" style={{ background: 'var(--card)' }}>Available</option>
                    <option value="On Trip" style={{ background: 'var(--card)' }}>On Trip</option>
                    <option value="Inactive" style={{ background: 'var(--card)' }}>Inactive</option>
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Safety Rating</label>
                  <input type="number" min="0" max="5" step="0.1" placeholder="5.0" value={formData.rating} onChange={e => setFormData(prev => ({ ...prev, rating: e.target.value }))} style={inputSt} />
                </div>

                <div>
                  <label style={labelSt}>Total Trips Completed</label>
                  <input type="number" min="0" placeholder="0" value={formData.trips} onChange={e => setFormData(prev => ({ ...prev, trips: e.target.value }))} style={inputSt} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={cancelBtnSt}>Cancel</button>
                <PrimaryBtn onClick={() => {}} disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register Driver'}
                </PrimaryBtn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {isEditModalOpen && currentDriver && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Edit Driver Details ({currentDriver.id})</h3>
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
                  <label style={labelSt}>Full Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Phone Number *</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Email Address *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>License Plate *</label>
                  <input type="text" value={formData.license} onChange={e => setFormData(prev => ({ ...prev, license: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>License Expiry *</label>
                  <input type="date" value={formData.expiry} onChange={e => setFormData(prev => ({ ...prev, expiry: e.target.value }))} style={inputSt} required />
                </div>

                <div>
                  <label style={labelSt}>Assigned Vehicle</label>
                  <input type="text" value={formData.vehicle} onChange={e => setFormData(prev => ({ ...prev, vehicle: e.target.value }))} style={inputSt} />
                </div>

                <div>
                  <label style={labelSt}>Status</label>
                  <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} style={selectSt}>
                    <option value="Available" style={{ background: 'var(--card)' }}>Available</option>
                    <option value="On Trip" style={{ background: 'var(--card)' }}>On Trip</option>
                    <option value="Inactive" style={{ background: 'var(--card)' }}>Inactive</option>
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Safety Rating</label>
                  <input type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={e => setFormData(prev => ({ ...prev, rating: e.target.value }))} style={inputSt} />
                </div>

                <div>
                  <label style={labelSt}>Total Trips</label>
                  <input type="number" min="0" value={formData.trips} onChange={e => setFormData(prev => ({ ...prev, trips: e.target.value }))} style={inputSt} />
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

      {/* Delete Driver Modal */}
      {isDeleteModalOpen && currentDriver && (
        <div style={modalOverlaySt}>
          <div style={modalContentSt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Delete Driver</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} style={closeBtnSt}><X size={18} /></button>
            </div>

            {error && (
              <div style={errorBannerSt}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
              Are you sure you want to delete driver <b style={{ color: 'var(--text-primary)' }}>{currentDriver.name} ({currentDriver.id})</b>? This action cannot be undone.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} style={cancelBtnSt}>Cancel</button>
              <button onClick={handleDeleteSubmit} disabled={submitting} style={{
                height: 40, padding: '0 18px', borderRadius: 10, background: 'var(--danger)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
              }}>
                {submitting ? 'Deleting...' : 'Delete Driver'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
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
  width: 540,
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

const iconBtnSmall: React.CSSProperties = {
  width: 26,
  height: 26,
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
