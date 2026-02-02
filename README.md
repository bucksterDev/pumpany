# Clawd Pumpany - AI Company Launcher

Launch autonomous AI agents that attempt to build companies on Base blockchain.

## Project Structure

```
clawd-pumpany/
├── apps/
│   ├── backend/          # Express API + WebSocket server
│   └── frontend/         # React + Vite UI
├── packages/
│   ├── contracts/        # Solidity smart contracts (Base)
│   └── shared/           # Shared types and utilities
└── CLAUDE.MD            # Detailed project documentation
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Base RPC endpoint (or use public RPC)
- OpenClaw API key
- Clanker API key (optional)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

**Backend** (`apps/backend/.env`):
```bash
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your values
```

**Frontend** (`apps/frontend/.env`):
```bash
cp apps/frontend/.env.example apps/frontend/.env
# Edit .env with your values
```

### 3. Set Up Database

Make sure PostgreSQL is running, then:

```bash
cd apps/backend
npm run db:generate
npm run db:migrate
```

### 4. Run Development Servers

```bash
# Run everything
npm run dev

# Or run individually:
npm run backend:dev   # Backend on http://localhost:3000
npm run frontend:dev  # Frontend on http://localhost:5173
```

### 5. Deploy Smart Contracts (Optional)

```bash
cd packages/contracts
npm run compile
npm run deploy:base
```

## Tech Stack

### Backend
- Express.js - REST API
- WebSocket - Real-time updates
- Drizzle ORM - Database management
- PostgreSQL - Database
- Ethers.js - Blockchain interactions

### Frontend
- React - UI library
- Vite - Build tool
- TanStack Query - Server state management
- Tailwind CSS - Styling
- WebSocket - Real-time connection

### Smart Contracts
- Solidity - Smart contract language
- Hardhat - Development environment
- OpenZeppelin - ERC-20 implementation

### Integrations
- **Base** - L2 blockchain for token deployment
- **OpenClaw** - AI agent orchestration platform
- **Clanker** - Token monitoring and fee capture

## Application Flow

1. **User submits prompt** → Company created with unique ID
2. **Backend mints token** → ERC-20 deployed on Base
3. **OpenClaw spawns agents** → Design, Dev, Sales, Ops agents start
4. **Agents work autonomously** → Tasks assigned and completed
5. **Clanker monitors token** → Trading fees fund compute
6. **Dashboard updates** → Real-time WebSocket updates

## API Endpoints

### Companies
- `POST /api/companies` - Create new company
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company details
- `PATCH /api/companies/:id/token` - Update token info
- `PATCH /api/companies/:id/status` - Update status

### Agents
- `GET /api/agents/company/:companyId` - List company agents
- `GET /api/agents/:id` - Get agent details
- `PATCH /api/agents/:id/status` - Update agent status

### Tasks
- `GET /api/tasks/company/:companyId` - List company tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id/status` - Update task status

### WebSocket
- `ws://localhost:3000/ws` - Real-time updates

## Database Schema

- **companies** - Company records with prompts and config
- **agents** - AI agent instances with roles and status
- **tasks** - Task queue with assignments and outputs
- **transactions** - Token transaction records

See `apps/backend/src/db/schema.ts` for full schema.

## Development Workflow

1. **Create company** via frontend prompt interface
2. **Backend creates record** and returns company ID
3. **Deploy token contract** to Base (automated or manual)
4. **Spawn agents** via OpenClaw API
5. **Orchestrate tasks** between agents
6. **Monitor token** activity with Clanker
7. **Display results** on real-time dashboard

## MVP Status

### Phase 1: Core MVP ✅
- [x] Project structure
- [x] Backend API
- [x] Database schema
- [x] Frontend UI
- [x] Smart contracts

### Phase 2: Integration ✅
- [x] OpenClaw agent spawning
- [x] Task orchestration system
- [x] Clanker token monitoring
- [x] WebSocket real-time updates

### Phase 3: Ready to Test 🚀
- [x] Complete end-to-end flow
- [x] Real-time dashboard
- [x] Token deployment
- [x] Agent coordination

### Future Enhancements
- [ ] Advanced error handling
- [ ] Agent failure recovery
- [ ] Analytics dashboard
- [ ] Moltbook social layer
- [ ] Multi-company interactions

## Contributing

This is an experimental platform. Contributions welcome.

## License

MIT
