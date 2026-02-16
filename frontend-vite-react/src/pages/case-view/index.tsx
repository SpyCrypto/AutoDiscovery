import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Users, CheckCircle2, Clock, AlertTriangle,
  Shield, Hash, Link2, Eye, Loader2,
} from 'lucide-react';
import { useProviders } from '@/providers/context';
import type { Case, DiscoveryStep, Document, Attestation, Party } from '@/providers/types';

type Tab = 'overview' | 'steps' | 'documents' | 'parties' | 'compliance';

function StepStatusBadge({ status }: { status: DiscoveryStep['status'] }) {
  const styles: Record<string, string> = {
    complete: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    in_progress: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    pending: 'bg-muted text-muted-foreground',
    overdue: 'bg-red-500/10 text-red-600 dark:text-red-400',
    waived: 'bg-muted text-muted-foreground line-through',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function CategoryBadge({ category }: { category: Document['category'] }) {
  const colors: Record<string, string> = {
    pleading: 'bg-blue-500/10 text-blue-600',
    motion: 'bg-indigo-500/10 text-indigo-600',
    order: 'bg-purple-500/10 text-purple-600',
    medical_record: 'bg-rose-500/10 text-rose-600',
    financial_record: 'bg-amber-500/10 text-amber-600',
    communication: 'bg-cyan-500/10 text-cyan-600',
    expert_report: 'bg-emerald-500/10 text-emerald-600',
    deposition: 'bg-orange-500/10 text-orange-600',
    court_transcript: 'bg-violet-500/10 text-violet-600',
    insurance: 'bg-teal-500/10 text-teal-600',
  };
  const label = category.replace(/_/g, ' ');
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${colors[category] || 'bg-muted text-muted-foreground'}`}>
      {label}
    </span>
  );
}

function ProtectiveOrderBadge({ tier }: { tier: Document['protectiveOrder'] }) {
  if (tier === 'none') return null;
  const styles: Record<string, string> = {
    confidential: 'bg-amber-500/10 text-amber-600',
    aeo: 'bg-red-500/10 text-red-600',
    sealed: 'bg-red-600/20 text-red-700 dark:text-red-400',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${styles[tier]}`}>
      {tier}
    </span>
  );
}

