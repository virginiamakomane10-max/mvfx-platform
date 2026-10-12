import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ChartView from './components/ChartView'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Assistant from './components/Assistant'
import LivePage from './components/LivePage'
import './src/styles.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

function Nav({ onNavigate, onLogout, active }){
  return (
    <nav className="nav">
      <button className={active==='trade'?'active':''} onClick={() => onNavigate('trade')}>Trade</button>
      <button className={active==='dashboard'?'active':''} onClick={() => onNavigate('dashboard')}>Dashboard</button>
      <button className={active==='live'?'active':''} onClick={() => onNavigate('live')}>Live</button>
      <button className={active==='assistant'?'active':''} onClick={() => onNavigate('assistant')}>Assistant</button>
      <button onClick={onLogout}>Logout</button>
    </nav>
  )
}

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('mvfx_token'))
  const [view, setView] = useState('home')
  const [mode, setMode] = useState(localStorage.getItem('mvfx_mode')||'demo')

  useEffect(() => { if (token) localStorage.setItem('mvfx_token', token); else localStorage.removeItem('mvfx_token'); }, [token])
  useEffect(() => { localStorage.setItem('mvfx_mode', mode) }, [mode])

  if (!token) return <Auth onAuth={(t) => setToken(t)} />

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src="/src/assets/mvfx-logo.svg" alt="MVFX" className="logo" />
          <div className="brand-text">MVFX</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:12,color:'#94a3b8'}}>Mode</div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button onClick={() => setMode('demo')} style={{background: mode==='demo' ? '#163a2b' : 'transparent', color: mode==='demo'?'#7ef5a6':'#94a3b8', padding:'6px 8px', borderRadius:8}}>DEMO</button>
            <button onClick={() => setMode('live')} style={{background: mode==='live' ? '#2a1018' : 'transparent', color: mode==='live'?'#ff9b9b':'#94a3b8', padding:'6px 8px', borderRadius:8}}>LIVE</button>
          </div>
        </div>
        <Nav onNavigate={setView} onLogout={() => setToken(null)} active={view} />
      </header>
      <main className="main">
        {view === 'trade' && <ChartView token={token} mode={mode} />}
        {view === 'dashboard' && <Dashboard token={token} mode={mode} />}
        {view === 'assistant' && <Assistant token={token} />}
        {view === 'live' && <LivePage token={token} />}
        {view === 'home' && (
          <div className="hero">
            <h1>MVFX</h1>
            <p>Professional trading platform — Demo and Live accounts. Mobile-first responsive design.</p>
            <button onClick={() => setView('trade')}>Start Trading (Demo)</button>
          </div>
        )}
      </main>
      <footer className="footer">MVFX — demo platform. Live trading requires broker integration and compliance (see LIVE_TRADING.md)</footer>
    </div>
  )
}
