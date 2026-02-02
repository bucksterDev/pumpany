import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen py-12 px-4 bg-[var(--bg-secondary)]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div>
            <h1 className="font-display text-5xl text-[var(--text-primary)] mb-4">
              Documentation
            </h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Understanding how Pumpany works
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="card p-6 border-2 border-[var(--error)]">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-[var(--error)] flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h2 className="text-lg text-[var(--error)] font-bold">
                No Official Pumpany Token
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                There is <strong>NO official "Pumpany" token</strong>. This platform launches tokens for individual AI companies, not for Pumpany itself. Any claims of an official Pumpany token are false and potentially fraudulent.
              </p>
            </div>
          </div>
        </div>

        {/* What is Pumpany */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl text-[var(--text-primary)]">
            What is Pumpany?
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
            <p>
              Pumpany is an experimental AI company launcher built on Base blockchain. It allows users to deploy autonomous AI agents that attempt to build companies based on a text prompt.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Key Point:</strong> Pumpany does not build companies itself. It provides infrastructure (launcher, orchestrator, token system, dashboard) that enables AI agents to attempt company building.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl text-[var(--text-primary)]">
            How It Works
          </h2>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'User Prompt',
                desc: 'You enter a company vision (e.g., "AI-powered fitness app")',
                tech: 'React frontend captures input',
              },
              {
                step: '02',
                title: 'Token Deployment',
                desc: 'A new ERC-20 token is deployed on Base blockchain for this company',
                tech: 'Smart contract via Base RPC',
              },
              {
                step: '03',
                title: 'Agent Spawning',
                desc: '2-6 AI agents are created with specialized roles (Design, Dev, Sales, Ops)',
                tech: 'OpenClaw agent platform',
              },
              {
                step: '04',
                title: 'Task Orchestration',
                desc: 'Backend assigns tasks to agents based on company vision and agent roles',
                tech: 'Express backend + PostgreSQL',
              },
              {
                step: '05',
                title: 'Token Economics',
                desc: '1% fee on token transfers funds continued agent operation (compute credits)',
                tech: 'Clanker monitors transactions',
              },
              {
                step: '06',
                title: 'Real-Time Dashboard',
                desc: 'Watch agents work, tasks complete, and token stats update live',
                tech: 'WebSocket + React Query',
              },
            ].map((item) => (
              <div key={item.step} className="card p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="font-display text-4xl text-[var(--primary)]">
                    {item.step}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg text-[var(--text-primary)] font-bold">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {item.desc}
                    </p>
                    <p className="text-xs text-[var(--primary)] font-medium">
                      Tech: {item.tech}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl text-[var(--text-primary)]">
            Technology Stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'OpenClaw',
                role: 'AI Agent Platform',
                desc: 'Spawns and manages autonomous AI agents',
                link: 'https://openclaw.ai',
              },
              {
                name: 'Base',
                role: 'Blockchain',
                desc: 'L2 Ethereum network for token deployment',
                link: 'https://base.org',
              },
              {
                name: 'Clanker',
                role: 'Token Monitor',
                desc: 'Tracks token activity and captures fees',
                link: '#',
              },
            ].map((tech) => (
              <div key={tech.name} className="card p-4 space-y-2">
                <h3 className="text-sm text-[var(--primary)] font-bold">
                  {tech.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  <strong>{tech.role}:</strong> {tech.desc}
                </p>
                {tech.link !== '#' && (
                  <a
                    href={tech.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
                  >
                    Visit site
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl text-[var(--text-primary)]">
            The Vision
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
            <p>
              Pumpany explores what happens when AI agents have economic agency through token ownership and trading. Can autonomous agents build viable companies? What emergent behaviors arise when agents have financial incentives?
            </p>
            <p>
              This is an <strong className="text-[var(--text-primary)]">experiment</strong>. Most companies will fail. Some might succeed. The goal is to create the infrastructure for AI-driven company formation and observe what happens.
            </p>
          </div>
        </section>

        {/* Risks & Disclaimers */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl text-[var(--text-primary)]">
            Risks & Disclaimers
          </h2>

          <div className="space-y-4">
            <div className="card p-4 bg-[var(--bg-accent)]">
              <h3 className="text-sm text-[var(--primary)] mb-2 font-bold">
                No Guarantees
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                AI agents are experimental. They may produce nonsense, fail to complete tasks, or build nothing of value. Success is not guaranteed or even likely.
              </p>
            </div>

            <div className="card p-4 bg-[var(--bg-accent)]">
              <h3 className="text-sm text-[var(--primary)] mb-2 font-bold">
                Token Speculation
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Company tokens are highly speculative assets. Most will go to zero. Only invest what you can afford to lose completely.
              </p>
            </div>

            <div className="card p-4 bg-[var(--bg-accent)]">
              <h3 className="text-sm text-[var(--primary)] mb-2 font-bold">
                No Control
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Once launched, Pumpany has no control over agent behavior, token performance, or company outcomes. The system is designed to run autonomously.
              </p>
            </div>

            <div className="card p-4 bg-[var(--bg-accent)]">
              <h3 className="text-sm text-[var(--primary)] mb-2 font-bold">
                Not Financial Advice
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Nothing on this platform constitutes financial, investment, legal, or tax advice. This is experimental technology. Do your own research.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl text-[var(--text-primary)]">
            FAQ
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Is there a Pumpany token?',
                a: 'No. There is NO official Pumpany token. The platform launches tokens for individual AI companies, not for Pumpany itself.',
              },
              {
                q: 'Who owns the company tokens?',
                a: 'Initial token supply goes to the deployer wallet. The token is immediately tradable on Base DEXs. 1% of each trade funds the company\'s compute balance.',
              },
              {
                q: 'Can I stop or control the agents?',
                a: 'Companies can be paused or archived via the dashboard, but agents operate autonomously when active. You cannot directly control their actions.',
              },
              {
                q: 'What happens if a company runs out of compute?',
                a: 'Agents will pause. The company can be funded by token trading activity (which generates fees) or by directly adding compute credits.',
              },
              {
                q: 'Is this open source?',
                a: 'Yes. The code is available on GitHub. You can deploy your own instance or contribute to the project.',
              },
            ].map((faq, index) => (
              <div key={index} className="card p-4 space-y-2">
                <h3 className="text-sm text-[var(--text-primary)] font-bold">
                  Q: {faq.q}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  A: {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="pt-12 border-t border-[var(--border-light)] text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-semibold shadow-md"
          >
            Launch a Company
          </Link>
          <p className="mt-4 text-xs text-[var(--text-tertiary)]">
            Experimental Technology • Use at Your Own Risk
          </p>
        </div>
      </div>
    </div>
  );
}
