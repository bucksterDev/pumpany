# Deployment Guide - Vercel

## Frontend Deployment (Automatic via Vercel)

The frontend is configured to deploy automatically when you push to GitHub.

### Vercel Settings:

1. **Framework Preset:** Vite
2. **Root Directory:** `./` (monorepo root)
3. **Build Command:** `npm run vercel-build`
4. **Output Directory:** `apps/frontend/dist`
5. **Install Command:** `npm install`

### Environment Variables (Frontend):

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.vercel.app
VITE_WS_URL=wss://your-backend-url.vercel.app/ws
```

**Note:** You'll need to deploy the backend first to get the backend URL.

---

## Backend Deployment (Separate Vercel Project)

Deploy the backend as a separate Vercel project:

### Option 1: Via Vercel CLI

```bash
cd apps/backend
vercel
```

### Option 2: Via Vercel Dashboard

1. Create a new project
2. Import the same GitHub repo
3. Set **Root Directory:** `apps/backend`
4. Framework Preset: Other
5. Build Command: `npm run build`
6. Output Directory: `dist`

### Environment Variables (Backend):

**CRITICAL:** Add these in Vercel Dashboard:

```bash
# Database (use a hosted database)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Base Chain
BASE_RPC_URL=https://sepolia.base.org
DEPLOYER_PRIVATE_KEY=your_private_key

# OpenClaw
OPENCLAW_API_KEY=your_key
OPENCLAW_API_URL=https://api.openclaw.ai

# Clanker
CLANKER_API_KEY=your_key
CLANKER_WEBHOOK_URL=https://your-backend-url.vercel.app/api/webhooks/clanker

# Security
API_SECRET_KEY=random_secret_key_here
NODE_ENV=production
```

---

## Database Setup (Required for Backend)

Vercel serverless functions need a hosted database. Options:

### Option 1: Supabase (Recommended)

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use "Connection Pooling" mode)
5. Add to Vercel as `DATABASE_URL`

### Option 2: Neon

1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add to Vercel as `DATABASE_URL`

### Run Migrations on Hosted DB

After setting up the database:

```bash
# Update .env with production DATABASE_URL
cd apps/backend

# Run migrations
npm run db:generate
npm run db:migrate
```

---

## WebSocket Considerations

**Important:** Vercel serverless functions have limitations with WebSockets.

### Solutions:

1. **Use Polling Instead:**
   - Modify frontend to poll `/api/companies/:id` every few seconds
   - Remove WebSocket connection

2. **Deploy Backend Elsewhere:**
   - Railway.app (supports WebSockets)
   - Render.com (supports WebSockets)
   - Fly.io (supports WebSockets)

3. **Use Vercel + Separate WS Service:**
   - Deploy REST API to Vercel
   - Deploy WebSocket server to Railway/Render

---

## Recommended Deployment Strategy

### For MVP Testing:

**Frontend:** Vercel ✅
**Backend:** Railway.app (better for WebSockets + persistent connections)
**Database:** Supabase ✅

### Deploy Backend to Railway Instead:

1. Go to https://railway.app
2. Connect GitHub repo
3. Select `apps/backend` directory
4. Add all environment variables
5. Deploy
6. Copy the Railway URL
7. Update frontend `VITE_API_URL` on Vercel

---

## Quick Start: Frontend Only

To deploy just the frontend (with mock backend):

1. Push to GitHub (already done ✅)
2. On Vercel, select root directory
3. Set build settings as above
4. **Don't add** `VITE_API_URL` yet (will use localhost mock)
5. Deploy

The frontend will work in demo mode until you deploy the backend.

---

## Current Status

- ✅ Code pushed to GitHub
- ✅ Vercel config files created
- ⏳ Ready for Vercel import

**Next Steps:**
1. Import project on Vercel
2. Configure build settings (see above)
3. Deploy frontend first
4. Deploy backend to Railway (recommended) or Vercel
5. Update frontend env vars with backend URL
