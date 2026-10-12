import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

function isCrypto(sym){ return /USDT$|BTC$|ETH$/.test(sym) }

export default function OrderBook({ symbol, token }){
  const [book, setBook] = useState({ bids:[], asks:[] })
  const [live, setLive] = useState(false)
  const wsRef = useRef(null)

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

    // If crypto, connect directly to Binance depth websocket for live orderbook
    if (isCrypto(symbol)){
      const s = symbol.toLowerCase();
      const stream = `${s}@depth@100ms`;
      const wsUrl = `wss://stream.binance.com:9443/ws/${stream}`;
      try{
        wsRef.current = new WebSocket(wsUrl);
        wsRef.current.onopen = () => console.log('orderbook ws open', wsUrl);
        wsRef.current.onmessage = (evt) => {
          try{
            const msg = JSON.parse(evt.data);
            // msg: { lastUpdateId, bids: [[price,qty],...], asks: [[price,qty],...] }
            const bids = (msg.b || msg.bids || []).map(b=>({ price: parseFloat(b[0]), qty: parseFloat(b[1]) }));
            const asks = (msg.a || msg.asks || []).map(a=>({ price: parseFloat(a[0]), qty: parseFloat(a[1]) }));
            if (mounted) setBook({ bids, asks, source: 'binance' })
            setLive(true)
          }catch(e){ }
        }
        wsRef.current.onclose = () => console.log('orderbook ws closed')
      }catch(e){ console.warn('orderbook ws error', e) }
    }

    const t = setInterval(load, 3000)
    return () => { mounted = false; clearInterval(t); if (wsRef.current) wsRef.current.close() }
  }, [symbol])

  return (
    <div className="orderbook">
      <div className="ob-header">Order Book {live ? <span style={{color:'#7ef5a6'}}>(Live)</span> : <span style={{color:'#94a3b8'}}>(Simulated)</span>}</div>
      <div className="ob-body">
        <div className="asks">
          {book.asks && book.asks.slice(0,10).map((a,i)=> <div key={i} className="row ask"><span>{a.price.toFixed(2)}</span><span>{a.qty.toFixed(4)}</span></div>)}
        </div>
        <div className="bids">
          {book.bids && book.bids.slice(0,10).map((b,i)=> <div key={i} className="row bid"><span>{b.price.toFixed(2)}</span><span>{b.qty.toFixed(4)}</span></div>)}
        </div>
      </div>
    </div>
  )
}
