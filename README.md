# QuizArena — Gamified Assessment Platform

A production-ready, full-stack **Quiz Management & Online Assessment Platform** with a gamified UI/UX (Kahoot / Duolingo energy). Built with React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Node.js, Express, Prisma ORM (SQLite for dev), JWT auth, Zod validation, and Zustand state management.

---

## 🎮 Live Demo Credentials

| Role    | Email                         | Password      |
|---------|-------------------------------|---------------|
| Admin   | admin@quizplatform.com        | `Admin123!`   |
| Student | student@quizplatform.com      | `Student123!` |

---

## 🚀 Quick Setup & Run

### Prerequisites
- **Node.js** v18+ (LTS recommended)
- **npm** v9+

### 1. Install all dependencies

```bash
# From the root "Quiz Platform" directory
npm install                       # install root dev deps (concurrently)
npm install --prefix server       # install server deps
npm install --prefix client       # install client deps
```

### 2. Configure environment variables

The server ships with a working `.env` file for local development. If you need to customize:

```bash
cp server/.env.example server/.env
```

The default `.env` values work out-of-the-box with SQLite:
```
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET=quiz_super_secret_access_key_2026_gamified
JWT_REFRESH_SECRET=quiz_super_secret_refresh_key_2026_gamified
```

### 3. Set up the database

```bash
# Push Prisma schema to SQLite and generate the Prisma client
npm run db:migrate

# Seed with sample quizzes, questions, and demo users
npm run db:seed
```

### 4. Start the development servers

```bash
# Runs both client (port 5173) and server (port 5000) concurrently
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 🧪 Running Unit Tests

```bash
npm test
# or directly:
npm --prefix server run test
```

Tests cover:
- **Scoring Logic** — Single choice, multi-choice, percentage calculation
- **Gamification Engine** — Level math, XP bonuses, streak calculation, badge evaluation
- **Server Timer Validation** — Server-side time-limit expiry checks
- **Auth JWT Flow** — Token generation and verification

---

## 📦 Build for Production

```bash
npm run build:server   # compile server TypeScript → dist/
npm run build:client   # compile client → dist/
```

---

## 🗂️ Project Structure

```
Quiz Platform/
├── package.json              # Root workspace scripts
├── README.md
├── .gitignore
├── server/
│   ├── .env                  # Local environment config
│   ├── .env.example          # Environment template
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma data model
│   │   └── seed.ts           # Seed script
│   └── src/
│       ├── index.ts          # Express app entry
│       ├── config/env.ts     # Zod env parsing
│       ├── middleware/
│       │   ├── auth.ts       # requireAuth, requireRole guards
│       │   ├── errorHandler.ts
│       │   └── validate.ts   # Zod request validation middleware
│       ├── controllers/      # Business logic per domain
│       ├── routes/           # Express routers
│       ├── schemas/          # Zod validation schemas
│       └── utils/
│           ├── jwt.ts        # Token generation/verification
│           ├── password.ts   # bcrypt hash/compare
│           ├── prisma.ts     # Prisma client singleton
│           └── gamification.ts # XP, level, streak, badge logic
└── client/
    ├── .env.example
    ├── package.json
    ├── vite.config.ts        # Vite + API proxy
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.tsx          # React entry point
        ├── App.tsx           # Router + route guards
        ├── index.css         # Tailwind + game button CSS
        ├── types/index.ts    # Shared TypeScript types
        ├── store/            # Zustand stores (auth, theme, audio, attempt)
        ├── services/api.ts   # Fetch + auto-refresh API client
        ├── utils/
        │   └── sound.ts      # Web Audio API SFX synthesizer
        ├── components/       # Reusable UI components
        └── pages/            # Route-level page components
```

---

## 🎯 Feature Highlights

### 🔐 Authentication
- JWT access tokens (15-minute expiry) + httpOnly refresh cookies (7 days)
- bcrypt password hashing (10 salt rounds)
- Auto token-refresh on 401 with seamless re-request
- Forgot/reset password with token-based flow

### 🎮 Gamification
- XP earned per quiz (base + perfect score bonus + streak multiplier)
- Dynamic level calculation via √ formula
- Daily streak tracking (reset if missed a day)
- Badge auto-unlock: First Step, Quiz Master, Sharpshooter, On Fire, Overachiever

### ⚡ Quiz Engine
- Server-enforced timer (15s grace period for latency)
- Idempotent submit endpoint (double-submit is safe)
- Single/Multi-choice/True-False question support
- Real-time answer auto-save on every selection

### 🏆 Leaderboard
- Global XP rankings with animated podium top 3
- Per-quiz best-score rankings
- Gold/Silver/Bronze badges for top 3

### 📊 Admin Command Center
- HUD stats (quizzes, students, attempts, avg score)
- 7-day attempts + average score trend chart
- Per-quiz analytics with question difficulty bar chart
- Bulk import questions via JSON or CSV

---

## ⚠️ Known Limitations & Assumptions

1. **Database**: Using SQLite (via `file:./dev.db`) for portability in development. For production, update `DATABASE_URL` in `.env` to a PostgreSQL connection string and change `provider = "postgresql"` in `schema.prisma`.

2. **Email**: The forgot-password flow returns the reset token directly in the API response (for demo convenience). In production, integrate an email service (SendGrid, Resend, etc.) to send reset links via email.

3. **File Uploads**: Quiz thumbnails accept URL strings, not file uploads. For production, integrate Cloudinary or an S3 bucket for image hosting.

4. **WebSocket**: The "live attempts" table on the Admin Dashboard refreshes on page load, not in real-time. WebSocket integration (Socket.IO) is not included.

5. **Refresh Token Rotation**: Refresh tokens are stateless (JWT-based). For production, store refresh tokens in a database table to support token revocation.

6. **CSV Import**: The CSV parser is a minimal custom implementation. For production-grade CSV parsing, integrate `papaparse` or `csv-parse`.

7. **Audio**: Web Audio API is used for synthesized SFX. Mobile browsers may require a user gesture before audio context is created (this is handled automatically by attaching to the first interaction).

8. **`prefers-reduced-motion`**: The codebase uses Framer Motion which respects `prefers-reduced-motion` by default via its `useReducedMotion` hook on individual components. The shake animation is defined in CSS and should be wrapped in a `@media (prefers-reduced-motion: no-preference)` block for full compliance.
