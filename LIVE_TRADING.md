# Live trading requirements, broker integrations, security and compliance

This file explains what is required to operate MVFX with genuine live trading (real money). The starter app implements simulated demo trading and connects to free market data where possible, but DOES NOT execute or settle real-money trades.

1) Broker / Execution Provider
- You must integrate with a licensed broker or liquidity provider that provides an API for order placement, positions, margins, and account management.
- Implement a "broker adapter" in the backend that converts MVFX order objects into the broker's API requests, and handles asynchronous execution reports and fills.
- You will need a commercial agreement and credentials from the broker.

2) Market data (production grade)
- For crypto, Binance public REST and WebSocket streams are usable for market data and are free for many symbols.
- For Forex & XAUUSD, free vendors (Alpha Vantage, Twelve Data) provide low-volume feeds but have rate limits and no SLA. For production, buy a paid low-latency feed.
- Verify licensing terms for data redistribution.

3) Payments & client money
- Integrate a PCI-compliant payment processor (e.g., Stripe, Adyen) or bank transfers for deposits/withdrawals.
- Implement reconciliation, refunds, AML checks, and secure accounting.

4) KYC/AML & onboarding
- Identity verification (Sumsub, Onfido, Trulioo) is required by regulators in most jurisdictions before accepting real-money trading.
- Background checks and sanctions screening are also required.

5) Regulatory & legal
- You must hold the appropriate license(s) or partner with a licensed broker to provide trading services.
- Follow the rules in each jurisdiction: client funds segregation, reporting, margin requirements, consumer protections.

6) Security & operations
- TLS (HTTPS) everywhere, HSTS, secure cookies, and CSRF protections.
- Use a secrets manager for production keys (HashiCorp Vault, AWS Secrets Manager).
- Regular backups, monitoring, and incident response plans.

7) Risk management
- Margin checks, position limits, system limits, and monitoring.
- Reconciliation against broker/exchange fills and market data.

8) Testing & audits
- Penetration testing, compliance audits, and operational readiness tests before accepting client funds.

This repository provides a scaffold for demo trading and market-data display. Before attempting to accept deposits or route live orders, implement the above items and consult legal counsel in target jurisdictions.
