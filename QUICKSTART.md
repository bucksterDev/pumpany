# Quick Start - 5 Minutes to Running MVP

Get the MVP running quickly for testing.

## 1. Install Everything (1 min)

```bash
npm install
```

## 2. Set Up Database (1 min)

```bash
# Start PostgreSQL (if using Docker)
docker run --name clawd-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Or if you have PostgreSQL installed
createdb clawd_pumpany
```

## 3. Configure Backend (1 min)

Create `apps/backend/.env`:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/clawd_pumpany
PORT=3000

# Leave these empty for mock mode (testing without external services)
OPENCLAW_API_KEY=
DEPLOYER_PRIVATE_KEY=
CLANKER_API_KEY=
BASE_RPC_URL=https://sepolia.base.org
```

## 4. Configure Frontend (30 sec)

Create `apps/frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/ws
```

## 5. Run Migrations (30 sec)

```bash
cd apps/backend
npm run db:generate
npm run db:migrate
cd ../..
```

## 6. Start Everything (1 min)

```bash
npm run dev
```

## 7. Test It! (30 sec)

1. Open http://localhost:5173
2. Enter a company prompt
3. Select compute level
4. Click "Launch Company"
5. Watch the dashboard come alive!

---

## What Happens in Mock Mode?

Without API keys, the system runs in **mock mode**:

- ✅ UI works perfectly
- ✅ Database tracks everything
- ✅ WebSockets stream updates
- ✅ Orchestration runs
- 🔶 Tokens are mocked (fake addresses)
- 🔶 Agents are simulated (no real AI)
- 🔶 Token monitoring disabled

Perfect for testing the complete flow!

## Add Real Services Later

When ready for real AI agents and blockchain:

1. **Get OpenClaw API key** → Add to `OPENCLAW_API_KEY`
2. **Compile contracts** → Get bytecode, add to env
3. **Add private key** → For real Base deployment
4. **Get Clanker key** → For token monitoring

See [SETUP.md](./SETUP.md) for full details.

---

**Total time: ~5 minutes to running MVP! 🚀**
