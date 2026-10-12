# MVFX — Architecture, requirements to enable live trading

This document explains what is required to operate MVFX with genuine live trading (real money). The starter app implements simulated/demo trading and live market data connectors where possible, but DOES NOT execute or settle real-money trades.

External services typically required before live trading:

1. Broker / Execution Provider
   - MVFX must integrate with a licensed broker or liquidity provider (LP) that accepts client accounts and provides an API for order placement, market data, margining, and account management.
   - Examples: Interactive Brokers, FXCM, Saxo Bank, or broker-specific APIs.
   - Requirements: commercial contract, API credentials, connectivity, and onboarding.

2. Market data providers
   - Crypto: Binance public REST & WebSocket can provide market data for many symbols.
   - Forex and XAUUSD: free APIs (Alpha Vantage, Twelve Data) exist but have rate limits and limited SLAs. For production, subscribe to a paid market data feed with guaranteed latency and coverage.

3. Payments & deposits
   - Payment processor (PCI-DSS compliance): Stripe, Adyen, or banking integrations for wire transfers. For card or instant payments, you must be PCI compliant or use hosted checkout.
   - KYC/AML provider: Onboarding customers requires identity verification (e.g., Sumsub, Onfido) and AML screening.

4. Regulatory
   - License depending on jurisdiction (financial regulator). You may need to register with FINRA/SEC/FCA/etc or partner with a licensed broker to offer trading.
   - Comply with AML/KYC, reporting, segregation of client funds, and consumer protection rules.

5. Security & compliance
   - TLS everywhere
   - Secure storage of secrets (vault), HSM (if required), encryption at rest for sensitive data.
   - Pen testing, monitoring, audits.

6. Insurance and operational readiness
   - Disaster recovery, backups, and incident response plans.

What this repo provides
- Demo trading engine (simulated funds) with orders executed at market prices from configured data feeds.
- Live market data connectors (Binance for crypto; Alpha Vantage for Forex/XAU when API key configured).
- Placeholder backend endpoints for broker order routing — these must be implemented using a broker's SDK/API.
- Authentication, account separation (DEMO vs LIVE), and UI components for trading and charts.

Next steps to enable real trading
- Choose and onboard a broker and payment processor.
- Implement broker adapter in backend to translate internal order formats into broker API calls, handle execution reports, fills, and margins.
- Integrate KYC/AML for onboarding and deposit/withdraw flows.
- Perform legal and security reviews.
