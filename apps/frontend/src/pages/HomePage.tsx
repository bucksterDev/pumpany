import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { ArrowRight, Sparkles, Zap, DollarSign } from 'lucide-react';
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

  return (
    <>
      <LaunchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmLaunch}
        computeLevel={computeLevel}
      />

      {/* Floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="min-h-screen flex flex-col">

        {/* Nav */}
        <nav className="flex items-center justify-between mb-20 stagger-1">
          <div className="font-display text-3xl gradient-cyan">
            PUMPANY
          </div>
          <Link
            to="/docs"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
          >
            Documentation
          </Link>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-3xl w-full space-y-16">

            <div className="text-center space-y-8 stagger-2">
              <div className="badge mx-auto">
                <Sparkles className="w-4 h-4" />
                <span>Autonomous AI on Base</span>
              </div>

              <h1 className="font-display text-7xl md:text-8xl">
                <span className="text-[var(--text)]">Launch </span>
                <span className="gradient-cyan">AI Companies</span>
              </h1>

              <p className="text-xl text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
                Deploy autonomous agents that build, market, and grow your company on Base blockchain
              </p>
            </div>

            {/* Form */}
            <div className="space-y-8 stagger-3">

              {/* Prompt */}
              <div className="glow-card">
                <label className="block text-sm font-semibold text-[var(--text)] mb-3">
                  Company Vision
                </label>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your company idea in detail..."
                  className="w-full h-40 px-5 py-4 text-base leading-relaxed resize-none"
                  required
                  minLength={10}
                />

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[var(--text-dim)]">
                    {prompt.length >= 10 ? '✓ Ready to launch' : `${10 - prompt.length} more characters`}
                  </span>
                  <span className="text-[var(--text-dim)]">{prompt.length}/10</span>
                </div>
              </div>

              {/* Agent Power & Fees Side by Side */}
              <div className="grid md:grid-cols-5 gap-6">

                {/* Agent Power - takes 3 cols */}
                <div className="md:col-span-3 glow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-[var(--cyan)]" />
                    <label className="text-sm font-semibold text-[var(--text)]">
                      Agent Power
                    </label>
                  </div>

                  <div className="space-y-3">
                    {(['low', 'medium', 'high'] as const).map((level) => {
                      const specs = {
                        low: { agents: 2, label: 'Basic', desc: 'Essential coverage' },
                        medium: { agents: 4, label: 'Pro', desc: 'Full team' },
                        high: { agents: 6, label: 'Max', desc: 'Complete power' },
                      };
                      const spec = specs[level];
                      const isSelected = computeLevel === level;

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setComputeLevel(level)}
                          className={`selection-card w-full ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                isSelected ? 'bg-[var(--cyan)]' : 'bg-[var(--text-dim)]'
                              }`} />
                              <div className="text-left">
                                <div className={`font-semibold text-sm mb-0.5 ${
                                  isSelected ? 'text-[var(--cyan)]' : 'text-[var(--text)]'
                                }`}>
                                  {spec.label}
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">
                                  {spec.desc}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs font-semibold text-[var(--text-muted)]">
                              {spec.agents} agents
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fees - takes 2 cols */}
                <div className="md:col-span-2 glow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-[var(--orange)]" />
                    <label className="text-sm font-semibold text-[var(--text)]">
                      Fees
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div className="pb-4 border-b border-[var(--deep)]">
                      <div className="text-xs text-[var(--text-muted)] mb-1">
                        Launch
                      </div>
                      <div className="text-2xl font-display gradient-warm">
                        0.1 SOL
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="text-xs text-[var(--text-muted)] mb-2">
                        Trading (1% total)
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--text-muted)]">Clanker</span>
                        <span className="text-[var(--text)]">0.6%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--cyan)]">AI Compute</span>
                        <span className="text-[var(--cyan)]">0.2%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--cyan)]">Creator</span>
                        <span className="text-[var(--cyan)]">0.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <button
                onClick={handleSubmit}
                disabled={createCompanyMutation.isPending || prompt.length < 10}
                className="w-full py-5 btn btn-primary text-base font-semibold"
              >
                {createCompanyMutation.isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-[var(--void)]/30 border-t-[var(--void)] rounded-full animate-spin" />
                    <span>Launching...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <span>Launch Company</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>

              {createCompanyMutation.isError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-shake">
                  <p className="text-red-400 text-sm">
                    {createCompanyMutation.error?.message || 'Launch failed. Please try again.'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center pt-12 stagger-4">
              <div className="flex items-center justify-center gap-6 text-xs text-[var(--text-dim)]">
                <span>OpenClaw</span>
                <span className="text-[var(--cyan)]">×</span>
                <span>Base</span>
                <span className="text-[var(--cyan)]">×</span>
                <span>Clanker</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
