import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Users, CheckCircle2, Clock, AlertTriangle,
  Shield, Hash, Link2, Eye, Loader2, Printer, Gavel, Search,
  Scale, Flag,
} from 'lucide-react';
import { useProviders } from '@/providers/context';
import type {
  Case, DiscoveryStep, Document, Attestation, Party,
  TimelineEntry, ObfuscationScore,
} from '@/providers/types';

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
  const { cases, documents, compliance, ai } = useProviders();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [steps, setSteps] = useState<DiscoveryStep[]>([]);
  const [docs, setDocs] = useState<Document[]>([]);
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [obfuscationData, setObfuscationData] = useState<ObfuscationScore | null>(null);
  const [showObfuscation, setShowObfuscation] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);

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

      // Load timeline from compliance report
      const report = await compliance.getComplianceReport(caseId!);
      setTimeline(report.timeline);

      // Load obfuscation data if there's a flagged production
      const flaggedDoc = d.find((doc) => doc.productionId);
      if (flaggedDoc?.productionId) {
        const obfData = await ai.detectObfuscation(flaggedDoc.productionId);
        setObfuscationData(obfData);
      }

      setLoading(false);
    }
    load();
  }, [caseId, cases, documents, compliance, ai]);

  const handleVerify = async (docId: string) => {
    setVerifying(docId);
    setVerifyResult(null);
    const result = await documents.verifyHash(docId);
    setVerifyResult(result.message);
    setTimeout(() => { setVerifying(null); setVerifyResult(null); }, 4000);
  };

  // Compute sanctions risk based on overdue steps, compliance gaps, obfuscation flags
  const computeSanctionsRisk = () => {
    const overdueSteps = steps.filter((s) => s.status === 'overdue');
    const pendingHighRisk = steps.filter(
      (s) => s.status !== 'complete' && s.daysRemaining !== undefined && s.daysRemaining <= 7,
    );
    const hasObfuscation = obfuscationData && obfuscationData.level !== 'low';
    const complianceGap = caseData ? 1 - caseData.complianceScore : 0;

    let riskScore = 0;
    riskScore += overdueSteps.length * 25;
    riskScore += pendingHighRisk.length * 10;
    riskScore += hasObfuscation ? 20 : 0;
    riskScore += complianceGap * 30;

    const capped = Math.min(riskScore, 100);
    const level = capped >= 60 ? 'critical' : capped >= 35 ? 'elevated' : capped >= 15 ? 'moderate' : 'low';
    // Estimate based on average sanctions ($704K) scaled by risk
    const estimatedExposure = Math.round((capped / 100) * 704094);
    return { score: capped, level, estimatedExposure };
  };

  // Handle compliance report export via print
  const handleExportReport = async () => {
    setExportingReport(true);
    const report = await compliance.getComplianceReport(caseId!);
    // Build a printable report in a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) { setExportingReport(false); return; }
    const reportHtml = `
      <!DOCTYPE html>
      <html><head><title>Compliance Report — ${caseData?.caseNumber}</title>
      <style>
        body { font-family: 'Georgia', serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 22px; border-bottom: 2px solid #b8860b; padding-bottom: 8px; }
        h2 { font-size: 16px; color: #444; margin-top: 24px; }
        .meta { font-size: 12px; color: #666; margin-bottom: 4px; }
        .score { font-size: 36px; font-weight: bold; color: ${(report.status.score >= 0.9) ? '#059669' : (report.status.score >= 0.7) ? '#d97706' : '#dc2626'}; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: 600; }
        .hash { font-family: monospace; font-size: 11px; color: #666; }
        .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 10px; color: #999; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <h1>AutoDiscovery Legal — Compliance Report</h1>
      <p class="meta">Case: <strong>${caseData?.title}</strong></p>
      <p class="meta">Case Number: ${caseData?.caseNumber} | Jurisdiction: ${caseData?.jurisdiction}</p>
      <p class="meta">Generated: ${new Date(report.generatedAt).toLocaleString()}</p>
      <h2>Compliance Score</h2>
      <p class="score">${Math.round(report.status.score * 100)}%</p>
      <p class="meta">Status: ${report.status.overall.toUpperCase()} | Steps: ${report.status.stepsComplete}/${report.status.stepsTotal} | Overdue: ${report.status.stepsOverdue}</p>
      <h2>ZK Attestation History</h2>
      <table>
        <thead><tr><th>Type</th><th>Description</th><th>Proof Hash</th><th>Timestamp</th><th>Verified</th></tr></thead>
        <tbody>${report.attestations.map((a) => `
          <tr>
            <td>${a.type.replace(/_/g, ' ')}</td>
            <td>${a.description}</td>
            <td class="hash">${a.proofHash}</td>
            <td>${new Date(a.timestamp).toLocaleString()}</td>
            <td>${a.verified ? '✓' : '✗'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <h2>Case Timeline</h2>
      <table>
        <thead><tr><th>Date</th><th>Event</th><th>Type</th><th>Status</th></tr></thead>
        <tbody>${report.timeline.map((t) => `
          <tr>
            <td>${t.date}</td>
            <td>${t.event}</td>
            <td>${t.type}</td>
            <td>${t.status}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>This report was generated by AutoDiscovery Legal Intelligence. ZK proof hashes can be independently verified against the Midnight blockchain.</p>
        <p>AutoDiscovery Legal — Privacy-Preserving Discovery Automation</p>
      </div>
      </body></html>`;
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
    setExportingReport(false);
  };

  // Timeline event icon + color mapping
  const timelineStyle = (type: TimelineEntry['type']) => {
    const map: Record<string, { color: string; bg: string }> = {
      filing: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
      production: { color: 'text-amber-500', bg: 'bg-amber-500/10' },
      deadline: { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      hearing: { color: 'text-purple-500', bg: 'bg-purple-500/10' },
      attestation: { color: 'text-ad-gold', bg: 'bg-ad-gold/10' },
    };
    return map[type] || map.deadline;
  };

  const sanctionsRisk = computeSanctionsRisk();

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
        <div className="space-y-6">
          {/* Row 1: Case Summary + Sanctions Risk Meter */}
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

            {/* Sanctions Risk Meter */}
            <div className={`bg-card border rounded-xl p-5 space-y-4 ${
              sanctionsRisk.level === 'critical' ? 'border-red-500/50' :
              sanctionsRisk.level === 'elevated' ? 'border-amber-500/50' :
              'border-border'
            }`}>
              <h3 className="font-semibold flex items-center gap-2">
                <Gavel className="w-4 h-4 text-ad-gold" /> Sanctions Risk
              </h3>
              <div className="flex items-center gap-4">
                {/* Risk Gauge */}
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/20" />
                    <circle
                      cx="18" cy="18" r="15" fill="none" strokeWidth="2"
                      strokeDasharray={`${(sanctionsRisk.score / 100) * 94.25} 94.25`}
                      strokeLinecap="round"
                      className={
                        sanctionsRisk.level === 'critical' ? 'text-red-500' :
                        sanctionsRisk.level === 'elevated' ? 'text-amber-500' :
                        sanctionsRisk.level === 'moderate' ? 'text-yellow-500' :
                        'text-emerald-500'
                      }
                      style={{ transition: 'stroke-dasharray 1s ease-out' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {Math.round(sanctionsRisk.score)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    sanctionsRisk.level === 'critical' ? 'bg-red-500/15 text-red-500' :
                    sanctionsRisk.level === 'elevated' ? 'bg-amber-500/15 text-amber-500' :
                    sanctionsRisk.level === 'moderate' ? 'bg-yellow-500/15 text-yellow-600' :
                    'bg-emerald-500/15 text-emerald-500'
                  }`}>
                    {sanctionsRisk.level}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2">
                    Est. Exposure: <strong className="text-foreground">${sanctionsRisk.estimatedExposure.toLocaleString()}</strong>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Based on avg. sanction of $704,094 (Willoughby, Duke L.J. 2010)
                  </p>
                </div>
              </div>
              {obfuscationData && obfuscationData.level !== 'low' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/8 border border-amber-500/15 rounded-lg text-[11px] text-amber-500">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Obfuscation flag contributing to risk score
                </div>
              )}
            </div>
          </div>

          {/* Row 2: ZK Attestations + Production Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            {/* Production Tracker / Scorecard */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-ad-gold" /> Production Scorecard
              </h3>
              {(() => {
                const proDocs = docs.filter((d) => d.originatorRole === 'prosecution' || d.originatorRole === 'third_party');
                const defDocs = docs.filter((d) => d.originatorRole === 'defense');
                const proPages = proDocs.reduce((sum, d) => sum + d.pageCount, 0);
                const defPages = defDocs.reduce((sum, d) => sum + d.pageCount, 0);
                const flaggedDocs = docs.filter((d) => d.productionId);
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-1">Prosecution</p>
                        <p className="text-xl font-bold">{proDocs.length} <span className="text-xs font-normal text-muted-foreground">docs</span></p>
                        <p className="text-xs text-muted-foreground">{proPages.toLocaleString()} pages</p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                        <p className="text-[10px] uppercase tracking-wider text-red-400 font-bold mb-1">Defense</p>
                        <p className="text-xl font-bold">{defDocs.length} <span className="text-xs font-normal text-muted-foreground">docs</span></p>
                        <p className="text-xs text-muted-foreground">{defPages.toLocaleString()} pages</p>
                      </div>
                    </div>
                    {flaggedDocs.length > 0 && obfuscationData && obfuscationData.level !== 'low' && (
                      <button
                        onClick={() => setShowObfuscation(!showObfuscation)}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-amber-500/8 border border-amber-500/15 rounded-lg text-xs text-amber-500 hover:bg-amber-500/15 transition-colors"
                      >
                        <Search className="w-3.5 h-3.5 shrink-0" />
                        <span className="flex-1 text-left">Haystack Alert — score: {obfuscationData.score}</span>
                        <Flag className="w-3 h-3" />
                      </button>
                    )}
                    {/* Obfuscation Explainer (expandable) */}
                    {showObfuscation && obfuscationData && (
                      <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg space-y-2 ad-animate-fade-up">
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Obfuscation Analysis — Level: {obfuscationData.level.toUpperCase()}
                        </p>
                        <ul className="space-y-1">
                          {obfuscationData.flags.map((flag, i) => (
                            <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                              {flag}
                            </li>
                          ))}
                        </ul>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-2 pt-2 border-t border-amber-500/15">
                          {obfuscationData.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Row 3: Discovery Timeline (full width) */}
          {timeline.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Scale className="w-4 h-4 text-ad-gold" /> Discovery Timeline
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-1">
                  {timeline.map((entry, i) => {
                    const style = timelineStyle(entry.type);
                    const isPending = entry.status === 'pending';
                    return (
                      <div key={i} className={`flex items-start gap-3 py-1.5 ${isPending ? 'opacity-60' : ''}`}>
                        <div className={`relative z-10 w-[37px] shrink-0 flex justify-center`}>
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            entry.status === 'completed' ? `${style.bg} border-current ${style.color}` :
                            entry.status === 'missed' ? 'bg-red-500/20 border-red-500 text-red-500' :
                            'bg-muted border-muted-foreground/30'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0 flex items-baseline gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0 w-20">{entry.date}</span>
                          <span className={`text-xs ${isPending ? 'text-muted-foreground' : 'text-foreground'}`}>{entry.event}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${style.bg} ${style.color}`}>
                            {entry.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
                {/* Deemed Admitted Countdown — RFA steps under IRCP 36 */}
                {step.ruleReference === 'IRCP 36' && step.status !== 'complete' && step.status !== 'waived' && step.daysRemaining !== undefined && (
                  <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    step.daysRemaining <= 7
                      ? 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
                      : step.daysRemaining <= 14
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400'
                      : 'bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400'
                  }`}>
                    <Gavel className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Deemed Admitted in <strong>{step.daysRemaining} days</strong> if unanswered
                    </span>
                    {step.daysRemaining <= 14 && (
                      <span className="ml-auto text-[10px] uppercase tracking-wider font-bold opacity-75">
                        {step.daysRemaining <= 7 ? 'CRITICAL' : 'WARNING'}
                      </span>
                    )}
                  </div>
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
          {/* Export Report Button */}
          <div className="flex justify-end">
            <button
              onClick={handleExportReport}
              disabled={exportingReport}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-ad-gold/10 text-ad-gold border border-ad-gold/20 rounded-lg hover:bg-ad-gold/20 transition-colors disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              {exportingReport ? 'Generating...' : 'Export Compliance Report'}
            </button>
          </div>

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
