import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { ArrowRight, Star, AlertCircle } from 'lucide-react';
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
    'AI fitness coaching app',
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

      <div className="min-h-screen py-12">

        {/* Masthead */}
        <header className="mb-16 stagger-1">
          <div className="newspaper-border">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-display text-5xl mb-2">PUMPANY</h1>
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-light)]">
                  Autonomous AI Company Spawner • Base Blockchain
                </p>
              </div>
              <Link
                to="/docs"
                className="font-mono text-xs uppercase ink-underline"
              >
                Documentation
              </Link>
            </div>
            <div className="h-1 bg-[var(--ink)]" />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto space-y-12">

          {/* Hero Article */}
          <article className="stagger-2">
            <div className="stamp mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-[var(--accent-red)]" fill="currentColor" />
                <span className="font-mono text-xs uppercase tracking-wider font-bold">
                  Featured Technology
                </span>
              </div>
              <h2 className="font-display text-6xl md:text-7xl leading-none mb-4">
                Deploy AI Agents to Build Your Company
              </h2>
              <p className="font-mono text-base leading-relaxed text-[var(--ink-light)]">
                Spawn autonomous agents on Base blockchain that build, market, and grow companies.
                Powered by OpenClaw and Clanker infrastructure.
              </p>
            </div>
          </article>

          {/* Form Section */}
          <section className="stagger-3">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Company Vision */}
              <div className="brutal-box p-6">
                <div className="mb-4">
                  <h3 className="font-display text-2xl mb-2">Company Vision</h3>
                  <p className="font-mono text-xs text-[var(--ink-light)]">
                    Describe your company in detail ({prompt.length}/10 characters minimum)
                  </p>
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: An AI-powered fitness coach that creates personalized workout plans based on your goals, fitness level, and available equipment. Uses computer vision to check form and provides real-time feedback."
                  className="w-full h-40 px-4 py-3 text-base leading-relaxed placeholder-[var(--ink-dim)] resize-none"
                  required
                  minLength={10}
                />

                {/* Examples */}
                {prompt.length === 0 && (
                  <div className="mt-4 pt-4 border-t-2 border-[var(--border)]">
                    <p className="font-mono text-xs uppercase tracking-wider mb-3 font-bold">
                      Example Companies:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {examplePrompts.map((example, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setPrompt(example)}
                          className="text-left px-3 py-2 border-2 border-[var(--border)] hover:border-[var(--ink)] transition-colors"
                        >
                          <span className="font-mono text-xs">{example}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Agent Configuration & Fees */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Agent Power */}
                <div className="brutal-box-red p-6">
                  <h3 className="font-display text-2xl mb-4">Agent Power</h3>

                  <div className="space-y-3">
                    {(['low', 'medium', 'high'] as const).map((level) => {
                      const specs = {
                        low: { agents: 2, label: 'Basic', desc: 'Essential team' },
                        medium: { agents: 4, label: 'Standard', desc: 'Full coverage' },
                        high: { agents: 6, label: 'Premium', desc: 'Maximum power' },
                      };
                      const spec = specs[level];
                      const isSelected = computeLevel === level;

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setComputeLevel(level)}
                          className={`w-full p-4 border-3 transition-all text-left ${
                            isSelected
                              ? 'border-[var(--ink)] bg-[var(--accent-yellow)]'
                              : 'border-[var(--border)] hover:border-[var(--ink-light)]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-display text-xl">{spec.label}</span>
                            <span className="font-mono text-xs font-bold">{spec.agents} AGENTS</span>
                          </div>
                          <p className="font-mono text-xs text-[var(--ink-light)]">{spec.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fee Structure */}
                <div className="brutal-box-blue p-6">
                  <div className="flex items-start gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 mt-1" />
                    <h3 className="font-display text-2xl">Fee Structure</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="pb-4 border-b-2 border-[var(--border)]">
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-sm">Launch Fee</span>
                        <span className="font-display text-2xl">0.1 SOL</span>
                      </div>
                    </div>

                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider mb-3 font-bold">
                        Trading Fees (1% total):
                      </p>
                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex justify-between">
                          <span>Clanker Protocol</span>
                          <span className="font-bold">0.6%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="highlight">AI Agent Compute</span>
                          <span className="font-bold">0.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="highlight">You (Creator)</span>
                          <span className="font-bold">0.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <button
                type="submit"
                disabled={createCompanyMutation.isPending || prompt.length < 10}
                className="w-full py-6 btn btn-primary text-base"
              >
                {createCompanyMutation.isPending ? (
                  <span>Deploying Company...</span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <span>Launch Company Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>

              {createCompanyMutation.isError && (
                <div className="p-4 border-3 border-[var(--accent-red)] bg-red-50 animate-shake">
                  <p className="font-mono text-sm text-[var(--accent-red)]">
                    ⚠ Error: {createCompanyMutation.error?.message || 'Launch failed. Please try again.'}
                  </p>
                </div>
              )}
            </form>
          </section>

          {/* Footer */}
          <footer className="stagger-4 pt-12 border-t-2 border-[var(--ink)] border-double">
            <div className="flex items-center justify-center gap-8 font-mono text-xs uppercase tracking-wider text-[var(--ink-dim)]">
              <span>OpenClaw</span>
              <span>•</span>
              <span>Base</span>
              <span>•</span>
              <span>Clanker</span>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
