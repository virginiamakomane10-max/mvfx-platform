import React, { useEffect, useState } from 'react'
import axios from 'axios'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function Dashboard({ token }) {
  const [data, setData] = useState(null)

  useEffect(() => { fetchData(); }, [])
  async function fetchData() {
    try {
      const r = await axios.get(`${BACKEND}/api/demo/account`, { headers: { Authorization: `Bearer ${token}` } })
      setData(r.data)
    } catch (e) { console.error(e) }
  }

  if (!data) return <div>Loading...</div>

  return (
    <div className="dashboard">
      <div className="card">
        <h3>Demo Account</h3>
        <div>Balance: {data.account.balance.toFixed(2)}</div>
        <div>Equity: {data.account.equity.toFixed(2)}</div>
      </div>
      <div className="card">
        <h3>Open Positions</h3>
        {data.positions.length === 0 && <div>No positions</div>}
        {data.positions.map(p => (
          <div key={p.id} className="pos">
            {p.side.toUpperCase()} {p.symbol} @{p.price} | qty {p.quantity}
          </div>
        ))}
      </div>
      <div className="card">
        <h3>History</h3>
        {data.history.map(h => (
          <div key={h.id} className="hist">{h.side} {h.symbol} @{h.price} — {h.status}</div>
        ))}
      </div>
    </div>
  )
}
