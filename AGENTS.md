# BhoomiChain System Guidelines and Rules

This document captures the full stack, folder structure, commands, quality standards, and performance budgets for the BhoomiChain project. Every future phase and resumed session starts here.

---

## 1. Tech Stack Overview

- **Blockchain Engine**: Stellar Testnet & Soroban Smart Contracts (Rust/WASM)
- **Frontend App**: React, TypeScript, Tailwind CSS, Vite
- **Wallet Integrations**: Freighter, Albedo, Lobstr, xBull (via `@creit.tech/stellar-wallets-kit`)
- **State Management & Data Retrieval**: Custom React Hooks, Stellar/Soroban SDK (`@stellar/stellar-sdk`), Horizon Client, Event Streams
- **Translations (i18n)**: English (en), Hindi (hi), Telugu (te), Kannada (kn) via `react-i18next`

---

## 2. Directory Structure

```
.
├── contracts/
│   ├── verifier-registry/      # Verifier staking, reputation, slashing
│   ├── parcel-token/           # Land parcel tokenization, freeze/clawback
│   ├── aggregation-deal/       # Core escrow, threshold, atomic payout
│   └── dispute-dao/            # DAO voting on disputed attestations
├── crates/
│   └── bhoomi-math/            # Pure Rust: split calculations, GPS validation
├── src/
│   ├── components/             # Pure render components — zero SDK imports
│   │   ├── BlockchainString.tsx
│   │   ├── ParcelCard.tsx
│   │   ├── VerificationStepper.tsx
│   │   ├── AggregationDonut.tsx
│   │   ├── DocumentCard.tsx
│   │   ├── StatusBadge.tsx
│   │   └── WalletButton.tsx
│   ├── hooks/
│   │   ├── useWallet.ts
│   │   ├── useLedgerEvents.ts
│   │   └── useTheme.ts
│   ├── lib/                    # ALL Stellar/Soroban SDK calls live here exclusively
│   │   ├── stellar.ts
│   │   ├── soroban.ts
│   │   ├── verifierRegistry.ts
│   │   ├── parcelToken.ts
│   │   ├── aggregationDeal.ts
│   │   └── disputeDao.ts
│   ├── config/
│   │   └── stellar.ts          # Env-driven: Horizon URL, RPC URL, passphrase, all contract IDs
│   ├── types/                  # Shared TypeScript domain types
│   ├── utils/
│   │   ├── errors.ts           # AppError + all error mappers
│   │   ├── validation.ts       # isValidStellarAddress, isValidParcelId, isValidAmount
│   │   ├── format.ts           # currency, date, address formatters
│   │   └── pdf.ts              # Ownership proof PDF generation
│   ├── i18n/
│   │   ├── en.json
│   │   ├── hi.json             # Hindi
│   │   ├── te.json             # Telugu
│   │   └── kn.json             # Kannada
│   └── pages/
│       ├── Landing.tsx
│       ├── corporate/
│       │   ├── Dashboard.tsx
│       │   └── DealDetail.tsx
│       ├── farmer/
│       │   ├── Home.tsx
│       │   ├── PayoutPortal.tsx
│       │   └── DocumentSubmission.tsx
│       ├── verifier/
│       │   ├── Workspace.tsx
│       │   └── ParcelVerification.tsx
│       └── settings/
│           └── Language.tsx
├── .github/workflows/
│   ├── ci.yml
│   └── deploy-contracts.yml
└── AGENTS.md
```

---

## 3. Development and Quality Commands

```bash
# Frontend Development & Testing
npm run dev               # Start local dev server
npm run build             # Build production bundle (target <250KB gzipped)
npm run test              # Run vitest unit tests
npm run lint              # Run eslint with type-checking rules
npm run type-check        # Run tsc --noEmit
npm run format:check      # Check prettier formatting

# Soroban Smart Contract Development & Testing
cargo test --workspace    # Run all Rust unit tests
cargo clippy --all-targets --all-features -- -D warnings # Run linter with strict warning-as-error setting
cargo fmt --check         # Verify formatting of Rust files
cargo build --target wasm32-unknown-unknown --release # Build WASM contracts
```

---

## 4. Rust Quality Bar (Soroban Contracts)

- **Doc Comments**: Every contract function must have a complete doc comment describing: purpose, parameters, return value, what it panics on, and what events it emits.
- **Explicit State Machines**: Use a typed `Status` or `State` enum. Transitions must be handled via `transition_to` method:
  `fn transition_to(&self, new: Status) -> Result<(), ContractError>`
  Inline status checks must be avoided in favor of state transition verification.
- **Explicit Storage Keys**: Storage keys must be defined in a typed `DataKey` enum. Raw strings are forbidden.
- **Zero Unwraps**: Handle all `Option` and `Result` explicitly. Every panic must feature a descriptive string literal.
- **Checked Arithmetic**: All math on `i128`, `u64`, etc. must use `checked_add`, `checked_sub`, `checked_mul`, `checked_div`, etc.
- **Newtypes**: Wrap primitive variables in descriptive newtypes where unit mixing can cause issues: e.g. `Amount(pub i128)`, `BasisPoints(pub u32)`, `ParcelId(pub u64)`.
- **Zero Clippy Warnings**: Code must compile clean under `cargo clippy --all-targets --all-features -- -D warnings`.
- **Formatting**: Must comply with `cargo fmt`.

---

## 5. TypeScript & Frontend Quality Bar

- **TypeScript Strictness**:
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
  - Zero `any` and zero `as unknown`
  - Zero non-null assertions (`!`) unless checked on the immediately preceding line.
- **Explicit Return Types**: All exported functions must specify their return type explicitly.
- **Component Naming**: Export named React functions only (no anonymous arrow components).
- **Decoupled SDK**: All Stellar/Soroban SDK calls must reside in `src/lib/`. Components and hooks must not import from `@stellar/stellar-sdk`.
- **Blockchain String Formatting**: Any address, hash, contract ID, parcel ID, or survey number must be wrapped inside the `<BlockchainString>` component.
- **Formatting**: Code must pass Prettier checks before commit.

---

## 6. Performance Budget

- **Main Bundle**: Must not exceed 250KB gzipped.
- **Concurrent Fetches**: Screen loads must fetch unrelated data concurrently via `Promise.all`.
- **Debounced Inputs**: Interactive search/lookup must debounce at least 300ms before triggering RPC/Horizon calls.
- **Subscription Cleanup**: All `useEffect` subscriptions or timers must clean up properly.
- **Lazy Loading**: Route-level lazy loading (`React.lazy` + `Suspense`) from Phase 3 onward.

---

## 7. Crucial Checkpoints

1. Update the **Deployed Contracts** table in `README.md` with active Testnet IDs and links after every deployment.
2. Confirm **Responsive Layouts**: All screens must behave correctly at 375px viewport with no horizontal scrolling and 44px+ tap targets.
3. Clean checkouts on `cargo clippy`, `tsc --noEmit`, and `npm run lint` before committing.
