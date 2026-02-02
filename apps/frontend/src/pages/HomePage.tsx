import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { Rocket, Zap, Terminal, Cpu } from 'lucide-react';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [computeLevel, setComputeLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const navigate = useNavigate();

  const createCompanyMutation = useMutation({
    mutationFn: companyAPI.create,
    onSuccess: (company) => {
      navigate(`/company/${company.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.length >= 10) {
      createCompanyMutation.mutate({ prompt, computeLevel });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full space-y-10">
        {/* Terminal Header */}
        <div className="text-center space-y-6 stagger-1">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--bg-secondary)] mb-4">
            <Terminal className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span className="text-xs font-mono text-[var(--text-secondary)] tracking-wider">
              SYSTEM_STATUS: ONLINE
            </span>
          </div>

          <h1 className="font-display text-7xl md:text-8xl text-[var(--text-primary)] leading-none">
            PUMPANY<span className="text-[var(--accent-cyan)]">_</span>
          </h1>

          <div className="space-y-2">
            <p className="text-2xl font-mono text-[var(--accent-cyan)] tracking-wide">
              {'> COMPANY_LAUNCHER.EXE'}
            </p>
            <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Deploy autonomous AI agents to Base. Mint tokens. Build companies.
              <br />
              <span className="text-[var(--text-dim)]">Powered by OpenClaw × Clanker</span>
            </p>
          </div>
        </div>

        {/* Launch Interface */}
        <form onSubmit={handleSubmit} className="space-y-8 stagger-2">
          {/* Prompt Input */}
          <div className="space-y-3">
            <label className="block text-sm font-mono text-[var(--accent-cyan)] tracking-wider">
              [INPUT] COMPANY_DIRECTIVE
            </label>
            <div className="relative cyber-border rounded-lg overflow-hidden group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="// Enter company concept&#10;// Example: A marketplace for AI-generated art with NFT minting capabilities..."
                className="w-full h-40 px-6 py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-sm leading-relaxed placeholder-[var(--text-dim)] focus:outline-none resize-none"
                required
                minLength={10}
              />
              <div className="absolute bottom-4 right-4 text-xs font-mono text-[var(--text-dim)]">
                {prompt.length} <span className="text-[var(--accent-cyan)]">/ 10</span> MIN
              </div>
            </div>
          </div>

          {/* Compute Level */}
          <div className="space-y-4">
            <label className="block text-sm font-mono text-[var(--accent-cyan)] tracking-wider">
              [SELECT] COMPUTE_ALLOCATION
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['low', 'medium', 'high'] as const).map((level) => {
                const specs = {
                  low: { agents: 2, power: 'MINIMAL', color: 'var(--text-dim)' },
                  medium: { agents: 4, power: 'STANDARD', color: 'var(--accent-cyan)' },
                  high: { agents: 6, power: 'MAXIMUM', color: 'var(--accent-magenta)' },
                };
                const spec = specs[level];
                const isSelected = computeLevel === level;

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setComputeLevel(level)}
                    className={`relative p-6 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'border-[var(--accent-cyan)] bg-[var(--bg-tertiary)] glow-cyan'
                        : 'border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-cyan)]/50'
                    }`}
                  >
                    <div className="space-y-3">
                      <Cpu
                        className="w-8 h-8 mx-auto"
                        style={{ color: isSelected ? spec.color : 'var(--text-dim)' }}
                      />
                      <div className="space-y-1">
                        <div className="font-mono text-xs tracking-wider uppercase" style={{ color: spec.color }}>
                          {level}
                        </div>
                        <div className="font-mono text-[10px] text-[var(--text-dim)]">
                          {spec.agents} AGENTS
                        </div>
                        <div className="font-mono text-[9px] text-[var(--text-dim)] opacity-60">
                          {spec.power}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 rounded-lg border-2 border-[var(--accent-cyan)] opacity-20 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Launch Button */}
          <button
            type="submit"
            disabled={createCompanyMutation.isPending || prompt.length < 10}
            className="relative w-full group"
          >
            <div
              className={`relative py-5 px-8 rounded-lg border-2 font-mono text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 ${
                createCompanyMutation.isPending || prompt.length < 10
                  ? 'border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] text-[var(--text-dim)] cursor-not-allowed'
                  : 'border-[var(--accent-cyan)] bg-[var(--bg-secondary)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-[var(--bg-void)] glow-cyan'
              }`}
            >
              {/* Animated background */}
              {!createCompanyMutation.isPending && prompt.length >= 10 && (
                <div className="absolute inset-0 bg-[var(--accent-cyan)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              )}

              {/* Content */}
              <div className="relative flex items-center justify-center gap-3">
                {createCompanyMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[var(--text-dim)] border-t-transparent rounded-full animate-spin" />
                    <span>INITIALIZING<span className="animate-blink">_</span></span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    <span>LAUNCH_COMPANY.EXE</span>
                  </>
                )}
              </div>
            </div>
          </button>

          {createCompanyMutation.isError && (
            <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
              <p className="text-red-400 font-mono text-xs">
                [ERROR] LAUNCH_FAILED: Please retry operation
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center text-xs font-mono text-[var(--text-dim)] stagger-3">
          <div className="space-y-1">
            <p>INFRASTRUCTURE: OpenClaw × Base × Clanker</p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
              <span>NETWORK_STATUS: OPERATIONAL</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
