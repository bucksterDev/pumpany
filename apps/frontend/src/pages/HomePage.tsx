import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { Rocket, Terminal, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import LaunchModal from '../components/LaunchModal';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [computeLevel, setComputeLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isTyping, setIsTyping] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      setShowModal(true);
    }
  };

  const handleConfirmLaunch = () => {
    setShowModal(false);
    createCompanyMutation.mutate({ prompt, computeLevel });
  };

  const examplePrompts = [
    'A marketplace for AI-generated art with NFT minting capabilities',
    'Social network for developers to share code snippets and collaborate in real-time',
    'AI-powered fitness coach that creates personalized workout plans',
    'Platform connecting freelance designers with startups for equity',
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 300);
  };

  return (
    <>
      <LaunchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmLaunch}
        computeLevel={computeLevel}
      />

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full space-y-12">
          {/* Docs Link */}
          <div className="text-center">
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--accent-cyan)]/30 bg-[var(--bg-secondary)] rounded-lg hover:border-[var(--accent-cyan)]/60 transition-colors text-sm font-mono text-[var(--text-secondary)]"
            >
              <BookOpen className="w-4 h-4" />
              <span>How It Works</span>
            </Link>
          </div>

          {/* Terminal Header */}
          <div className="text-center space-y-6 stagger-1">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--bg-secondary)] mb-4">
              <Terminal className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span className="text-xs font-mono text-[var(--text-secondary)] tracking-wider">
                SYSTEM_STATUS: ONLINE
              </span>
            </div>

          <div className="space-y-2">
            <h1 className="font-display text-7xl md:text-9xl text-[var(--text-primary)] leading-none tracking-tight">
              PUMPANY<span className="text-[var(--accent-cyan)]">_</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[var(--accent-magenta)]">
              <Sparkles className="w-3 h-3" />
              <span>AI COMPANY LAUNCHER</span>
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <p className="text-xl font-mono text-[var(--accent-cyan)] tracking-wide">
              {'> INITIALIZE_COMPANY.EXE'}
            </p>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              Deploy autonomous AI agents to Base blockchain.
              <br />
              <span className="text-[var(--text-dim)]">Mint tokens • Spawn agents • Build companies</span>
            </p>
          </div>
        </div>

        {/* Launch Interface */}
        <form onSubmit={handleSubmit} className="space-y-8 stagger-2">
          {/* Prompt Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-mono text-[var(--accent-cyan)] tracking-wider">
                [INPUT] COMPANY_DIRECTIVE
              </label>
              <span className="text-xs font-mono text-[var(--text-dim)]">
                {prompt.length >= 10 ? '✓' : '○'} MIN 10 CHARS
              </span>
            </div>

            <div className={`relative cyber-border rounded-lg overflow-hidden group transition-all duration-300 ${
              isTyping ? 'scale-[0.99]' : 'scale-100'
            }`}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="// Describe your company vision&#10;// What problem does it solve? Who is it for?&#10;// Example: A marketplace for AI-generated art..."
                className="w-full h-40 px-6 py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-sm leading-relaxed placeholder-[var(--text-dim)] focus:outline-none resize-none"
                required
                minLength={10}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-colors ${
                  prompt.length >= 10 ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--text-dim)]'
                } animate-pulse`} />
                <span className="text-xs font-mono text-[var(--text-dim)]">
                  {prompt.length} <span className="text-[var(--accent-cyan)]">/ 10</span>
                </span>
              </div>
            </div>

            {/* Example Prompts */}
            {prompt.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs font-mono text-[var(--text-dim)] tracking-wider">
                  [EXAMPLES] CLICK TO USE:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className="text-left p-3 rounded border border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-cyan)]/30 hover:bg-[var(--bg-tertiary)] transition-all group/example"
                    >
                      <div className="flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-[var(--accent-cyan)] mt-1 opacity-0 group-hover/example:opacity-100 transition-opacity" />
                        <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                          {example}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compute Level */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-mono text-[var(--accent-cyan)] tracking-wider">
                [SELECT] COMPUTE_ALLOCATION
              </label>
              <span className="text-xs font-mono text-[var(--text-dim)]">
                AGENTS: {computeLevel === 'low' ? '2' : computeLevel === 'medium' ? '4' : '6'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {(['low', 'medium', 'high'] as const).map((level) => {
                const specs = {
                  low: { agents: 2, power: 'MINIMAL', color: 'var(--text-dim)', icon: '⚡' },
                  medium: { agents: 4, power: 'STANDARD', color: 'var(--accent-cyan)', icon: '⚡⚡' },
                  high: { agents: 6, power: 'MAXIMUM', color: 'var(--accent-magenta)', icon: '⚡⚡⚡' },
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
                        ? 'border-[var(--accent-cyan)] bg-[var(--bg-tertiary)] glow-cyan scale-105'
                        : 'border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-cyan)]/50 hover:scale-102'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="text-2xl">{spec.icon}</div>
                      <div className="space-y-1">
                        <div className="font-mono text-sm tracking-wider uppercase font-bold" style={{ color: isSelected ? spec.color : 'var(--text-secondary)' }}>
                          {level}
                        </div>
                        <div className="font-mono text-xs text-[var(--text-dim)]">
                          {spec.agents} AGENTS
                        </div>
                        <div className="font-mono text-[9px] text-[var(--text-dim)] opacity-60">
                          {spec.power}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <>
                        <div className="absolute inset-0 rounded-lg border-2 border-[var(--accent-cyan)] opacity-20 animate-pulse" />
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--accent-cyan)] rounded-full flex items-center justify-center">
                          <span className="text-[8px] text-[var(--bg-void)]">✓</span>
                        </div>
                      </>
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
              className={`relative py-6 px-8 rounded-lg border-2 font-mono text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 ${
                createCompanyMutation.isPending || prompt.length < 10
                  ? 'border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] text-[var(--text-dim)] cursor-not-allowed'
                  : 'border-[var(--accent-cyan)] bg-[var(--bg-secondary)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-[var(--bg-void)] glow-cyan hover:scale-105'
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
                    <span>LAUNCH COMPANY</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </div>
          </button>

          {createCompanyMutation.isError && (
            <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5 animate-shake">
              <p className="text-red-400 font-mono text-xs flex items-center gap-2">
                <span className="text-lg">⚠</span>
                [ERROR] LAUNCH_FAILED: {createCompanyMutation.error?.message || 'Please retry operation'}
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center space-y-4 stagger-3">
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-[var(--text-dim)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
              <span>OPENCLAW</span>
            </div>
            <span>×</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-magenta)] animate-pulse" />
              <span>BASE</span>
            </div>
            <span>×</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-yellow)] animate-pulse" />
              <span>CLANKER</span>
            </div>
          </div>
          <p className="text-[10px] font-mono text-[var(--text-dim)] opacity-60">
            NETWORK_STATUS: OPERATIONAL • BUILD_VERSION: 0.1.0
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
