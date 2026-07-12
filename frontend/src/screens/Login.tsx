import { useState } from 'react'
import { Eye, EyeOff, Zap, CheckCircle2 } from 'lucide-react'
import { apiFetch } from '../lib/api'

interface Props { onLogin: () => void }

const FEATURES = [
  'Real-time fleet monitoring & dispatch',
  'Advanced driver performance analytics',
  'Automated maintenance scheduling',
  'Fuel & expense cost optimization',
]

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('admin@transitops.com')
  const [password, setPassword] = useState('admin123')
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState('Fleet Manager')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Email is required'); return }
    if (!password) { setError('Password is required'); return }
    setError('')
    setLoading(true)
    
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      onLogin()
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(145deg, #1a1f2e 0%, #0f1117 60%, #1a1208 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(245,158,11,0.07)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(59,130,246,0.06)', filter: 'blur(100px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={22} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>TransitOps</span>
          </div>

          {/* Hero text */}
          <h1 style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.8px' }}>
            Modern Fleet<br />
            <span style={{ color: 'var(--primary)' }}>Operations</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 48px', maxWidth: 380 }}>
            Enterprise-grade transport management platform built for logistics teams who demand precision.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Grid illustration */}
          <div style={{
            marginTop: 56,
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12,
            maxWidth: 280,
          }}>
            {[
              { label: '2,400+', sub: 'Vehicles managed' },
              { label: '98.2%', sub: 'Uptime SLA' },
              { label: '340+', sub: 'Fleet operators' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '14px 12px',
              }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: 'var(--primary)' }}>{s.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', color: '#fff' }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 32px' }}>Sign in to your TransitOps account</p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#EF4444' }}>
                {error}
              </div>
            )}

            <Field label="Email Address">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@transitops.io"
                style={inputStyle}
              />
            </Field>

            <Field label="Password">
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={{ ...inputStyle, paddingRight: 48 }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {showPass ? <EyeOff size={16} color="var(--text-secondary)" /> : <Eye size={16} color="var(--text-secondary)" />}
                </button>
              </div>
            </Field>

            <Field label="Role">
              <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {['Fleet Manager', 'Dispatcher', 'Driver', 'Admin', 'Accountant'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                Remember me
              </label>
              <button type="button" style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              height: 48, borderRadius: 12, background: 'var(--primary)',
              border: 'none', color: '#fff', fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s',
              fontFamily: 'Inter, sans-serif', marginTop: 4,
              opacity: loading ? 0.7 : 1
            }}
              onMouseEnter={e => (!loading && (e.currentTarget.style.background = 'var(--primary-hover)'))}
              onMouseLeave={e => (!loading && (e.currentTarget.style.background = 'var(--primary)'))}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 48,
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: 'var(--card)',
  color: 'var(--text-primary)',
  fontSize: 14,
  padding: '0 14px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}
