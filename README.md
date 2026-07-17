# BhoomiChain — Decentralized Land Aggregation & Escrow on Stellar

> *Trustless land title aggregation for Indian smallholder farmers, powered by Stellar Soroban smart contracts.*

[![CI](https://github.com/your-org/bhoomichain/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/bhoomichain/actions/workflows/ci.yml)

---

## Overview

BhoomiChain enables structured land aggregation deals between Indian smallholder farmers and corporate buyers through a transparent, auditable escrow on the **Stellar Testnet**. Land parcels are tokenized on-chain, verifiers (licensed lawyers) stake XLM as collateral, and payouts are triggered atomically when the verification threshold is met.

### Roles

| Role | Description |
|------|-------------|
| **Farmer** | Registers land parcels, submits documents, monitors payout status |
| **Corporate Buyer** | Creates aggregation deals, funds escrow, monitors attestation progress |
| **Verifier** | Licensed attorney/surveyor — stakes XLM, attests parcel ownership, votes on disputes |
| **Admin** | BhoomiChain DAO multisig — can suspend verifiers, freeze parcels, cancel deals |

---

## Tech Stack

- **Blockchain**: Stellar Testnet + Soroban Smart Contracts (Rust/WASM)
- **Frontend**: React 18, TypeScript (strict), Tailwind CSS, Vite
- **Wallets**: Freighter, Albedo, Lobstr, xBull via `@creit.tech/stellar-wallets-kit`
- **i18n**: English, हिन्दी, తెలుగు, ಕನ್ನಡ via `react-i18next`

---

## Quick Start & Dev Access

Start the local Vite server:
```bash
# Install dependencies
npm install --legacy-peer-deps

# Run the local server (exposed to network for mobile)
npm run dev
```

### 🔗 Active Dev Server Links
* **💻 Desktop Web App**: [http://localhost:5173/](http://localhost:5173/)
* **📱 Mobile Web App (Network)**: [http://10.55.231.197:5173/](http://10.55.231.197:5173/) *(Note: Ensure your testing device is on the same local network)*

### 🦀 Soroban Smart Contracts
```bash
# Run all native Rust unit tests
cargo test --workspace

# Compile WASM smart contracts for deployment
cargo build --target wasm32-unknown-unknown --release
```

---

## Smart Contracts

| Contract | Description |
|----------|-------------|
| `verifier-registry` | Verifier staking, reputation, slashing |
| `parcel-token` | Land parcel tokenization, freeze/clawback |
| `aggregation-deal` | Core escrow, threshold verification, atomic payout |
| `dispute-dao` | DAO voting on disputed attestations |

### Deployed Contracts (Testnet)

> **Update this table after every deployment.**

| Contract | Testnet Contract ID | Stellar Expert |
|----------|---------------------|---------------|
| `verifier-registry` | _TBD_ | _TBD_ |
| `parcel-token` | _TBD_ | _TBD_ |
| `aggregation-deal` | _TBD_ | _TBD_ |
| `dispute-dao` | _TBD_ | _TBD_ |

---

## Project Structure

```
.
├── contracts/
│   ├── verifier-registry/   # Verifier staking, reputation, slashing
│   ├── parcel-token/        # Land parcel tokenization, freeze/clawback
│   ├── aggregation-deal/    # Core escrow, threshold, atomic payout
│   └── dispute-dao/         # DAO voting on disputed attestations
├── crates/
│   └── bhoomi-math/         # Pure Rust: split calculations, GPS validation
├── src/
│   ├── components/          # Pure render components — zero SDK imports
│   ├── hooks/               # useWallet, useLedgerEvents, useTheme
│   ├── lib/                 # ALL Stellar/Soroban SDK calls live here
│   ├── config/              # Stellar config (Horizon URL, RPC URL, contract IDs)
│   ├── types/               # Shared TypeScript domain types
│   ├── utils/               # errors, validation, format, pdf
│   ├── i18n/                # en, hi, te, kn translations
│   └── pages/               # Landing, Farmer, Corporate, Verifier, Settings
└── .github/workflows/       # CI + Contract Deployment
```

---

## Quality Standards

### Rust / Soroban
- Zero `clippy` warnings (`-D warnings` flag)
- Every contract function has doc comments (purpose, params, returns, panics, events)
- Typed `DataKey` enum — raw string storage keys forbidden
- Typed `Status` enum with `transition_to()` state machine
- Zero `.unwrap()` — all `Option`/`Result` explicitly handled
- Checked arithmetic everywhere (`checked_add`, `checked_mul`, etc.)
- Newtypes for domain primitives (`Amount`, `BasisPoints`, `ParcelId`)

### TypeScript / Frontend
- `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- Zero `any`, zero `as unknown`, zero non-null assertions
- All Stellar SDK calls isolated in `src/lib/`
- All blockchain strings wrapped in `<BlockchainString>` component
- Named exported React functions (no anonymous arrow components)

### Performance Budget
- Main bundle: < 250 KB gzipped
- Unrelated data fetched concurrently via `Promise.all`
- Search inputs debounced ≥ 300ms
- Route-level lazy loading from Phase 3

---

## Development Commands

```bash
# Frontend
npm run dev          # Start local dev server (port 5173)
npm run type-check   # TypeScript strict check (zero errors)
npm run lint         # ESLint / OXLint
npm run test         # Vitest unit tests
npm run build        # Production bundle (< 250 KB target)

# Contracts
cargo test --workspace                                          # All Rust tests
cargo clippy --all-targets --all-features -- -D warnings       # Zero warnings
cargo fmt --check                                              # Format check
cargo build --target wasm32-unknown-unknown --release           # WASM build
```

---

## Environment Setup

Copy `.env.example` to `.env.local`:

```env
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_CONTRACT_VERIFIER_REGISTRY=C...
VITE_CONTRACT_PARCEL_TOKEN=C...
VITE_CONTRACT_AGGREGATION_DEAL=C...
VITE_CONTRACT_DISPUTE_DAO=C...
```

---

## License

MIT — BhoomiChain is open-source infrastructure for equitable land markets.
