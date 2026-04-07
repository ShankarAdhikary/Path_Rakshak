# 🛡️ AcciGuard AI — Golden Hour Companion

A Progressive Web App (PWA) built with React + Vite designed to assist during road accidents and medical emergencies. It provides AI-powered first-aid guidance, real-time mapping of nearby emergency services, and structured checklists to help you act fast during the critical "golden hour."

## Features

- 🆘 **SOS Button** — One-tap emergency activation with pulsing animation
- 🤖 **AI Chat** — Gemini 2.0 Flash-powered emergency guidance (voice input supported)
- 🗺️ **Interactive Map** — Nearby hospitals, police, ambulances via OpenStreetMap + Overpass API
- ⏱️ **Golden Hour Timer** — Countdown with color-coded urgency
- ✅ **Checklists** — Time-based golden hour steps + post-accident evidence/legal/insurance checklists
- 🩺 **Medical ID** — Blood type, allergies, conditions, emergency contact (shareable)
- 📞 **Emergency Contacts** — Quick-call contacts stored locally
- 📴 **Offline Support** — Service Worker + fallback data for 5 Indian cities
- 🌐 **Localization** — Country-specific emergency numbers (India 112, US 911, UK 999, Australia 000)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

### Gemini API Key (required for AI chat)

1. Get a free key at [aistudio.google.com](https://aistudio.google.com)
2. Set it in the app's **Settings** screen, or create a `.env` file:

```bash
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY=your_key_here
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 19 + Vite 6 |
| Styling | Tailwind CSS v3 |
| Maps | Leaflet + react-leaflet + OpenStreetMap |
| Data | Overpass API (live) + local JSON (offline) |
| Storage | localStorage + localforage (IndexedDB) |
| AI | Google Gemini 2.0 Flash REST API |
| PWA | Service Worker + Web App Manifest |
| Voice | Web Speech API |

## Build

```bash
npm run build   # Production build to dist/
npm run preview # Preview production build
```

## Emergency Numbers

| Country | Number |
|---------|--------|
| 🇮🇳 India | 112 |
| 🇺🇸 United States | 911 |
| 🇬🇧 United Kingdom | 999 |
| 🇦🇺 Australia | 000 |

> ⚠️ **Always call your local emergency services first. This app is a supplement, not a replacement.**
