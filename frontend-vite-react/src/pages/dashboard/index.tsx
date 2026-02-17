import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, Clock, AlertTriangle, CheckCircle2, FileText,
  ArrowRight, Shield, TrendingUp, Scale, Sparkles,
} from 'lucide-react';
import { useProviders } from '@/providers/context';
import type { Case, ComplianceStatus } from '@/providers/types';

function ComplianceBadge({ score }: { score: number }) {
  if (score >= 0.9) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/15 text-emerald-500 ad-glow-emerald">
        <CheckCircle2 className="w-3 h-3" /> Compliant
      </span>
    );
  }
  if (score >= 0.7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-500 ad-glow-gold">
        <AlertTriangle className="w-3 h-3" /> At Risk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-500/15 text-red-500">
      <AlertTriangle className="w-3 h-3" /> Non-Compliant
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: typeof FolderOpen; label: string; value: string | number; sub?: string; accent?: string;
}) {
  const accentColor = accent || 'blue';
  const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
    blue: { bg: 'from-blue-500/20 to-blue-600/5', text: 'text-blue-400', glow: 'ad-glow-blue' },
    gold: { bg: 'from-amber-500/20 to-amber-600/5', text: 'text-ad-gold', glow: 'ad-glow-gold' },
    emerald: { bg: 'from-emerald-500/20 to-emerald-600/5', text: 'text-emerald-400', glow: 'ad-glow-emerald' },
    red: { bg: 'from-red-500/20 to-red-600/5', text: 'text-red-400', glow: '' },
  };
  const c = colorMap[accentColor] || colorMap.blue;

  return (
    <div className={`relative bg-card border border-border rounded-2xl p-5 overflow-hidden ${c.glow}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${c.bg} rounded-bl-[3rem] opacity-60`} />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${c.bg}`}>
            <Icon className={`w-5 h-5 ${c.text}`} />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { cases, compliance } = useProviders();
  const navigate = useNavigate();
  const [caseList, setCaseList] = useState<Case[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ComplianceStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const allCases = await cases.listCases();
      setCaseList(allCases);

      const statusMap: Record<string, ComplianceStatus> = {};
      for (const c of allCases) {
        statusMap[c.id] = await compliance.getComplianceStatus(c.id);
      }
      setStatuses(statusMap);
      setLoading(false);
    }
    load();
  }, [cases, compliance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Scale className="w-5 h-5 text-ad-gold animate-pulse" />
          <span className="text-sm">Loading cases...</span>
        </div>
      </div>
    );
  }

  const totalDocs = caseList.reduce((sum, c) => sum + c.documentCount, 0);
  const totalSteps = caseList.reduce((sum, c) => sum + c.stepsTotal, 0);
  const completedSteps = caseList.reduce((sum, c) => sum + c.stepsComplete, 0);
  const overdueCount = Object.values(statuses).reduce((sum, s) => sum + s.stepsOverdue, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-ad-gold" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-ad-gold font-bold">Overview</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Discovery compliance across all active cases</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>IRCP Active</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderOpen} label="Active Cases" value={caseList.length} sub="Idaho — IRCP" accent="blue" />
        <StatCard icon={FileText} label="Documents" value={totalDocs} sub="Across all cases" accent="gold" />
        <StatCard icon={TrendingUp} label="Steps Done" value={`${completedSteps}/${totalSteps}`} sub={`${Math.round((completedSteps / totalSteps) * 100)}% complete`} accent="emerald" />
        <StatCard
          icon={overdueCount > 0 ? AlertTriangle : Shield}
          label="Overdue"
          value={overdueCount}
          sub={overdueCount > 0 ? 'Action required' : 'All on track'}
          accent={overdueCount > 0 ? 'red' : 'emerald'}
        />
      </div>

      {/* Case List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold">Active Cases</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{caseList.length}</span>
        </div>
        <div className="space-y-3">
          {caseList.map((c, index) => {
            const status = statuses[c.id];
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="w-full text-left bg-card border border-border rounded-2xl p-5 hover:border-ad-gold/30 hover:shadow-lg hover:shadow-ad-gold/5 transition-all duration-300 group ad-animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{c.caseNumber}</span>
                      <ComplianceBadge score={c.complianceScore} />
                      {c.caseType === 'med_mal' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-bold uppercase tracking-wide">
                          Med-Mal
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base group-hover:text-ad-gold transition-colors">{c.title}</h3>
                    <div className="flex items-center gap-4 mt-2.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> {c.documentCount} docs
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {c.stepsComplete}/{c.stepsTotal} steps
                      </span>
                      {c.nextDeadline && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> {c.nextDeadline}
                        </span>
                      )}
                    </div>
                    {c.nextDeadlineLabel && (
                      <p className="text-xs text-ad-gold/70 mt-2 font-medium">
                        {c.nextDeadlineLabel}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    {/* Compliance Score Ring */}
                    <div className="relative w-14 h-14">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted/20" />
                        <circle
                          cx="18" cy="18" r="15" fill="none" strokeWidth="2.5"
                          strokeDasharray={`${c.complianceScore * 94.25} 94.25`}
                          strokeLinecap="round"
                          className={c.complianceScore >= 0.9 ? 'text-emerald-500' : c.complianceScore >= 0.7 ? 'text-amber-500' : 'text-red-500'}
                          style={{ transition: 'stroke-dasharray 1s ease-out' }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                        {Math.round(c.complianceScore * 100)}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-ad-gold group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>

                {/* Obfuscation Alert */}
                {status && status.score < 0.85 && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-amber-500/8 border border-amber-500/15 rounded-xl text-xs text-amber-500 font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Haystack Alert: DEF Production Set 1 flagged for potential data dump obfuscation (score: 0.62)
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
