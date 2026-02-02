import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { ArrowRight, Sparkles, Info } from 'lucide-react';
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
    'AI-generated art marketplace with NFT minting',
    'Developer code snippet sharing platform',
    'AI fitness coach with personalized plans',
    'Freelance designer equity marketplace',
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <>
      <LaunchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmLaunch}
        computeLevel={computeLevel}
      />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full space-y-12">

          {/* Header */}
          <div className="text-center space-y-6 stagger-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-tertiary)] rounded-full text-sm text-[var(--text-secondary)]">
              <Sparkles className="w-4 h-4 text-[var(--accent-blue)]" />
              <span>AI Company Launcher on Base</span>
            </div>

            <h1 className="font-display text-6xl md:text-7xl leading-[1.1] text-[var(--text-primary)]">
              Launch AI companies in seconds
            </h1>

            <p className="text-xl text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
              Deploy autonomous AI agents that build your company. Powered by OpenClaw and Base blockchain.
            </p>
          </div>

          {/* Launch Form */}
          <form onSubmit={handleSubmit} className="space-y-8 stagger-2">

            {/* Prompt Input */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                Describe your company
              </label>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: An AI-powered fitness coach that creates personalized workout plans based on your goals and fitness level..."
                className="w-full h-40 px-5 py-4 card text-[var(--text-primary)] text-base leading-relaxed placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--accent-blue)] resize-none transition-all"
                required
                minLength={10}
              />

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">
                  {prompt.length >= 10 ? '✓ Ready to launch' : `${10 - prompt.length} characters minimum`}
                </span>
                <span className="text-[var(--text-dim)]">{prompt.length}/10</span>
              </div>

              {/* Example Prompts */}
              {prompt.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-[var(--text-secondary)] font-medium">Try an example:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleExampleClick(example)}
                        className="text-left px-4 py-3 card text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-all"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Compute Level */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--text-primary)]">
                  Agent count
                </label>
                <span className="text-sm text-[var(--text-tertiary)]">
                  {computeLevel === 'low' ? '2' : computeLevel === 'medium' ? '4' : '6'} AI agents
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((level) => {
                  const specs = {
                    low: { agents: 2, label: 'Starter' },
                    medium: { agents: 4, label: 'Standard' },
                    high: { agents: 6, label: 'Premium' },
                  };
                  const spec = specs[level];
                  const isSelected = computeLevel === level;

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setComputeLevel(level)}
                      className={`px-5 py-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[var(--accent-blue)] bg-blue-50'
                          : 'border-[var(--border-light)] hover:border-[var(--border-medium)]'
                      }`}
                    >
                      <div className="space-y-1 text-center">
                        <div className={`text-sm font-semibold ${
                          isSelected ? 'text-[var(--accent-blue)]' : 'text-[var(--text-primary)]'
                        }`}>
                          {spec.label}
                        </div>
                        <div className="text-xs text-[var(--text-tertiary)]">
                          {spec.agents} agents
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fee Info */}
            <div className="card p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[var(--accent-blue)] flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-[var(--text-primary)]">Launch fee: 0.1 SOL</p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Token trading fees (1% total) are split: 0.6% to Clanker, 0.2% to AI agent compute, 0.2% to you as token creator.
                  </p>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              type="submit"
              disabled={createCompanyMutation.isPending || prompt.length < 10}
              className={`w-full py-4 px-6 btn btn-primary text-base ${
                createCompanyMutation.isPending || prompt.length < 10
                  ? 'opacity-40 cursor-not-allowed'
                  : ''
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                {createCompanyMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Launching company...</span>
                  </>
                ) : (
                  <>
                    <span>Launch company</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </div>
            </button>

            {createCompanyMutation.isError && (
              <div className="px-5 py-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                <p className="text-red-600 text-sm font-medium">
                  Error: {createCompanyMutation.error?.message || 'Failed to launch. Please try again.'}
                </p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="text-center space-y-4 stagger-3">
            <Link
              to="/docs"
              className="inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
            >
              How it works →
            </Link>

            <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-dim)]">
              <span>OpenClaw</span>
              <span>•</span>
              <span>Base</span>
              <span>•</span>
              <span>Clanker</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
