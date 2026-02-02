# Setup Guide - Clawd Pumpany MVP

Complete setup instructions for getting the MVP running.

## Prerequisites

1. **Node.js 18+**
   ```bash
   node --version  # Should be 18.x or higher
   ```

2. **PostgreSQL**
   ```bash
   # Install via Homebrew (macOS)
   brew install postgresql@15
   brew services start postgresql@15

   # Or use Docker
   docker run --name clawd-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
   ```

3. **API Keys**
   - OpenClaw API key (get from openclaw.ai)
   - Base RPC endpoint (or use public: https://mainnet.base.org)
   - Clanker API key (optional, get from clanker.world)
   - Private key for token deployment (testnet recommended)

## Step 1: Install Dependencies

```bash
# From project root
npm install
```

## Step 2: Set Up Database

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE clawd_pumpany;

# Exit psql
\q
```

## Step 3: Configure Environment Variables

### Backend Environment

Create `apps/backend/.env`:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/clawd_pumpany

# Base Chain (use testnet for testing)
BASE_RPC_URL=https://sepolia.base.org
DEPLOYER_PRIVATE_KEY=your_private_key_here

# OpenClaw
OPENCLAW_API_KEY=your_openclaw_api_key
OPENCLAW_API_URL=https://api.openclaw.ai

# Clanker (optional)
CLANKER_API_KEY=your_clanker_api_key
CLANKER_WEBHOOK_URL=http://localhost:3000/api/webhooks/clanker

# Security
API_SECRET_KEY=your_random_secret_key
```

### Frontend Environment

Create `apps/frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/ws
```

## Step 4: Generate and Run Database Migrations

```bash
cd apps/backend

# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate
```

## Step 5: Compile Smart Contracts (Optional)

If you want to deploy actual tokens:

```bash
cd packages/contracts

# Compile contracts
npm run compile

# This generates the bytecode needed for deployment
# Copy the bytecode and add to backend .env as COMPANY_TOKEN_BYTECODE
```

## Step 6: Start Development Servers

### Option 1: Run Everything

```bash
# From project root
npm run dev
```

### Option 2: Run Individually

```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **WebSocket:** ws://localhost:3000/ws

## Step 7: Test the Flow

1. **Open Frontend**
   - Navigate to http://localhost:5173

2. **Create a Company**
   - Enter a prompt like: "A marketplace for AI-generated art with NFT minting"
   - Select compute level (medium recommended)
   - Click "Launch Company"

3. **Watch the Dashboard**
   - You'll be redirected to the company dashboard
   - Watch in real-time as:
     - Token is deployed (or mocked if bytecode not set)
     - Agents are spawned
     - Tasks are created and assigned
     - Agent status updates via WebSocket

4. **Monitor Backend Logs**
   - Watch the backend terminal for:
     - Token deployment
     - Agent spawning
     - Task orchestration
     - Token event monitoring

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Reset database if needed
psql postgres -c "DROP DATABASE clawd_pumpany;"
psql postgres -c "CREATE DATABASE clawd_pumpany;"
cd apps/backend && npm run db:migrate
```

### OpenClaw API Issues

If OpenClaw API is not available:
- The app will log warnings but continue
- Agents won't actually spawn, but the flow will complete
- You can test the UI/UX without real agent execution

### Token Deployment Issues

Without `COMPANY_TOKEN_BYTECODE`:
- System uses mock token deployment
- Returns fake addresses for testing UI
- Clanker monitoring won't work (no real tokens)

To get real deployment:
1. Compile contracts: `cd packages/contracts && npm run compile`
2. Get bytecode from `artifacts/contracts/CompanyToken.sol/CompanyToken.json`
3. Add to backend `.env` as `COMPANY_TOKEN_BYTECODE`

### Port Conflicts

If ports are in use:
- Backend: Change `PORT` in `apps/backend/.env`
- Frontend: Change port in `apps/frontend/vite.config.ts`

## Testing Without External Services

You can test the complete flow without OpenClaw or real Base deployment:

1. Leave `OPENCLAW_API_KEY` empty - agents will be mocked
2. Leave `COMPANY_TOKEN_BYTECODE` empty - tokens will be mocked
3. Leave `CLANKER_API_KEY` empty - monitoring will be disabled

The UI and orchestration will work, just without actual AI agents or blockchain transactions.

## Next Steps After Setup

1. **Test Company Creation**
   - Create multiple companies
   - Try different compute levels
   - Watch real-time updates

2. **Check Database**
   ```bash
   cd apps/backend
   npm run db:studio  # Opens Drizzle Studio
   ```

3. **Monitor API**
   - GET http://localhost:3000/api/companies - List all companies
   - GET http://localhost:3000/api/agents/company/:id - List agents
   - GET http://localhost:3000/api/tasks/company/:id - List tasks

4. **WebSocket Testing**
   - Open browser console on dashboard
   - Watch for WebSocket messages
   - Should see real-time updates for:
     - Token deployment
     - Agent spawning
     - Task assignments
     - Compute balance changes

## Production Deployment

For production deployment:

1. **Database**: Use managed PostgreSQL (Supabase, Neon, etc.)
2. **Backend**: Deploy to Railway, Render, or Fly.io
3. **Frontend**: Deploy to Vercel or Netlify
4. **Contracts**: Deploy to Base mainnet (use mainnet RPC)
5. **Environment**: Update all URLs and keys for production

## API Endpoints Reference

### Companies
- `POST /api/companies` - Create company
- `GET /api/companies` - List all
- `GET /api/companies/:id` - Get details
- `PATCH /api/companies/:id/token` - Update token
- `PATCH /api/companies/:id/status` - Update status

### Agents
- `GET /api/agents/company/:companyId` - List agents
- `GET /api/agents/:id` - Get agent
- `PATCH /api/agents/:id/status` - Update status

### Tasks
- `GET /api/tasks/company/:companyId` - List tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id/status` - Update status

### Webhooks
- `POST /api/webhooks/clanker` - Clanker webhook

### Health
- `GET /health` - Health check

## Support

Issues? Check:
1. Backend logs for errors
2. Frontend console for errors
3. Database connections
4. Environment variables

Happy building! 🚀