export function CaseView() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { cases, documents, compliance } = useProviders();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [steps, setSteps] = useState<DiscoveryStep[]>([]);
  const [docs, setDocs] = useState<Document[]>([]);
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    async function load() {
      setLoading(true);
      const [c, s, d, a, p] = await Promise.all([
        cases.getCase(caseId!),
        cases.getCaseSteps(caseId!),
        documents.listDocuments(caseId!),
        compliance.getAttestations(caseId!),
        cases.getCaseParties(caseId!),
      ]);
      setCaseData(c);
      setSteps(s);
      setDocs(d);
      setAttestations(a);
      setParties(p);
      setLoading(false);
    }
    load();
  }, [caseId, cases, documents, compliance]);

  const handleVerify = async (docId: string) => {
    setVerifying(docId);
    setVerifyResult(null);
    const result = await documents.verifyHash(docId);
    setVerifyResult(result.message);
    setTimeout(() => { setVerifying(null); setVerifyResult(null); }, 4000);
  };

  if (loading || !caseData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading case...</div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'steps', label: 'Steps', count: steps.length },
    { key: 'documents', label: 'Documents', count: docs.length },
    { key: 'parties', label: 'Parties', count: parties.length },
    { key: 'compliance', label: 'Compliance', count: attestations.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-mono text-muted-foreground">{caseData.caseNumber}</span>
            <h1 className="text-2xl font-bold mt-1">{caseData.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {caseData.jurisdiction} • {caseData.caseType.replace('_', '-')} • Filed {caseData.filingDate}
            </p>
          </div>
          <div className="text-right">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted/30" />
                <circle
                  cx="18" cy="18" r="15" fill="none" strokeWidth="2.5"
                  strokeDasharray={`${caseData.complianceScore * 94.25} 94.25`}
                  strokeLinecap="round"
                  className={caseData.complianceScore >= 0.9 ? 'text-emerald-500' : caseData.complianceScore >= 0.7 ? 'text-amber-500' : 'text-red-500'}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {Math.round(caseData.complianceScore * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Compliance</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-muted">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold">Case Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Documents:</span> <strong>{caseData.documentCount}</strong></div>
              <div><span className="text-muted-foreground">Steps:</span> <strong>{caseData.stepsComplete}/{caseData.stepsTotal}</strong></div>
              <div><span className="text-muted-foreground">Next Deadline:</span> <strong>{caseData.nextDeadline || 'None'}</strong></div>
              <div><span className="text-muted-foreground">Status:</span> <strong className="capitalize">{caseData.status}</strong></div>
            </div>
            {caseData.nextDeadlineLabel && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 rounded-lg text-xs text-amber-700 dark:text-amber-400">
                <Clock className="w-4 h-4 shrink-0" />
                {caseData.nextDeadlineLabel}
              </div>
            )}
          </div>

          {/* Recent Attestations */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> ZK Attestations
            </h3>
            {attestations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attestations yet</p>
            ) : (
              <div className="space-y-2">
                {attestations.slice(0, 4).map((att) => (
                  <div key={att.id} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p>{att.description}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {att.proofHash.slice(0, 24)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'steps' && (
        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`bg-card border rounded-xl p-4 flex items-start gap-4 ${
                step.status === 'overdue' ? 'border-red-500/50' : 'border-border'
              }`}
            >
              <div className="pt-0.5">
                {step.status === 'complete' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : step.status === 'in_progress' ? (
                  <Clock className="w-5 h-5 text-blue-500" />
                ) : step.status === 'overdue' ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{step.ruleReference}</span>
                  <StepStatusBadge status={step.status} />
                </div>
                <h4 className="font-medium text-sm">{step.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Deadline: <strong>{step.deadline}</strong></span>
                  {step.completedAt && <span>Completed: {step.completedAt}</span>}
                  {step.daysRemaining !== undefined && step.status !== 'complete' && (
                    <span className={step.daysRemaining <= 7 ? 'text-red-500 font-medium' : ''}>
                      {step.daysRemaining} days remaining
                    </span>
                  )}
                </div>
                {step.notes && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 italic">{step.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-2">
          {/* Verify Result Toast */}
          {verifyResult && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {verifyResult}
            </div>
          )}

          {docs.map((doc) => (
            <div key={doc.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <CategoryBadge category={doc.category} />
                    <ProtectiveOrderBadge tier={doc.protectiveOrder} />
                    {doc.hasTwin && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <Link2 className="w-3 h-3" /> Twin
                      </span>
                    )}
                    {doc.verified && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-sm">{doc.title}</h4>
                  {doc.aiSynopsis && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.aiSynopsis}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span><FileText className="w-3 h-3 inline" /> {doc.pageCount} pages</span>
                    <span>From: {doc.originator}</span>
                    {doc.batesStart && <span>Bates: {doc.batesStart}–{doc.batesEnd}</span>}
                  </div>
                  {doc.entities && doc.entities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.entities.slice(0, 5).map((e, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                          {e}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Twin Bond Details */}
                  {doc.twinBond && (
                    <div className="mt-2 p-2 bg-sky-500/5 rounded-lg border border-sky-500/20 text-xs">
                      <div className="flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400 mb-1">
                        <Link2 className="w-3 h-3" /> Twin Bond — Fidelity: {doc.twinBond.fidelityScore}%
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Hash className="w-3 h-3" />
                        Bond: <span className="font-mono">{doc.twinBond.bondHash.slice(0, 20)}...</span>
                      </div>
                      {doc.twinBond.visualFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doc.twinBond.visualFeatures.map((f, i) => (
                            <span key={i} className="px-1 py-0.5 rounded text-[9px] bg-sky-500/10 text-sky-700 dark:text-sky-300">
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => handleVerify(doc.id)}
                    disabled={verifying === doc.id}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    {verifying === doc.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Shield className="w-3 h-3" />
                    )}
                    Verify
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors">
                    <Eye className="w-3 h-3" /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'parties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parties.map((party) => (
            <div key={party.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                  party.role === 'prosecution' ? 'bg-blue-500/10 text-blue-600' :
                  party.role === 'defense' ? 'bg-red-500/10 text-red-600' :
                  party.role === 'court' ? 'bg-purple-500/10 text-purple-600' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {party.role === 'prosecution' ? 'PRO' : party.role === 'defense' ? 'DEF' : party.role === 'court' ? 'COURT' : '3P'}
                </span>
                {party.subRole && <span className="text-xs text-muted-foreground">{party.subRole}</span>}
              </div>
              <h4 className="font-semibold">{party.name}</h4>
              {party.attorney && (
                <p className="text-sm text-muted-foreground mt-1">
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  {party.attorney}{party.firm ? ` — ${party.firm}` : ''}
                </p>
              )}
              {party.email && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">{party.email}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4">ZK Proof Attestation History</h3>
            <div className="space-y-4">
              {attestations.map((att) => (
                <div key={att.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted capitalize">
                        {att.type.replace(/_/g, ' ')}
                      </span>
                      {att.verified && (
                        <span className="text-xs text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{att.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="font-mono">{att.proofHash}</span>
                      <span>{new Date(att.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
