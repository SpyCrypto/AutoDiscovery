import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, Clock, AlertTriangle, CheckCircle2, FileText,
  ArrowRight, Shield, TrendingUp,
} from 'lucide-react';
import { useProviders } from '@/providers/context';
import type { Case, ComplianceStatus } from '@/providers/types';

function ComplianceBadge({ score }: { score: number }) {
  if (score >= 0.9) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="w-3 h-3" /> Compliant
      </span>
    );
  }
  if (score >= 0.7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <AlertTriangle className="w-3 h-3" /> At Risk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400">
      <AlertTriangle className="w-3 h-3" /> Non-Compliant
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub }: {
  icon: typeof FolderOpen; label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
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
        <div className="animate-pulse text-muted-foreground">Loading cases...</div>
      </div>
    );
  }

  const totalDocs = caseList.reduce((sum, c) => sum + c.documentCount, 0);
  const totalSteps = caseList.reduce((sum, c) => sum + c.stepsTotal, 0);
  const completedSteps = caseList.reduce((sum, c) => sum + c.stepsComplete, 0);
  const overdueCount = Object.values(statuses).reduce((sum, s) => sum + s.stepsOverdue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Discovery compliance overview across all active cases</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderOpen} label="Active Cases" value={caseList.length} sub="Idaho — IRCP" />
        <StatCard icon={FileText} label="Total Documents" value={totalDocs} sub="Across all cases" />
        <StatCard icon={TrendingUp} label="Steps Complete" value={`${completedSteps}/${totalSteps}`} sub={`${Math.round((completedSteps / totalSteps) * 100)}% progress`} />
        <StatCard
          icon={overdueCount > 0 ? AlertTriangle : Shield}
          label="Overdue Steps"
          value={overdueCount}
          sub={overdueCount > 0 ? 'Action required' : 'All on track'}
        />
      </div>

      {/* Case List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Active Cases</h2>
        <div className="space-y-3">
          {caseList.map((c) => {
            const status = statuses[c.id];
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="w-full text-left bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{c.caseNumber}</span>
                      <ComplianceBadge score={c.complianceScore} />
                      {c.caseType === 'med_mal' && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium">
                          Med-Mal
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base truncate">{c.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> {c.documentCount} docs
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {c.stepsComplete}/{c.stepsTotal} steps
                      </span>
                      {c.nextDeadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Next: {c.nextDeadline}
                        </span>
                      )}
                    </div>
                    {c.nextDeadlineLabel && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        → {c.nextDeadlineLabel}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {/* Compliance Score Ring */}
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
                        <circle
                          cx="18" cy="18" r="15" fill="none" strokeWidth="3"
                          strokeDasharray={`${c.complianceScore * 94.25} 94.25`}
                          strokeLinecap="round"
                          className={c.complianceScore >= 0.9 ? 'text-emerald-500' : c.complianceScore >= 0.7 ? 'text-amber-500' : 'text-red-500'}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {Math.round(c.complianceScore * 100)}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>

                {/* Obfuscation Alert for case-001 */}
                {status && status.score < 0.85 && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-500/10 rounded-lg text-xs text-amber-700 dark:text-amber-400">
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
