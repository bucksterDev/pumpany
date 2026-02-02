import { pgTable, text, timestamp, uuid, decimal, integer, pgEnum } from 'drizzle-orm/pg-core';

export const computeLevelEnum = pgEnum('compute_level', ['low', 'medium', 'high']);
export const companyStatusEnum = pgEnum('company_status', ['active', 'paused', 'archived']);
export const agentRoleEnum = pgEnum('agent_role', ['design', 'dev', 'sales', 'ops']);
export const agentStatusEnum = pgEnum('agent_status', ['active', 'idle', 'busy', 'stopped']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed', 'failed']);

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  prompt: text('prompt').notNull(),
  computeLevel: computeLevelEnum('compute_level').notNull(),
  tokenAddress: text('token_address'),
  tokenName: text('token_name'),
  tokenSymbol: text('token_symbol'),
  computeBalance: decimal('compute_balance', { precision: 18, scale: 8 }).default('0'),
  status: companyStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  role: agentRoleEnum('role').notNull(),
  containerId: text('container_id'),
  openclawAgentId: text('openclaw_agent_id'),
  status: agentStatusEnum('status').default('idle').notNull(),
  tasksCompleted: integer('tasks_completed').default(0).notNull(),
  config: text('config'), // JSON string for agent-specific config
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  agentId: uuid('agent_id').references(() => agents.id),
  description: text('description').notNull(),
  status: taskStatusEnum('status').default('pending').notNull(),
  output: text('output'), // JSON string for task results
  priority: integer('priority').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  tokenAddress: text('token_address').notNull(),
  txHash: text('tx_hash').notNull(),
  volume: decimal('volume', { precision: 18, scale: 8 }).notNull(),
  feeCaptured: decimal('fee_captured', { precision: 18, scale: 8 }).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
