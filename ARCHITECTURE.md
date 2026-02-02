# System Architecture

Complete technical overview of the Clawd Pumpany platform.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  React + Vite + Tailwind + WebSocket Client                    │
│                                                                  │
│  Pages:                                                         │
│  • HomePage: Prompt input + compute selection                  │
│  • DashboardPage: Real-time company monitoring                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ HTTP/WS
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API SERVER                         │
│  Express.js + WebSocket + Drizzle ORM                          │
│                                                                  │
│  Routes:                                                        │
│  • /api/companies - Company CRUD                               │
│  • /api/agents - Agent management                              │
│  • /api/tasks - Task management                                │
│  • /api/webhooks/clanker - Token events                        │
│  • /ws - WebSocket real-time updates                           │
└─────────┬─────────┬─────────┬─────────┬─────────┬─────────────┘
          │         │         │         │         │
          ▼         ▼         ▼         ▼         ▼
    ┌─────────┐ ┌──────────┐ ┌──────┐ ┌────────┐ ┌──────────┐
    │PostgreSQL│ │OpenClaw  │ │Base  │ │Clanker │ │WebSocket │
    │Database  │ │AI Agents │ │Chain │ │Monitor │ │Broadcast │
    └──────────┘ └──────────┘ └──────┘ └────────┘ └──────────┘
```

## Component Breakdown

### 1. Frontend (`apps/frontend`)

**Technology:** React 18 + Vite + Tailwind CSS + TanStack Query

**Key Components:**
- `HomePage.tsx` - Company creation interface
- `DashboardPage.tsx` - Real-time monitoring
- `api.ts` - API client with type definitions
- WebSocket connection for live updates

**Features:**
- Prompt-based company creation
- Compute level selection (low/medium/high)
- Real-time agent status
- Task queue visualization
- Token statistics display

### 2. Backend API (`apps/backend`)

**Technology:** Express.js + TypeScript + WebSocket + Drizzle ORM

**Core Services:**

#### `orchestrator.ts` - Master Coordinator
- `launchCompany()` - Complete company launch flow
- `startTaskOrchestration()` - Continuous task assignment
- `pollAgentStatuses()` - Agent health monitoring
- Broadcasts real-time updates via WebSocket

#### `openclaw.ts` - AI Agent Management
- `spawnAgent()` - Create individual agent
- `spawnCompanyAgents()` - Create full team
- `assignTaskToAgent()` - Task delegation
- `getAgentStatus()` - Status polling
- `pollTaskCompletion()` - Result collection

#### `token.ts` - Blockchain Integration
- `deployCompanyToken()` - ERC-20 deployment on Base
- `generateTokenSymbol()` - Smart naming
- `getTokenBalance()` - Balance queries
- `getTokenInfo()` - Token metadata

#### `clanker.ts` - Token Monitoring
- `registerTokenWithClanker()` - Monitoring setup
- `startTokenEventListener()` - Event listening
- `handleClankerWebhook()` - Webhook processing
- `getTokenStats()` - Analytics

### 3. Database Schema (`apps/backend/src/db`)

**Tables:**

```sql
companies
├── id (UUID)
├── prompt (TEXT)
├── computeLevel (ENUM: low, medium, high)
├── tokenAddress (TEXT)
├── tokenName (TEXT)
├── tokenSymbol (TEXT)
├── computeBalance (DECIMAL)
├── status (ENUM: active, paused, archived)
└── timestamps

agents
├── id (UUID)
├── companyId (FK → companies)
├── role (ENUM: design, dev, sales, ops)
├── containerId (TEXT)
├── openclawAgentId (TEXT)
├── status (ENUM: active, idle, busy, stopped)
├── tasksCompleted (INTEGER)
└── timestamps

tasks
├── id (UUID)
├── companyId (FK → companies)
├── agentId (FK → agents, nullable)
├── description (TEXT)
├── status (ENUM: pending, in_progress, completed, failed)
├── output (TEXT, JSON)
├── priority (INTEGER)
└── timestamps

transactions
├── id (UUID)
├── companyId (FK → companies)
├── tokenAddress (TEXT)
├── txHash (TEXT)
├── volume (DECIMAL)
├── feeCaptured (DECIMAL)
└── timestamp
```

### 4. Smart Contracts (`packages/contracts`)

**CompanyToken.sol** - ERC-20 with Fee Mechanism

```solidity
Features:
- Standard ERC-20 functionality
- 1% transfer fee on all transactions
- Fee collector address (backend wallet)
- Initial supply: 1 million tokens
- OpenZeppelin base contracts
```

**Deployment:**
- Hardhat development environment
- Configured for Base mainnet + testnet
- Automated deployment scripts
- Gas optimization enabled

## Data Flow

### Company Launch Flow

```
1. User Submits Prompt
   └─> Frontend POST /api/companies
       └─> Backend creates company record
           └─> Returns company_id immediately

