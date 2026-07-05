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

### Option A — Everything on Vercel (recommended, one project, zero config)

The frontend **and** the Echo AI API deploy together on Vercel from the **repository root** — no "Root Directory" change needed. The root [`vercel.json`](vercel.json) builds the Vite app in `client/` and the API lives in `/api/**` as serverless functions (`/api/health`, `/api/ai/chat`, `/api/ai/categorize`, `/api/ai/summarize`). `VITE_API_URL` defaults to the same-domain `/api`.

**One-time setup:**
1. In Vercel → **Add New… → Project** and import this repo.
2. Leave **Root Directory** as the default (`./`). The root `vercel.json` handles the build (`npm --prefix client install` + `npm --prefix client run build`), output (`client/dist`), SPA rewrites, and serverless functions.
3. Make sure Vercel deploys the branch that contains the app. If it isn't on `main` yet, either merge it into `main`, or set **Settings → Git → Production Branch** to your feature branch.
4. *(Optional)* Add environment variables (Project → Settings → Environment Variables):
   - `GEMINI_API_KEY` *(omit to use the built-in EchoBrain fallback)*
   - `GEMINI_MODEL` = `gemini-1.5-flash`
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` *(for cloud auth)*
5. **Deploy.** That's it. 🎉

**Or via CLI (from the repo root):**
```bash
npm i -g vercel
vercel            # first run: link/confirm; keep root directory as ./
vercel --prod     # ship to production
```

> The app deploys and runs even with **no** environment variables — it falls back to secure local demo mode + EchoBrain AI, so the live URL is instantly demo-ready.

### Option B — Frontend on Vercel + Backend on Render

Prefer a standalone Express server? `render.yaml` deploys the `server/` service to Render. Add `GEMINI_API_KEY` in the Render dashboard, then set the frontend's `VITE_API_URL` to the Render URL (e.g. `https://echovault-api.onrender.com/api`). Both `client/api/**` (Vercel functions) and `server/**` (Express) share the same AI logic, so either works.

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
