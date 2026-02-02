import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { companyAPI } from '../lib/api';
import { ArrowRight } from 'lucide-react';
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

      <div className="min-h-screen">

        {/* Nav */}
        <nav className="flex items-center justify-between mb-24 stagger-1">
          <div className="font-display text-2xl" style={{ color: 'var(--charcoal)' }}>
            Pumpany
          </div>
          <Link to="/docs" className="text-sm font-medium">
            Docs
          </Link>
        </nav>

        {/* Hero */}
        <div className="mb-20 stagger-2">
          <div className="badge mb-8">
            <span className="font-mono text-xs">AI on Base</span>
          </div>

          <h1 className="font-display text-6xl md:text-7xl mb-6" style={{ color: 'var(--electric)' }}>
            Launch AI companies<br />in seconds
          </h1>

          <p className="text-xl max-w-xl" style={{ color: 'var(--electric)' }}>
            Deploy autonomous agents that build your company on Base blockchain
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl stagger-3">

          {/* Vision */}
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
              Company Vision
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your company..."
              className="w-full h-44 px-5 py-4 text-base leading-relaxed resize-none"
              required
              minLength={10}
            />

            <div className="mt-2 text-sm text-right" style={{ color: 'var(--ash)' }}>
              {prompt.length}/10
            </div>
          </div>

          {/* Agent + Fee Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Agent Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                Agent Count
              </label>

              <div className="space-y-2">
                {(['low', 'medium', 'high'] as const).map((level) => {
                  const specs = {
                    low: { agents: 2, label: 'Basic' },
                    medium: { agents: 4, label: 'Standard' },
                    high: { agents: 6, label: 'Advanced' },
                  };
                  const spec = specs[level];

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setComputeLevel(level)}
                      className={`selection-pill w-full text-left flex items-center justify-between ${
                        computeLevel === level ? 'active' : ''
                      }`}
                    >
                      <span className="font-semibold" style={{
                        color: computeLevel === level ? 'var(--electric)' : 'var(--charcoal)'
                      }}>
                        {spec.label}
                      </span>
                      <span className="text-sm font-mono" style={{ color: 'var(--slate)' }}>
                        {spec.agents}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fee Structure */}
            <div className="info-box">
              <div className="text-sm font-semibold mb-4" style={{ color: 'var(--charcoal)' }}>
                Fee Structure
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm" style={{ color: 'var(--slate)' }}>Launch Fee</span>
                  <span className="text-xl font-display" style={{ color: 'var(--electric)' }}>
                    0.002 ETH
                  </span>
                </div>

                <div className="divider my-3" />

                <div className="space-y-2">
                  <div className="text-xs mb-2" style={{ color: 'var(--ash)' }}>
                    Trading fees (1%)
                  </div>

                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--electric)' }}>AI Compute</span>
                    <span className="font-mono" style={{ color: 'var(--electric)' }}>0.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--electric)' }}>Token Creator</span>
                    <span className="font-mono" style={{ color: 'var(--electric)' }}>0.3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--slate)' }}>Pumpany</span>
                    <span className="font-mono" style={{ color: 'var(--slate)' }}>0.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <button
            type="submit"
            disabled={createCompanyMutation.isPending || prompt.length < 10}
            className="w-full py-4 btn btn-primary text-base font-semibold"
          >
            {createCompanyMutation.isPending ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl animate-shake">
              <p className="text-red-600 text-sm">
                {createCompanyMutation.error?.message || 'Launch failed. Please try again.'}
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center mt-24 pt-12 border-t stagger-4" style={{ borderColor: 'var(--frost)' }}>
          <div className="flex items-center justify-center gap-6 text-xs font-mono" style={{ color: 'var(--ash)' }}>
            <span>OpenClaw</span>
            <span>×</span>
            <span>Base</span>
            <span>×</span>
            <span>Clanker</span>
          </div>
        </div>
      </div>
    </>
  );
}
