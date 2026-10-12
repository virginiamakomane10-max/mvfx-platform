import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ChartView from './components/ChartView'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Assistant from './components/Assistant'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

function App() {
  const [token, setToken] = useState(localStorage.getItem('mvfx_token'))
  const [view, setView] = useState('home')

  useEffect(() => { if (token) localStorage.setItem('mvfx_token', token); else localStorage.removeItem('mvfx_token'); }, [token])

  if (!token) return <Auth onAuth={(t) => setToken(t)} />

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">MVFX</div>
        <nav>
          <button onClick={() => setView('trade')}>Trade</button>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={() => setView('assistant')}>Assistant</button>
          <button onClick={() => { setToken(null); }}>Logout</button>
        </nav>
      </header>
      <main className="main">
        {view === 'trade' && <ChartView token={token} />}
        {view === 'dashboard' && <Dashboard token={token} />}
        {view === 'assistant' && <Assistant token={token} />}
        {view === 'home' && (
          <div className="hero">
            <h1>MVFX</h1>
            <p>Professional trading platform — Demo and Live accounts. Mobile-first responsive design.</p>
            <button onClick={() => setView('trade')}>Start Trading (Demo)</button>
          </div>
        )}
      </main>
      <footer className="footer">MVFX — demo platform. Live trading requires broker integration and compliance (see ARCHITECTURE.md)</footer>
    </div>
  )
}

export default App
