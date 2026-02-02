import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { ArrowRight, Sparkles } from 'lucide-react';
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
    'AI-generated art marketplace with NFT minting',
    'Developer code snippet sharing platform',
    'AI-powered personalized fitness coaching',
    'Freelance designer equity marketplace',
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

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-3xl w-full space-y-16">

          {/* Header */}
          <div className="text-center space-y-8 stagger-1">
            <div className="space-y-4">
              <h1 className="font-display text-6xl md:text-8xl leading-none tracking-tight">
                PUMPANY
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-3 h-3" />
                <span>AI Company Launcher</span>
              </div>
            </div>

            <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
              Deploy autonomous AI agents to build companies on Base
            </p>
          </div>

          {/* Launch Form */}
          <form onSubmit={handleSubmit} className="space-y-12 stagger-2">

            {/* Prompt Input */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <label className="text-sm text-gray-500 font-mono">
                  Company Vision
                </label>
                <span className="text-xs text-gray-700 font-mono">
                  {prompt.length}/10
                </span>
              </div>

              <div className={`border-minimal transition-all ${
                isTyping ? 'opacity-70' : 'opacity-100'
              }`}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your company idea..."
                  className="w-full h-32 px-5 py-4 bg-transparent text-white text-base leading-relaxed placeholder-gray-700 focus:outline-none resize-none border-0"
                  required
                  minLength={10}
                />
              </div>

              {/* Example Prompts */}
              {prompt.length === 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-700 font-mono">Examples:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleExampleClick(example)}
                        className="text-left px-4 py-3 border-minimal text-sm text-gray-500 hover:text-gray-400 hover:border-gray-700 transition-all"
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
              <div className="flex items-baseline justify-between">
                <label className="text-sm text-gray-500 font-mono">
                  Agent Count
                </label>
                <span className="text-xs text-gray-700 font-mono">
                  {computeLevel === 'low' ? '2' : computeLevel === 'medium' ? '4' : '6'} agents
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((level) => {
                  const specs = {
                    low: { agents: 2, label: 'Basic' },
                    medium: { agents: 4, label: 'Standard' },
                    high: { agents: 6, label: 'Advanced' },
                  };
                  const spec = specs[level];
                  const isSelected = computeLevel === level;

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setComputeLevel(level)}
                      className={`px-6 py-5 border transition-all ${
                        isSelected
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
                          : 'border-[var(--border-subtle)] hover:border-[var(--border-dim)]'
                      }`}
                    >
                      <div className="space-y-2 text-center">
                        <div className={`text-sm font-mono ${
                          isSelected ? 'text-[var(--accent-primary)]' : 'text-gray-500'
                        }`}>
                          {spec.label}
                        </div>
                        <div className="text-xs text-gray-700 font-mono">
                          {spec.agents}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch Button */}
            <button
              type="submit"
              disabled={createCompanyMutation.isPending || prompt.length < 10}
              className={`w-full py-5 border-2 font-mono text-sm tracking-wide transition-all ${
                createCompanyMutation.isPending || prompt.length < 10
                  ? 'border-gray-900 text-gray-800 cursor-not-allowed'
                  : 'border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black glow-green'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                {createCompanyMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-800 border-t-[var(--accent-primary)] rounded-full animate-spin" />
                    <span>Deploying<span className="animate-blink">_</span></span>
                  </>
                ) : (
                  <>
                    <span>Launch Company</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </div>
            </button>

            {createCompanyMutation.isError && (
              <div className="px-5 py-4 border border-red-500/30 bg-red-500/5 animate-shake">
                <p className="text-red-500 text-sm font-mono">
                  Error: {createCompanyMutation.error?.message || 'Deployment failed'}
                </p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="text-center space-y-6 stagger-3">
            <Link
              to="/docs"
              className="inline-block text-sm text-gray-600 hover:text-gray-400 transition-colors font-mono"
            >
              Documentation
            </Link>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-800 font-mono">
              <span>OpenClaw</span>
              <span>·</span>
              <span>Base</span>
              <span>·</span>
              <span>Clanker</span>
            </div>

            <p className="text-xs text-gray-900 font-mono">
              v0.1.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
