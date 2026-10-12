import React, { useState } from 'react'
import axios from 'axios'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function TradePanel({ symbol, token, latest }){
  const [side, setSide] = useState('buy')
  const [qty, setQty] = useState('0.001')
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')

  async function placeDemo(e){
    e.preventDefault()
    try{
      const price = latest?.close || 0
      const r = await axios.post(`${BACKEND}/api/demo/order`, { symbol, side, price, quantity: parseFloat(qty), sl: sl?parseFloat(sl):null, tp: tp?parseFloat(tp):null }, { headers: { Authorization: `Bearer ${token}` } })
      alert('Demo order placed (simulated funds)')
    }catch(e){ alert('Error: ' + (e.response?.data?.error || e.message)) }
  }

  return (
    <div className="trade-panel">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontWeight:700}}>{symbol} — {side.toUpperCase()} (DEMO)</div>
        <div style={{fontSize:12, color:'#94a3b8'}}>Demo mode: simulated funds only</div>
      </div>
      <div className="tabs">
        <button className={side==='buy'?'active':''} onClick={()=>setSide('buy')}>Buy</button>
        <button className={side==='sell'?'active':''} onClick={()=>setSide('sell')}>Sell</button>
      </div>
      <form onSubmit={placeDemo} className="ticket-form">
        <div className="row"><label>Price</label><div className="value">{latest?latest.close.toFixed(5):'—'}</div></div>
        <div className="row"><label>Quantity</label><input value={qty} onChange={e=>setQty(e.target.value)} /></div>
        <div className="row"><label>Stop Loss</label><input placeholder="optional" value={sl} onChange={e=>setSl(e.target.value)} /></div>
        <div className="row"><label>Take Profit</label><input placeholder="optional" value={tp} onChange={e=>setTp(e.target.value)} /></div>
        <div className="actions"><button className="submit">{side==='buy'?'Buy (Demo)':'Sell (Demo)'}</button></div>
      </form>
      <div className="note">Demo trading — this is simulated; live trading requires broker integration and regulatory approvals.</div>
    </div>
  )
}
