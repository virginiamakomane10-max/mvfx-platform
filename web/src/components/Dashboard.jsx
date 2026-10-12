import React, { useEffect, useState } from 'react'
import axios from 'axios'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function Dashboard({ token, mode }){
  const [data, setData] = useState(null)

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 2000); return () => clearInterval(t) }, [])
  async function fetchData(){
    try{
      if (mode === 'demo'){
        const r = await axios.get(`${BACKEND}/api/demo/account`, { headers: { Authorization: `Bearer ${token}` } })
        setData(r.data)
      } else {
        // Live account data would require broker APIs — show placeholder
        setData({ account: { balance: 0, equity: 0 }, positions: [], history: [] })
      }
    }catch(e){ console.error(e) }
  }

  if (!data) return <div>Loading...</div>

  return (
    <div className="dashboard-grid">
      <div className="card balance">
        <h3>{mode === 'demo' ? 'Demo Account' : 'Live Account (disabled)'}</h3>
        <div className="val">Balance: <strong>{data.account.balance.toFixed(2)}</strong></div>
        <div className="val">Equity: <strong>{data.account.equity.toFixed(2)}</strong></div>
      </div>
      <div className="card positions">
        <h3>Open Positions</h3>
        {data.positions.length===0 && <div>No open positions</div>}
        {data.positions.map(p=> (
          <div key={p.id} className="pos">
            <div>{p.side.toUpperCase()} {p.symbol}</div>
            <div>Entry @{p.price} • Qty {p.quantity}</div>
            <div>Unrealized P/L: {p.profit?.toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="card history">
        <h3>History</h3>
        {data.history.map(h=> (
          <div key={h.id} className="hist">{h.side} {h.symbol} @{h.price} — {h.status}</div>
        ))}
      </div>
    </div>
  )
}
