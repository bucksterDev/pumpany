# Deploy Backend to Railway

Railway is perfect for our backend because it supports WebSockets and long-running connections.

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (easiest)

## Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `pumpany` repository
4. Railway will detect it's a Node.js app

## Step 3: Configure Root Directory

1. After creating the project, go to **Settings**
2. Under **"Build"**, set **Root Directory** to: `apps/backend`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `node dist/index.js`

## Step 4: Add Environment Variables

Go to **Variables** tab and add:

```bash
# Required
NODE_ENV=production
PORT=3000

# Database - Use Railway PostgreSQL (see below)
DATABASE_URL=postgresql://...

# Optional (for mock mode, leave empty)
OPENCLAW_API_KEY=
DEPLOYER_PRIVATE_KEY=
CLANKER_API_KEY=
BASE_RPC_URL=https://sepolia.base.org
API_SECRET_KEY=your_random_secret_here
```

## Step 5: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a database
4. Copy the `DATABASE_URL` from the PostgreSQL service
5. Add it to your backend service variables

## Step 6: Run Database Migrations

After deploying, you need to run migrations:

### Option A: Use Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npm run db:migrate --service backend
```

### Option B: Temporary Solution

Add migration to start command (one-time):
1. Go to Settings → Deploy
2. Change **Start Command** to: `npm run db:migrate && node dist/index.js`
3. Deploy
4. After first successful deploy, change back to: `node dist/index.js`

## Step 7: Get Your Backend URL

1. Go to **Settings** → **Domains**
2. Railway gives you a URL like: `backend-production-xxxx.up.railway.app`
3. Copy this URL

## Step 8: Update Frontend on Vercel

1. Go to your Vercel project
2. Go to **Settings** → **Environment Variables**
3. Add:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app
   VITE_WS_URL=wss://your-backend-url.up.railway.app/ws
   ```
4. Redeploy frontend

## Step 9: Test!

Your full stack should now be live:
- Frontend: `your-project.vercel.app`
- Backend: `backend-production-xxxx.up.railway.app`

Test the flow:
1. Visit frontend
2. Enter a company prompt
3. Submit
4. Should see company created and redirected to dashboard

---

## Troubleshooting

### Build fails on Railway

Check the logs. Common issues:
- Wrong root directory (should be `apps/backend`)
- Missing dependencies (Railway should auto-detect from package.json)

### Database connection fails

- Make sure `DATABASE_URL` is set correctly
- Check that PostgreSQL service is running
- Run migrations using Railway CLI

### WebSocket not connecting

- Make sure you're using `wss://` (not `ws://`) for the production URL
- Check that backend is deployed and running

### Health check fails

- Backend has a `/health` endpoint that Railway uses
- If it fails, check logs for startup errors

---

## Cost

Railway free tier includes:
- $5/month credit
- Should be enough for testing/MVP
- Upgrade when you need more

## Next Steps

Once everything is working:
1. Add real API keys (OpenClaw, Base RPC, etc.)
2. Test token deployment
3. Test agent spawning
4. Monitor with Railway metrics

Happy deploying! 🚀
