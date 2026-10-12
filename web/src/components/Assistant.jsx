import React, { useState } from 'react'
import axios from 'axios'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function Assistant({ token }) {
  const [msg, setMsg] = useState('')
  const [reply, setReply] = useState('')

  async function send() {
    try {
      const r = await axios.post(`${BACKEND}/api/assistant`, { message: msg }, { headers: { Authorization: `Bearer ${token}` } })
      setReply(r.data.reply)
      // speak
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(r.data.reply)
        speechSynthesis.speak(u)
      }
    } catch (e) { setReply('assistant error') }
  }

  return (
    <div className="assistant">
      <h3>MVFX Assistant</h3>
      <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Ask about demo, trading, accounts..."></textarea>
      <button onClick={send}>Ask</button>
      <div className="reply">{reply}</div>
    </div>
  )
}
