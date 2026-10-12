import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'
import io from 'socket.io-client'
import axios from 'axios'
import OrderBook from './OrderBook'
import TradePanel from './TradePanel'

const WS = import.meta.env.VITE_WS_URL || 'http://localhost:4000'
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

const TF_MAP = { '1m':'1m','5m':'5m','15m':'15m','30m':'30m','1h':'1h' }

export default function ChartView({ token }){
  const chartRef = useRef()
  const chartApiRef = useRef()
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [timeframe, setTimeframe] = useState('1m')
  const socketRef = useRef()
  const [latest, setLatest] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(()=>{
    const chart = createChart(chartRef.current, { width: chartRef.current.clientWidth, height: 480, layout: { background: { color: '#071827' }, textColor: '#d1d1d1' }, grid: { vertLines: { color: '#0b1220' }, horzLines: { color: '#0b1220' } } })
    const candleSeries = chart.addCandlestickSeries({ upColor: '#28a745', downColor: '#dc3545', borderVisible: false, wickVisible: true });
    chartApiRef.current = { chart, candleSeries }

    const resize = () => chart.applyOptions({ width: chartRef.current.clientWidth })
    window.addEventListener('resize', resize)

    // initial klines load
    (async () => {
      try{
        const r = await axios.get(`${BACKEND}/api/klines?symbol=${symbol}&interval=${timeframe}&limit=200`)
        const data = r.data.klines.map(k => ({ time: Math.floor(k.t/1000), open: k.o, high: k.h, low: k.l, close: k.c }))
        candleSeries.setData(data)
      }catch(e){ console.warn('klines load error', e) }
    })()

    socketRef.current = io(WS)
    socketRef.current.on('connect', () => setConnected(true))
    socketRef.current.on('disconnect', () => setConnected(false))
    socketRef.current.on('price', (data)=>{
      if (data.symbol !== symbol) return
      const c = { time: Math.floor(data.candle.t/1000), open: data.candle.o, high: data.candle.h, low: data.candle.l, close: data.candle.c }
      candleSeries.update(c)
      setLatest(c)
    })

    return () => { window.removeEventListener('resize', resize); socketRef.current.disconnect(); chart.remove() }
  }, [symbol])

  useEffect(()=>{
    // reload klines when timeframe changes
    (async ()=>{
      try{
        const r = await axios.get(`${BACKEND}/api/klines?symbol=${symbol}&interval=${timeframe}&limit=200`)
        const data = r.data.klines.map(k => ({ time: Math.floor(k.t/1000), open: k.o, high: k.h, low: k.l, close: k.c }))
        chartApiRef.current.candleSeries.setData(data)
      }catch(e){ }
    })()
  }, [timeframe, symbol])

  return (
    <div className="trade-page">
      <aside className="left-panel">
        <div className="market-select">
          <label>Market</label>
          <select value={symbol} onChange={e => setSymbol(e.target.value)}>
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="XAUUSD">Gold XAU/USD</option>
            <option value="EURUSD">EUR/USD</option>
          </select>
        </div>
        <div className="timeframes">
          {['1m','5m','15m','30m','1h'].map(tf => <button key={tf} className={timeframe===tf? 'active':''} onClick={()=>setTimeframe(tf)}>{tf.toUpperCase()}</button>)}
        </div>
        <div className="connection">Data: {connected? <span className="status on">Connected</span> : <span className="status off">Disconnected</span>}</div>
        <OrderBook symbol={symbol} token={token} />
      </aside>
      <section className="chart-section">
        <div className="chart-toolbar">
          <div className="chart-title">{symbol} • {timeframe.toUpperCase()}</div>
          <div className="latest">Latest: {latest ? latest.close : '—'}</div>
        </div>
        <div ref={chartRef} className="chart"></div>
        <TradePanel symbol={symbol} token={token} latest={latest} />
      </section>
    </div>
  )
}
