import { useState } from 'react'
import { Building2, Shield, Bell, Palette, User, Save } from 'lucide-react'
import { Card, PageHeader, PrimaryBtn } from '../components/UI'

const ROLES = ['Admin', 'Fleet Manager', 'Dispatcher', 'Driver', 'Accountant']
const PERMS = ['View Fleet', 'Edit Fleet', 'View Trips', 'Create Trips', 'View Maintenance', 'Edit Maintenance', 'View Expenses', 'Edit Expenses', 'View Analytics', 'Manage Settings']

const DEFAULT_MATRIX: Record<string, Record<string, boolean>> = {
  Admin: Object.fromEntries(PERMS.map(p => [p, true])),
  'Fleet Manager': Object.fromEntries(PERMS.map((p, i) => [p, i < 8])),
  Dispatcher: Object.fromEntries(PERMS.map((p, i) => [p, [2, 3, 4].includes(i)])),
  Driver: Object.fromEntries(PERMS.map((p, i) => [p, [2, 4].includes(i)])),
  Accountant: Object.fromEntries(PERMS.map((p, i) => [p, [6, 7, 8].includes(i)])),
}

type Tab = 'company' | 'rbac' | 'notifications' | 'theme' | 'profile'

export default function Settings() {
  const [tab, setTab] = useState<Tab>('company')
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX)

  const toggle = (role: string, perm: string) => {
    setMatrix(prev => ({
      ...prev,
      [role]: { ...prev[role], [perm]: !prev[role][perm] },
    }))
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'company', label: 'Company', icon: <Building2 size={15} /> },
    { id: 'rbac', label: 'RBAC & Permissions', icon: <Shield size={15} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    { id: 'theme', label: 'Theme', icon: <Palette size={15} /> },
    { id: 'profile', label: 'Profile', icon: <User size={15} /> },
  ]

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage system configuration and preferences" />

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Sidebar tabs */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <Card style={{ padding: '8px' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 12px', borderRadius: 10, border: 'none',
                background: tab === t.id ? 'rgba(245,158,11,0.1)' : 'transparent',
                color: tab === t.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: tab === t.id ? 600 : 500,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.1s', marginBottom: 2,
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </Card>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {tab === 'company' && (
            <Card>
              <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700 }}>Company Settings</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {[
                  { label: 'Company Name', value: 'TransitOps Nigeria Ltd' },
                  { label: 'Registration Number', value: 'RC-2019-884421' },
                  { label: 'Contact Email', value: 'ops@transitops.io' },
                  { label: 'Phone', value: '+234 800 123 4567' },
                  { label: 'Address', value: 'Plot 14B, Victoria Island, Lagos' },
                  { label: 'Industry', value: 'Logistics & Transport' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>{f.label}</label>
                    <input defaultValue={f.value} style={inputSt} />
                  </div>
                ))}
              </div>
              <PrimaryBtn><Save size={15} /> Save Changes</PrimaryBtn>
            </Card>
          )}

          {tab === 'rbac' && (
            <Card>
              <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>RBAC Permission Matrix</h3>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-secondary)' }}>Configure role-based access control for your team members.</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '0 16px 12px 0', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Permission</th>
                      {ROLES.map(r => (
                        <th key={r} style={{ textAlign: 'center', padding: '0 12px 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PERMS.map(perm => (
                      <tr key={perm} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px 12px 0', fontSize: 13, fontWeight: 500 }}>{perm}</td>
                        {ROLES.map(role => (
                          <td key={role} style={{ textAlign: 'center', padding: '12px' }}>
                            <label style={{ cursor: 'pointer', display: 'inline-flex' }}>
                              <input
                                type="checkbox"
                                checked={matrix[role][perm]}
                                onChange={() => toggle(role, perm)}
                                style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }}
                              />
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 20 }}>
                <PrimaryBtn><Save size={15} /> Save Permissions</PrimaryBtn>
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card>
              <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700 }}>Notification Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Maintenance due alerts', sub: 'Get notified when a vehicle is due for service', on: true },
                  { label: 'License expiry reminders', sub: 'Driver license expiry warnings 90 days before', on: true },
                  { label: 'Trip completion notifications', sub: 'Notify when trips are completed or cancelled', on: false },
                  { label: 'Fuel level alerts', sub: 'Alert when vehicle fuel drops below 25%', on: true },
                  { label: 'Daily summary report', sub: 'Receive an end-of-day operational summary', on: false },
                ].map(n => (
                  <NotifRow key={n.label} {...n} />
                ))}
              </div>
            </Card>
          )}

          {tab === 'theme' && (
            <Card>
              <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Theme</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 10 }}>Appearance</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {['Dark', 'Light', 'System'].map(m => (
                      <button key={m} style={{
                        padding: '10px 24px', borderRadius: 10,
                        background: m === 'Dark' ? 'rgba(245,158,11,0.12)' : 'var(--surface)',
                        border: `1px solid ${m === 'Dark' ? 'var(--primary)' : 'var(--border)'}`,
                        color: m === 'Dark' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: 14, fontWeight: m === 'Dark' ? 600 : 400,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}>{m}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 10 }}>Accent Color</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['#F59E0B', '#3B82F6', '#22C55E', '#8B5CF6', '#EF4444'].map(c => (
                      <div key={c} style={{
                        width: 32, height: 32, borderRadius: 10, background: c,
                        cursor: 'pointer', border: c === '#F59E0B' ? '3px solid white' : '3px solid transparent',
                        transition: 'border 0.1s',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {tab === 'profile' && (
            <Card>
              <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700 }}>Profile</h3>
              <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff' }}>JD</div>
                <div>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>James Doe</p>
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>Fleet Manager · TransitOps Nigeria Ltd</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { label: 'First Name', value: 'James' },
                  { label: 'Last Name', value: 'Doe' },
                  { label: 'Email', value: 'james.doe@transitops.io' },
                  { label: 'Phone', value: '+234 810 987 6543' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>{f.label}</label>
                    <input defaultValue={f.value} style={inputSt} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <PrimaryBtn><Save size={15} /> Update Profile</PrimaryBtn>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function NotifRow({ label, sub, on }: { label: string; sub: string; on: boolean }) {
  const [enabled, setEnabled] = useState(on)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--surface)', borderRadius: 12 }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{label}</p>
        <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{sub}</p>
      </div>
      <button onClick={() => setEnabled(v => !v)} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none',
        background: enabled ? 'var(--primary)' : 'var(--border)',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 3, left: enabled ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}

const inputSt: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--surface)',
  color: 'var(--text-primary)', fontSize: 13, padding: '0 12px',
  fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
}
