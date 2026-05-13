import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, CheckCircle2, AlertTriangle, Clock, Sparkles,
  FileCheck, TrendingUp, ChevronRight, Lock, Eye,
} from 'lucide-react';
import { useProviders } from '@/providers/context';
import type { Case, ComplianceStatus, Attestation, AttestationScope } from '@/providers/types';

function ScopeBadge({ scope }: { scope: AttestationScope }) {
  const styles: Record<AttestationScope, { bg: string; text: string; label: string }> = {
    step: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Step' },
    phase: { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'Phase' },
    case: { bg: 'bg-ad-gold/10', text: 'text-ad-gold', label: 'Case' },
  };
  const s = styles[scope];
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}
      title={`${scope === 'step' ? 'Proves a single discovery step was completed' : scope === 'phase' ? 'Proves an entire discovery phase met all obligations' : 'Proves overall case compliance across all phases'}`}
    >
      {s.label}
    </span>
  );
}

export function CompliancePage() {
  const { cases, compliance } = useProviders();
  const navigate = useNavigate();

  const [caseList, setCaseList] = useState<Case[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ComplianceStatus>>({});
  const [allAttestations, setAllAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const allCases = await cases.listCases();
      setCaseList(allCases);

      const statusMap: Record<string, ComplianceStatus> = {};
      const attestations: Attestation[] = [];
      for (const c of allCases) {
        statusMap[c.id] = await compliance.getComplianceStatus(c.id);
        const caseAttestations = await compliance.getAttestations(c.id);
        attestations.push(...caseAttestations);
      }
      setStatuses(statusMap);
      setAllAttestations(attestations.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
      setLoading(false);
    }
    load();
  }, [cases, compliance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Shield className="w-5 h-5 text-ad-gold animate-pulse" />
          <span className="text-sm">Loading compliance data...</span>
        </div>
      </div>
    );
  }

  const totalSteps = caseList.reduce((sum, c) => sum + c.stepsTotal, 0);
  const completedSteps = caseList.reduce((sum, c) => sum + c.stepsComplete, 0);
  const overdueCount = Object.values(statuses).reduce((sum, s) => sum + s.stepsOverdue, 0);
  const avgScore = caseList.length > 0
    ? caseList.reduce((sum, c) => sum + c.complianceScore, 0) / caseList.length
    : 0;

  const stepAttestations = allAttestations.filter((a) => a.scope === 'step');
  const phaseAttestations = allAttestations.filter((a) => a.scope === 'phase');
  const caseAttestations = allAttestations.filter((a) => a.scope === 'case');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-ad-gold" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-ad-gold font-bold">Compliance Center</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Cross-case compliance overview with zero-knowledge proof verification</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg. Score</span>
          </div>
          <p className="text-3xl font-bold tracking-tight">{Math.round(avgScore * 100)}%</p>
          <p className="text-[11px] text-muted-foreground mt-1.5">Across {caseList.length} active cases</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5">
              <FileCheck className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steps Complete</span>
          </div>
          <p className="text-3xl font-bold tracking-tight">{completedSteps}/{totalSteps}</p>
          <p className="text-[11px] text-muted-foreground mt-1.5">{Math.round((completedSteps / totalSteps) * 100)}% across all cases</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-ad-gold/20 to-ad-gold/5">
              <Shield className="w-5 h-5 text-ad-gold" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Proofs Generated</span>
          </div>
          <p className="text-3xl font-bold tracking-tight">{allAttestations.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            {stepAttestations.length} step · {phaseAttestations.length} phase · {caseAttestations.length} case
          </p>
        </div>
        <div className={`bg-card border rounded-2xl p-5 ${overdueCount > 0 ? 'border-red-500/50' : 'border-border'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${overdueCount > 0 ? 'from-red-500/20 to-red-600/5' : 'from-emerald-500/20 to-emerald-600/5'}`}>
              {overdueCount > 0 ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overdue</span>
          </div>
          <p className="text-3xl font-bold tracking-tight">{overdueCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1.5">{overdueCount > 0 ? 'Action required' : 'All obligations on track'}</p>
        </div>
      </div>

      {/* Per-Case Compliance Cards */}
      <div>
        <h2 className="text-lg font-bold mb-4">Case Compliance Status</h2>
        <div className="space-y-3">
          {caseList.map((c) => {
            const status = statuses[c.id];
            if (!status) return null;
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="w-full text-left bg-card border border-border rounded-xl p-5 hover:border-ad-gold/30 hover:shadow-lg hover:shadow-ad-gold/5 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Compliance Ring */}
                    <div className="relative w-12 h-12 shrink-0">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted/20" />
                        <circle
                          cx="18" cy="18" r="15" fill="none" strokeWidth="2.5"
                          strokeDasharray={`${status.score * 94.25} 94.25`}
                          strokeLinecap="round"
                          className={status.score >= 0.9 ? 'text-emerald-500' : status.score >= 0.7 ? 'text-amber-500' : 'text-red-500'}
                          style={{ transition: 'stroke-dasharray 1s ease-out' }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {Math.round(status.score * 100)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{c.caseNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          status.overall === 'compliant' ? 'bg-emerald-500/15 text-emerald-500' :
                          status.overall === 'at_risk' ? 'bg-amber-500/15 text-amber-500' :
                          'bg-red-500/15 text-red-500'
                        }`}>
                          {status.overall.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-medium text-sm group-hover:text-ad-gold transition-colors truncate">{c.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{status.stepsComplete}/{status.stepsTotal} steps</span>
                        {status.stepsOverdue > 0 && (
                          <span className="text-red-500 font-medium">{status.stepsOverdue} overdue</span>
                        )}
                        {status.nextDeadline && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {status.nextDeadline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-ad-gold transition-colors shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Attestation History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Proof History</h2>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span
              className="cursor-help border-b border-dotted border-muted-foreground"
              title="Zero-knowledge proofs allow verification of compliance without revealing sensitive case details. Each proof is anchored on the Midnight blockchain."
            >
              Zero-Knowledge Verified
            </span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {allAttestations.map((att) => (
            <div key={att.id} className="flex items-start gap-4 p-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <ScopeBadge scope={att.scope} />
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted capitalize">
                    {att.type.replace(/_/g, ' ')}
                  </span>
                  {att.verified && (
                    <span className="text-xs text-emerald-600 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {att.blockHeight && (
                    <span
                      className="text-[10px] text-muted-foreground font-mono cursor-help"
                      title="Block height on the Midnight blockchain where this proof was anchored"
                    >
                      Block #{att.blockHeight.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm">{att.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span
                    className="font-mono cursor-help"
                    title="Cryptographic proof hash — can be independently verified against the blockchain"
                  >
                    {att.proofHash}
                  </span>
                  <span>{new Date(att.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <button
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors shrink-0"
                title="View proof details on blockchain"
              >
                <Eye className="w-3 h-3" /> View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
