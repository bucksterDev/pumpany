import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { Rocket, Terminal, Sparkles, ArrowRight, Zap } from 'lucide-react';
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
          <div className="text-center stagger-1">
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-4 py-2 cyber-border text-xs tracking-wider hover:border-cyan-500/50 transition-all"
            >
              <Terminal className="w-3 h-3 text-cyan-500" />
              <span className="text-gray-400">DOCUMENTATION</span>
            </Link>
          </div>

          {/* Terminal Header */}
          <div className="text-center space-y-8 stagger-2">
            <div className="inline-flex items-center gap-3 px-4 py-2 cyber-border">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] text-gray-500 tracking-widest font-mono">
                SYSTEM ONLINE
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="font-display text-7xl md:text-9xl leading-none tracking-tighter">
                <span className="bg-gradient-to-r from-cyan-500 via-magenta-500 to-yellow-500 bg-clip-text text-transparent">
                  PUMPANY
                </span>
                <span className="text-cyan-500 animate-blink">_</span>
              </h1>

              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-4 h-4 text-magenta-500" />
                <span className="text-sm tracking-[0.3em] text-gray-400 font-mono">
                  AI COMPANY SPAWNER
                </span>
                <Sparkles className="w-4 h-4 text-cyan-500" />
              </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-2">
              <p className="text-lg font-mono text-cyan-500">
                {'>'} DEPLOY_AUTONOMOUS_AGENTS.SH
              </p>
              <p className="text-sm text-gray-400">
                Spawn AI agents on Base blockchain. They build companies. You watch.
              </p>
            </div>
          </div>

          {/* Launch Interface */}
          <form onSubmit={handleSubmit} className="space-y-8 stagger-3">
            {/* Prompt Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <label className="font-mono text-cyan-500 tracking-wider">
                  [INPUT] COMPANY_DIRECTIVE
                </label>
                <span className="font-mono text-gray-600">
                  {prompt.length >= 10 ? '✓ VALID' : `${10 - prompt.length} CHARS REQUIRED`}
                </span>
              </div>

              <div className={`relative cyber-border transition-all duration-300 ${
                isTyping ? 'scale-[0.98]' : 'scale-100'
              }`}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="// ENTER COMPANY VISION&#10;// WHAT PROBLEM DOES IT SOLVE?&#10;// WHO IS IT FOR?&#10;&#10;Example: A marketplace for AI-generated art..."
                  className="w-full h-48 px-6 py-5 bg-black/40 text-gray-300 font-mono text-sm leading-loose placeholder-gray-700 focus:outline-none resize-none border-0 backdrop-blur-sm"
                  required
                  minLength={10}
                />
                <div className="absolute bottom-5 right-5 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    prompt.length >= 10 ? 'bg-cyan-500 animate-pulse' : 'bg-gray-800'
                  }`} />
                  <span className="text-xs font-mono text-gray-600">
                    {prompt.length}<span className="text-cyan-500">/</span>10
                  </span>
                </div>
              </div>

              {/* Example Prompts */}
              {prompt.length === 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-mono text-gray-600 tracking-widest">
                    [EXAMPLES]
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleExampleClick(example)}
                        className="text-left p-4 bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <ArrowRight className="w-3 h-3 text-cyan-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="text-xs font-mono text-gray-500 group-hover:text-gray-400 leading-relaxed">
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
              <div className="flex items-center justify-between text-xs">
                <label className="font-mono text-cyan-500 tracking-wider">
                  [SELECT] COMPUTE_POWER
                </label>
                <span className="font-mono text-gray-600">
                  {computeLevel === 'low' ? '2' : computeLevel === 'medium' ? '4' : '6'} AGENTS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {(['low', 'medium', 'high'] as const).map((level) => {
                  const specs = {
                    low: { agents: 2, power: 'LOW', icon: <Zap className="w-6 h-6" /> },
                    medium: { agents: 4, power: 'MED', icon: <><Zap className="w-5 h-5" /><Zap className="w-5 h-5 -ml-3" /></> },
                    high: { agents: 6, power: 'MAX', icon: <><Zap className="w-4 h-4" /><Zap className="w-4 h-4 -ml-2" /><Zap className="w-4 h-4 -ml-2" /></> },
                  };
                  const spec = specs[level];
                  const isSelected = computeLevel === level;

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setComputeLevel(level)}
                      className={`relative p-6 bg-black/40 border transition-all duration-200 ${
                        isSelected
                          ? 'border-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className={`flex items-center justify-center ${
                          isSelected ? 'text-cyan-500' : 'text-gray-700'
                        }`}>
                          {spec.icon}
                        </div>
                        <div className="space-y-1">
                          <div className={`font-mono text-sm tracking-widest ${
                            isSelected ? 'text-cyan-500' : 'text-gray-600'
                          }`}>
                            {level.toUpperCase()}
                          </div>
                          <div className="font-mono text-[10px] text-gray-700">
                            {spec.agents} AGENTS • {spec.power}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 border border-cyan-500 opacity-50 animate-pulse pointer-events-none" />
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
              className="relative w-full group overflow-hidden"
            >
              <div className={`relative py-6 px-8 border-2 font-mono text-sm tracking-[0.2em] transition-all duration-300 ${
                createCompanyMutation.isPending || prompt.length < 10
                  ? 'border-gray-800 bg-gray-900/20 text-gray-700 cursor-not-allowed'
                  : 'border-cyan-500 bg-cyan-500/5 text-cyan-500 hover:bg-cyan-500 hover:text-black group-hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]'
              }`}>
                {/* Animated scan effect */}
                {!createCompanyMutation.isPending && prompt.length >= 10 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                <div className="relative flex items-center justify-center gap-4">
                  {createCompanyMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-700 border-t-cyan-500 rounded-full animate-spin" />
                      <span>INITIALIZING<span className="animate-blink">_</span></span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      <span>DEPLOY COMPANY</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </div>
              </div>
            </button>

            {createCompanyMutation.isError && (
              <div className="p-5 border border-red-500/50 bg-red-500/5 animate-shake">
                <p className="text-red-400 font-mono text-xs flex items-center gap-3">
                  <span className="text-lg">⚠</span>
                  <span>[ERROR] {createCompanyMutation.error?.message || 'DEPLOYMENT_FAILED'}</span>
                </p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="text-center space-y-4 stagger-4">
            <div className="flex items-center justify-center gap-6 text-[10px] font-mono text-gray-700">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span>OPENCLAW</span>
              </div>
              <span className="text-gray-800">×</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-magenta-500 animate-pulse" />
                <span>BASE</span>
              </div>
              <span className="text-gray-800">×</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                <span>CLANKER</span>
              </div>
            </div>
            <p className="text-[9px] font-mono text-gray-800 tracking-widest">
              BUILD_v0.1.0 • EXPERIMENTAL
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
