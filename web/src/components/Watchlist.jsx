import React, { useState, useEffect } from 'react'

const DEFAULT = ['BTCUSDT','ETHUSDT','XAUUSD','EURUSD']

export default function Watchlist({ onSelect }){
  const [list, setList] = useState(() => JSON.parse(localStorage.getItem('mvfx_watchlist')|| null) || DEFAULT)
  const [symbol, setSymbol] = useState('')

  useEffect(()=> localStorage.setItem('mvfx_watchlist', JSON.stringify(list)), [list])

  function add(){
    const s = symbol.trim().toUpperCase()
    if (!s) return
    if (list.includes(s)) return setSymbol('')
    setList([s, ...list].slice(0,20))
    setSymbol('')
  }

  function remove(s){ setList(list.filter(x=>x!==s)) }

  return (
    <div className="watchlist">
      <div className="wl-header">Watchlist</div>
      <div className="wl-add">
        <input placeholder="Symbol (e.g. BTCUSDT)" value={symbol} onChange={e=>setSymbol(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>
      <div className="wl-list">
        {list.map(s => (
          <div key={s} className="wl-item">
            <button className="symbol" onClick={()=> onSelect && onSelect(s)}>{s}</button>
            <button className="remove" onClick={()=>remove(s)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
