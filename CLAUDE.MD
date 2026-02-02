# CLAUDE.MD - AI Company Launcher Platform

## Project Overview

This is an **AI-powered company launcher** built on Base blockchain. Users input a prompt, and the platform spawns autonomous AI agents that attempt to build companies. The system is NOT building companies itself—it's building the infrastructure: a launcher, orchestrator, token watcher, and dashboard.

**Core Technology Stack:**
- **Blockchain:** Base (L2 Ethereum)
- **AI Agent Platform:** OpenClaw (openclaw.ai)
- **Token Infrastructure:** Clanker (Base)
- **Social Layer (Optional):** Moltbook

---

## Application Flow

### 1. Prompt → Company Creation
**Tools:** Frontend + Backend API

- User enters:
  - Company prompt/vision
  - Compute level selection
- Backend:
  - Generates unique `company_id`
  - Saves configuration to database
  - Returns company record

### 2. Mint Startup Token (on Base)
**Tools:** Base RPC + ERC-20 Contract

- Deploy new ERC-20 token for the company
- Store `token_address` in company record
- Return token details to frontend
- **Purpose:** Each company gets its own tradable asset

### 3. Spawn AI Employees
**Tools:** OpenClaw Agent Platform

- Create 3-4 specialized agents:
  - **Design Agent:** UI/UX, branding, creative
  - **Dev Agent:** Build, code, technical implementation
  - **Sales Agent:** Marketing, outreach, growth
  - **Ops Agent:** Operations, coordination, logistics
- Pass original prompt + specific role context
- Start agent containers
- **Purpose:** Agents immediately begin autonomous work

### 4. Task Orchestration
**Tools:** Backend + OpenClaw Control API

- Assign tasks to appropriate agents
- Poll agent outputs/completions
- Store results in database
- Coordinate inter-agent communication
- **Purpose:** Keep agents aligned and productive

### 5. Token Watching + Fees
**Tools:** Clanker (Base) + Onchain Event Listener

- Monitor token trading volume
- Capture transaction fees
- Credit compute balance for the company
- **Purpose:** Token activity funds continued agent operation

### 6. Business Dashboard
**Tools:** React + WebSockets

**Display:**
- Token statistics (price, volume, holders)
- Agent status (active, idle, tasks completed)
- Open tasks and queue
- Revenue generated
- "Employee" count
- Real-time updates

**Purpose:** User sees their startup operating in real-time

### 7. Agent Social Layer (Optional)
**Tools:** Moltbook

- Agents post status updates
- Agents read other agents' posts
- Cross-company agent interactions
- **Purpose:** Experimental social dynamics between AI companies

---

## System Architecture

```
┌─────────────┐
│   Frontend  │ (React + WebSockets)
└──────┬──────┘
       │
┌──────▼──────┐
│   Backend   │ (API + Orchestrator)
└──────┬──────┘
       │
       ├──────► Base Chain (Token Minting)
       │
       ├──────► OpenClaw (Agent Spawning)
       │
       ├──────► Clanker (Token Monitoring)
       │
       └──────► Database (State Management)
```

---

## Key Components

### 1. Launcher
- User-facing prompt interface
- Compute tier selection
- Company configuration

### 2. Agent Orchestrator
- OpenClaw integration
- Task assignment logic
- Agent lifecycle management
- Output collection

### 3. Token Watcher
- Onchain event monitoring
- Fee capture mechanism
- Compute credit system

### 4. Dashboard
- Real-time company metrics
- Agent activity visualization
- Token performance tracking

---

## Database Schema (Conceptual)

### Companies Table
- `company_id` (UUID)
- `prompt` (text)
- `compute_level` (enum)
- `token_address` (address)
- `created_at` (timestamp)
- `compute_balance` (decimal)
- `status` (active/paused/archived)

### Agents Table
- `agent_id` (UUID)
- `company_id` (FK)
- `role` (design/dev/sales/ops)
- `status` (active/idle/busy)
- `container_id` (string)
- `tasks_completed` (integer)

### Tasks Table
- `task_id` (UUID)
- `company_id` (FK)
- `agent_id` (FK)
- `description` (text)
- `status` (pending/in_progress/completed)
- `output` (json)
- `created_at` (timestamp)

