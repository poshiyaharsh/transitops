import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import Fleet from './screens/Fleet'
import Drivers from './screens/Drivers'
import Trips from './screens/Trips'
import Maintenance from './screens/Maintenance'
import FuelExpenses from './screens/FuelExpenses'
import Analytics from './screens/Analytics'
import Settings from './screens/Settings'

export type Screen = 'Dashboard' | 'Fleet' | 'Drivers' | 'Trips' | 'Maintenance' | 'Fuel & Expenses' | 'Analytics' | 'Settings'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return !!localStorage.getItem('userInfo');
  })
  const [activeScreen, setActiveScreen] = useState<Screen>('Dashboard')
  const [companyName, setCompanyName] = useState('TransitOps')

  React.useEffect(() => {
    // Fetch global theme and company settings on app load
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.theme) {
          applyTheme(data.theme);
        }
        if (data.company && data.company.name) {
          setCompanyName(data.company.name);
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const applyTheme = (theme: { appearance: string, accentColor: string }) => {
    const root = document.documentElement;
    if (theme.accentColor) {
      root.style.setProperty('--primary', theme.accentColor);
      root.style.setProperty('--primary-hover', theme.accentColor + 'cc');
    }
    
    if (theme.appearance === 'Light') {
      root.style.setProperty('--bg', '#F3F4F6');
      root.style.setProperty('--surface', '#FFFFFF');
      root.style.setProperty('--card', '#FFFFFF');
      root.style.setProperty('--border', '#E5E7EB');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#6B7280');
    } else if (theme.appearance === 'Dark') {
      root.style.setProperty('--bg', '#0F1117');
      root.style.setProperty('--surface', '#181B22');
      root.style.setProperty('--card', '#1F242D');
      root.style.setProperty('--border', '#2B313D');
      root.style.setProperty('--text-primary', '#FFFFFF');
      root.style.setProperty('--text-secondary', '#9CA3AF');
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.style.setProperty('--bg', '#0F1117');
        root.style.setProperty('--surface', '#181B22');
        root.style.setProperty('--card', '#1F242D');
        root.style.setProperty('--border', '#2B313D');
        root.style.setProperty('--text-primary', '#FFFFFF');
        root.style.setProperty('--text-secondary', '#9CA3AF');
      } else {
        root.style.setProperty('--bg', '#F3F4F6');
        root.style.setProperty('--surface', '#FFFFFF');
        root.style.setProperty('--card', '#FFFFFF');
        root.style.setProperty('--border', '#E5E7EB');
        root.style.setProperty('--text-primary', '#111827');
        root.style.setProperty('--text-secondary', '#6B7280');
      }
    }
  };

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setLoggedIn(false);
  }

  const screens: Record<Screen, React.ReactElement> = {
    Dashboard: <Dashboard />,
    Fleet: <Fleet />,
    Drivers: <Drivers />,
    Trips: <Trips />,
    Maintenance: <Maintenance />,
    'Fuel & Expenses': <FuelExpenses />,
    Analytics: <Analytics />,
    Settings: <Settings />,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar active={activeScreen} onNavigate={setActiveScreen} onLogout={handleLogout} companyName={companyName} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar screen={activeScreen} companyName={companyName} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {screens[activeScreen]}
        </main>
      </div>
    </div>
  )
}
