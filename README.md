<div align="center">

# 🌳 Arthavest

### Invest in Indonesian MSMEs. Profits flow per second.

**Fractional ownership marketplace for Indonesian MSMEs** with profit distribution via SuiStream primitive on the Sui network. Built for [Sui Overflow Hackathon 2026](https://overflow.sui.io/).

[![Live Demo](https://img.shields.io/badge/Live-Demo-0D9488?style=for-the-badge&logo=vercel&logoColor=white)](https://arthavest.web.id) [![Sui](https://img.shields.io/badge/Sui-Network-4DA2FF?style=for-the-badge&logo=sui&logoColor=white)](https://sui.io/) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/) [![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<p align="center">
  <img src="public/logo-wordmark.png" alt="Arthavest" width="280">
</p>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Sui-Native Architecture](#-sui-native-architecture)
- [Live Demo Features](#-live-demo-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Smart Contracts](#-smart-contracts)
- [Deployment](#-deployment)
- [Internationalization & Theming](#-internationalization--theming)
- [Roadmap](#-roadmap)
- [Submission Deliverables](#-submission-deliverables)
- [License](#-license)

---

## 🎯 Overview

**Arthavest** is a two-layer product combining a reusable DeFi primitive (SuiStream) with a real-world-asset (RWA) marketplace for Indonesian MSMEs (UMKM — Usaha Mikro, Kecil, dan Menengah).

- **Layer 1 — SuiStream Primitive**: A composable money-stream Move module. Each stream is an object owned by the recipient, transferable, fractionalizable, and atomic via PTBs.
- **Layer 2 — Arthavest App**: A marketplace where investors buy fractional shares of verified Indonesian MSMEs (coffee shops, laundry, catering, etc.) and receive monthly profit streams directly to their wallet — every second, atomically, with zero platform fees.

### Why this matters
- Indonesia has **64M MSMEs** contributing **60% of GDP**, but **87% can't access bank loans**
- Retail investors lack small-ticket investment rails into local businesses
- Traditional crowdfunding charges **10-20% platform fees** with manual monthly transfers
- Arthavest uses **Sui's unique features** (Object model, PTB, zkLogin, Walrus, DeepBook) to solve this cleanly — impossible to replicate on EVM with the same elegance

---

## 😰 The Problem

| Metric | Value |
|--------|-------|
| Active MSMEs in Indonesia | **64 million** |
| Contribution to GDP | **60%** |
| Credit access rejection rate | **87%** |
| Annual funding gap | **Rp 1.2 quadrillion** (~$75B USD) |

**Three pain points:**
1. Bank loans require collateral & 6-12 month processes — 87% of MSMEs rejected
2. Public stock markets require Rp 100M+ minimum — too high for Gen Z & millennials
3. Conventional crowdfunding charges 10-20% platform fees + manual monthly transfers

---

## 💡 The Solution

### Two layers, one experience

**Layer 1 · SuiStream (Primitive)**
- Money stream as a Move object — owned by the recipient
- Composable inside Programmable Transaction Blocks (PTB)
- Transferable, fractionalizable, cancellable
- Reusable: can power payroll, vesting, subscriptions, micro-installments

**Layer 2 · Arthavest (Application)**
- MSME onboarding → Mint NFT + share tokens
- Investor buys shares → PTB atomic (pay SUI + receive shares + mint receipt)
- Owner reports profit → Walrus proof upload
- Distribution → PTB bulk `create_stream` for all holders (1 tx, atomic)
- Investor withdraws → anytime, sub-second finality

### End-to-end flow

```
MSME reports profit
    ↓
Walrus proof upload (immutable blob ID on-chain)
    ↓
DAO Jury verifies (5 jurors, ≥3 approve)
    ↓
PTB bulk: create_stream(152-336 investors) — 1 atomic tx
    ↓
Stream objects appear in investor wallets — accrue per second
    ↓
Investor withdraws anytime (sponsored tx for first-timers)
```

---

## ⚡ Sui-Native Architecture

Every Sui feature used solves a real problem — not a gimmick.

| Sui Feature | Used In | Benefit |
|-------------|---------|---------|
| **Object-Centric Model** | MSME NFT, Share Token (ARTHA), Stream Object | Direct ownership without registry mappings |
| **Programmable Transaction Blocks (PTB)** | Bulk profit distribution, buy + mint receipt | Atomic, gas-efficient, no partial failure |
| **zkLogin** | Investor & MSME onboarding (Google/Twitch) | Web2 UX, web3 security — no wallet install |
| **Sponsored Transactions** | First-time buy & withdraw | Zero gas barrier for new users |
| **Walrus Storage** | MSME document verification (Akta, NPWP, financials) | Immutable audit trail, permanent blob ID |
| **DeepBook** | Secondary market for MSME shares | Liquidity without exit window, on-chain orderbook |

### Comparison: Arthavest vs EVM equivalent

| Aspect | Arthavest (Sui) | EVM equivalent |
|--------|-----------------|----------------|
| Distribution finality | ~800ms | 12-60s (L1) / 1-3s (L2) |
| Gas cost (152 investors) | ~0.03 SUI | $4-12 (ETH L1) |
| Atomic bulk distribution | ✅ 1 PTB | ❌ Multiple txs |
| Wallet onboarding | zkLogin (Google) | MetaMask install |
| Document storage | Walrus (permanent) | IPFS (pinning required) |

---

## 🎬 Live Demo Features

8 fully functional tabs in the app:

1. **Marketplace** — Browse 6 verified MSMEs (Kopi Senja, Warung Bu Tini, Bersih Kilat Laundry, Bakso Pak Joko, Keripik Tempe Ibu Sum, Kebun Organik Lestari)
2. **Portfolio** — Live stream visualizer with real-time accrual (updates every 500ms), withdraw flow
3. **MSME Dashboard** — Owner view with profit distribution flow (3-phase: Walrus upload → DAO verify → PTB bulk)
4. **Secondary Market** — DeepBook integration with orderbook mini, sparklines, buy/sell flow
5. **DAO Jury** — Profit report verification queue with 5-juror voting + Walrus proof review
6. **Onboard MSME** — 4-step wizard (Info → Financials → Walrus docs → Review & Submit)
7. **How It Works** — Two-layer diagram + end-to-end flow
8. **Sui Architecture** — 6 features grid + object tree + PTB code example

### Custom branding throughout
- **Logo**: Circular tree icon (green-gold) + wordmark "Arthavest" (dark blue + green arrow + gold coin)
- **Category icons**: Custom icons for kuliner, kopi, laundry, kerajinan, jasa, pertanian
- **Stream visualizer icons**: UMKM (shop/stall with people) and Investor (shield with upward arrow)

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** (App Router, Turbopack)
- **TypeScript 5** (strict typing)
- **Tailwind CSS 4** + **shadcn/ui** (New York style)
- **Framer Motion** (animations, page transitions, PTB phases)
- **Recharts** (revenue performance charts, sparklines)
- **Sonner** (toast notifications)
- **Zustand** (state management with localStorage persistence)

### Blockchain Integration
- **@mysten/dapp-kit** (wallet connection, Sui client)
- **@mysten/sui** (SDK)
- **next-themes** (dark/light mode)

### Smart Contracts
- **Move** language (Sui Move)
- Two modules: `arthavest::arthavest` (marketplace) + `suistream::stream` (primitive)

### Storage & Tooling
- **Walrus** (decentralized immutable storage for MSME documents)
- **DeepBook** (on-chain central limit orderbook)
- **Prisma ORM** (SQLite for any auxiliary app data)

---

## 📁 Project Structure

```
Arthavest/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (SuiProvider + ThemeProvider)
│   │   ├── page.tsx                  # Main page (tab router)
│   │   └── globals.css               # Tailwind + design tokens + dark mode
│   ├── components/
│   │   ├── layout/                   # Header (logo, wallet, lang, theme) + Footer
│   │   ├── providers/                # SuiProvider, ThemeProvider
│   │   ├── sections/                 # 8 main sections (one per tab)
│   │   │   ├── Hero.tsx
│   │   │   ├── Marketplace.tsx
│   │   │   ├── UMKMDetail.tsx
│   │   │   ├── InvestorDashboard.tsx
│   │   │   ├── OwnerDashboard.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Architecture.tsx
│   │   │   ├── dao/DAOJury.tsx
│   │   │   ├── onboarding/OnboardingUMKM.tsx
│   │   │   └── secondary/SecondaryMarket.tsx
│   │   ├── stream/StreamVisualizer.tsx  # Live money flow animation
│   │   └── ui/                       # shadcn/ui components (40+)
│   ├── lib/
│   │   ├── store.ts                  # Zustand store (wallet, UMKMs, streams, listings, DAO, onboarding)
│   │   ├── types.ts                  # TypeScript types
│   │   ├── i18n.ts                   # 600+ translation keys × 3 languages
│   │   ├── useTranslation.ts         # i18n hook
│   │   ├── format.ts                 # IDR/SUI formatters
│   │   ├── sui-features.ts           # Sui features showcase data
│   │   ├── category-icons.ts         # Category icon helper
│   │   └── sui/useHybridWallet.ts    # Real Sui wallet + mock fallback
│   └── hooks/                        # use-mobile, use-toast
├── contracts/                        # Move smart contracts
│   ├── arthavest.move                # Marketplace module (UMKM NFT, ARTHA token, distribution)
│   ├── stream.move                   # SuiStream primitive (Stream<T> object)
│   └── DEPLOY.md                     # Full Sui testnet deployment guide
├── public/                           # Static assets
│   ├── logo-icon.png                 # Circular brand mark
│   ├── logo-wordmark.png             # "Arthavest" wordmark
│   ├── cat-{kuliner,kopi,laundry,kerajinan,jasa,pertanian}.png
│   ├── stream-umkm.png               # UMKM icon for stream visualizer
│   └── stream-investor.png           # Investor icon for stream visualizer
├── download/                         # Deliverables
│   ├── arthavest-pitch-deck.pptx     # 8-slide pitch deck (English)
│   ├── demo-video-script.md          # 2-minute demo video script
│   └── slides/                       # Editable slide HTML sources
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (recommend 20+)
- **Bun** (preferred package manager) — install: `curl -fsSL https://bun.sh/install | bash`
- Modern browser with **Sui Wallet extension** (optional — app falls back to demo mode)

### Installation

```bash
# Clone the repo
git clone https://github.com/Zerxxz/Arthavest.git
cd Arthavest

# Install dependencies
bun install

# Start dev server
bun run dev
```

Open `http://localhost:3000` in your browser.

### Available Scripts

```bash
bun run dev          # Start dev server (port 3000)
bun run lint         # Run ESLint
bun run build        # Production build
bun run db:push      # Push Prisma schema to SQLite
bun run db:generate  # Generate Prisma client
```

### Demo Mode

The app **auto-connects in demo mode** with a mock wallet (Google zkLogin simulation) so you can explore all 8 tabs without installing anything. If you have a real Sui wallet extension (Sui Wallet, Ethos, etc.), it will use real wallet connection instead.

---

## 📜 Smart Contracts

### `arthavest::arthavest` (Marketplace module)

```move
module arthavest::arthavest {
    // Core types
    public struct UMKM has key { ... }              // MSME NFT
    public struct ARTHA has drop {}                 // Share token (fungible)
    public struct ProfitReport has key { ... }      // Verified profit report
    public struct Distribution has key { ... }      // Bulk distribution receipt

    // Key entry functions
    public entry fun onboard_umkm(...)              // Mint MSME NFT + share supply
    public entry fun buy_shares(...)                // Investor buys shares (PTB atomic)
    public entry fun report_profit(...)             // Owner submits monthly profit
    public entry fun verify_profit_report(...)      // DAO jury approves
    public entry fun distribute_profit(...)         // Bulk create_stream for all holders
}
```

### `suistream::stream` (Primitive module)

```move
module suistream::stream {
    public struct Stream<phantom T> has key, store { ... }  // Money stream object
    
    public entry fun create_stream<T>(...)                   // Create + fund stream
    public entry fun withdraw<T>(...)                        // Recipient withdraws accrued
    public entry fun pause<T>(...) / resume<T>(...)          // Sender controls
    public entry fun cancel<T>(...)                          // Refund remaining
}
```

### Deploy to Sui Testnet

See [`contracts/DEPLOY.md`](contracts/DEPLOY.md) for the full deployment guide including:
- Sui CLI installation & testnet config
- Move package build & publish
- Walrus storage setup
- Real wallet integration (replace mock handlers with PTB submissions)
- Submission checklist

---

## 🌍 Internationalization & Theming

### 3 Languages
- 🇬🇧 **English** (default for international jury)
- 🇮🇩 **Bahasa Indonesia** (local market)
- 🇨🇳 **中文** (Chinese — SEA expansion)

Language preference persists in `localStorage`. Switch via the language dropdown (🌐 icon) in the header.

### Dark / Light Mode
- **Light mode**: Warm cream background (`oklch(0.985 0.008 85)`) with emerald-teal primary
- **Dark mode**: Warm emerald-tinted dark background (`oklch(0.16 0.018 170)`) — not pure black
- Toggle via the theme button (🌙/☀️ icon) in the header
- Theme preference persists via `next-themes`

### Design System
- **Palette**: Cream background + emerald-teal primary (`#0D9488`) + amber-gold accent (`#F59E0B`)
- **Typography**: Plus Jakarta Sans (headings) + Inter (body) + JetBrains Mono (numerics)
- **Components**: shadcn/ui (New York style) with custom utility classes (`.glass-card`, `.shadow-glow-emerald`, `.bg-grid-warm`)

---

## 🗺 Roadmap

| Phase | Timeline | Goals |
|-------|----------|-------|
| **Hackathon MVP** | Q1 2026 (NOW) | 8 flows complete, Move contracts written, demo data |
| **Testnet Public Launch** | Q2 2026 | Publish Move contracts, real @mysten/dapp-kit, real Walrus upload, 10 MSME pilots (Bandung) |
| **Sui Mainnet Launch** | Q3 2026 | Active DAO jury (5 elected), DeepBook secondary market live, 100 MSMEs onboarded, IDR→SUI on-ramp |
| **SEA Expansion** | Q4 2026 | Vietnam & Philippines pilots, mobile app (React Native), SuiStream SDK open-source, koperasi MSME partnerships |

---

## 📦 Submission Deliverables

| Deliverable | Path | Description |
|-------------|------|-------------|
| **Live Demo** | [preview link](https://arthavest.web.id) | Full interactive app (8 tabs) |
| **Pitch Deck** | [`download/arthavest-pitch-deck.pptx`](download/arthavest-pitch-deck.pptx) | 8-slide English deck (1.6 MB) |
| **Demo Video Script** | [`download/demo-video-script.md`](download/demo-video-script.md) | 2-minute video script with 6 scenes |
| **Move Contracts** | [`contracts/arthavest.move`](contracts/arthavest.move), [`contracts/stream.move`](contracts/stream.move) | Smart contract source |
| **Deployment Guide** | [`contracts/DEPLOY.md`](contracts/DEPLOY.md) | Full Sui testnet deployment instructions |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ☕ in Bandung · Move + Sui + Next.js**

[Live Demo](https://arthavest.web.id) · [Pitch Deck](download/arthavest-pitch-deck.pptx) · [Smart Contracts](contracts/) · [Deploy Guide](contracts/DEPLOY.md)

</div>
