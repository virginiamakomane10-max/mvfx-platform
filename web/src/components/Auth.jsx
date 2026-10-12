import React, { useState } from 'react'
import axios from 'axios'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault(); setError('')
    try {
      const url = `${BACKEND}/api/${mode}`
      const r = await axios.post(url, { username, password })
      onAuth(r.data.token)
    } catch (e) { setError(e.response?.data?.error || e.message) }
  }

  return (
    <div className="auth">
      <div className="card">
        <h2>{mode === 'login' ? 'Login' : 'Register'} to MVFX</h2>
        <form onSubmit={submit}>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
          <button type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
        </form>
        <div className="switch">{mode === 'login' ? 'Need an account?' : 'Already have an account?'} <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Register' : 'Login'}</button></div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  )
}