2. Async Launch Process
   └─> orchestrator.launchCompany()
       │
       ├─> Deploy Token on Base
       │   └─> token.deployCompanyToken()
       │       └─> Update company with token address
       │       └─> Broadcast: token_deployed
       │
       ├─> Spawn AI Agents
       │   └─> openclaw.spawnCompanyAgents()
       │       └─> Create agents in database
       │       └─> Broadcast: agents_spawned
       │
       ├─> Create Initial Tasks
       │   └─> Generate 5 initial tasks
       │       └─> Insert into tasks table
       │       └─> Broadcast: tasks_created
       │
       └─> Start Orchestration
           └─> startTaskOrchestration()
           └─> startAgentStatusPolling()
           └─> Register token with Clanker
           └─> Start event listener

3. Continuous Operation
   └─> Every 10s: Assign pending tasks to idle agents
   └─> Every 5s: Poll agent statuses
   └─> Real-time: Listen for token events
   └─> Broadcast all updates via WebSocket
```

### Task Orchestration Loop

```
Every 10 seconds:

1. Query idle agents
2. Query pending tasks (ordered by priority)
3. For each idle agent:
   ├─> Assign highest priority task
   ├─> Call OpenClaw API
   ├─> Update task status: in_progress
   ├─> Update agent status: busy
   └─> Broadcast task_assigned

4. Monitor task completion
   ├─> Poll OpenClaw for results
   ├─> Update task status: completed
   ├─> Update agent status: idle
   ├─> Increment agent.tasksCompleted
   └─> Broadcast task_completed
```

### Token Monitoring

```
Token Transfer Event:
└─> Base blockchain emits Transfer event
    └─> Event listener catches event
        └─> Parse transfer data
            └─> Calculate 1% fee
                └─> Save to transactions table
                    └─> Update company.computeBalance
                        └─> Broadcast compute_balance_updated

Clanker Webhook:
└─> Clanker detects swap/liquidity
    └─> POST /api/webhooks/clanker
        └─> handleClankerWebhook()
            └─> Find company by token
                └─> Broadcast event to frontend
```

## Real-Time Updates

**WebSocket Events:**

```typescript
// Company launch
{ type: 'company_launch_started', companyId, timestamp }
{ type: 'token_deployed', companyId, tokenAddress, tokenSymbol, timestamp }
{ type: 'agents_spawned', companyId, agentCount, timestamp }
{ type: 'company_launched', companyId, timestamp }

// Task orchestration
{ type: 'task_assigned', companyId, taskId, agentId, agentRole, timestamp }
{ type: 'task_completed', companyId, taskId, output, timestamp }

// Agent updates
{ type: 'agent_status_update', companyId, agentId, status, tasksCompleted, timestamp }

// Token activity
{ type: 'compute_balance_updated', companyId, newBalance, feeCaptured, txHash, timestamp }
{ type: 'token_swap', companyId, tokenAddress, data, timestamp }
{ type: 'liquidity_change', companyId, tokenAddress, data, timestamp }

// Errors
{ type: 'company_launch_failed', companyId, error, timestamp }
```

## Scalability Considerations

### Current Design
- Single backend server
- PostgreSQL for persistence
- In-memory WebSocket connections
- Polling-based orchestration

### Future Improvements
- Horizontal scaling with load balancer
- Redis for WebSocket state
- Job queue (BullMQ) for orchestration
- Database read replicas
- Caching layer (Redis)
- CDN for frontend

## Security

### Current Implementation
- API key authentication for services
- Private key for blockchain operations
- CORS enabled
- Environment variable secrets
- Input validation (Zod)

### Production Requirements
- Rate limiting
- API key authentication
- Request signing
- Webhook verification
- Database encryption
- Audit logging
- DDoS protection

## Monitoring & Observability

### Logging
- Console logs for all major events
- Error tracking with stack traces
- WebSocket broadcast for real-time visibility

### Metrics (Future)
- Company creation rate
- Agent spawn success rate
- Task completion time
- Token deployment success
- API response times
- WebSocket connection count

## Deployment Architecture

```
Production Setup:

Frontend (Vercel)
├── Static assets on CDN
├── Environment variables
└── Automatic deployments

Backend (Railway/Render)
├── Express server
├── WebSocket server
├── Environment secrets
├── Auto-scaling
└── Health checks

Database (Supabase/Neon)
├── Managed PostgreSQL
├── Automatic backups
├── Connection pooling
└── Read replicas

Blockchain (Base)
├── Mainnet for production
├── Sepolia for testing
└── RPC endpoint (Alchemy/Infura)

Monitoring (Future)
├── Sentry for errors
├── Datadog for metrics
└── LogRocket for sessions
```

## Technology Decisions

### Why These Choices?

**Monorepo (Turborepo):** Share code, coordinate builds, single deploy
**React + Vite:** Fast dev experience, modern tooling
**Express:** Simple, battle-tested, flexible
**Drizzle ORM:** Type-safe, lightweight, SQL-like
**PostgreSQL:** Reliable, relational data, great tooling
**WebSockets:** Real-time is core to UX
**Hardhat:** Best Solidity tooling, great docs
**Base:** Low fees, Ethereum compatibility, growing ecosystem
**TypeScript:** Type safety across entire stack

---

**This architecture enables rapid MVP iteration while providing clear paths to scale.**
