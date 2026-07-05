# EchoVault — Protect Your Digital Life 🛡️

> A secure **Digital Legacy Platform** that helps people preserve, organize, and securely pass on their digital life, important documents, memories, and business assets — so the people who matter most are never left in the dark.

Built mobile-first for the **Cursor Mobilethon Hackathon**, with a premium, emotional, Apple/Notion/1Password-inspired UI.

---

## ✨ Why EchoVault

People spend years building memories, businesses and digital assets. When something unexpected happens, families often don't know where the important documents are, how to access accounts, where crypto wallets live, or what the person's wishes were.

**EchoVault solves this** — one beautiful, private vault for documents, memories, wishes, and time-locked messages, with granular access for the people you trust.

---

## 🚀 Features

| Feature | Description |
| --- | --- |
| **Digital Vault** | Encrypted storage for passports, IDs, insurance, property, business & crypto documents. Search, filter, sort, importance & beneficiaries. |
| **Memory Vault** | Photos, videos, voice notes, letters, stories & achievements — with AI-generated summaries. |
| **Time Capsules** | The emotional centerpiece. Seal a message to be opened on a birthday, anniversary, after graduation, in 5 years, or manually. Live countdown timers. |
| **Trusted Circle** | Add trusted people with permission levels: Viewer, Family, Lawyer, Business Partner, Administrator. |
| **Echo AI** | A Gemini-powered assistant. Ask "Where is my passport?", "What expires next year?", "Summarize my memories", "Organize my vault". |
| **Emergency Card** | Blood group, allergies, conditions, medication, doctor, insurance & contacts — with a scannable QR code. |
| **Settings** | Profile, security, notifications, theme (dark/light), storage & AI preferences. |

---

## 🧱 Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Framer Motion, React Router
- **Backend:** Node.js, Express.js
- **Database & Auth & Storage:** Supabase
- **AI:** Google Gemini API
- **Deployment:** Vercel (frontend) + Render (backend)

---

## 📁 Project Structure

```
echovault/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Layout, UI primitives, Logo, etc.
│   │   ├── context/         # Auth, Data, Theme providers
│   │   ├── lib/             # Supabase, local store, AI api, utils, seed
│   │   └── pages/           # Landing, Auth, Dashboard, Vault, Memories,
│   │                        #   Capsules, Circle, Echo, Emergency, Settings
│   └── vercel.json
├── server/                 # Express API + Gemini proxy
│   ├── routes/             # health, ai
│   └── services/           # gemini, echoBrain (mock fallback)
├── supabase/schema.sql     # Full database schema + RLS policies
└── render.yaml             # Backend deployment config
```

---

## 🏃 Quick Start (zero config)

EchoVault works **out of the box** with no API keys — auth and data run in a secure local demo mode, and Echo AI uses a smart rule-based fallback ("EchoBrain"). Add keys later to go fully cloud + Gemini.

```bash
# 1. Install everything
npm run install:all        # or: (cd client && npm i) && (cd server && npm i)

# 2. Run both apps (in two terminals, or use the combined script)
npm run dev                # runs API on :4000 and web on :5173
#   — or individually —
npm run dev:server
npm run dev:client
```

Open **http://localhost:5173** and click **"Explore the live demo"** to jump straight into a pre-populated vault.

---

## 🔐 Enabling Supabase + Gemini (optional)

### Frontend (`client/.env`)
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=/api
```

### Backend (`server/.env`)
```env
PORT=4000
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-1.5-flash
```

### Database
1. Create a Supabase project.
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql) — it creates all tables (`users`, `vault_documents`, `memories`, `trusted_contacts`, `time_capsules`, `emergency_cards`, `activity_logs`, `notifications`) with **Row Level Security** so every user only sees their own data.
3. Enable **Email** and **Google** providers under Authentication.
4. (Optional) Create a private `vault` storage bucket for file uploads.

When these are set, the app automatically switches from demo mode to real Supabase auth. If `GEMINI_API_KEY` is present, Echo AI uses Gemini; otherwise it gracefully falls back to EchoBrain.

---

## 🌐 Deployment

- **Frontend → Vercel:** point Vercel at the `client/` directory. `vercel.json` handles the SPA rewrites and Vite build. Add the `VITE_*` env vars.
- **Backend → Render:** `render.yaml` deploys the `server/` service. Add `GEMINI_API_KEY` in the Render dashboard. Set the frontend's `VITE_API_URL` to the Render URL (e.g. `https://echovault-api.onrender.com/api`).

---

## 🎨 Design

Premium, mobile-first UI with glassmorphism, rounded cards, gradients, smooth Framer Motion animations, beautiful empty states, and full **dark / light** mode.

**Palette:** Primary `#2563EB` · Secondary `#7C3AED` · Success `#22C55E` · Warning `#F59E0B` · Danger `#EF4444` · Background `#0F172A` · Cards `#1E293B`.

---

## 🤖 Echo AI

Echo can:
- Categorize documents & suggest categories
- Generate memory summaries
- Search your vault naturally & answer questions
- Track what expires next & generate reminders
- Suggest beneficiaries & help organize your vault

Powered by Google Gemini, with a fully offline fallback so demos never break.

---

Built with ❤️ for the Cursor Mobilethon.
