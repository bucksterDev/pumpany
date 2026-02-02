import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { Rocket, ArrowRight, BookOpen, Zap } from 'lucide-react';
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
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border-light)] bg-[var(--bg-primary)] rounded-lg hover:border-[var(--primary)] hover:shadow-sm transition-all text-sm text-[var(--text-secondary)]"
            >
              <BookOpen className="w-4 h-4" />
              <span>How It Works</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-6 stagger-1">
            <div className="space-y-4">
              <h1 className="font-display text-6xl md:text-8xl text-[var(--text-primary)] leading-none">
                Pumpany
              </h1>
              <p className="text-xl text-[var(--primary)] font-semibold">
                AI Company Launcher
              </p>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Deploy autonomous AI agents to Base blockchain. Launch companies powered by intelligent agents that work together to build your vision.
              </p>
            </div>
          </div>

        {/* Launch Interface */}
        <form onSubmit={handleSubmit} className="space-y-8 stagger-2">
          {/* Prompt Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                Company Vision
              </label>
              <span className="text-xs text-[var(--text-tertiary)]">
                {prompt.length >= 10 ? '✓ Ready' : `${10 - prompt.length} characters minimum`}
              </span>
            </div>

            <div className={`relative card overflow-hidden transition-all duration-300 ${
              isTyping ? 'scale-[0.99]' : 'scale-100'
            }`}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your company vision. What problem does it solve? Who is it for?&#10;&#10;Example: A marketplace for AI-generated art with NFT minting capabilities"
                className="w-full h-40 px-6 py-4 bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm leading-relaxed placeholder-[var(--text-placeholder)] focus:outline-none resize-none border-0"
                required
                minLength={10}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-colors ${
                  prompt.length >= 10 ? 'bg-[var(--success)]' : 'bg-[var(--border-medium)]'
                }`} />
                <span className="text-xs text-[var(--text-tertiary)]">
                  {prompt.length} / 10
                </span>
              </div>
            </div>

            {/* Example Prompts */}
            {prompt.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Example ideas to get started:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className="card text-left p-4 hover:shadow-md transition-all group/example"
                    >
                      <div className="flex items-start gap-3">
                        <ArrowRight className="w-4 h-4 text-[var(--primary)] mt-0.5 opacity-0 group-hover/example:opacity-100 transition-opacity" />
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
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
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                Compute Level
              </label>
              <span className="text-xs text-[var(--text-tertiary)]">
                {computeLevel === 'low' ? '2' : computeLevel === 'medium' ? '4' : '6'} AI agents
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {(['low', 'medium', 'high'] as const).map((level) => {
                const specs = {
                  low: { agents: 2, label: 'Basic', description: 'Starter team' },
                  medium: { agents: 4, label: 'Standard', description: 'Recommended' },
                  high: { agents: 6, label: 'Advanced', description: 'Full team' },
                };
                const spec = specs[level];
                const isSelected = computeLevel === level;

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setComputeLevel(level)}
                    className={`card relative p-6 transition-all duration-200 ${
                      isSelected
                        ? 'border-[var(--primary)] shadow-lg scale-105'
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="text-2xl">
                        <Zap className={`w-6 h-6 ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-tertiary)]'}`} />
                      </div>
                      <div className="space-y-1">
                        <div className={`text-sm font-semibold capitalize ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}>
                          {spec.label}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {spec.agents} agents
                        </div>
                        <div className="text-xs text-[var(--text-tertiary)]">
                          {spec.description}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-md">
                        <span className="text-[10px] text-white font-bold">✓</span>
                      </div>
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
            className={`w-full py-4 px-8 rounded-lg font-semibold text-base transition-all duration-200 ${
              createCompanyMutation.isPending || prompt.length < 10
                ? 'bg-[var(--bg-tertiary)] text-[var(--text-placeholder)] cursor-not-allowed'
                : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              {createCompanyMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Launching Company...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  <span>Launch Company</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </div>
          </button>

          {createCompanyMutation.isError && (
            <div className="p-4 rounded-lg border border-[var(--error)] bg-[var(--error-light)]">
              <p className="text-[var(--error)] text-sm flex items-center gap-2">
                <span className="text-lg">⚠</span>
                Launch failed: {createCompanyMutation.error?.message || 'Please try again'}
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center space-y-4 stagger-3">
          <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-tertiary)]">
            <span>Powered by</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <span className="font-medium">OpenClaw</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <span className="font-medium">Base</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <span className="font-medium">Clanker</span>
            </div>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            Version 0.1.0 • Experimental Technology
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
