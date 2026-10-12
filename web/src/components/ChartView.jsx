import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'
import io from 'socket.io-client'
import axios from 'axios'

const WS = import.meta.env.VITE_WS_URL || 'http://localhost:4000'
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function ChartView({ token }) {
  const chartRef = useRef()
  const chartApiRef = useRef()
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [timeframe, setTimeframe] = useState('1m')
  const socketRef = useRef()
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    const chart = createChart(chartRef.current, { width: chartRef.current.clientWidth, height: 400, layout: { background: { color: '#0b1220' }, textColor: '#d1d1d1' } })
    const candleSeries = chart.addCandlestickSeries({ upColor: '#28a745', downColor: '#dc3545', borderVisible: false, wickVisible: true });
    chartApiRef.current = { chart, candleSeries };

    window.addEventListener('resize', () => chart.applyOptions({ width: chartRef.current.clientWidth }))

    // initial load from backend klines
    (async () => {
      try {
        const r = await axios.get(`${BACKEND}/api/ping`)
      } catch (e) {}
    })();

    socketRef.current = io(WS)
    socketRef.current.on('price', (data) => {
      if (data.symbol !== symbol) return;
      const c = { time: data.candle.t / 1000, open: data.candle.o, high: data.candle.h, low: data.candle.l, close: data.candle.c }
      candleSeries.update(c)
      setLatest(c)
    })

    return () => { socketRef.current.disconnect(); chart.remove(); }
  }, [symbol])

  async function placeDemo(side) {
    // place demo order at market (use latest.c)
    try {
      const price = latest?.close || 0
      const qty = 0.001
      await axios.post(`${BACKEND}/api/demo/order`, { symbol, side, price, quantity: qty }, { headers: { Authorization: `Bearer ${token}` } })
      alert('Demo order placed')
    } catch (e) { alert('error placing order: ' + (e.response?.data?.error || e.message)) }
  }

  return (
    <div className="trade-page">
      <aside className="left-panel">
        <h3>Market</h3>
        <select value={symbol} onChange={e => setSymbol(e.target.value)}>
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="XAUUSD">Gold XAU/USD</option>
          <option value="EURUSD">EUR/USD</option>
        </select>
        <div className="timeframes">
          <button onClick={() => setTimeframe('1m')}>M1</button>
          <button onClick={() => setTimeframe('5m')}>M5</button>
          <button onClick={() => setTimeframe('15m')}>M15</button>
          <button onClick={() => setTimeframe('30m')}>M30</button>
          <button onClick={() => setTimeframe('1h')}>H1</button>
        </div>
        <div className="ticket">
          <button className="buy" onClick={() => placeDemo('buy')}>Buy</button>
          <button className="sell" onClick={() => placeDemo('sell')}>Sell</button>
        </div>
      </aside>
      <section className="chart-section">
        <div ref={chartRef} className="chart"></div>
        <div className="ticker">Latest: {latest ? latest.close : '—'}</div>
      </section>
    </div>
  )
}
