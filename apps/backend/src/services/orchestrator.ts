import { db } from '../db/index.js';
import { companies, agents, tasks } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { spawnCompanyAgents, assignTaskToAgent, getAgentStatus } from './openclaw.js';
import { deployCompanyToken } from './token.js';
import { registerTokenWithClanker, startTokenEventListener } from './clanker.js';
import { broadcast } from '../index.js';

/**
 * Launch a complete company: deploy token, spawn agents, create initial tasks
 */
export async function launchCompany(companyId: string) {
  try {
    console.log(`🚀 Launching company ${companyId}`);

    // Get company details
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId));

    if (!company) {
      throw new Error('Company not found');
    }

    // Broadcast launch started
    broadcast({
      type: 'company_launch_started',
      companyId,
      timestamp: new Date().toISOString(),
    });

    // Step 1: Deploy token on Base
    console.log('📝 Deploying token...');
    try {
      const tokenResult = await deployCompanyToken(
        company.id,
        company.prompt
      );

      await db
        .update(companies)
        .set({
          tokenAddress: tokenResult.tokenAddress,
          tokenName: tokenResult.tokenName,
          tokenSymbol: tokenResult.tokenSymbol,
          updatedAt: new Date(),
        })
        .where(eq(companies.id, companyId));

      console.log(`✅ Token deployed: ${tokenResult.tokenAddress}`);

      broadcast({
        type: 'token_deployed',
        companyId,
        tokenAddress: tokenResult.tokenAddress,
        tokenSymbol: tokenResult.tokenSymbol,
        timestamp: new Date().toISOString(),
      });

      // Register token with Clanker and start monitoring
      await registerTokenWithClanker(tokenResult.tokenAddress);
      startTokenEventListener(companyId, tokenResult.tokenAddress);
    } catch (error) {
      console.error('Token deployment failed:', error);
      // Continue anyway - token can be deployed later
    }

    // Step 2: Spawn AI agents
    console.log('🤖 Spawning agents...');
    try {
      const openclawAgents = await spawnCompanyAgents(
        company.prompt,
        company.computeLevel
      );

      // Save agents to database
      for (const agent of openclawAgents) {
        await db.insert(agents).values({
          companyId: company.id,
          role: agent.role as any,
          openclawAgentId: agent.id,
          containerId: agent.containerId,
          status: 'active',
        });
      }

      console.log(`✅ Spawned ${openclawAgents.length} agents`);

      broadcast({
        type: 'agents_spawned',
        companyId,
        agentCount: openclawAgents.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Agent spawning failed:', error);
      throw error;
    }

    // Step 3: Create initial tasks
    console.log('📋 Creating initial tasks...');
    const initialTasks = generateInitialTasks(company.prompt);

    for (const task of initialTasks) {
      await db.insert(tasks).values({
        companyId: company.id,
        description: task.description,
        priority: task.priority,
      });
    }

    console.log(`✅ Created ${initialTasks.length} initial tasks`);

    broadcast({
      type: 'company_launched',
      companyId,
      timestamp: new Date().toISOString(),
    });

    // Step 4: Start task orchestration
    startTaskOrchestration(companyId);

    console.log(`🎉 Company ${companyId} launched successfully`);

    return {
      success: true,
      companyId,
      message: 'Company launched successfully',
    };
  } catch (error: any) {
    console.error('Company launch failed:', error);

    broadcast({
      type: 'company_launch_failed',
      companyId,
      error: error.message,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
}

/**
 * Generate initial tasks based on company prompt
 */
function generateInitialTasks(prompt: string): Array<{
  description: string;
  priority: number;
}> {
  return [
    {
      description: `Research and analyze the market for: ${prompt}`,
      priority: 10,
    },
    {
      description: 'Create initial brand identity and design concepts',
      priority: 9,
    },
    {
      description: 'Define technical architecture and tech stack',
      priority: 9,
    },
    {
      description: 'Develop go-to-market strategy',
      priority: 8,
    },
    {
      description: 'Create project roadmap and milestones',
      priority: 8,
    },
  ];
}

/**
 * Start continuous task orchestration for a company
 */
export async function startTaskOrchestration(companyId: string) {
  console.log(`🎯 Starting task orchestration for company ${companyId}`);

  // Run orchestration loop
  setInterval(() => {
    orchestrateTasks(companyId).catch((error) => {
      console.error(`Orchestration error for ${companyId}:`, error);
    });
  }, 10000); // Check every 10 seconds
}

/**
 * Orchestrate tasks - assign pending tasks to idle agents
 */
async function orchestrateTasks(companyId: string) {
  try {
    // Get idle agents
    const idleAgents = await db
      .select()
      .from(agents)
      .where(eq(agents.companyId, companyId))
      .where(eq(agents.status, 'idle'));

    if (idleAgents.length === 0) {
      return; // No idle agents
    }

    // Get pending tasks
    const pendingTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.companyId, companyId))
      .where(eq(tasks.status, 'pending'))
      .orderBy(desc(tasks.priority))
      .limit(idleAgents.length);

    if (pendingTasks.length === 0) {
      return; // No pending tasks
    }

    // Assign tasks to agents
    for (let i = 0; i < Math.min(idleAgents.length, pendingTasks.length); i++) {
      const agent = idleAgents[i];
      const task = pendingTasks[i];

      try {
        if (!agent.openclawAgentId) {
          console.error(`Agent ${agent.id} has no openclawAgentId`);
          continue;
        }

        // Assign task via OpenClaw
        await assignTaskToAgent(
          agent.openclawAgentId,
          task.description,
          task.priority
        );

        // Update task status
        await db
          .update(tasks)
          .set({
            agentId: agent.id,
            status: 'in_progress',
          })
          .where(eq(tasks.id, task.id));

        // Update agent status
        await db
          .update(agents)
          .set({
            status: 'busy',
            updatedAt: new Date(),
          })
          .where(eq(agents.id, agent.id));

        console.log(`✅ Assigned task ${task.id} to agent ${agent.id} (${agent.role})`);

        broadcast({
          type: 'task_assigned',
          companyId,
          taskId: task.id,
          agentId: agent.id,
          agentRole: agent.role,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Failed to assign task ${task.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Task orchestration failed:', error);
  }
}

/**
 * Poll agent statuses and update database
 */
export async function pollAgentStatuses(companyId: string) {
  try {
    const companyAgents = await db
      .select()
      .from(agents)
      .where(eq(agents.companyId, companyId));

    for (const agent of companyAgents) {
      if (!agent.openclawAgentId) continue;

      try {
        const status = await getAgentStatus(agent.openclawAgentId);

        // Update agent in database
        await db
          .update(agents)
          .set({
            status: status.status === 'running' ? 'active' : 'idle',
            tasksCompleted: status.tasksCompleted,
            updatedAt: new Date(),
          })
          .where(eq(agents.id, agent.id));

        // Broadcast status update
        broadcast({
          type: 'agent_status_update',
          companyId,
          agentId: agent.id,
          status: status.status,
          tasksCompleted: status.tasksCompleted,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Failed to poll agent ${agent.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to poll agent statuses:', error);
  }
}

/**
 * Start polling agent statuses for a company
 */
export function startAgentStatusPolling(companyId: string) {
  setInterval(() => {
    pollAgentStatuses(companyId).catch((error) => {
      console.error(`Agent polling error for ${companyId}:`, error);
    });
  }, 5000); // Poll every 5 seconds
}
