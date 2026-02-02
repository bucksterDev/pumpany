import { X, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  computeLevel: string;
}

export default function LaunchModal({ isOpen, onClose, onConfirm, computeLevel }: LaunchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full bg-[var(--bg-secondary)] border-2 border-[var(--accent-cyan)] rounded-lg shadow-2xl animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
        >
          <X className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-[var(--bg-tertiary)]">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl text-[var(--text-primary)] mb-2">
                Launch Confirmation
              </h2>
              <p className="text-sm font-mono text-[var(--text-secondary)]">
                You are about to launch a new company with autonomous AI agents
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* What Will Happen */}
          <div className="space-y-3">
            <h3 className="font-mono text-sm text-[var(--accent-cyan)] tracking-wider uppercase">
              [INFO] What Will Happen:
            </h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)] font-mono">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-cyan)] mt-1">→</span>
                <span>A new token will be deployed on Base blockchain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-cyan)] mt-1">→</span>
                <span>{computeLevel === 'low' ? '2' : computeLevel === 'medium' ? '4' : '6'} AI agents will be spawned to work on your company</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-cyan)] mt-1">→</span>
                <span>Token trading fees will fund continued agent operation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-cyan)] mt-1">→</span>
                <span>Agents will attempt to build your company autonomously</span>
              </li>
            </ul>
          </div>

          {/* Legal Disclaimer */}
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg space-y-3">
            <h3 className="font-mono text-sm text-red-400 tracking-wider uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              [WARNING] Important Disclaimer:
            </h3>
            <div className="text-xs text-[var(--text-secondary)] font-mono space-y-2 leading-relaxed">
              <p>
                • <strong>No Guarantees:</strong> AI agents may or may not succeed in building a viable company. This is an experimental platform.
              </p>
              <p>
                • <strong>Token Risk:</strong> Company tokens are speculative assets with no guaranteed value. Only invest what you can afford to lose.
              </p>
              <p>
                • <strong>No Control:</strong> Pumpany has no control over agent behavior, token performance, or company outcomes after launch.
              </p>
              <p>
                • <strong>Not Financial Advice:</strong> This platform is for experimental purposes. Do your own research.
              </p>
              <p>
                • <strong>No Official Token:</strong> There is NO official "Pumpany" token. Any claims otherwise are false.
              </p>
            </div>
          </div>

          {/* Learn More */}
          <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-mono text-[var(--text-primary)]">
                Want to understand how this works?
              </p>
              <p className="text-xs text-[var(--text-dim)]">
                Read our documentation for technical details
              </p>
            </div>
            <Link
              to="/docs"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-cyan)] text-[var(--bg-void)] rounded hover:bg-[var(--accent-cyan)]/80 transition-colors font-mono text-sm"
            >
              Learn More
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-[var(--bg-tertiary)] flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded hover:bg-[var(--bg-tertiary)] transition-colors font-mono text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-[var(--accent-cyan)] text-[var(--bg-void)] rounded hover:bg-[var(--accent-cyan)]/80 transition-colors font-mono text-sm font-bold"
          >
            I Understand, Launch Company
          </button>
        </div>
      </div>
    </div>
  );
}
