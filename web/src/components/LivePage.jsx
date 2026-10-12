import React from 'react'

export default function LivePage(){
  return (
    <div className="live-page card">
      <h2>Live Trading</h2>
      <p>Live trading is disabled in this starter. To enable genuine live trading you must:</p>
      <ul>
        <li>Onboard and contract with a licensed broker/execution provider and implement a broker adapter in the backend.</li>
        <li>Set up payment processing, KYC/AML, and regulatory compliance for your jurisdiction.</li>
        <li>Securely store API credentials and audit the order routing logic.</li>
      </ul>
      <p>The platform will not display or simulate live balances or execution. All live orders must be routed to the broker's APIs.</p>
    </div>
  )
}
