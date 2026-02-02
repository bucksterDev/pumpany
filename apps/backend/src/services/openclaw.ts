import axios from 'axios';

const OPENCLAW_API_URL = process.env.OPENCLAW_API_URL || 'https://api.openclaw.ai';
const OPENCLAW_API_KEY = process.env.OPENCLAW_API_KEY;

if (!OPENCLAW_API_KEY) {
  console.warn('OPENCLAW_API_KEY not set - agent spawning will fail');
}

const openclawClient = axios.create({
  baseURL: OPENCLAW_API_URL,
  headers: {
    'Authorization': `Bearer ${OPENCLAW_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface AgentConfig {
  role: 'design' | 'dev' | 'sales' | 'ops';
  prompt: string;
  companyContext: string;
  tools?: string[];
}

export interface OpenClawAgent {
  id: string;
  containerId: string;
  status: 'starting' | 'running' | 'stopped' | 'error';
  role: string;
}

export interface AgentTask {
  taskId: string;
  agentId: string;
  description: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: any;
}

/**
 * Spawn a new AI agent with OpenClaw
 */
export async function spawnAgent(config: AgentConfig): Promise<OpenClawAgent> {
  try {
    const rolePrompts = {
      design: `You are a Design Agent responsible for UI/UX, branding, and creative decisions.
Company vision: ${config.companyContext}
Your role: Create designs, mockups, and visual assets. Focus on user experience and brand identity.`,

      dev: `You are a Development Agent responsible for building and coding the product.
Company vision: ${config.companyContext}
Your role: Write code, implement features, fix bugs, and handle technical architecture.`,

      sales: `You are a Sales Agent responsible for marketing, growth, and customer acquisition.
Company vision: ${config.companyContext}
Your role: Develop marketing strategies, create content, reach out to potential customers.`,

      ops: `You are an Operations Agent responsible for coordination and logistics.
Company vision: ${config.companyContext}
Your role: Manage workflows, coordinate between team members, handle administrative tasks.`,
    };

    const response = await openclawClient.post('/agents/create', {
      name: `${config.role}-agent`,
      prompt: rolePrompts[config.role],
      tools: config.tools || ['web_search', 'code_execution', 'file_operations'],
      config: {
        model: 'claude-sonnet-4-5',
        temperature: 0.7,
        max_tokens: 4000,
      },
    });

    return {
      id: response.data.agentId,
      containerId: response.data.containerId,
      status: response.data.status,
      role: config.role,
    };
  } catch (error: any) {
    console.error('Failed to spawn agent:', error.message);
    throw new Error(`OpenClaw agent spawn failed: ${error.message}`);
  }
}

/**
 * Spawn multiple agents for a company
 */
export async function spawnCompanyAgents(
  companyPrompt: string,
  computeLevel: 'low' | 'medium' | 'high'
): Promise<OpenClawAgent[]> {
  const agentCounts = {
    low: ['design', 'dev'] as const,
    medium: ['design', 'dev', 'sales', 'ops'] as const,
    high: ['design', 'dev', 'sales', 'ops', 'design', 'dev'] as const, // Extra design and dev
  };

  const roles = agentCounts[computeLevel];
  const agents: OpenClawAgent[] = [];

  // Spawn agents in parallel
  const spawnPromises = roles.map((role) =>
    spawnAgent({
      role,
      companyContext: companyPrompt,
      prompt: companyPrompt,
    })
  );

  try {
    const results = await Promise.allSettled(spawnPromises);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        agents.push(result.value);
      } else {
        console.error(`Failed to spawn ${roles[index]} agent:`, result.reason);
      }
    });

    return agents;
  } catch (error) {
    console.error('Error spawning company agents:', error);
    throw error;
  }
}

/**
 * Assign a task to an agent
 */
export async function assignTaskToAgent(
  agentId: string,
  taskDescription: string,
  priority: number = 0
): Promise<AgentTask> {
  try {
    const response = await openclawClient.post(`/agents/${agentId}/tasks`, {
      description: taskDescription,
      priority,
    });

    return {
      taskId: response.data.taskId,
      agentId,
      description: taskDescription,
      status: response.data.status || 'queued',
      result: response.data.result,
    };
  } catch (error: any) {
    console.error('Failed to assign task to agent:', error.message);
    throw new Error(`Task assignment failed: ${error.message}`);
  }
}

/**
 * Get agent status and output
 */
export async function getAgentStatus(agentId: string): Promise<{
  status: string;
  output?: any;
  tasksCompleted: number;
}> {
  try {
    const response = await openclawClient.get(`/agents/${agentId}/status`);
    return {
      status: response.data.status,
      output: response.data.output,
      tasksCompleted: response.data.tasksCompleted || 0,
    };
  } catch (error: any) {
    console.error('Failed to get agent status:', error.message);
    throw new Error(`Failed to get agent status: ${error.message}`);
  }
}

/**
 * Stop an agent
 */
export async function stopAgent(agentId: string): Promise<void> {
  try {
    await openclawClient.post(`/agents/${agentId}/stop`);
  } catch (error: any) {
    console.error('Failed to stop agent:', error.message);
    throw new Error(`Failed to stop agent: ${error.message}`);
  }
}

/**
 * Get task result from agent
 */
export async function getTaskResult(agentId: string, taskId: string): Promise<{
  status: string;
  result?: any;
  error?: string;
}> {
  try {
    const response = await openclawClient.get(`/agents/${agentId}/tasks/${taskId}`);
    return {
      status: response.data.status,
      result: response.data.result,
      error: response.data.error,
    };
  } catch (error: any) {
    console.error('Failed to get task result:', error.message);
    throw new Error(`Failed to get task result: ${error.message}`);
  }
}

/**
 * Poll agent for task completion
 */
export async function pollTaskCompletion(
  agentId: string,
  taskId: string,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<any> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await getTaskResult(agentId, taskId);

    if (result.status === 'completed') {
      return result.result;
    }

    if (result.status === 'failed') {
      throw new Error(result.error || 'Task failed');
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Task polling timeout');
}