### Transactions Table
- `tx_id` (UUID)
- `company_id` (FK)
- `token_address` (address)
- `volume` (decimal)
- `fee_captured` (decimal)
- `timestamp` (timestamp)

---

## Development Priorities

### Phase 1: Core Infrastructure
1. Frontend prompt interface
2. Backend API for company creation
3. Base token deployment integration
4. Basic database setup

### Phase 2: Agent Integration
1. OpenClaw API integration
2. Agent spawning logic
3. Task assignment system
4. Output polling mechanism

### Phase 3: Token Economics
1. Clanker integration
2. Event listener for token activity
3. Fee capture logic
4. Compute credit system

### Phase 4: Dashboard & Monitoring
1. Real-time dashboard UI
2. WebSocket connections
3. Agent status visualization
4. Token metrics display

### Phase 5: Polish & Extensions
1. Moltbook social layer
2. Advanced orchestration
3. Multi-company interactions
4. Analytics and insights

---

## Important Reminders

### What This IS:
- ✅ A launcher for AI company experiments
- ✅ An orchestration layer for autonomous agents
- ✅ A token-powered compute marketplace
- ✅ A real-time monitoring dashboard

### What This IS NOT:
- ❌ A guarantee that agents will succeed
- ❌ A traditional business management tool
- ❌ A direct company builder
- ❌ A financial product (handle legal carefully)

---

## Technical Considerations

### OpenClaw Integration
- Agent lifecycle management
- Container orchestration
- API rate limits
- Output format standardization
- Error handling for agent failures

### Base Blockchain
- Gas optimization for token deployment
- Event indexing for transactions
- Wallet management
- Contract security audits

### Scalability
- Multi-company agent isolation
- Database query optimization
- WebSocket connection limits
- Agent compute resource allocation

### Security
- API authentication
- User wallet connections
- Agent sandbox environments
- Smart contract vulnerabilities
- Rate limiting

---

## Environment Variables (Example)

```env
# Backend
DATABASE_URL=postgresql://...
API_SECRET_KEY=...

# Base Chain
BASE_RPC_URL=https://mainnet.base.org
DEPLOYER_PRIVATE_KEY=...
TOKEN_FACTORY_ADDRESS=...

# OpenClaw
OPENCLAW_API_KEY=...
OPENCLAW_API_URL=...

# Clanker
CLANKER_API_KEY=...
CLANKER_WEBHOOK_URL=...

# Frontend
VITE_API_URL=http://localhost:3000
VITE_WALLET_CONNECT_ID=...
```

---

## Coding Conventions

### General
- Use TypeScript for type safety
- Follow functional programming patterns where possible
- Write descriptive commit messages
- Keep functions small and focused

### Agent Prompts
- Store prompts as templates
- Include role-specific context
- Pass company vision consistently
- Version control prompt changes

### Token Operations
- Always verify gas estimates
- Use try-catch for blockchain calls
- Log all token operations
- Implement retry logic

### Task Orchestration
- Queue tasks by priority
- Implement timeout handling
- Store intermediate results
- Log agent decision-making

---

## Useful Commands

```bash
# Start development
npm run dev

# Deploy token contract
npm run deploy:token

# Start agent orchestrator
npm run orchestrator:start

# Monitor token events
npm run monitor:tokens

# Database migrations
npm run db:migrate
```

---

## Resources

- **OpenClaw Docs:** openclaw.ai/docs
- **Base Network:** base.org
- **Clanker:** [Clanker documentation]
- **Moltbook:** [Moltbook documentation]

---

## Notes for Claude (AI Assistant)

When helping with this project:

1. **Focus on infrastructure**, not company outcomes
2. **Prioritize agent orchestration** logic and reliability
3. **Security first** for token operations and smart contracts
4. **Real-time updates** are critical for dashboard UX
5. **Agent outputs are unpredictable**—build robust error handling
6. **Token economics drive compute**—this is the core feedback loop
7. **Keep it simple**—emergent behavior comes from simple rules

This is an experimental platform. The goal is to create the environment where AI agents can attempt company building, not to guarantee success.

---

**Last Updated:** 2026-02-01
