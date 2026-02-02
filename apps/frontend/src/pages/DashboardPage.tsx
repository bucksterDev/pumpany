import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyAPI, agentAPI, taskAPI, Agent, Task } from '../lib/api';
import { Users, ListTodo, TrendingUp, Coins, Terminal, Circle } from 'lucide-react';

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const [ws, setWs] = useState<WebSocket | null>(null);

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyAPI.getById(id!),
    enabled: !!id,
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['agents', id],
    queryFn: () => agentAPI.getByCompanyId(id!),
    enabled: !!id,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskAPI.getByCompanyId(id!),
    enabled: !!id,
  });

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('[WS] Connection established');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[WS] Message:', data);
    };

    websocket.onerror = (error) => {
      console.error('[WS] Error:', error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Terminal className="w-12 h-12 text-[var(--accent-cyan)] animate-pulse mx-auto" />
          <p className="font-mono text-sm text-[var(--text-secondary)]">
            [LOADING] COMPANY_DASHBOARD<span className="animate-blink">_</span>
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-mono text-sm text-red-400">[ERROR] COMPANY_NOT_FOUND</p>
      </div>
    );
  }

  const activeAgents = agents.filter((a) => a.status === 'active' || a.status === 'busy');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');

  return (
    <div className="min-h-screen py-8 space-y-8">
      {/* Header */}
      <div className="space-y-6 stagger-1">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-[var(--accent-cyan)]" />
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-cyan)] to-transparent" />
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <h1 className="font-display text-5xl text-[var(--text-primary)] leading-none">
              {company.tokenName || 'UNNAMED_COMPANY'}
            </h1>
            <p className="text-[var(--text-secondary)] max-w-2xl font-mono text-sm leading-relaxed">
              {company.prompt}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <StatusBadge status={company.status} />
              <span className="font-mono text-xs text-[var(--text-dim)] tracking-wider uppercase">
                COMPUTE: {company.computeLevel}
              </span>
            </div>
          </div>

          {company.tokenAddress ? (
            <div className="cyber-border rounded-lg px-6 py-4 space-y-2">
              <p className="font-mono text-[10px] text-[var(--accent-cyan)] tracking-wider uppercase">
                TOKEN_ADDRESS
              </p>
              <p className="font-mono text-xs text-[var(--text-primary)]">
                {company.tokenAddress.slice(0, 10)}...{company.tokenAddress.slice(-8)}
              </p>
            </div>
          ) : (
            <div className="cyber-border rounded-lg px-6 py-4 space-y-2">
              <p className="font-mono text-[10px] text-yellow-500 tracking-wider uppercase">
                TOKEN_STATUS
              </p>
              <p className="font-mono text-xs text-yellow-500/70">
                DEPLOYING<span className="animate-blink">_</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-2">
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="ACTIVE_AGENTS"
          value={activeAgents.length}
          subtext={`${agents.length} TOTAL`}
          color="cyan"
        />
        <MetricCard
          icon={<ListTodo className="w-5 h-5" />}
          label="TASKS_PENDING"
          value={pendingTasks.length}
          subtext={`${completedTasks.length} DONE`}
          color="magenta"
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="TOKEN_VOLUME"
          value="$0"
          subtext="24H"
          color="yellow"
        />
        <MetricCard
          icon={<Coins className="w-5 h-5" />}
          label="COMPUTE_CREDITS"
          value={parseFloat(company.computeBalance).toFixed(2)}
          subtext="BALANCE"
          color="cyan"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agents Panel */}
        <div className="cyber-border rounded-lg p-6 space-y-4 stagger-3">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm text-[var(--accent-cyan)] tracking-wider uppercase">
              [AGENTS] DEPLOYED_UNITS
            </h2>
            <span className="font-mono text-xs text-[var(--text-dim)]">
              {agents.length} ACTIVE
            </span>
          </div>

          {agents.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-mono text-xs text-[var(--text-dim)]">
                [STATUS] NO_AGENTS_SPAWNED
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {agents.map((agent, index) => (
                <AgentCard key={agent.id} agent={agent} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Tasks Panel */}
        <div className="cyber-border rounded-lg p-6 space-y-4 stagger-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm text-[var(--accent-cyan)] tracking-wider uppercase">
              [TASKS] OPERATION_QUEUE
            </h2>
            <span className="font-mono text-xs text-[var(--text-dim)]">
              {tasks.length} TOTAL
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-mono text-xs text-[var(--text-dim)]">
                [STATUS] NO_TASKS_QUEUED
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {tasks.slice(0, 10).map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Log */}
      <div className="cyber-border rounded-lg p-6 space-y-4 stagger-4">
        <h2 className="font-mono text-sm text-[var(--accent-cyan)] tracking-wider uppercase">
          [LOG] SYSTEM_EVENTS
        </h2>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar font-mono text-xs">
          <LogEntry timestamp={new Date(company.createdAt)} message="COMPANY_INITIALIZED" type="success" />
          {company.tokenAddress && (
            <LogEntry timestamp={new Date(company.updatedAt)} message={`TOKEN_DEPLOYED: ${company.tokenAddress.slice(0, 10)}...`} type="success" />
          )}
          {agents.length > 0 && (
            <LogEntry timestamp={new Date(agents[0].createdAt)} message={`AGENTS_SPAWNED: ${agents.length} UNITS`} type="success" />
          )}
          <LogEntry timestamp={new Date()} message="MONITORING_ACTIVE" type="info" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: { bg: 'bg-[var(--accent-cyan)]/10', border: 'border-[var(--accent-cyan)]', text: 'text-[var(--accent-cyan)]' },
    paused: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-500' },
    archived: { bg: 'bg-[var(--text-dim)]/10', border: 'border-[var(--text-dim)]', text: 'text-[var(--text-dim)]' },
  };
  const color = colors[status as keyof typeof colors] || colors.active;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded border ${color.bg} ${color.border} ${color.text} font-mono text-xs tracking-wider uppercase`}>
      <Circle className="w-2 h-2 fill-current animate-pulse" />
      {status}
    </span>
  );
}

function MetricCard({ icon, label, value, subtext, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  color: 'cyan' | 'magenta' | 'yellow';
}) {
  const colors = {
    cyan: 'text-[var(--accent-cyan)]',
    magenta: 'text-[var(--accent-magenta)]',
    yellow: 'text-[var(--accent-yellow)]',
  };

  return (
    <div className="cyber-border rounded-lg p-4 space-y-3 hover:border-[var(--accent-cyan)] transition-colors">
      <div className={`${colors[color]}`}>{icon}</div>
      <div className="space-y-1">
        <p className="font-mono text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        <p className="font-mono text-[10px] text-[var(--accent-cyan)] tracking-wider uppercase">{label}</p>
        <p className="font-mono text-[9px] text-[var(--text-dim)]">{subtext}</p>
      </div>
    </div>
  );
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const roleEmojis = {
    design: '🎨',
    dev: '⚡',
    sales: '📡',
    ops: '⚙️',
  };

  const statusColors = {
    active: 'text-[var(--accent-cyan)]',
    idle: 'text-[var(--text-dim)]',
    busy: 'text-[var(--accent-magenta)]',
    stopped: 'text-red-400',
  };

  return (
    <div
      className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded border border-[var(--bg-tertiary)] hover:border-[var(--accent-cyan)]/30 transition-colors"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{roleEmojis[agent.role]}</span>
        <div>
          <p className="font-mono text-xs text-[var(--text-primary)] uppercase tracking-wider">
            {agent.role}_AGENT
          </p>
          <p className="font-mono text-[10px] text-[var(--text-dim)]">
            {agent.tasksCompleted} TASKS_DONE
          </p>
        </div>
      </div>
      <div className={`font-mono text-[10px] ${statusColors[agent.status]} tracking-wider uppercase flex items-center gap-2`}>
        <Circle className="w-2 h-2 fill-current animate-pulse" />
        {agent.status}
      </div>
    </div>
  );
}

function TaskCard({ task, index }: { task: Task; index: number }) {
  const statusColors = {
    pending: { bg: 'bg-[var(--text-dim)]/5', text: 'text-[var(--text-dim)]', border: 'border-[var(--text-dim)]/20' },
    in_progress: { bg: 'bg-[var(--accent-cyan)]/5', text: 'text-[var(--accent-cyan)]', border: 'border-[var(--accent-cyan)]/20' },
    completed: { bg: 'bg-green-500/5', text: 'text-green-400', border: 'border-green-500/20' },
    failed: { bg: 'bg-red-500/5', text: 'text-red-400', border: 'border-red-500/20' },
  };
  const color = statusColors[task.status];

  return (
    <div
      className={`p-3 rounded border ${color.bg} ${color.border} transition-colors`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="font-mono text-xs text-[var(--text-primary)] flex-1 leading-relaxed">
          {task.description}
        </p>
        <span className={`font-mono text-[9px] ${color.text} tracking-wider uppercase whitespace-nowrap`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <p className="font-mono text-[9px] text-[var(--text-dim)]">
        {new Date(task.createdAt).toLocaleTimeString()}
      </p>
    </div>
  );
}

function LogEntry({ timestamp, message, type }: { timestamp: Date; message: string; type: 'success' | 'info' | 'error' }) {
  const colors = {
    success: 'text-green-400',
    info: 'text-[var(--accent-cyan)]',
    error: 'text-red-400',
  };

  return (
    <div className="flex items-start gap-3 text-[var(--text-secondary)]">
      <span className="text-[var(--text-dim)]">[{timestamp.toLocaleTimeString()}]</span>
      <span className={colors[type]}>{message}</span>
    </div>
  );
}
