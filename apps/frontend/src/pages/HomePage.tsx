import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { ArrowRight, Zap, Info, Sparkles } from 'lucide-react';
import LaunchModal from '../components/LaunchModal';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [computeLevel, setComputeLevel] = useState<'low' | 'medium' | 'high'>('medium');
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
    'AI art marketplace with NFT minting',
    'Developer code snippet platform',
    'AI-powered fitness coaching app',
    'Designer equity marketplace',
  ];

  return (
    <>
      <LaunchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmLaunch}
        computeLevel={computeLevel}
      />

      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="px-8 py-6 flex items-center justify-between stagger-1">
          <div className="font-display text-2xl tracking-tight">
            <span className="gradient-text">PUMPANY</span>
          </div>
          <Link
            to="/docs"
            className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Docs
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-4xl w-full">

            {/* Header */}
            <div className="text-center mb-20 stagger-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-sm text-[var(--text-secondary)]">Autonomous AI on Base</span>
              </div>

              <h1 className="font-display text-7xl md:text-8xl lg:text-9xl leading-[0.95] mb-8">
                <span className="gradient-text text-glow">SPAWN</span>
                <br />
                <span className="text-white">AI COMPANIES</span>
              </h1>

              <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                Deploy autonomous agents that build, market, and grow your company on Base blockchain
              </p>
            </div>

            {/* Main Form */}
            <div className="max-w-2xl mx-auto space-y-8 stagger-3">

              {/* Prompt Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-white">
                    Company Vision
                  </label>
                  <span className="text-xs font-mono text-[var(--text-dim)]">
                    {prompt.length}/10
                  </span>
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your company idea..."
                  className="w-full h-48 px-6 py-5 card text-white text-lg leading-relaxed placeholder-[var(--text-dim)] resize-none"
                  required
                  minLength={10}
                />

                {/* Examples */}
                {prompt.length === 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setPrompt(example)}
                        className="text-left px-4 py-3 glass rounded-lg text-sm text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)] transition-all group"
                      >
                        <ArrowRight className="w-3 h-3 inline mr-2 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        {example}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Compute + Fee */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Compute Level */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white">
                    Agent Power
                  </label>

                  <div className="space-y-2">
                    {(['low', 'medium', 'high'] as const).map((level) => {
                      const specs = {
                        low: { agents: 2, label: 'Basic', icon: 1 },
                        medium: { agents: 4, label: 'Pro', icon: 2 },
                        high: { agents: 6, label: 'Max', icon: 3 },
                      };
                      const spec = specs[level];
                      const isSelected = computeLevel === level;

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setComputeLevel(level)}
                          className={`w-full px-5 py-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                            isSelected
                              ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                              : 'border-[var(--border)] hover:border-[var(--border-bright)]'
                          }`}
                        >
                          <div>
                            <div className={`font-semibold mb-1 ${
                              isSelected ? 'text-[var(--accent)]' : 'text-white'
                            }`}>
                              {spec.label}
                            </div>
                            <div className="text-xs text-[var(--text-dim)]">
                              {spec.agents} AI agents
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(spec.icon)].map((_, i) => (
                              <Zap key={i} className={`w-4 h-4 ${
                                isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'
                              }`} fill="currentColor" />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fee Info */}
                <div className="card p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Info className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    <div className="text-sm font-semibold text-white">
                      Fee Structure
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Launch</span>
                      <span className="font-mono text-white">0.1 SOL</span>
                    </div>

                    <div className="h-px bg-[var(--border)]" />

                    <div className="space-y-2 text-xs">
                      <div className="text-[var(--text-secondary)]">Trading fees (1%):</div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-dim)]">Clanker</span>
                        <span className="font-mono text-[var(--text-secondary)]">0.6%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-dim)]">AI Compute</span>
                        <span className="font-mono text-[var(--accent)]">0.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-dim)]">You (creator)</span>
                        <span className="font-mono text-[var(--accent)]">0.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <button
                onClick={handleSubmit}
                disabled={createCompanyMutation.isPending || prompt.length < 10}
                className="w-full py-6 btn btn-primary text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-3">
                  {createCompanyMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[var(--bg-dark)]/30 border-t-[var(--bg-dark)] rounded-full animate-spin" />
                      <span>DEPLOYING...</span>
                    </>
                  ) : (
                    <>
                      <span>LAUNCH COMPANY</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </div>
              </button>

              {createCompanyMutation.isError && (
                <div className="px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-shake">
                  <p className="text-red-400 text-sm">
                    {createCompanyMutation.error?.message || 'Launch failed. Try again.'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-20 stagger-4">
              <div className="flex items-center justify-center gap-6 text-xs text-[var(--text-dim)] font-mono">
                <span>OpenClaw</span>
                <span className="text-[var(--accent)]">×</span>
                <span>Base</span>
                <span className="text-[var(--accent)]">×</span>
                <span>Clanker</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
