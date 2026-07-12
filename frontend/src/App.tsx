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

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

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
      <Sidebar active={activeScreen} onNavigate={setActiveScreen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar screen={activeScreen} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {screens[activeScreen]}
        </main>
      </div>
    </div>
  )
}
