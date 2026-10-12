import React, { useEffect, useState } from 'react'
import axios from 'axios'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function OrderBook({ symbol, token }){
  const [book, setBook] = useState({ bids:[], asks:[] })
  const [live, setLive] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load(){
      try{
        const r = await axios.get(`${BACKEND}/api/orderbook?symbol=${symbol}`)
        if (!mounted) return
        setBook(r.data)
        setLive(r.data.source === 'binance')
      }catch(e){ console.warn(e) }
    }
    load()
    const t = setInterval(load, 1500)
    return () => { mounted = false; clearInterval(t) }
  }, [symbol])

  return (
    <div className="orderbook">
      <div className="ob-header">Order Book {live ? '(Live)' : '(Simulated)'}</div>
      <div className="ob-body">
        <div className="asks">
          {book.asks.slice(0,8).map((a,i)=> <div key={i} className="row ask"><span>{a.price.toFixed(2)}</span><span>{a.qty.toFixed(4)}</span></div>)}
        </div>
        <div className="bids">
          {book.bids.slice(0,8).map((b,i)=> <div key={i} className="row bid"><span>{b.price.toFixed(2)}</span><span>{b.qty.toFixed(4)}</span></div>)}
        </div>
      </div>
    </div>
  )
}
