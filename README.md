# CS PRO — Couchsurfing Assistant & Trips Manager (iPhone Web App)

<div align="center">

![Couchsurfing Assistant](https://img.shields.io/badge/Platform-iPhone%2015%20Pro%20Max-amber?style=for-the-badge&logo=apple)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20TailwindCSS%20%7C%20Vite-blue?style=for-the-badge)
![AI Nodes](https://img.shields.io/badge/AI%20Nodes-LLaVA%20%7C%20Ollama%20%7C%20Tailscale-emerald?style=for-the-badge)

</div>

**CS PRO** is a premium, mobile-first iOS web application tailored specifically for **iPhone 15 Pro Max** (430px logical screen width, safe area insets, native sheets, and bottom navigation). It serves as the travel hub and trip management module for Couchsurfing travelers and digital nomads.

---

## 🚀 Key Features

### 1. Couchsurfing Authentication & Session Bridge
- Sign in with Couchsurfing credentials or paste active `_couchsurfing_session` / API Bearer tokens.
- Secure local isolation: authentication credentials stay in your private workspace.
- Live session status indicator in the iOS Dynamic Island bar (`CS: IDLE`, `CS: SYNC`, `CS: OFFLINE`).

### 2. Dual Trip Creation Architecture
- **Import from Couchsurfing**:
  - Connects to your Couchsurfing session.
  - Multi-stage scraping progress (Proxy connection → Session verification → Itinerary parsing → Host deduplication).
  - Smart duplicate detection: existing trips are preserved and refreshed without overwriting local custom notes.
  - Selective import with bulk actions.
- **Create Local Trip**:
  - Native iOS trip creation form with city autocomplete and automatic country resolution.
  - Precise date pickers with nights duration calculator.
  - Optional traveler count and trip notes.
  - **Local Isolation Guarantee**: Creating a local trip saves it securely on device and **NEVER** publishes to Couchsurfing automatically.
  - **Explicit Publication**: Separate user-confirmed action to publish a local itinerary to Couchsurfing with clear status feedback (`Not Published` → `Publishing...` → `Published`).

### 3. Rich Travel Cards & Host Discovery Statistics
- Destination cards showing City, Country, Dates, Duration, Source badge (`Couchsurfing` vs `Local`), and Publication tag.
- Host discovery metrics:
  - **Hosts Discovered**
  - **Profiles Analyzed** (via LLaVA image context + Ollama LLM)
  - **Hosts Selected**
  - **Queue count**
- Individual trip actions: **Find Hosts** (opens host discovery with trip pre-loaded), **Sync Data**, **Edit Trip**, and **Archive / Delete**.

### 4. Native iOS Mobile UX
- Designed specifically for **iPhone 15 Pro Max**:
  - `430px` logical viewport width.
  - Respects iOS Safe Areas (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`).
  - Native dark cyberpunk color palette (`#0c0f14`, `#11141b`, `#151a24`, `#222a38`, `#f59e0b`).
  - Native swipeable bottom sheets for details, filters, and forms.
  - Light mode & Dark mode toggle.
  - Desktop responsive iPhone frame preview tool.

### 5. Multi-Tab Navigation
- **Trips**: Main trips hub with search, status filters (All, Upcoming, Local, Couchsurfing, Past), and sorting.
- **Search**: Host discovery module pre-loaded with active trip.
- **Queue (10)**: Host candidate dispatch queue.
- **Auto**: Automated scraping tasks.
- **Inbox (18)**: Couchsurfing chat messages & host responses.
- **Context**: AI models (Ollama, LLaVA, Tailscale mesh) and session parameters.

---

## 🛠️ Project Structure

```text
cs-pro-scrapper/
├── index.html                  # Mobile meta tags, Apple PWA chrome, Google Fonts
├── package.json
├── tailwind.config.js          # Custom CS theme palette & fonts
├── vite.config.ts
├── src/
│   ├── types/
│   │   └── trip.ts             # Trip, HostStats, CSAccount, ImportCandidate types
│   ├── data/
│   │   ├── initialTrips.ts     # Realistic default sample trips (Tokyo, Kyoto, Osaka, Sapporo)
│   │   └── popularDestinations.ts # Destination dictionary for autocomplete
│   ├── services/
│   │   ├── storage.ts          # LocalStorage persistence service
│   │   └── csScraperService.ts # Couchsurfing API / scraping simulation & sync service
│   ├── components/
│   │   ├── Header.tsx          # iOS Status Bar, Dynamic Island pill, AI node badges
│   │   ├── BottomNav.tsx       # iOS Native bottom tab navigation
│   │   ├── TripCard.tsx        # High-density travel card with host progress bar
│   │   ├── ImportModal.tsx     # 3-step import flow (Source → Progress → Deduplicated Results)
│   │   ├── CreateTripModal.tsx # Native create form + explicit publish toggle
│   │   ├── TripDetailsModal.tsx# Full trip detail sheet + Find Hosts launcher
│   │   ├── EditTripModal.tsx   # Edit destination, dates, guests & notes
│   │   ├── AuthModal.tsx       # Couchsurfing login & session management
│   │   ├── HostSearchModal.tsx # Host search & scraper queue preview
│   │   ├── StatusSheet.tsx     # Tailscale, Ollama & LLaVA cluster diagnostics
│   │   └── EmptyState.tsx      # Travel-focused empty state
│   ├── App.tsx                 # Main application controller & responsive frame
│   ├── main.tsx
│   └── index.css               # Tailwind & iOS safe area CSS rules
```

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 25)
- npm 9+

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/Zergan84/cs-pro-scrapper.git
cd cs-pro-scrapper

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` on your browser or open it directly in Safari on your iPhone (connected via local network or Tailscale).

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📱 Adding to iPhone Home Screen (PWA)
1. Open the deployed application URL in Safari on your iPhone.
2. Tap the **Share** button (box with upward arrow).
3. Tap **Add to Home Screen**.
4. Launch **CS PRO** from your home screen for full-screen native iOS immersion with zero browser address bar!
